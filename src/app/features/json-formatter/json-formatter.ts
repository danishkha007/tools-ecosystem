import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolHeaderComponent } from '../../components/tool-header/tool-header';
import { ToolConfigService } from '../../core/services/tool-config';
import { ToolData } from '../../core/models/tool-data.model';
import { SeoService } from '../../core/services/seo.service';
import { ToolDataService } from '../../core/services/tool-data.service';
import { SeoContentComponent } from "../../components/seo-content/seo-content";

@Component({
  selector: 'app-json-formatter',
  templateUrl: './json-formatter.html',
  styleUrls: ['./json-formatter.scss'],
  imports: [CommonModule, FormsModule, ToolHeaderComponent, SeoContentComponent]
})
export class JsonFormatterComponent implements OnInit {
  toolId = 'json-formatter';

  inputJSON = '';
  outputJSON = '';
  isValid = true;
  errorMessage = '';
  compactMode = false;
  sortKeys = false;
  objectCount = 0;
  arrayCount = 0;

  toolData: ToolData = {} as ToolData;

  get buttonText(): string {
    return this.toolData?.buttonText || 'Format JSON';
  }

  get charCount(): number {
    return this.inputJSON.length;
  }

  get outputCharCount(): number {
    return this.outputJSON.length;
  }

  constructor(
    private toolConfigService: ToolConfigService,
    private seoService: SeoService,
    private toolDataService: ToolDataService
  ) {
    const tool = this.toolDataService.getToolById('json-formatter');
    if (tool) {
      this.toolData = tool;
    }
  }

  ngOnInit(): void {
    this.seoService.setSeoData(this.toolData.seo);
  }

  onInputChange(): void {
    this.formatJSON();
  }

  formatJSON(): void {
    this.errorMessage = '';
    this.objectCount = 0;
    this.arrayCount = 0;

    if (!this.inputJSON.trim()) {
      this.outputJSON = '';
      this.isValid = true;
      return;
    }

    try {
      const parsed = JSON.parse(this.inputJSON);
      this.isValid = true;

      let output: string;
      if (this.compactMode) {
        output = JSON.stringify(parsed);
      } else {
        output = this.sortKeys ? JSON.stringify(this.sortObject(parsed), null, 2) : JSON.stringify(parsed, null, 2);
      }

      this.outputJSON = output;
      this.countStructures(parsed);
    } catch (error) {
      this.isValid = false;
      this.outputJSON = this.inputJSON;
      this.errorMessage = error instanceof Error ? error.message : 'Invalid JSON format';
    }
  }

  private sortObject(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sortObject(item));
    }

    const sorted: Record<string, any> = {};
    const keys = Object.keys(obj).sort();
    for (const key of keys) {
      sorted[key] = this.sortObject(obj[key]);
    }
    return sorted;
  }

  private countStructures(obj: any): void {
    if (obj === null || typeof obj !== 'object') {
      return;
    }

    if (Array.isArray(obj)) {
      this.arrayCount++;
      obj.forEach(item => this.countStructures(item));
    } else {
      this.objectCount++;
      Object.values(obj).forEach(value => this.countStructures(value));
    }
  }

  clearAll(): void {
    this.inputJSON = '';
    this.outputJSON = '';
    this.isValid = true;
    this.errorMessage = '';
    this.objectCount = 0;
    this.arrayCount = 0;
  }

  async copyToClipboard(): Promise<void> {
    if (!this.outputJSON) return;

    try {
      await navigator.clipboard.writeText(this.outputJSON);
    } catch (error) {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = this.outputJSON;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  }

  downloadJSON(): void {
    if (!this.outputJSON) return;

    const blob = new Blob([this.outputJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  async pasteFromClipboard(): Promise<void> {
    try {
      const text = await navigator.clipboard.readText();
      this.inputJSON = text;
      this.formatJSON();
    } catch (error) {
      this.errorMessage = 'Failed to paste from clipboard. Please try manually.';
    }
  }
}