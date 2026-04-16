import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturesSection } from '../../core/models/tool-data.model';

export interface Feature {
  iconPath?: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-features-section',
  standalone: true,
  imports: [CommonModule],
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
}
