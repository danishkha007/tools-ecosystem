import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutSection } from '../../core/models/tool-data.model';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-section.html',
  styleUrl: './about-section.scss'
})
export class AboutSectionComponent {
  @Input() aboutSection: AboutSection = {} as AboutSection;

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
