import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Category } from '@core/models/category-data.model';
import { Tool } from '@core/models/tool-data.model';
import { DataService } from '@core/services/data.service';
import { ToolCardComponent } from '@components/tool-card/tool-card';

@Component({
  selector: 'app-same-category-tools',
  standalone: true,
  imports: [CommonModule, RouterLink, ToolCardComponent],
  templateUrl: './same-category-tools.html',
  styleUrl: './same-category-tools.scss'
})
export class SameCategoryToolsComponent implements OnChanges {
  @Input() currentTool?: Tool;
  @Input() category?: Category;
  @Input() limit = 4;

  tools: Tool[] = [];

  constructor(private dataService: DataService) {}

  ngOnChanges(): void {
    if (!this.currentTool) {
      this.tools = [];
      return;
    }

    this.tools = this.dataService.getOtherToolsInCategory(this.currentTool, this.limit);
  }

  get categoryName(): string {
    return this.category?.name || '';
  }

  get categoryRoute(): string {
    return this.category?.route ? `/${this.category.route}` : '/tools';
  }
}
