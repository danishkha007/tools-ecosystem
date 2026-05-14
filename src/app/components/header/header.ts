import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Tool } from '../../core/models/tool-data.model';
import { Category } from '@core/models/category-data.model';
import { DataService } from '@core/services/data.service';
import { isPlatformBrowser } from '@angular/common';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';


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

  constructor(@Inject(PLATFORM_ID) platformId: object, private dataService: DataService, private router: Router) {
    const tools = this.dataService.getAllTools();
    this.allToolsCount = tools.length;
    this.featuredTools = this.featuredToolIds
      .map(id => tools.find(tool => tool.id === id))
      .filter((tool): tool is Tool => Boolean(tool));
    this.categories = this.dataService.getCategoriesWithTools();
    if (isPlatformBrowser(platformId)) {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          if (!!!event.url.endsWith('#available-tools')) {
            window.scrollTo(0, 0);
          } else {
            window.scrollTo(0, document.body.scrollHeight - 75);
          }
        }
      });
    }
  }
}
