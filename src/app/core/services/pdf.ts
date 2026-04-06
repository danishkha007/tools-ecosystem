import { Injectable } from '@angular/core';
import { PDFDocument, PDFPage } from 'pdf-lib';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  async mergePDFs(files: File[]): Promise<Uint8Array> {
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);

      const pages = await mergedPdf.copyPages(
        pdf,
        pdf.getPageIndices()
      );

      pages.forEach(page => mergedPdf.addPage(page));
    }

    return await mergedPdf.save();
  }

  async mergeSelectedPages(pdfFiles: any[], passwords?: { [key: string]: string }): Promise<Uint8Array> {
    const mergedPdf = await PDFDocument.create();

    for (const item of pdfFiles) {
      try {
        const bytes = await item.file.arrayBuffer();
        const password = passwords ? passwords[item.name] : undefined;
        const loadOptions = password ? { password } : {};
        const pdf = await PDFDocument.load(bytes, loadOptions as any);
        
        // item.pages contains indices, convert to page references
        const pageIndices = item.pages.filter((idx: number) => idx >= 0 && idx < pdf.getPageCount());
        const pages = await mergedPdf.copyPages(pdf, pageIndices);
        pages.forEach((p: any) => mergedPdf.addPage(p));
      } catch (error: any) {
        if (error.message && error.message.includes('encrypted') || error.message?.includes('password')) {
          throw { 
            type: 'encrypted', 
            fileName: item.name, 
            message: `${item.name} is password protected` 
          };
        }
        console.error('Error merging PDF:', item.name, error);
        throw new Error(`Failed to merge ${item.name}: ${error}`);
      }
    }

    return await mergedPdf.save();
  }

  async mergePagesInOrder(pageItems: any[], passwords?: { [key: string]: string }): Promise<Uint8Array> {
    const mergedPdf = await PDFDocument.create();
    
    // Cache loaded PDFs to avoid reloading the same file multiple times
    const pdfCache = new Map<string, PDFDocument>();
    
    for (const item of pageItems) {
      try {
        let sourcePdf = pdfCache.get(item.name);
        
        // If not in cache, load the PDF
        if (!sourcePdf) {
          const bytes = await item.file.arrayBuffer();
          const password = passwords ? passwords[item.name] : undefined;
          const loadOptions = password ? { password } : {};
          sourcePdf = await PDFDocument.load(bytes, loadOptions as any);
          pdfCache.set(item.name, sourcePdf);
        }
        
        // Copy the specific page (0-indexed pageIndex)
        const pageIndex = item.pageIndex;
        if (pageIndex >= 0 && pageIndex < sourcePdf.getPageCount()) {
          const [copiedPage] = await mergedPdf.copyPages(sourcePdf, [pageIndex]);
          mergedPdf.addPage(copiedPage);
        }
      } catch (error: any) {
        if (error.message && error.message.includes('encrypted') || error.message?.includes('password')) {
          throw { 
            type: 'encrypted', 
            fileName: item.name, 
            message: `${item.name} is password protected` 
          };
        }
        console.error('Error merging page:', item.name, 'page', item.pageIndex, error);
        throw new Error(`Failed to merge page from ${item.name}: ${error}`);
      }
    }

    return await mergedPdf.save();
  }

  async compressPdfs(files: { file: File; name: string; size: number }[], level: 'low' | 'medium' | 'high'): Promise<Uint8Array> {
    // Lowered threshold to 50KB to ensure more files get compressed
    const MIN_SIZE_FOR_COMPRESSION = 50 * 1024; // 50KB
    
    const qualitySettings = {
      // Low: Minimal compression - maintain highest quality possible
      low: { scale: 1, jpegQuality: 1 },
      // Medium: Moderate compression with good quality
      medium: { scale: 1, jpegQuality: 0.99 },
      // High: Maximum compression while keeping quality acceptable  
      high: { scale: 1, jpegQuality: 0.98 }
    };
    
    const settings = qualitySettings[level];
    const compressedPdf = await PDFDocument.create();

    for (const item of files) {
      try {
        const arrayBuffer = await item.file.arrayBuffer();
        
        // For very small files, just copy pages directly without image conversion
        if (item.size < MIN_SIZE_FOR_COMPRESSION) {
          const sourcePdf = await PDFDocument.load(arrayBuffer);
          const pages = await compressedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
          pages.forEach(page => compressedPdf.addPage(page));
          continue;
        }
        
        const pdfjsLib = await import('pdfjs-dist');
        (pdfjsLib as any).GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const numPages = pdf.numPages;

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: settings.scale });

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d')!;
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          
          context.fillStyle = '#FFFFFF';
          context.fillRect(0, 0, canvas.width, canvas.height);

          // Enable high quality image rendering
          context.imageSmoothingEnabled = true;
          context.imageSmoothingQuality = 'high';

          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise;

          // Use settings.jpegQuality for compression
          const imageDataUrl = canvas.toDataURL('image/jpeg', settings.jpegQuality);
          
          const image = await compressedPdf.embedJpg(imageDataUrl);
          
          const newPage = compressedPdf.addPage([image.width, image.height]);
          newPage.drawImage(image, {
            x: 0,
            y: 0,
            width: image.width,
            height: image.height
          });
        }
      } catch (error) {
        console.error('Error compressing PDF:', item.name, error);
        throw new Error(`Failed to compress ${item.name}`);
      }
    }

    return await compressedPdf.save({ useObjectStreams: true });
  }
}