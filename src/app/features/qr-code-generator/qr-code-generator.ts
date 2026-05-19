import { Component, OnInit, HostListener, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tool } from '../../core/models/tool-data.model';
import { SeoService } from '../../core/services/seo.service';
import { DataService } from '@core/services/data.service';
import { Category } from '@core/models/category-data.model';

@Component({
  selector: 'qr-code-generator',
  templateUrl: './qr-code-generator.html',
  styleUrls: ['./qr-code-generator.scss'],
  imports: [CommonModule, FormsModule]
})
export class QrCodeGeneratorComponent implements OnInit {
  toolId = 'qr-code-generator';

  toolData: Tool | undefined;
  categoryData: Category | undefined;

  // QR Code Content
  qrContent = '';
  qrType: 'text' | 'url' | 'wifi' = 'text';
  
  // WiFi Options
  wifiSsid = '';
  wifiPassword = '';
  wifiEncryption: 'WPA' | 'WEP' | 'NOPASS' = 'WPA';
  
  // QR Code Image
  qrImage: string | null = null;
  
  // UI State
  loading = false;
  showError = false;
  isValidContent = true;
  showDownloadOptions = true;
  maxCharacters = 2048;
  errorCorrectLevel: 'L' | 'M' | 'Q' | 'H' = 'M';
  
  // Download Options
  downloadType: 'png' | 'svg' = 'png';
  showLogo = false;
  
  // Internal flag to track if QR is being generated
  isGenerating = false;

  constructor(
    private dataService: DataService,
    private seoService: SeoService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
  ) {
    this.toolData = this.dataService.getCompleteToolDataById(this.toolId);
    this.categoryData = this.dataService.getCategoryDataById(this.toolData.category);
  }

  ngOnInit(): void {
    this.seoService.setSeoData(this.dataService.getSeoDataById(this.toolId));
  }

   showHeader(){
    return true;
  }

  @HostListener('window:resize')
  onResize() {
    // Handle window resize if needed
  }

  // Validate content
  validateContent(): boolean {
    if (!this.qrContent || this.qrContent.trim().length === 0) {
      this.isValidContent = false;
      this.showError = true;
      return false;
    }
    
    if (this.qrContent.length > this.maxCharacters) {
      this.isValidContent = false;
      this.showError = true;
      return false;
    }
    
    this.isValidContent = true;
    this.showError = false;
    return true;
  }

  // Handle content change
  onContentChange(): void {
    this.validateContent();
    this.cdr.detectChanges();
  }

  // Clear content
  clearContent(): void {
    this.qrContent = '';
    this.qrImage = null;
    this.isValidContent = true;
    this.showError = false;
  }

  // Clear all
  clearAll(): void {
    this.qrContent = '';
    this.qrImage = null;
    this.isValidContent = false;
    this.showError = false;
    this.wifiSsid = '';
    this.wifiPassword = '';
  }

  // Toggle download type
  toggleDownloadType(): void {
    this.downloadType = this.downloadType === 'png' ? 'svg' : 'png';
  }

  // Generate QR Code - uses QR Server API
  generateQRCode(): void {
    // Prevent multiple simultaneous calls
    if (this.isGenerating) {
      return;
    }
    
    // Clear any previous errors
    this.showError = false;
    
    // Validate content first
    if (!this.qrContent || this.qrContent.trim().length === 0) {
      this.isValidContent = false;
      this.showError = true;
      return;
    }
    
    if (this.qrContent.length > this.maxCharacters) {
      this.isValidContent = false;
      this.showError = true;
      return;
    }
    
    this.isValidContent = true;
    this.loading = true;
    this.isGenerating = true;
    
    // Build content based on QR type
    let content = this.qrContent;
    
    if (this.qrType === 'wifi' && this.wifiSsid) {
      // Format WiFi credentials for QR code
      const security = this.wifiEncryption === 'NOPASS' ? 'nopass' : this.wifiEncryption;
      content = `WIFI:T:${security};S:${this.wifiSsid};P:${this.wifiPassword};;`;
    }
    
    // Generate QR code using QR Server API with error correction
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(content)}&ecc=${this.errorCorrectLevel}`;
    
    // Set the image source directly
    this.qrImage = qrUrl;
    this.loading = false;
    this.isGenerating = false;
    this.showError = false;
    
    // Preload image to verify it loads correctly
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      this.zone.run(() => {
        this.loading = false;
        this.isGenerating = false;
        this.cdr.detectChanges();
      });
    };
    
    img.onerror = () => {
      this.zone.run(() => {
        this.loading = false;
        this.isGenerating = false;
        this.showError = true;
        this.cdr.detectChanges();
      });
    };
    
    img.src = qrUrl;
  }

  // Download QR Code
  downloadQR(format: 'png' | 'svg'): void {
    if (!this.qrImage) {
      return;
    }

    const link = document.createElement('a');
    link.href = this.qrImage;
    link.download = `qr-code.${format === 'png' ? 'png' : 'svg'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Copy to clipboard
  copyToClipboard(): void {
    if (!this.qrImage) {
      return;
    }

    // Copy the image URL to clipboard
    navigator.clipboard.writeText(this.qrImage).then(() => {
      alert('QR Code URL copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy QR Code URL.');
    });
  }

  // Truncate text for display
  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  }

  // Check valid content
  isValidContentCheck(): boolean {
    return this.qrContent.length > 0 && this.qrContent.length <= this.maxCharacters;
  }
}
