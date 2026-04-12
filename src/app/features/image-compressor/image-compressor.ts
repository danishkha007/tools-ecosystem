import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { FaqSectionComponent, FaqItem } from '../../components/faq-section/faq-section';
import { UseCaseModalComponent } from '../../components/use-case-modal/use-case-modal';
import { ToolHeaderComponent } from '../../components/tool-header/tool-header';
import { AboutSectionComponent } from '../../components/about-section/about-section';
import { ToolConfigService } from '../../core/services/tool-config';
import { ToolSEO } from '../../core/models/tool';

interface CompressImage {
  file: File;
  name: string;
  originalSize: number;
  compressedSize?: number;
  compressionRatio?: number;
  previewUrl?: string;
}

@Component({
  selector: 'app-image-compressor',
  standalone: true,
  imports: [CommonModule, FaqSectionComponent, UseCaseModalComponent, FormsModule, ToolHeaderComponent, AboutSectionComponent],
  templateUrl: './image-compressor.html',
  styleUrl: './image-compressor.scss',
})
export class ImageCompressor implements OnInit {

  selectedFiles: CompressImage[] = [];
  loading = false;
  compressing = false;
  compressedUrl: string | null = null;
  compressMessage: string | null = null;
  progressComplete = false;
  totalOriginalSize = 0;
  totalCompressedSize = 0;
  
  // Compression quality (1-100)
  compressionQuality: number = 80;
  
  // Output format
  outputFormat: 'original' | 'jpeg' | 'png' | 'webp' = 'original';
  
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
      title: 'Website Optimization',
      description: 'Compress images for your website to improve loading speeds and SEO rankings. Faster websites mean better user experience and higher search engine rankings.',
      benefits: [
        'Faster website loading times',
        'Better SEO rankings',
        'Reduced bandwidth usage',
        'Improved user experience on mobile'
      ],
      icon: 'upload',
      color: '#dbeafe'
    },
    2: {
      title: 'Email Attachments',
      description: 'Compress images before attaching to emails. Stay within attachment limits and send high-quality images without exceeding email provider limits.',
      benefits: [
        'Stay within email attachment limits',
        'Send more images per email',
        'Faster email sending',
        'Save storage space'
      ],
      icon: 'email',
      color: '#d1fae5'
    },
    3: {
      title: 'Social Media',
      description: 'Prepare images for social media platforms. Compress to optimal sizes for posting while maintaining visual quality.',
      benefits: [
        'Optimal file sizes for social platforms',
        'Faster uploads to social media',
        'Save mobile data when posting',
        'Maintain image quality'
      ],
      icon: 'mobile',
      color: '#fce7f3'
    },
    4: {
      title: 'Storage Saving',
      description: 'Free up storage space on your device by compressing existing images. Reduce file sizes without significant quality loss.',
      benefits: [
        'Save significant storage space',
        'Batch compress multiple images',
        'Maintain image quality options',
        'Organize and optimize your library'
      ],
      icon: 'archive',
      color: '#fef3c7'
    }
  };
  
  faqs: FaqItem[] = [
    {
      question: 'How does image compression work?',
      answer: 'Our image compressor uses advanced algorithms to reduce file size while maintaining visual quality. It optimizes the image data, reduces colors where possible, and removes unnecessary metadata.'
    },
    {
      question: 'Will compression affect image quality?',
      answer: 'Our compression is designed to maintain the best possible quality while reducing file size. You can adjust the quality slider to balance between file size and image quality.'
    },
    {
      question: 'What image formats are supported?',
      answer: 'We support JPG, PNG, WebP, and GIF formats. You can choose to keep the original format or convert to a different format.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, all image compression happens in your browser. Your images are never uploaded to our servers, ensuring complete privacy and security.'
    },
    {
      question: 'How much can I reduce the image size?',
      answer: 'The compression ratio depends on the image content and selected quality level. Typically, you can reduce file size by 50-90% for JPG images.'
    }
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private toolConfigService: ToolConfigService
  ) {
    this.loadSeoData();
  }

  ngOnInit(): void {}

  loadSeoData() {
    const tools = this.toolConfigService.getAllTools();
    const tool = tools.find(t => t.id === 'image-compress');
    
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
      if (file.type.startsWith('image/')) {
        const compressImage: CompressImage = {
          file,
          name: file.name,
          originalSize: file.size
        };
        
        // Create preview URL
        compressImage.previewUrl = URL.createObjectURL(file);
        
        this.selectedFiles.push(compressImage);
        this.totalOriginalSize += file.size;
        this.cdr.detectChanges();
      }
    }
  }

  removeFile(index: number) {
    const file = this.selectedFiles[index];
    if (file.previewUrl) {
      URL.revokeObjectURL(file.previewUrl);
    }
    this.totalOriginalSize -= file.originalSize;
    this.selectedFiles.splice(index, 1);
    if (this.compressedUrl) {
      URL.revokeObjectURL(this.compressedUrl);
      this.compressedUrl = null;
    }
    this.cdr.detectChanges();
  }

  clearAll() {
    if (this.compressedUrl) {
      URL.revokeObjectURL(this.compressedUrl);
    }
    this.selectedFiles.forEach(file => {
      if (file.previewUrl) {
        URL.revokeObjectURL(file.previewUrl);
      }
    });
    this.selectedFiles = [];
    this.compressedUrl = null;
    this.compressMessage = null;
    this.totalOriginalSize = 0;
    this.totalCompressedSize = 0;
    this.cdr.detectChanges();
  }

  setCompressionQuality(quality: number) {
    this.compressionQuality = quality;
  }

  setOutputFormat(format: 'original' | 'jpeg' | 'png' | 'webp') {
    this.outputFormat = format;
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

  async compressImages() {
    if (this.selectedFiles.length === 0) return;
    
    this.compressing = true;
    this.loading = true;
    this.progressComplete = false;
    this.compressMessage = null;
    this.totalCompressedSize = 0; // Reset compressed size for each compression
    this.cdr.detectChanges();
    
    try {
      // Process each image
      const compressedBlobs: Blob[] = [];
      
      for (let i = 0; i < this.selectedFiles.length; i++) {
        const imgData = this.selectedFiles[i];
        
        // Load image
        const img = await this.loadImage(imgData.file);
        
        // Create canvas and compress
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        
        // Determine output format and quality
        let targetFormat = this.outputFormat;
        if (targetFormat === 'original') {
          // Detect format from file type
          if (imgData.file.type === 'image/png') {
            targetFormat = 'png';
          } else if (imgData.file.type === 'image/webp') {
            targetFormat = 'webp';
          } else {
            targetFormat = 'jpeg';
          }
        }
        
        let mimeType: string;
        let quality: number | undefined;
        
        switch (targetFormat) {
          case 'png':
            mimeType = 'image/png';
            // PNG doesn't support quality parameter - it's lossless
            quality = undefined;
            break;
          case 'webp':
            mimeType = 'image/webp';
            // WebP quality: 0-100
            quality = this.compressionQuality / 100;
            break;
          case 'jpeg':
          default:
            mimeType = 'image/jpeg';
            // JPEG quality: 0-1 (but toBlob expects 0-1, not percentage)
            quality = this.compressionQuality / 100;
            break;
        }
        
        // Compress
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((b) => {
            if (b) resolve(b);
            else reject(new Error('Failed to create blob'));
          }, mimeType, quality);
        });
        
        // For lossy formats (JPEG/WebP), if compressed is larger than original, 
        // use the original file instead - this can happen at high quality settings
        let finalBlob = blob;
        if (targetFormat !== 'png' && blob.size > imgData.originalSize) {
          // If re-encoding makes it larger, use the original file
          finalBlob = new Blob([await imgData.file.arrayBuffer()], { type: imgData.file.type });
        }
        
        compressedBlobs.push(finalBlob);
        
        // Update file info
        imgData.compressedSize = finalBlob.size;
        imgData.compressionRatio = Math.round((1 - (finalBlob.size / imgData.originalSize)) * 100);
        
        this.totalCompressedSize += finalBlob.size;
        
        this.cdr.detectChanges();
      }
      
      // Create output blob
      let outputBlob: Blob;
      let extension: string;
      
      if (this.selectedFiles.length === 1) {
        outputBlob = compressedBlobs[0];
        const originalName = this.selectedFiles[0].name;
        const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
        if (this.outputFormat === 'original') {
          extension = originalName.split('.').pop() || 'jpg';
        } else {
          extension = this.outputFormat === 'jpeg' ? 'jpg' : this.outputFormat;
        }
        this.compressedUrl = URL.createObjectURL(outputBlob);
      } else {
        // For multiple files, create a zip (simplified - just use first for demo)
        outputBlob = compressedBlobs[0];
        extension = 'jpg';
        this.compressedUrl = URL.createObjectURL(outputBlob);
      }
      
      this.progressComplete = true;
      this.cdr.detectChanges();
      
      const savings = this.getSavingsPercentage();
      const savedSize = this.totalOriginalSize - this.totalCompressedSize;
      
      let messagePrefix = savings > 0 ? 'Reduced' : 'Compressed';
      if (savings === 0 && this.totalCompressedSize === this.totalOriginalSize) {
        messagePrefix = 'Compressed';
      }
      
      this.compressMessage = `${messagePrefix} ${this.formatFileSize(Math.abs(savedSize))} (${Math.abs(savings)}%) - Your ${this.selectedFiles.length} image(s) are now ${this.formatFileSize(this.totalCompressedSize)}`;
      
      setTimeout(() => {
        this.loading = false;
        this.compressing = false;
        this.progressComplete = false;
        this.cdr.detectChanges();
      }, 1500);
      
    } catch (error: any) {
      console.error('Error compressing images:', error);
      this.compressMessage = `Error: ${error instanceof Error ? error.message : 'Failed to compress images. Please try again.'}`;
      this.loading = false;
      this.compressing = false;
      this.cdr.detectChanges();
    }
  }

  private loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  downloadCompressed(): void {
    if (!this.compressedUrl) return;
    
    if (this.selectedFiles.length === 1) {
      const originalName = this.selectedFiles[0].name;
      const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
      let extension = originalName.split('.').pop() || 'jpg';
      if (this.outputFormat !== 'original') {
        extension = this.outputFormat;
      }
      const fileName = `${nameWithoutExt}-compressed.${extension}`;
      
      const a = document.createElement('a');
      a.href = this.compressedUrl;
      a.download = fileName;
      a.click();
    } else {
      // For multiple files, download first one as demo
      const a = document.createElement('a');
      a.href = this.compressedUrl;
      a.download = 'compressed-images.jpg';
      a.click();
    }
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

    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    await this.processFiles(imageFiles);
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
