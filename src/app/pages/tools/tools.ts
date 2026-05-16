import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AppData } from "@core/models/app-data.model";
import { Category } from "@core/models/category-data.model";
import { Tool } from "@core/models/tool-data.model";
import { DataService } from "@core/services/data.service";
import { SeoService } from "@core/services/seo.service";
import { ToolCardComponent } from "@components/tool-card/tool-card";

type SortOption = 'name-asc' | 'name-desc';

@Component({
  selector: 'app-tools-page',
  templateUrl: './tools.html',
  styleUrl: './tools.scss',
  imports: [CommonModule, FormsModule, ToolCardComponent]
})
export class ToolsPageComponent {
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
        "canonicalUrl": "https://www.mytooltrove.com"
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
        this.seoService.setSeoData(this.seoData);
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