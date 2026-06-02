import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { FeaturesSection } from '../../core/models/tool-data.model';
import { CardComponent } from "@components/card/card";


export interface Feature {
  iconPath?: string;
  imagePath?: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-features-section',
  standalone: true,
  imports: [CommonModule, CardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './features-section.html',
  styleUrl: './features-section.scss'
})
export class FeaturesSectionComponent {
  @Input() label: string = 'FEATURES';
  @Input() title: string = 'Why Choose This Tool?';
  @Input() subtitle: string = 'Discover the powerful features that make this tool essential for your workflow.';
  @Input() showLabelIcon: boolean = true;
  @Input() features: Feature[] = [];
  @Input() featuresSection: FeaturesSection = {} as FeaturesSection;

  activeIndex = 0;
  readonly visibleCount = 4;

  get carouselFeatures() {
    return this.featuresSection?.features ?? [];
  }

  get visibleFeatures() {
    const features = this.carouselFeatures;

    if (features.length <= this.visibleCount) {
      return features.map((feature, index) => ({ feature, index }));
    }

    return Array.from({ length: this.visibleCount }, (_, offset) => {
      const index = (this.activeIndex + offset) % features.length;
      return { feature: features[index], index };
    });
  }

  previousFeature(): void {
    const total = this.carouselFeatures.length;

    if (total <= this.visibleCount) {
      return;
    }

    this.activeIndex = (this.activeIndex - 1 + total) % total;
  }

  nextFeature(): void {
    const total = this.carouselFeatures.length;

    if (total <= this.visibleCount) {
      return;
    }

    this.activeIndex = (this.activeIndex + 1) % total;
  }
}
