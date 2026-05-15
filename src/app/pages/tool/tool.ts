import { ChangeDetectorRef, Component, OnInit, Type, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { SeoService } from '../../core/services/seo.service';
import { Tool } from '../../core/models/tool-data.model';
import { loadToolComponentById } from '../../core/services/registry.service';
import { DataService } from '@core/services/data.service';
import { AmazonAdComponent } from "@components/amazon-ad/amazon-ad";
import { AboutSectionComponent } from "@components/about-section/about-section";
import { FeaturesSectionComponent } from "@components/features-section/features-section";
import { UseCaseSectionComponent } from "@components/use-case-section/use-case-section";
import { TheorySectionComponent } from "@components/theory-section/theory-section";
import { FaqSectionComponent } from "@components/faq-section/faq-section";
import { Category } from '@core/models/category-data.model';

@Component({
  selector: 'app-tool-page-template',
  standalone: true,
  imports: [CommonModule, NgComponentOutlet, AmazonAdComponent, AboutSectionComponent, FeaturesSectionComponent, UseCaseSectionComponent, TheorySectionComponent, FaqSectionComponent],
  templateUrl: './tool.html',
  styleUrl: './tool.scss',
})
export class ToolPageComponent implements OnInit {
  toolData?: Tool;
  categoryData?: Category;
  toolComponent?: Type<unknown>;
  activeFaqIndex: number | null = null;

  private route = inject(ActivatedRoute);
  private seoService = inject(SeoService);
  private dataService = inject(DataService);
  private cdr = inject(ChangeDetectorRef);

  async ngOnInit(): Promise<void> {
    const toolId = this.route.snapshot.data['toolId'] as string | undefined;

    if (!toolId) {
      return;
    }
    this.cdr.detectChanges();

    this.toolData = this.dataService.getCompleteToolDataById(toolId);
    this.categoryData = this.dataService.getCategoryDataById(this.toolData.category);
    this.cdr.detectChanges();
    this.seoService.setSeoDataById(toolId);
    this.cdr.detectChanges();

    this.toolComponent = await loadToolComponentById(toolId);
    this.cdr.detectChanges();
  }
  toggleFaq(index: number): void {
    if (this.activeFaqIndex === index) {
      this.activeFaqIndex = null;
    } else {
      this.activeFaqIndex = index;
    }
  }
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
