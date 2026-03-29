import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolCategory } from '../../core/models/tool-category';
import { Tool } from '../../core/models/tool';
import { ToolConfigService } from '../../core/services/tool-config';
import { ToolCardComponent } from '../../components/tool-card/tool-card';

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
  allTools: Tool[] = [];
  filteredTools: Tool[] = [];
  
  sortOption: SortOption = 'name-asc';
  selectedCategory: string | null = null;
  
  sortOptions: { value: SortOption; label: string }[] = [
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' }
  ];

  constructor(private toolService: ToolConfigService) {}

  ngOnInit(): void {
    this.categories = this.toolService.getToolCategories();
    this.buildAllTools();
    this.applySort();
  }

  private buildAllTools(): void {
    this.allTools = [];
    for (const category of this.categories) {
      if (!category.tools) continue;
      for (const tool of category.tools) {
        this.allTools.push({ ...tool, category: category.name.toLowerCase() });
      }
    }
    // Start with all tools
    this.filteredTools = [...this.allTools];
  }

  get categoriesWithTools(): ToolCategory[] {
    return this.categories.filter(category => category.tools && category.tools.length > 0);
  }

  getCategoryToolCount(categoryName: string): number {
    const category = this.categories.find(c => c.name === categoryName);
    return category?.tools?.length || 0;
  }

  selectCategory(categoryName: string | null): void {
    this.selectedCategory = categoryName;
    this.applySort();
  }

  isCategorySelected(categoryName: string): boolean {
    return this.selectedCategory === categoryName;
  }

  applySort(): void {
    if (this.selectedCategory) {
      // Filter by category first
      const category = this.categories.find(c => c.name === this.selectedCategory);
      if (category?.tools) {
        this.filteredTools = [...category.tools];
      }
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