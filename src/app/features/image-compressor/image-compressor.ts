import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { ToolHeaderComponent } from '../../components/tool-header/tool-header';
import { ToolData } from '../../core/models/tool-data.model';
import { SeoService } from '../../core/services/seo.service';
import { ToolDataService } from '../../core/services/tool-data.service';
import { SeoContentComponent } from "../../components/seo-content/seo-content";

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
  imports: [CommonModule, FormsModule, ToolHeaderComponent, SeoContentComponent],
  templateUrl: './image-compressor.html',
  styleUrl: './image-compressor.scss',
})
export class ImageCompressor implements OnInit {

  toolId = 'image-compressor';

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
  toolData: ToolData = {} as ToolData;

  constructor(
    private cdr: ChangeDetectorRef,
    private seoService: SeoService,
    private toolDataService: ToolDataService
  ) {
    const tool = this.toolDataService.getToolById(this.toolId);
    if (tool) {
      this.toolData = tool;
    }
  }

  ngOnInit(): void {
    this.seoService.setSeoData(this.toolData.seo);
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
}
