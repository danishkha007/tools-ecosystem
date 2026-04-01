import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-amazon-ad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './amazon-ad.html',
  styleUrls: ['./amazon-ad.scss']
})
export class AmazonAdComponent {
  @Input() associateId: string = 'bookshub1-21';
  @Input() adType: 'banner' | 'link' = 'banner';

  get amazonLink(): string {
    return `https://www.amazon.com?tag=${this.associateId}`;
  }
}
