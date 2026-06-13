import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Data, RouterLink } from '@angular/router';
import { ToolCardComponent } from '../../components/tool-card/tool-card';
import { DataService } from '@core/services/data.service';
import { Category } from '@core/models/category-data.model';
import { Seo } from '@core/models/seo-data.model';
import { SeoService } from '@core/services/seo.service';
import { BreadcrumbsComponent } from "@components/breadcrumbs/breadcrumbs";
import { Tool } from '@core/models/tool-data.model';

@Component({
  selector: 'app-tool-category-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ToolCardComponent, BreadcrumbsComponent],
  templateUrl: './category.html',
  styleUrl: './category.scss',
})
export class CategoryPageComponent implements OnInit {
  categoryId = '';
  category: Category = {} as Category;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private seoService: SeoService
  ) {
    this.categoryId = this.route.snapshot.routeConfig?.path?.split('/')[1] || '';
  }
  ngOnInit(): void {
    this.category = this.dataService.getCategoriesWithTools().filter(cat => cat.id.split('-')[0] === this.categoryId)[0];
    this.seoService.setSeoData(this.getCategorySeoData(this.category));
  }

  private getCategorySeoData(category: Category): Seo | undefined {
    if (!category?.id) {
      return undefined;
    }

    return this.dataService.getSeoDataById(category.id) || {
      id: category.id,
      title: `${category.name} | MyToolTrove`,
      metaDescription: category.description,
      h1: category.name,
      h2: category.description,
      canonicalUrl: `https://mytooltrove.com/${category.route}`,
      keywords: [
        category.name.toLowerCase(),
        'free online tools',
        'MyToolTrove'
      ]
    };
  }
  getCategoryName(tool: Tool): string {
          const category = this.dataService.getCategoryNameById(tool.category);
          return category;
        }
}
