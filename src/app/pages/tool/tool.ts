import { ChangeDetectorRef, Component, OnInit, Type, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { ToolHeaderComponent } from '../../components/tool-header/tool-header';
// import { SeoContentComponent } from '../../components/seo-content/seo-content';
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

@Component({
  selector: 'app-tool-page-template',
  standalone: true,
  imports: [CommonModule, NgComponentOutlet, ToolHeaderComponent, AmazonAdComponent, AboutSectionComponent, FeaturesSectionComponent, UseCaseSectionComponent, TheorySectionComponent, FaqSectionComponent],
  templateUrl: './tool.html',
  styleUrl: './tool.scss',
})
export class ToolPageComponent implements OnInit {
  toolData?: Tool;
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
