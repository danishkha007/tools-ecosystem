import { Injectable } from '@angular/core';
import { PDFDocument } from 'pdf-lib';

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
        // Use type assertion for password option (pdf-lib may not expose it in types)
        const loadOptions = password ? { password } : {};
        const pdf = await PDFDocument.load(bytes, loadOptions as any);
        
        // item.pages contains indices, convert to page references
        const pageIndices = item.pages.filter((idx: number) => idx >= 0 && idx < pdf.getPageCount());
        const pages = await mergedPdf.copyPages(pdf, pageIndices);
        pages.forEach((p: any) => mergedPdf.addPage(p));
      } catch (error: any) {
        // Check if it's an encryption/password error
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
}
