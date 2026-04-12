import { Component, NgZone, OnInit } from '@angular/core';
import { PdfService } from '../../core/services/pdf';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { FaqSectionComponent, FaqItem } from '../../components/faq-section/faq-section';
import { UseCaseModalComponent } from '../../components/use-case-modal/use-case-modal';
import { ToolHeaderComponent } from '../../components/tool-header/tool-header';
import { ToolConfigService } from '../../core/services/tool-config';
import { ToolSEO } from '../../core/models/tool';

interface CompressFile {
  file: File;
  name: string;
  size: number;
  originalSize: number;
  compressedSize?: number;
  compressionRatio?: number;
}

@Component({
  selector: 'app-pdf-compress',
  templateUrl: './pdf-compress.html',
  styleUrls: ['./pdf-compress.scss'],
  imports: [CommonModule, FaqSectionComponent, UseCaseModalComponent, FormsModule, ToolHeaderComponent]
})
export class PdfCompressComponent implements OnInit {

  selectedFiles: CompressFile[] = [];
  loading = false;
  compressing = false;
  compressedUrl: string | null = null;
  compressMessage: string | null = null;
  progressComplete = false;
  totalOriginalSize = 0;
  totalCompressedSize = 0;
  
  // Compression level
  compressionLevel: 'low' | 'medium' | 'high' = 'medium';
  
  // SEO data loaded from tool config
  seoTitle = '';
  seoMetaDescription = '';
  seoH1 = '';
  seoH2 = '';
  
  // FAQ Configuration
  faqTitle = 'Frequently Asked Questions';
  faqAccentColor = '#2f84ff';
  expandedFaqIndex: number | null = 0;
  
  // Use Case Modal State
  showUseCaseModal = false;
  currentUseCase: {
    title: string;
    description: string;
    benefits: string[];
    icon: string;
    color: string;
  } | null = null;

  // Use Case Data
  useCaseDetails: { [key: number]: any } = {
    1: {
      title: 'Email Attachments',
      description: 'Easily compress large PDF files to send via email without worrying about attachment size limits. Most email providers have a 25MB limit, and our tool helps you stay within those boundaries.',
      benefits: [
        'Stay within email provider attachment limits',
        'Send multiple files in one email',
        'Faster email sending and receiving',
        'Save storage space in your inbox'
      ],
      icon: 'email',
      color: '#dbeafe'
    },
    2: {
      title: 'Faster Uploads',
      description: 'Compress PDFs for quicker uploads to websites, cloud storage, or document management systems. Smaller files mean less waiting and more productivity.',
      benefits: [
        'Faster upload speeds on slow connections',
        'Less bandwidth usage',
        'Quick uploads to cloud services',
        'Efficient document management'
      ],
      icon: 'upload',
      color: '#d1fae5'
    },
    3: {
      title: 'Mobile Sharing',
      description: 'Create smaller, more manageable PDFs that are perfect for sharing on mobile devices. Send documents via WhatsApp, Telegram, or other messaging apps.',
      benefits: [
        'Share via messaging apps easily',
        'Save mobile data when sending',
        'Works on all smartphone types',
        'Instant sharing without compression'
      ],
      icon: 'mobile',
      color: '#fce7f3'
    },
    4: {
      title: 'Archive Storage',
      description: 'Save significant storage space by compressing documents for long-term archiving. Perfect for legal documents, medical records, and historical files.',
      benefits: [
        'Reduce storage costs significantly',
        'Faster backup and restore times',
        'Organize more documents in less space',
        'Maintain document accessibility'
      ],
      icon: 'archive',
      color: '#fef3c7'
    }
  };
  
  faqs: FaqItem[] = [
    {
      question: 'How does PDF compression work?',
      answer: 'Our PDF compressor uses advanced algorithms to reduce the file size of your PDF documents. It removes unnecessary data, optimizes images, and compresses fonts while maintaining document quality.'
    },
    {
      question: 'Will the compression affect my document quality?',
      answer: 'Our compression tool is designed to maintain the best possible quality while reducing file size. You can choose between low, medium, and high compression levels depending on your needs.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, all PDF compression happens in your browser. Your files are not uploaded to our servers, ensuring complete privacy and security.'
    },
    {
      question: 'How much can I reduce my PDF file size?',
      answer: 'The compression ratio depends on the content of your PDF. Files with many images can typically be reduced by 50-90%, while text-only PDFs may see smaller reductions.'
    },
    {
      question: 'Do I need to create an account to use this tool?',
      answer: 'No, our PDF Compress Tool is completely free and doesn\'t require any registration or account creation.'
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

  ngOnInit(): void {
    // SEO data is loaded in constructor
  }

  loadSeoData() {
    const tools = this.toolConfigService.getAllTools();
    const tool = tools.find(t => t.id === 'compress-pdf');
    
    if (tool && tool.seo) {
      const seo: ToolSEO = tool.seo;
      this.seoTitle = seo.title;
      this.seoMetaDescription = seo.metaDescription;
      this.seoH1 = seo.h1;
      this.seoH2 = seo.h2;
      this.faqs = [...this.faqs, ...(seo.faqs || [])]; // Use default FAQs if not provided in SEO config
      
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
        const compressFile: CompressFile = {
          file,
          name: file.name,
          size: file.size,
          originalSize: file.size
        };
        this.selectedFiles.push(compressFile);
        this.totalOriginalSize += file.size;
        this.cdr.detectChanges();
      }
    }
  }

  removeFile(index: number) {
    const file = this.selectedFiles[index];
    this.totalOriginalSize -= file.originalSize;
    this.selectedFiles.splice(index, 1);
    if (this.compressedUrl) {
      URL.revokeObjectURL(this.compressedUrl);
      this.compressedUrl = null;
    }
  }

  clearAll() {
    if (this.compressedUrl) {
      URL.revokeObjectURL(this.compressedUrl);
    }
    this.selectedFiles = [];
    this.compressedUrl = null;
    this.compressMessage = null;
    this.totalOriginalSize = 0;
    this.totalCompressedSize = 0;
  }

  setCompressionLevel(level: 'low' | 'medium' | 'high') {
    this.compressionLevel = level;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getSavingsPercentage(): number {
    if (this.totalOriginalSize === 0) return 0;
    return Math.round(((this.totalOriginalSize - this.totalCompressedSize) / this.totalOriginalSize) * 100);
  }

  async compressPDFs() {
    if (this.selectedFiles.length === 0) return;
    
    this.compressing = true;
    this.loading = true;
    this.progressComplete = false;
    this.compressMessage = null;
    this.cdr.detectChanges();
    
    try {
      // Simulate compression progress
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For now, we'll create a simple compressed version
      // In a real implementation, you would use a PDF compression library
      const result = await this.pdfService.compressPdfs(
        this.selectedFiles.map(f => ({ file: f.file, name: f.name, size: f.size })),
        this.compressionLevel
      );
      
      // Get the actual compressed file size
      const compressedSize = result.length;
      this.totalCompressedSize = compressedSize;
      
      // Distribute the compressed size proportionally among files
      this.selectedFiles.forEach((file) => {
        const proportion = file.originalSize / this.totalOriginalSize;
        file.compressedSize = Math.round(compressedSize * proportion);
        file.compressionRatio = Math.round((1 - (file.compressedSize! / file.originalSize)) * 100);
      });
      
      const blob = new Blob([new Uint8Array(result)], { type: 'application/pdf' });
      
      if (this.compressedUrl) {
        URL.revokeObjectURL(this.compressedUrl);
      }
      this.compressedUrl = URL.createObjectURL(blob);
      
      this.progressComplete = true;
      this.cdr.detectChanges();
      
      const savings = this.getSavingsPercentage();
      this.compressMessage = `Compression complete! Reduced file size by ${savings}%. Your ${this.selectedFiles.length} file(s) are ready to download.`;
      
      setTimeout(() => {
        this.loading = false;
        this.compressing = false;
        this.progressComplete = false;
        this.cdr.detectChanges();
      }, 1500);
      
    } catch (error: any) {
      console.error('Error compressing PDFs:', error);
      this.compressMessage = `Error: ${error instanceof Error ? error.message : 'Failed to compress PDFs. Please try again.'}`;
      this.loading = false;
      this.compressing = false;
      this.cdr.detectChanges();
    }
  }

  downloadCompressed(): void {
    if (!this.compressedUrl) return;
    const a = document.createElement('a');
    a.href = this.compressedUrl;
    a.download = this.selectedFiles.length === 1 
      ? this.selectedFiles[0].name.replace('.pdf', '-compressed.pdf')
      : 'compressed-pdfs.zip';
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

  openUseCaseModal(useCaseId: number): void {
    const useCase = this.useCaseDetails[useCaseId];
    if (useCase) {
      this.currentUseCase = useCase;
      this.showUseCaseModal = true;
      this.cdr.detectChanges();
    }
  }

  closeUseCaseModal(): void {
    this.showUseCaseModal = false;
    this.currentUseCase = null;
    this.cdr.detectChanges();
  }
}
