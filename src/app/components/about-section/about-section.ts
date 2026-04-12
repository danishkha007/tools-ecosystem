import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AboutFeature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-section.html',
  styleUrl: './about-section.scss'
})
export class AboutSectionComponent {
  @Input() badgeText: string | undefined;
  @Input() badgeIcon: string | undefined; // SVG path or icon name
  @Input() title: string | undefined;
  @Input() subtitle: string | undefined;
  @Input() description: string | undefined;
  @Input() ctaPrimaryText: string | undefined;
  @Input() ctaPrimaryLink: string | undefined;
  @Input() ctaNote: string | undefined;
  @Input() imageSrc: string | undefined;
  @Input() features: AboutFeature[] | undefined;

  // Function to scroll to top (if needed for CTA)
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}