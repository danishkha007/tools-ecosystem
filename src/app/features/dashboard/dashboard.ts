import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolCategory } from '../../core/models/tool-category';
import { ToolData } from '../../core/models/tool-data.model';
import { ToolConfigService } from '../../core/services/tool-config';
import { ToolCardComponent } from '../../components/tool-card/tool-card';
// import { AmazonAdComponent } from '../../components/amazon-ad/amazon-ad';

type SortOption = 'name-asc' | 'name-desc';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ToolCardComponent]
})
export class DashboardComponent implements OnInit {

  categories: ToolCategory[] = [];
  allTools: ToolData[] = [];
  filteredTools: ToolData[] = [];
  // adPlacements: number[] = [];
  
  sortOption: SortOption = 'name-asc';
  selectedCategory: string | null = null;
  
  // SEO data
  seoTitle = 'MyToolTrove - Free Online Tools | PDF, Image, Calculator & Developer Tools';
  seoMetaDescription = 'MyToolTrove - Your free all-in-one destination for online tools. Merge PDFs, compress images, calculate percentages, and more. No registration required, 100% free forever.';
  
  sortOptions: { value: SortOption; label: string }[] = [
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' }
  ];

  constructor(private toolService: ToolConfigService) {}

  ngOnInit(): void {
    // Set document title and meta description
    document.title = this.seoTitle;
    
    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', this.seoMetaDescription);
    }
    
    this.categories = this.toolService.getActiveCategories();
    this.buildAllTools();
    // this.calculateAdPlacements();
    this.applySort();
  }

  private buildAllTools(): void {
    this.allTools = this.toolService.getAllTools();
    // Start with all tools
    this.filteredTools = [...this.allTools];
  }

  get categoriesWithTools(): ToolCategory[] {
    return this.categories;
  }

  getCategoryToolCount(categoryName: string): number {
    return this.toolService.getToolsByCategory(categoryName).length;
  }

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
      // Filter by category first
      this.filteredTools = this.toolService.getToolsByCategory(this.selectedCategory);
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
