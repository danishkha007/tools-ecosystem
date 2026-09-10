import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import QRCode from 'qrcode';
import { Tool } from '../../core/models/tool-data.model';
import { DataService } from '@core/services/data.service';
import { Category } from '@core/models/category-data.model';

type QrType = 'text' | 'url' | 'wifi';
type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

@Component({
  selector: 'qr-code-generator',
  templateUrl: './qr-code-generator.html',
  styleUrls: ['./qr-code-generator.scss'],
  imports: [CommonModule, FormsModule]
})
export class QrCodeGeneratorComponent implements OnInit, OnDestroy {
  toolId = 'qr-code-generator';
  toolData: Tool | undefined;
  categoryData: Category | undefined;

  qrType: QrType = 'text';
  qrContent = '';
  wifiSsid = '';
  wifiPassword = '';
  wifiEncryption: 'WPA' | 'WEP' | 'nopass' = 'WPA';
  errorCorrectLevel: ErrorCorrectionLevel = 'M';

  qrImage: string | null = null;
  qrSvg: string | null = null;
  loading = false;
  errorMessage = '';
  copied = false;
  readonly maxCharacters = 2048;

  private generateTimer?: ReturnType<typeof setTimeout>;
  private generationId = 0;

  constructor(private dataService: DataService) {
    this.toolData = this.dataService.getCompleteToolDataById(this.toolId);
    this.categoryData = this.dataService.getCategoryDataById(this.toolData.category);
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    clearTimeout(this.generateTimer);
  }

  showHeader(): boolean {
    return true;
  }

  get isWifi(): boolean {
    return this.qrType === 'wifi';
  }

  setType(type: QrType): void {
    this.qrType = type;
    this.errorMessage = '';
    this.queueGeneration();
  }

  onContentChange(): void {
    this.errorMessage = '';
    this.queueGeneration();
  }

  clearAll(): void {
    this.generationId += 1;
    this.qrContent = '';
    this.wifiSsid = '';
    this.wifiPassword = '';
    this.qrImage = null;
    this.qrSvg = null;
    this.errorMessage = '';
    this.copied = false;
    clearTimeout(this.generateTimer);
  }

  queueGeneration(): void {
    clearTimeout(this.generateTimer);
    this.generationId += 1;
    const content = this.getEncodedContent();
    if (!content.trim()) {
      this.qrImage = null;
      this.qrSvg = null;
      this.loading = false;
      return;
    }

    this.loading = true;
    this.generateTimer = setTimeout(() => this.generateQRCode(), 120);
  }

  async generateQRCode(): Promise<void> {
    const content = this.getEncodedContent();
    if (!this.isContentValid(content)) {
      this.qrImage = null;
      this.qrSvg = null;
      this.loading = false;
      return;
    }

    const requestId = ++this.generationId;
    this.loading = true;
    this.errorMessage = '';

    try {
      const options = {
        errorCorrectionLevel: this.errorCorrectLevel,
        margin: 2,
        width: 640,
        color: { dark: '#111827', light: '#ffffff' }
      } as const;
      const [image, svg] = await Promise.all([
        QRCode.toDataURL(content, options),
        QRCode.toString(content, { ...options, type: 'svg' })
      ]);

      if (requestId === this.generationId) {
        this.qrImage = image;
        this.qrSvg = svg;
      }
    } catch {
      if (requestId === this.generationId) {
        this.qrImage = null;
        this.qrSvg = null;
        this.errorMessage = 'This content is too long for the selected error-correction level. Try shorter content or choose a lower level.';
      }
    } finally {
      if (requestId === this.generationId) this.loading = false;
    }
  }

  downloadQR(format: 'png' | 'svg'): void {
    const source = format === 'png' ? this.qrImage : this.qrSvg;
    if (!source) return;

    const link = document.createElement('a');
    link.download = `qr-code.${format}`;
    if (format === 'png') {
      link.href = source;
    } else {
      link.href = URL.createObjectURL(new Blob([source], { type: 'image/svg+xml' }));
    }
    link.click();
    if (format === 'svg') setTimeout(() => URL.revokeObjectURL(link.href), 0);
  }

  async copyToClipboard(): Promise<void> {
    if (!this.qrImage || !navigator.clipboard) return;
    try {
      const response = await fetch(this.qrImage);
      const blob = await response.blob();
      if ('ClipboardItem' in window) {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      } else {
        await navigator.clipboard.writeText(this.getEncodedContent());
      }
      this.copied = true;
      setTimeout(() => (this.copied = false), 1800);
    } catch {
      this.errorMessage = 'Could not copy the QR code. Please use the download button instead.';
    }
  }

  private getEncodedContent(): string {
    if (this.qrType !== 'wifi') return this.qrContent.trim();
    if (!this.wifiSsid.trim()) return '';
    const escape = (value: string) => value.replace(/([\\;,:"])/g, '\\$1');
    return `WIFI:T:${this.wifiEncryption};S:${escape(this.wifiSsid)};P:${escape(this.wifiPassword)};;`;
  }

  private isContentValid(content: string): boolean {
    if (!content.trim()) return false;
    if (content.length > this.maxCharacters) {
      this.errorMessage = `Keep the content under ${this.maxCharacters} characters.`;
      return false;
    }
    return true;
  }
}
