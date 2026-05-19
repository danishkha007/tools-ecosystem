import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tool } from '../../core/models/tool-data.model';
import { ToolCardComponent } from '../../components/tool-card/tool-card';
import { SeoService } from '@core/services/seo.service';
import { AppData } from '@core/models/app-data.model';
import { DataService } from '@core/services/data.service';
import { Category } from '@core/models/category-data.model';
// import { AmazonAdComponent } from '../../components/amazon-ad/amazon-ad';

type SortOption = 'name-asc' | 'name-desc';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ToolCardComponent]
})
export class HomeComponent implements OnInit {

  appData: AppData;

  categories: Category[] = [];
  allTools: Tool[] = [];
  filteredTools: Tool[] = [];
  // adPlacements: number[] = [];

  sortOption: SortOption = 'name-asc';
  selectedCategory: string | null = null;

  // SEO data
  seoData = {
    "id": "home",
    "title": 'Free Online Tools for PDF, Image & Developers | MyToolTrove',
    "metaDescription": 'MyToolTrove - Your all-in-one destination for free online tools. Merge PDFs, Compress Images, Convertors, Calculators, and more. No Registration, Free Forever.',
    "keywords": [
      "free online tools", "PDF tools", "image compression", "developer tools",
      "calculator tools", "merge PDFs", "compress images", "gann hexagonal support resistance calculator", "mytooltrove", "tool trove", "online utilities", "free tools online", "pdf merger", "image optimizer", "percentage calculator"],
    "h1": "Free Online Tools | PDF, Image, Calculator & Developer Tools",
    "h2": "Your all-in-one destination for free online tools. Merge PDFs, compress images, calculate percentages, and more. No registration required, 100% free forever.",
    "canonicalUrl": "https://mytooltrove.com"
  }

  sortOptions: { value: SortOption; label: string }[] = [
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' }
  ];

  constructor(
    private seoService: SeoService,
    private dataService: DataService) {
    this.appData = this.dataService.getAppData();
  }


  ngOnInit(): void {
    // Set document title and meta description
    // this.seoService.setSeoData(this.seoData);
    this.seoService.setSeoDataById('home');
    this.categories = this.dataService.getCategoriesWithTools();
    this.buildAllTools();
    this.applySort();
  }

  private buildAllTools(): void {
    this.allTools = this.dataService.getAllTools();
    // Start with all tools
    this.filteredTools = [...this.allTools];
  }

  get categoriesWithTools(): Category[] {
    return this.categories;
  }
      getCategoryName(tool: Tool): string {
        const category = this.dataService.getCategoryNameById(tool.category);
        return category;
      }

  // getCategoryToolCount(categoryName: string): number {
  //   return this.toolService.getToolsByCategory(categoryName).length;
  // }

  selectCategory(categoryName: string | null): void {
    this.selectedCategory = categoryName;
    this.applySort();
    // this.recalculateAdPlacements();
  }

  isCategorySelected(categoryName: string): boolean {
    return this.selectedCategory === categoryName;
  }

  applySort(): void {
    if (this.selectedCategory) {
      this.filteredTools = this.dataService.getToolsByCategory(this.selectedCategory);
    } else {
      // Show all tools
      this.filteredTools = [...this.allTools];
    }

    // Apply sorting
    if (this.sortOption === 'name-asc') {
      this.filteredTools.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.sortOption === 'name-desc') {
      this.filteredTools.sort((a, b) => b.name.localeCompare(a.name));
    }
  }



  onSortChange(): void {
    this.applySort();
  }
}
