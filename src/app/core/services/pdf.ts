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
}
