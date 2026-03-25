import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolCategory } from '../../core/models/tool-category';
import { Tool } from '../../core/models/tool';
import { ToolConfigService } from '../../core/services/tool-config';
import { ToolCardComponent } from '../../components/tool-card/tool-card';

type SortOption = 'name-asc' | 'name-desc' | 'category';
type GroupOption = 'by-category' | 'all';

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
  
  sortOption: SortOption = 'name-asc';
  groupOption: GroupOption = 'by-category';
  
  sortOptions: { value: SortOption; label: string }[] = [
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' }
    // { value: 'category', label: 'By Category' }
  ];
  
  groupOptions: { value: GroupOption; label: string }[] = [
    { value: 'by-category', label: 'By Category' },
    { value: 'all', label: 'All Tools' }
  ];

  constructor(private toolService: ToolConfigService) {}

  ngOnInit(): void {
    this.categories = this.toolService.getToolCategories();
    this.buildAllTools();
    this.applySortAndGroup();
  }

  private buildAllTools(): void {
    this.allTools = [];
    for (const category of this.categories) {
      if (!category.tools) continue;
      for (const tool of category.tools) {
        this.allTools.push({ ...tool, category: category.name.toLowerCase() });
      }
    }
  }

  get categoriesWithTools(): ToolCategory[] {
    return this.categories.filter(category => category.tools && category.tools.length > 0);
  }

  applySortAndGroup(): void {
    if (this.groupOption === 'all') {
      this.sortAllTools();
    } else {
      this.sortCategories();
    }
  }

  private sortAllTools(): void {
    if (this.sortOption === 'name-asc') {
      this.allTools.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.sortOption === 'name-desc') {
      this.allTools.sort((a, b) => b.name.localeCompare(a.name));
    }
  }

  private sortCategories(): void {
    for (const category of this.categories) {
      if (!category.tools) continue;
      if (this.sortOption === 'name-asc') {
        category.tools.sort((a, b) => a.name.localeCompare(b.name));
      } else if (this.sortOption === 'name-desc') {
        category.tools.sort((a, b) => b.name.localeCompare(a.name));
      }
    }
  }

  onSortChange(): void {
    this.applySortAndGroup();
  }

  onGroupChange(): void {
    if (this.groupOption === 'all') {
      this.sortAllTools();
    } else {
      this.sortCategories();
    }
  }
}
