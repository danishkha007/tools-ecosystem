import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Tool } from '../../core/models/tool-data.model';
import { Category } from '@core/models/category-data.model';
import { DataService } from '@core/services/data.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  featuredTools: Tool[];
  categories: Category[];
  allToolsCount: number;

  private readonly featuredToolIds = ['pdf-merger', 'pdf-compressor', 'image-compressor', 'resume-builder'];

  constructor(private dataService: DataService) {
    const tools = this.dataService.getAllTools();
    this.allToolsCount = tools.length;
    this.featuredTools = this.featuredToolIds
      .map(id => tools.find(tool => tool.id === id))
      .filter((tool): tool is Tool => Boolean(tool));
    this.categories = this.dataService.getCategoriesWithTools();
  }
}
