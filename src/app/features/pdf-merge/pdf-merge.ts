import { Component, NgZone } from '@angular/core';
import { PdfService } from '../../core/services/pdf';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { FaqSectionComponent, FaqItem } from '../../components/faq-section/faq-section';
import * as pdfjsLib from 'pdfjs-dist';
(pdfjsLib as any).GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

interface PdfFile {
  file: File;
  name: string;
  pages: number[];
  totalPages: number;
  thumbnail?: string;
  pageThumbnails?: { [key: number]: string };
  isGeneratingThumbnails?: boolean;
  thumbnailProgress?: number;
}

interface PageItem {
  pdf: PdfFile;
  pageIndex: number;
  id: string;
}

@Component({
  selector: 'app-pdf-merge',
  templateUrl: './pdf-merge.html',
  styleUrls: ['./pdf-merge.scss'],
  imports: [DragDropModule, CommonModule, FaqSectionComponent, FormsModule]
})
export class PdfMergeComponent {

  pdfFiles: PdfFile[] = [];
  pageItems: PageItem[] = [];
  loading = false;
  mergedUrl: string | null = null;
  mergeMessage: string | null = null;
  progressComplete = false;
  isGeneratingPages = false;
  
  // Password modal state
  showPasswordModal = false;
  currentEncryptedFile: string | null = null;
  currentPassword = '';
  passwords: { [key: string]: string } = {};
  filesToSkip: string[] = [];
  
  // View mode toggle
  private _viewMode: 'pdf' | 'page' = 'pdf';
  
  get viewMode(): 'pdf' | 'page' {
    return this._viewMode;
  }
  
  set viewMode(value: 'pdf' | 'page') {
    this._viewMode = value;
    if (value === 'page') {
      // Build flat list of page items for drag-drop first (to show structure immediately)
      this.buildPageItems();
      // Then generate thumbnails for all PDFs
      this.generateAllPageThumbnailsForAll();
    }
  }
  
  // FAQ Configuration
  faqTitle = 'Frequently Asked Questions';
  faqAccentColor = '#2f84ff';
  expandedFaqIndex: number | null = 0;
  
  faqs: FaqItem[] = [
    {
      question: 'How do I merge PDF files?',
      answer: 'Simply drag and drop your PDF files into the upload area, or click "Browse Files" to select them from your computer. Once uploaded, click "Merge PDFs" to combine them into a single document.'
    },
    {
      question: 'Can I reorder the PDF files before merging?',
      answer: 'Yes! You can drag and drop the uploaded PDF files to rearrange their order. The final merged PDF will follow the order you set.'
    },
    {
      question: 'Is there a limit to how many PDFs I can merge?',
      answer: 'Our tool supports merging multiple PDF files. While there\'s no strict limit, very large files may take longer to process.'
    },
    {
      question: 'Do I need to create an account to use this tool?',
      answer: 'No, our PDF Merge Tool is completely free and doesn\'t require any registration or account creation.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, all PDF processing happens in your browser. Your files are not uploaded to our servers, ensuring complete privacy and security.'
    }
  ];

  constructor(private pdfService: PdfService, private cdr: ChangeDetectorRef, private ngZone: NgZone) { }

  async onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    const files = Array.from(input.files);
    await this.processFiles(files);
    input.value = '';
  }

  private async processFiles(files: File[]) {
    for (const file of files) {
      try {
        const totalPages = await this.getPdfPageCount(file);
        const thumbnail = await this.generateThumbnail(file);
        const newPdf: PdfFile = {
          file,
          name: file.name,
          totalPages,
          pages: Array.from({ length: totalPages }, (_, i) => i),
          thumbnail,
          isGeneratingThumbnails: true
        };
        this.pdfFiles.push(newPdf);
        this.cdr.detectChanges();
        
        // Start generating page thumbnails in the background without blocking
        this.ngZone.runOutsideAngular(() => {
          this.generatePageThumbnailsAsync(newPdf);
        });
      } catch (err) {
        console.error(err);
      }
    }
  }

  private async generatePageThumbnailsAsync(pdf: PdfFile) {
    try {
      const thumbnails = await this.generateAllPageThumbnails(pdf);
      this.ngZone.run(() => {
        pdf.pageThumbnails = thumbnails;
        pdf.isGeneratingThumbnails = false;
        pdf.thumbnailProgress = 100;
        this.cdr.detectChanges();
      });
    } catch (err) {
      console.error('Error generating page thumbnails:', err);
      this.ngZone.run(() => {
        pdf.isGeneratingThumbnails = false;
        this.cdr.detectChanges();
      });
    }
  }

  async getPdfPageCount(file: File): Promise<number> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    return pdf.numPages;
  }

  async generateThumbnail(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer
    }).promise;

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
    this.pdfFiles.splice(index, 1);
  }

  drop(event: CdkDragDrop<PdfFile[]>) {
    moveItemInArray(this.pdfFiles, event.previousIndex, event.currentIndex);
  }

  dropPage(event: CdkDragDrop<PageItem[]>) {
    // Reorder the flat pageItems array
    moveItemInArray(this.pageItems, event.previousIndex, event.currentIndex);
    this.cdr.detectChanges();
  }

  buildPageItems() {
    // Build a flat list of all pages from all PDFs
    this.pageItems = [];
    for (const pdf of this.pdfFiles) {
      for (let i = 0; i < pdf.totalPages; i++) {
        this.pageItems.push({
          pdf: pdf,
          pageIndex: i,
          id: `${pdf.name}-${i}`
        });
      }
    }
  }

  togglePage(file: PdfFile, pageIndex: number) {
    if (file.pages.includes(pageIndex)) {
      file.pages = file.pages.filter(p => p !== pageIndex);
    } else {
      file.pages.push(pageIndex);
    }
  }

  // expandPdf method removed - no longer needed

  async generateAllPageThumbnails(pdf: PdfFile): Promise<{ [key: number]: string }> {
    const thumbnails: { [key: number]: string } = {};
    try {
      const arrayBuffer = await pdf.file.arrayBuffer();
      const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      for (let i = 1; i <= pdf.totalPages; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 0.5 });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await page.render({
          canvasContext: context,
          viewport
        }).promise;
        
        thumbnails[i - 1] = canvas.toDataURL();
      }
    } catch (err) {
      console.error('Error generating page thumbnails:', err);
    }
    return thumbnails;
  }

  selectAllPages(pdf: PdfFile) {
    pdf.pages = Array.from({ length: pdf.totalPages }, (_, i) => i);
  }

  deselectAllPages(pdf: PdfFile) {
    pdf.pages = [];
  }

  selectAllPagesAllPdfs() {
    this.pdfFiles.forEach(pdf => {
      pdf.pages = Array.from({ length: pdf.totalPages }, (_, i) => i);
    });
    this.cdr.detectChanges();
  }

  deselectAllPagesAllPdfs() {
    this.pdfFiles.forEach(pdf => {
      pdf.pages = [];
    });
    this.cdr.detectChanges();
  }

  getTotalPages(): number {
    return this.pdfFiles.reduce((sum, pdf) => sum + pdf.totalPages, 0);
  }

  getAllPageIndices(pdf: PdfFile): number[] {
    return Array.from({ length: pdf.totalPages }, (_, i) => i);
  }

  getTotalSelectedPages(): number {
    return this.pdfFiles.reduce((sum, pdf) => sum + pdf.pages.length, 0);
  }

  allPdfsHaveThumbnails(): boolean {
    return this.pdfFiles.every(pdf => !!pdf.pageThumbnails);
  }

  async generateAllPageThumbnailsForAll() {
    for (const pdf of this.pdfFiles) {
      if (!pdf.pageThumbnails) {
        pdf.pageThumbnails = {};
        const thumbnails = await this.generateAllPageThumbnails(pdf);
        pdf.pageThumbnails = thumbnails;
        this.cdr.detectChanges();
      }
    }
  }

  async mergePDFs() {
    // Check if we're in page view and have a custom order
    if (this.viewMode === 'page' && this.pageItems.length > 0) {
      // Filter only selected pages from pageItems and maintain their order
      const selectedPageItems = this.pageItems.filter(item => 
        item.pdf.pages.includes(item.pageIndex)
      );
      
      // Check if any pages are selected
      if (selectedPageItems.length === 0) {
        this.mergeMessage = 'No pages selected. Please select pages to merge.';
        return;
      }
      
      // Build array of page items with file reference for mergePagesInOrder
      const pagesToMerge = selectedPageItems.map(item => ({
        file: item.pdf.file,
        name: item.pdf.name,
        pageIndex: item.pageIndex
      }));
      
      this.loading = true;
      this.progressComplete = false;
      this.mergeMessage = null;
      this.cdr.detectChanges();
      
      try {
        // Use mergePagesInOrder to maintain user's custom page order
        const result = await this.pdfService.mergePagesInOrder(pagesToMerge, this.passwords);
        const blob = new Blob([new Uint8Array(result)], { type: 'application/pdf' });
        if (this.mergedUrl) {
          URL.revokeObjectURL(this.mergedUrl);
        }
        this.mergedUrl = URL.createObjectURL(blob);
        
        this.progressComplete = true;
        this.cdr.detectChanges();
        this.mergeMessage = `PDF merge is complete! ${selectedPageItems.length} pages merged in your custom order. Download is ready.`;
        
        setTimeout(() => {
          this.loading = false;
          this.progressComplete = false;
          this.cdr.detectChanges();
        }, 1000);
        
        return;
      } catch (error: any) {
        console.error('Error merging PDFs:', error);
        this.mergeMessage = `Error: ${error instanceof Error ? error.message : 'Failed to merge PDFs. Please try again.'}`;
        this.loading = false;
        this.cdr.detectChanges();
        return;
      }
    }
    
    // Default behavior: use pdfFiles order
    const filesToMerge = this.pdfFiles.filter(f => !this.filesToSkip.includes(f.name));
    
    if (filesToMerge.length < 1) {
      this.mergeMessage = 'No files to merge. All files were skipped.';
      return;
    }
    
    this.loading = true;
    this.progressComplete = false;
    this.mergeMessage = null;
    this.cdr.detectChanges();
    
    try {
      const result = await this.pdfService.mergeSelectedPages(filesToMerge, this.passwords);
      const blob = new Blob([new Uint8Array(result)], { type: 'application/pdf' });
      if (this.mergedUrl) {
        URL.revokeObjectURL(this.mergedUrl);
      }
      this.mergedUrl = URL.createObjectURL(blob);
      
      // Set progress to complete - this will trigger the CSS animation
      this.progressComplete = true;
      this.cdr.detectChanges();
      
      // Build message about skipped files
      if (this.filesToSkip.length > 0) {
        this.mergeMessage = `PDF merge is complete! ${this.filesToSkip.length} file(s) were skipped. Download is ready.`;
      } else {
        this.mergeMessage = 'PDF merge is complete. Download is ready.';
      }
      
      // Wait for animation to complete, then hide progress bar
      setTimeout(() => {
        this.loading = false;
        this.progressComplete = false;
        this.cdr.detectChanges();
      }, 1000);
      
    } catch (error: any) {
      console.error('Error merging PDFs:', error);
      
      // Check if it's an encrypted file error
      if (error && error.type === 'encrypted') {
        this.currentEncryptedFile = error.fileName;
        this.showPasswordModal = true;
        this.loading = false;
        this.cdr.detectChanges();
        return;
      }
      
      this.mergeMessage = `Error: ${error instanceof Error ? error.message : 'Failed to merge PDFs. Please try again.'}`;
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  // Password modal methods
  onUnlockWithPassword() {
    if (this.currentEncryptedFile && this.currentPassword) {
      this.passwords[this.currentEncryptedFile] = this.currentPassword;
      this.showPasswordModal = false;
      this.currentPassword = '';
      this.currentEncryptedFile = null;
      // Retry merge with password
      this.mergePDFs();
    }
  }

  onIgnoreFile() {
    if (this.currentEncryptedFile) {
      this.filesToSkip.push(this.currentEncryptedFile);
      this.showPasswordModal = false;
      this.currentPassword = '';
      this.currentEncryptedFile = null;
      // Retry merge, skipping this file
      this.mergePDFs();
    }
  }

  closePasswordModal() {
    this.showPasswordModal = false;
    this.currentPassword = '';
    this.currentEncryptedFile = null;
    this.mergeMessage = 'Merge cancelled due to password-protected file.';
  }

  downloadMerged(): void {
    if (!this.mergedUrl) return;
    const a = document.createElement('a');
    a.href = this.mergedUrl;
    a.download = 'merged.pdf';
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
}
