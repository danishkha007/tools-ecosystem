import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturesSection, TheorySection } from '../../core/models/tool-data.model';

@Component({
  selector: 'app-theory-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theory-section.html',
  styleUrl: './theory-section.scss'
})
export class TheorySectionComponent {
  @Input() theorySection: TheorySection = {} as TheorySection;
}
