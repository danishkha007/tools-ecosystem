import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type AdSize = '720x90' | '350x350';

@Component({
  selector: 'app-amazon-ad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './amazon-ad.html',
  styleUrls: ['./amazon-ad.scss']
})
export class AmazonAdComponent {
  @Input() associateId: string = 'mytooltrove-21';
  @Input() size: AdSize = '720x90';

  get amazonLink(): string {
    return `https://www.amazon.in?tag=${this.associateId}`;
  }

  get containerClass(): string {
    return `amazon-ad-${this.size.replace('x', '-')}`;
  }
}