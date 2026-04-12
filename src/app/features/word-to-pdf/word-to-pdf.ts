// import { Component, NgZone, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { ChangeDetectorRef } from '@angular/core';
// import { FaqSectionComponent, FaqItem } from '../../components/faq-section/faq-section';
// import { ToolConfigService } from '../../core/services/tool-config';
// import { ToolSEO } from '../../core/models/tool';

// interface ConvertFile {
//   file: File;
//   name: string;
//   size: number;
//   thumbnail?: string;
//   conversionStatus?: 'pending' | 'processing' | 'completed' | 'error';
//   progress?: number;
// }

// @Component({
//   selector: 'app-word-to-pdf',
//   templateUrl: './word-to-pdf.html',
//   styleUrls: ['./word-to-pdf.scss'],
//   imports: [CommonModule, FaqSectionComponent, FormsModule]
// })
// export class WordToPdfComponent implements OnInit {

//   selectedFiles: ConvertFile[] = [];
//   loading = false;
//   converting = false;
//   convertedUrl: string | null = null;
//   convertMessage: string | null = null;
//   progressComplete = false;
//   progressValue = 0;
  
//   // SEO data
//   seoTitle = '';
//   seoMetaDescription = '';
//   seoH1 = '';
//   seoH2 = '';
  
//   // FAQ Configuration
//   faqTitle = 'Frequently Asked Questions';
//   faqAccentColor = '#2f84ff';
//   expandedFaqIndex: number | null = null;
  
//   faqs: FaqItem[] = [
//     {
//       question: 'How does Word to PDF conversion work?',
//       answer: 'Our converter reads your Word document and converts it to a high-quality PDF. We preserve the formatting, fonts, and layout from your original document.'
//     },
//     {
//       question: 'Will my formatting be preserved?',
//       answer: 'Yes! Word to PDF conversion typically preserves formatting very well. Text styles, fonts, paragraphs, lists, and basic tables are maintained in the PDF output.'
//     },
//     {
//       question: 'Is my data secure?',
//       answer: 'Yes, all conversion happens in your browser. Your files are never uploaded to our servers, ensuring complete privacy and security.'
//     },
//     {
//       question: 'What Word formats are supported?',
//       answer: 'Our converter supports .docx files (Word 2007 and later). Legacy .doc files are not supported in browser-based conversion.'
//     },
//     {
//       question: 'Do I need to create an account to use this tool?',
//       answer: 'No, our Word to PDF converter is completely free and doesn\'t require any registration or account creation.'
//     }
//   ];

//   constructor(
//     private cdr: ChangeDetectorRef,
//     private ngZone: NgZone,
//     private toolConfigService: ToolConfigService
//   ) {
//     this.loadSeoData();
//   }

//   ngOnInit(): void {}

//   loadSeoData() {
//     const tools = this.toolConfigService.getAllTools();
//     const tool = tools.find(t => t.id === 'word-to-pdf');
    
//     if (tool && tool.seo) {
//       const seo: ToolSEO = tool.seo;
//       this.seoTitle = seo.title;
//       this.seoMetaDescription = seo.metaDescription;
//       this.seoH1 = seo.h1;
//       this.seoH2 = seo.h2;
//       this.faqs = [...this.faqs, ...(seo.faqs || [])];
      
//       document.title = seo.title || 'ToolTrove';
      
//       let metaDesc = document.querySelector('meta[name="description"]');
//       if (!metaDesc) {
//         metaDesc = document.createElement('meta');
//         metaDesc.setAttribute('name', 'description');
//         document.head.appendChild(metaDesc);
//       }
//       metaDesc.setAttribute('content', seo.metaDescription || '');
//     }
//   }

//   async onFileSelect(event: Event) {
//     const input = event.target as HTMLInputElement;
//     if (!input.files) return;
//     const files = Array.from(input.files);
//     await this.processFiles(files);
//     input.value = '';
//   }

//   private async processFiles(files: File[]) {
//     for (const file of files) {
//       if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
//           file.name.endsWith('.docx')) {
//         const convertFile: ConvertFile = {
//           file,
//           name: file.name,
//           size: file.size,
//           conversionStatus: 'pending',
//           progress: 0
//         };
//         this.selectedFiles.push(convertFile);
//       }
//     }
//     setTimeout(() => this.cdr.detectChanges());
//   }

//   removeFile(index: number) {
//     this.selectedFiles.splice(index, 1);
//     if (this.convertedUrl) {
//       URL.revokeObjectURL(this.convertedUrl);
//       this.convertedUrl = null;
//     }
//   }

//   clearAll() {
//     if (this.convertedUrl) {
//       URL.revokeObjectURL(this.convertedUrl);
//     }
//     this.selectedFiles = [];
//     this.convertedUrl = null;
//     this.convertMessage = null;
//   }

//   formatFileSize(bytes: number): string {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   }

//   /**
//    * Converts DOCX to PDF using mammoth + html2canvas + pdf-lib
//    */
//   async convertToPdf() {
//     if (this.selectedFiles.length === 0) return;
    
//     this.converting = true;
//     this.loading = true;
//     this.progressComplete = false;
//     this.convertMessage = null;
//     this.progressValue = 0;
    
//     setTimeout(() => this.cdr.detectChanges());
    
//     try {
//       // Load html2canvas if not available
//       if (!(window as any).html2canvas) {
//         await this.loadHtml2Canvas();
//       }
      
//       const { PDFDocument } = await import('pdf-lib');
//       const mergedPdf = await PDFDocument.create();
      
//       // Process each file
//       for (let i = 0; i < this.selectedFiles.length; i++) {
//         const file = this.selectedFiles[i];
//         file.conversionStatus = 'processing';
//         setTimeout(() => this.cdr.detectChanges());
        
//         try {
//           const arrayBuffer = await file.file.arrayBuffer();
          
//           // Extract HTML with formatting
//           const html = await this.extractDocxAsHtml(arrayBuffer);
          
//           // Convert to PDF using canvas rendering
//           const pdfBytes = await this.renderHtmlToPdf(html);
          
//           // Load and merge PDF pages
//           const tempPdf = await PDFDocument.load(pdfBytes);
//           const pages = await tempPdf.copyPages(tempPdf, tempPdf.getPageIndices());
//           pages.forEach((page: any) => mergedPdf.addPage(page));
          
//           file.conversionStatus = 'completed';
//           this.progressValue = ((i + 1) / this.selectedFiles.length) * 100;
          
//         } catch (err) {
//           console.error('Error processing file:', file.name, err);
//           file.conversionStatus = 'error';
//         }
//       }
      
//       const pdfBytes = await mergedPdf.save();
      
//       if (this.convertedUrl) {
//         URL.revokeObjectURL(this.convertedUrl);
//       }
//       const pdfBlob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
//       this.convertedUrl = URL.createObjectURL(pdfBlob);
      
//       this.progressComplete = true;
//       this.progressValue = 100;
      
//       this.convertMessage = `Conversion complete! Your ${this.selectedFiles.length} Word document(s) have been converted to PDF.`;
      
//       setTimeout(() => {
//         this.loading = false;
//         this.converting = false;
//         this.progressComplete = false;
//         this.cdr.detectChanges();
//       }, 100);
      
//     } catch (error: any) {
//       console.error('Error converting Word to PDF:', error);
//       this.convertMessage = `Error: ${error instanceof Error ? error.message : 'Failed to convert documents. Please try again.'}`;
//       this.loading = false;
//       this.converting = false;
//       setTimeout(() => this.cdr.detectChanges());
//     }
//   }

//   /**
//    * Loads html2canvas script
//    */
//   private loadHtml2Canvas(): Promise<void> {
//     return new Promise((resolve, reject) => {
//       const script = document.createElement('script');
//       script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
//       script.onload = () => resolve();
//       script.onerror = () => reject(new Error('Failed to load html2canvas'));
//       document.head.appendChild(script);
//     });
//   }

//   /**
//    * Extracts DOCX content as styled HTML
//    */
//   private async extractDocxAsHtml(arrayBuffer: ArrayBuffer): Promise<string> {
//     const mammoth = await import('mammoth');
    
//     const result = await mammoth.convertToHtml({ arrayBuffer }, {
//       styleMap: [
//         "p[style-name='Heading 1'] => h1:fresh",
//         "p[style-name='Heading 2'] => h2:fresh",
//         "p[style-name='Heading 3'] => h3:fresh",
//         "p[style-name='Heading 4'] => h4:fresh",
//         "b => b",
//         "i => i",
//         "u => u",
//         "table => table.document-table",
//         "tr => tr",
//         "td => td",
//         "th => th"
//       ]
//     });
    
//     // Wrap with comprehensive styling
//     return `
//       <div style="
//         width: 816px;
//         padding: 72px;
//         font-family: 'Times New Roman', Times, serif;
//         font-size: 12pt;
//         line-height: 1.5;
//         color: #000000;
//         background: white;
//         box-sizing: border-box;
//       ">
//         ${result.value}
//         <style>
//           h1 { font-size: 20pt; font-weight: bold; margin: 18pt 0 10pt 0; }
//           h2 { font-size: 16pt; font-weight: bold; margin: 14pt 0 8pt 0; }
//           h3 { font-size: 14pt; font-weight: bold; margin: 12pt 0 6pt 0; }
//           h4 { font-size: 12pt; font-weight: bold; margin: 10pt 0 4pt 0; }
//           p { margin: 0 0 10pt 0; text-align: justify; }
//           ul, ol { margin: 6pt 0 10pt 0; padding-left: 36pt; }
//           li { margin: 3pt 0; }
//           table.document-table { border-collapse: collapse; width: 100%; margin: 10pt 0; }
//           table.document-table td, table.document-table th { border: 1px solid #000; padding: 4pt 6pt; }
//         </style>
//       </div>
//     `;
//   }

//   /**
//    * Renders HTML to PDF using html2canvas
//    */
//   private async renderHtmlToPdf(html: string): Promise<Uint8Array> {
//     const { PDFDocument } = await import('pdf-lib');
    
//     // Create a hidden container
//     const container = document.createElement('div');
//     container.innerHTML = html;
//     container.style.position = 'fixed';
//     container.style.left = '-9999px';
//     container.style.top = '0';
//     container.style.zIndex = '-1';
//     document.body.appendChild(container);
    
//     // Wait for rendering
//     await new Promise(resolve => setTimeout(resolve, 100));
    
//     const html2canvas = (window as any).html2canvas;
    
//     // Render to canvas
//     const canvas = await html2canvas(container, {
//       scale: 2,
//       useCORS: true,
//       allowTaint: true,
//       backgroundColor: '#ffffff',
//       width: 816,
//       windowWidth: 816
//     });
    
//     // Convert canvas to PDF
//     const imgData = canvas.toDataURL('image/jpeg', 0.95);
    
//     const pdfDoc = await PDFDocument.create();
//     const jpgImage = await pdfDoc.embedJpg(await this.base64ToUint8Array(imgData));
    
//     // Calculate dimensions for A4
//     const pageWidth = 595.28;
//     const pageHeight = 841.89;
//     const imgHeight = (jpgImage.height / jpgImage.width) * pageWidth;
//     const numPages = Math.ceil(imgHeight / pageHeight);
    
//     for (let i = 0; i < numPages; i++) {
//       const page = pdfDoc.addPage([pageWidth, pageHeight]);
//       const yOffset = i * pageHeight;
//       const remainingHeight = imgHeight - yOffset;
//       const drawHeight = Math.min(pageHeight, remainingHeight);
      
//       page.drawImage(jpgImage, {
//         x: 0,
//         y: pageHeight - drawHeight,
//         width: pageWidth,
//         height: drawHeight
//       });
//     }
    
//     document.body.removeChild(container);
    
//     return pdfDoc.save();
//   }

//   /**
//    * Converts base64 to Uint8Array
//    */
//   private base64ToUint8Array(base64: string): Promise<Uint8Array> {
//     return new Promise((resolve, reject) => {
//       const img = new Image();
//       img.onload = () => {
//         const canvas = document.createElement('canvas');
//         canvas.width = img.width;
//         canvas.height = img.height;
//         const ctx = canvas.getContext('2d')!;
//         ctx.drawImage(img, 0, 0);
//         canvas.toBlob(blob => {
//           if (blob) {
//             blob.arrayBuffer().then(buffer => {
//               resolve(new Uint8Array(buffer));
//             });
//           } else {
//             reject(new Error('Failed to convert image'));
//           }
//         }, 'image/jpeg', 0.95);
//       };
//       img.onerror = () => reject(new Error('Failed to load image'));
//       img.src = base64;
//     });
//   }

//   downloadConverted(): void {
//     if (!this.convertedUrl) return;
//     const a = document.createElement('a');
//     a.href = this.convertedUrl;
//     a.download = this.selectedFiles.length === 1 
//       ? this.selectedFiles[0].name.replace('.docx', '.pdf')
//       : 'converted-documents.pdf';
//     a.click();
//   }

//   onDragOver(event: DragEvent): void {
//     event.preventDefault();
//     event.stopPropagation();
//     const target = event.target as HTMLElement;
//     target.closest('.upload-container')?.classList.add('drag-over');
//   }

//   onDragLeave(event: DragEvent): void {
//     event.preventDefault();
//     event.stopPropagation();
//     const target = event.target as HTMLElement;
//     target.closest('.upload-container')?.classList.remove('drag-over');
//   }

//   async onDrop(event: DragEvent): Promise<void> {
//     event.preventDefault();
//     event.stopPropagation();
//     const target = event.target as HTMLElement;
//     target.closest('.upload-container')?.classList.remove('drag-over');

//     const files = event.dataTransfer?.files;
//     if (!files) return;

//     const docxFiles = Array.from(files).filter(file => 
//       file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
//       file.name.endsWith('.docx')
//     );
//     await this.processFiles(docxFiles);
//   }

//   scrollToTop(): void {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }
// }
