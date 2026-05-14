import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Data, RouterLink } from '@angular/router';
import { ToolCardComponent } from '../../components/tool-card/tool-card';
import { DataService } from '@core/services/data.service';
import { Category } from '@core/models/category-data.model';

@Component({
  selector: 'app-tool-category-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ToolCardComponent],
  templateUrl: './category.html',
  styleUrl: './category.scss',
})
export class CategoryPageComponent implements OnInit {
  categoryId = '';
  category: Category = {} as Category;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) {
    this.categoryId = this.route.snapshot.routeConfig?.path?.split('/')[1] || '';
  }
  ngOnInit(): void {
    this.category = this.dataService.getCategoriesWithTools().filter(cat => cat.id.split('-')[0] === this.categoryId)[0];
  }
}