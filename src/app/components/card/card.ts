import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface CardData {
    id: number;
    image?: string;
    title: string;
    description: string;
}

@Component({
  selector: 'app-card',
  templateUrl: './card.html',
  styleUrls: ['./card.scss'],
  imports: [CommonModule]
})
export class CardComponent {
  @Input() data?: CardData;
}
