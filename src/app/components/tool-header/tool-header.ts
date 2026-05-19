import { Component, Input } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { Tool } from '@core/models/tool-data.model';
import { BreadcrumbsComponent } from "../breadcrumbs/breadcrumbs";
import { Category } from '@core/models/category-data.model';

@Component({
  selector: 'app-tool-header',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent],
  templateUrl: './tool-header.html',
  styleUrls: ['./tool-header.scss']
})
export class ToolHeaderComponent {
  @Input() tool: Tool | undefined;
  @Input() category: Category | undefined;
  @Input() headerOnly: boolean = false;

  constructor(
    private location: Location,
    private router: Router,
  ) { }

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
      return;
    }
    this.router.navigate(['/']);
  }
}
