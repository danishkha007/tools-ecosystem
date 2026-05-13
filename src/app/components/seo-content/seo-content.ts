import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tool, ToolData } from '../../core/models/tool-data.model';
import { AboutSectionComponent } from '../about-section/about-section';
import { FeaturesSectionComponent } from "../features-section/features-section";
import { UseCaseSectionComponent } from "../use-case-section/use-case-section";
import { FaqSectionComponent } from "../faq-section/faq-section";
import { TheorySectionComponent } from '../theory-section/theory-section';
import { AmazonAdComponent } from "../amazon-ad/amazon-ad";
import { DataService } from '@core/services/data.service';

@Component({
  selector: 'app-seo-content',
  standalone: true,
  imports: [CommonModule, FaqSectionComponent, UseCaseSectionComponent, FeaturesSectionComponent, AboutSectionComponent, TheorySectionComponent, AmazonAdComponent],
  templateUrl: './seo-content.html'
})
export class SeoContentComponent {
  @Input() toolId: string = '';
  activeFaqIndex: number | null = null;
  
  private dataService = inject(DataService);
  toolData: Tool | undefined;

  // constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    if (this.toolId) {
      this.toolData = this.dataService.getToolDataById(this.toolId);
    }
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