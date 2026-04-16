import { Component, NgZone, OnInit } from '@angular/core';
import { PdfService } from '../../core/services/pdf';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { FaqItem } from '../../components/faq-section/faq-section';
import { ToolHeaderComponent } from '../../components/tool-header/tool-header';
import { ToolConfigService } from '../../core/services/tool-config';
import { ToolData } from '../../core/models/tool-data.model';
import { SeoService } from '../../core/services/seo.service';
import { ToolDataService } from '../../core/services/tool-data.service';
import { SeoContentComponent } from "../../components/seo-content/seo-content";

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
  imports: [CommonModule, FormsModule, ToolHeaderComponent, SeoContentComponent]
})
export class PdfCompressComponent implements OnInit {
  toolId= 'pdf-compress';

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

  toolData: ToolData = {} as ToolData;

  constructor(
    private pdfService: PdfService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private toolConfigService: ToolConfigService,
    private seoService: SeoService,
    private toolDataService: ToolDataService
  ) {
    const tool = this.toolDataService.getToolById('pdf-compress');
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
}
