import { ChangeDetectorRef, Component, OnInit, Type, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { ToolHeaderComponent } from '../tool-header/tool-header';
import { SeoContentComponent } from '../seo-content/seo-content';
import { SeoService } from '../../core/services/seo.service';
import { Tool } from '../../core/models/tool-data.model';
import { loadToolComponentById } from '../../core/services/tool-component-registry';
import { DataService } from '@core/services/data.service';

@Component({
  selector: 'app-tool-page-template',
  standalone: true,
  imports: [CommonModule, NgComponentOutlet, ToolHeaderComponent, SeoContentComponent],
  templateUrl: './tool-page-template.html',
  styleUrl: './tool-page-template.scss',
})
export class ToolPageTemplateComponent implements OnInit {
  toolData?: Tool;
  toolComponent?: Type<unknown>;

  private route = inject(ActivatedRoute);
  private seoService = inject(SeoService);
  private dataService = inject(DataService);
  private cdr = inject(ChangeDetectorRef);

  async ngOnInit(): Promise<void> {
    const toolId = this.route.snapshot.data['toolId'];

    if (!toolId) {
      return;
    }

    this.toolData = this.dataService.getToolDataById(toolId);
    this.seoService.setSeoDataById(toolId);
    this.cdr.detectChanges();

    this.toolComponent = await loadToolComponentById(toolId);
    this.cdr.detectChanges();
  }
}
