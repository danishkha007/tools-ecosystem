import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FaqItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq-section.html',
  styleUrl: './faq-section.scss',
})
export class FaqSectionComponent {
  @Input() title: string = 'Frequently Asked Questions';
  @Input() faqs: FaqItem[] = [];
  @Input() accentColor: string = '#2f84ff';
  @Input() expandedIndex: number | null = 0;

  toggleFaq(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }
}
