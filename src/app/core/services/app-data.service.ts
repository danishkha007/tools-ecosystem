import { Injectable } from '@angular/core';
import { ToolData } from '../models/tool-data.model';
import toolSeoData from '../models/tool-seo-data.json';

@Injectable({
  providedIn: 'root'
})
export class AppDataService {
  private appData = toolSeoData;

  getAppData() {
    return {
      "title": "MyToolTrove - Free Online Tools | PDF, Image, Calculator & Developer Tools",
      "metaDescription": "MyToolTrove - Your free all-in-one destination for online tools. Merge PDFs, compress images, calculate percentages, and more. No registration required, 100% free forever.",
      "keywords": ["Gann Calculator","Tool Trove","MyToolTrove","free online tools", "pdf tools", "image tools", "calculator tools", "developer tools", "merge pdfs", "compress images", "percentage calculator", "gann hexagonal calculator"],
      "h1": "MyToolTrove - Your Free Online Tool Destination",
      "h2": "Online tools for PDF, Image, Calculator, and Developer needs",
      "canonicalUrl": "https://www.mytooltrove.com",
    }
  };
}