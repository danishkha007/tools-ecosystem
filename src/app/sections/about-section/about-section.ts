import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutSection } from '../../core/models/tool-data.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-section.html',
  styleUrl: './about-section.scss'
})
export class AboutSectionComponent {
  @Input() aboutSection: AboutSection = {} as AboutSection;
  private sanitizer= inject(DomSanitizer);


  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  getSaniizedSafeHTML(html: string | undefined) {
    return this.sanitizer.bypassSecurityTrustHtml(html as string);
  }
}
