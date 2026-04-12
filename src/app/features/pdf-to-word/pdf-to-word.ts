import { Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { FaqSectionComponent, FaqItem } from '../../components/faq-section/faq-section';
import { ToolHeaderComponent } from '../../components/tool-header/tool-header';
import { ToolConfigService } from '../../core/services/tool-config';
import { ToolSEO } from '../../core/models/tool';
import { PdfService } from '../../core/services/pdf';
import * as pdfjsLib from 'pdfjs-dist';
(pdfjsLib as any).GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

interface ConvertFile {
  file: File;
  name: string;
  size: number;
  pages: number;
  thumbnail?: string;
  conversionStatus?: 'pending' | 'processing' | 'completed' | 'error';
  progress?: number;
  extractedText?: string;
}

@Component({
  selector: 'app-pdf-to-word',
  templateUrl: './pdf-to-word.html',
  styleUrls: ['./pdf-to-word.scss'],
  imports: [CommonModule, FaqSectionComponent, FormsModule, ToolHeaderComponent]
})
export class PdfToWordComponent implements OnInit {

  selectedFiles: ConvertFile[] = [];
  loading = false;
  converting = false;
  convertedUrl: string | null = null;
  convertMessage: string | null = null;
  progressComplete = false;
  
  // OCR settings
  ocrEnabled = true;
  ocrProgress = 0;
  isOcrProcessing = false;
  
  // SEO data
  seoTitle = '';
  seoMetaDescription = '';
  seoH1 = '';
  seoH2 = '';
  
  // FAQ Configuration
  faqTitle = 'Frequently Asked Questions';
  faqAccentColor = '#2f84ff';
  expandedFaqIndex: number | null = 0;
  
  faqs: FaqItem[] = [
    {
      question: 'How does PDF to Word conversion work?',
      answer: 'Our converter extracts text content from PDFs using advanced text extraction and OCR technology. For text-based PDFs, it reads the text directly. For scanned PDFs, it uses OCR to recognize text from images.'
    },
    {
      question: 'Will the formatting be preserved?',
      answer: 'This converter extracts text content and creates a new Word document with that text. Original formatting (fonts, colors, layouts, tables, images) cannot be preserved with text-based conversion. For best results with formatting, consider using native Word documents instead of converting from PDF.'
    },
    {
      question: 'Does this tool support scanned PDFs?',
      answer: 'Yes! Our converter includes OCR (Optical Character Recognition) technology that can extract text from scanned documents and images within PDFs.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, all conversion happens in your browser. Your files are never uploaded to our servers, ensuring complete privacy and security.'
    },
    {
      question: 'Do I need to create an account to use this tool?',
      answer: 'No, our PDF to Word converter is completely free and doesn\'t require any registration or account creation.'
    }
  ];

  constructor(
    private pdfService: PdfService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private toolConfigService: ToolConfigService
  ) {
    this.loadSeoData();
  }

  ngOnInit(): void {}

  loadSeoData() {
    const tools = this.toolConfigService.getAllTools();
    const tool = tools.find(t => t.id === 'pdf-to-word');
    
    if (tool && tool.seo) {
      const seo: ToolSEO = tool.seo;
      this.seoTitle = seo.title;
      this.seoMetaDescription = seo.metaDescription;
      this.seoH1 = seo.h1;
      this.seoH2 = seo.h2;
      this.faqs = [...this.faqs, ...(seo.faqs || [])];
      
      document.title = seo.title || 'ToolTrove';
      
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', seo.metaDescription || '');
    }
  }

  async onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    const files = Array.from(input.files);
    await this.processFiles(files);
    input.value = '';
  }

  private async processFiles(files: File[]) {
    for (const file of files) {
      if (file.type === 'application/pdf') {
        try {
          const pages = await this.getPdfPageCount(file);
          const thumbnail = await this.generateThumbnail(file);
          
          const convertFile: ConvertFile = {
            file,
            name: file.name,
            size: file.size,
            pages,
            thumbnail,
            conversionStatus: 'pending',
            progress: 0
          };
          this.selectedFiles.push(convertFile);
          this.cdr.detectChanges();
        } catch (err) {
          console.error('Error processing file:', file.name, err);
        }
      }
    }
  }

  async getPdfPageCount(file: File): Promise<number> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    return pdf.numPages;
  }

  async generateThumbnail(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1 });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: context,
      viewport
    }).promise;

    return canvas.toDataURL();
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
    if (this.convertedUrl) {
      URL.revokeObjectURL(this.convertedUrl);
      this.convertedUrl = null;
    }
  }

  clearAll() {
    if (this.convertedUrl) {
      URL.revokeObjectURL(this.convertedUrl);
    }
    this.selectedFiles = [];
    this.convertedUrl = null;
    this.convertMessage = null;
    this.ocrProgress = 0;
  }

  toggleOcr() {
    this.ocrEnabled = !this.ocrEnabled;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async convertToWord() {
    if (this.selectedFiles.length === 0) return;
    
    this.converting = true;
    this.loading = true;
    this.progressComplete = false;
    this.convertMessage = null;
    this.ocrProgress = 0;
    this.cdr.detectChanges();
    
    try {
      // Import Tesseract dynamically
      const Tesseract = await import('tesseract.js');
      
      // Extract text from all PDFs
      const allText: string[] = [];
      const totalFiles = this.selectedFiles.length;
      
      for (let i = 0; i < this.selectedFiles.length; i++) {
        const pdfFile = this.selectedFiles[i];
        pdfFile.conversionStatus = 'processing';
        pdfFile.progress = 0;
        this.cdr.detectChanges();
        
        const extractedText = await this.extractTextWithOcr(pdfFile.file, Tesseract, (progress) => {
          pdfFile.progress = progress;
          this.ocrProgress = ((i + progress / 100) / totalFiles) * 100;
          this.cdr.detectChanges();
        });
        
        pdfFile.extractedText = extractedText;
        pdfFile.conversionStatus = 'completed';
        pdfFile.progress = 100;
        allText.push(`--- ${pdfFile.name} ---\n${extractedText}`);
        this.cdr.detectChanges();
      }
      
      // Generate Word document
      const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import('docx');
      
      const paragraphs = [];
      
      for (const text of allText) {
        // Split by double newlines to create paragraphs
        const sections = text.split('\n\n');
        for (const section of sections) {
          const trimmed = section.trim();
          if (!trimmed) continue;
          
          // Check if it's a heading (starts with ---)
          if (trimmed.startsWith('---')) {
            paragraphs.push(
              new Paragraph({
                text: trimmed.replace(/---/g, '').trim(),
                heading: HeadingLevel.HEADING_1,
                spacing: { after: 200 }
              })
            );
          } else {
            // Regular paragraph
            const lines = trimmed.split('\n');
            for (const line of lines) {
              if (line.trim()) {
                paragraphs.push(
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: line.trim(),
                        size: 24
                      })
                    ],
                    spacing: { after: 120 }
                  })
                );
              }
            }
          }
        }
        
        // Add page break between files
        paragraphs.push(
          new Paragraph({
            children: [],
            pageBreakBefore: true
          })
        );
      }
      
      const doc = new Document({
        sections: [{
          children: paragraphs
        }]
      });
      
      // Use toBlob for browser compatibility
      const docxBlob = await Packer.toBlob(doc);
      
      if (this.convertedUrl) {
        URL.revokeObjectURL(this.convertedUrl);
      }
      this.convertedUrl = URL.createObjectURL(docxBlob);
      
      this.progressComplete = true;
      this.cdr.detectChanges();
      
      this.convertMessage = `Conversion complete! Your ${this.selectedFiles.length} PDF(s) have been converted to Word format. Download is ready.`;
      
      setTimeout(() => {
        this.loading = false;
        this.converting = false;
        this.progressComplete = false;
        this.ocrProgress = 0;
        this.cdr.detectChanges();
      }, 1500);
      
    } catch (error: any) {
      console.error('Error converting PDFs:', error);
      this.convertMessage = `Error: ${error instanceof Error ? error.message : 'Failed to convert PDFs. Please try again.'}`;
      this.loading = false;
      this.converting = false;
      this.cdr.detectChanges();
    }
  }

  private async extractTextWithOcr(
    file: File, 
    Tesseract: any, 
    onProgress: (progress: number) => void
  ): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages;
    
    let fullText = '';
    
    // First, try to extract text directly from the PDF
    let hasTextContent = false;
    
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      if (textContent.items.length > 0) {
        hasTextContent = true;
        const pageText = this.processTextContent(textContent);
        fullText += pageText + '\n\n';
      }
    }
    
    // If PDF has no text content (scanned), use OCR
    if (!hasTextContent || this.ocrEnabled) {
      const ocrText = await this.performOcr(file, pdf, numPages, Tesseract, onProgress);
      
      // If OCR found more text, use that; otherwise keep original
      if (ocrText.trim().length > fullText.trim().length) {
        fullText = ocrText;
      } else if (!hasTextContent && ocrText.trim().length > 0) {
        fullText = ocrText;
      }
    }
    
    return fullText.trim();
  }

  private processTextContent(textContent: any): string {
    const items = textContent.items;
    let text = '';
    let lastY: number | null = null;
    
    for (const item of items) {
      if ('str' in item) {
        // Check if this is a new line (different Y position)
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
          text += '\n';
        }
        text += item.str + ' ';
        lastY = item.transform[5];
      }
    }
    
    return text.trim();
  }

  private async performOcr(
    file: File, 
    pdf: any, 
    numPages: number, 
    Tesseract: any,
    onProgress: (progress: number) => void
  ): Promise<string> {
    let fullOcrText = '';
    
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2 });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      context.fillStyle = '#FFFFFF';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      await page.render({
        canvasContext: context,
        viewport
      }).promise;
      
      // Perform OCR on the page
      const { data } = await Tesseract.recognize(canvas, 'eng', {
        logger: (m: any) => {
          if (m.status === 'recognizing text') {
            const pageProgress = m.progress * 100;
            const overallProgress = ((pageNum - 1 + pageProgress / 100) / numPages) * 100;
            onProgress(overallProgress);
          }
        }
      });
      
      fullOcrText += `--- Page ${pageNum} ---\n${data.text}\n\n`;
      onProgress((pageNum / numPages) * 100);
    }
    
    return fullOcrText;
  }

  downloadConverted(): void {
    if (!this.convertedUrl) return;
    const a = document.createElement('a');
    a.href = this.convertedUrl;
    a.download = this.selectedFiles.length === 1 
      ? this.selectedFiles[0].name.replace('.pdf', '.docx')
      : 'converted-documents.docx';
    a.click();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const target = event.target as HTMLElement;
    target.closest('.upload-container')?.classList.add('drag-over');
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const target = event.target as HTMLElement;
    target.closest('.upload-container')?.classList.remove('drag-over');
  }

  async onDrop(event: DragEvent): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    const target = event.target as HTMLElement;
    target.closest('.upload-container')?.classList.remove('drag-over');

    const files = event.dataTransfer?.files;
    if (!files) return;

    const pdfFiles = Array.from(files).filter(file => file.type === 'application/pdf');
    await this.processFiles(pdfFiles);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
