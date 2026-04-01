import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface UseCase {
  id?: number;
  title: string;
  description: string;
  benefits: string[];
  icon: string;
  color: string;
}

@Component({
  selector: 'app-use-case-modal',
  templateUrl: './use-case-modal.html',
  styleUrls: ['./use-case-modal.scss'],
  imports: [CommonModule],
  standalone: true
})
export class UseCaseModalComponent {
  @Input() isOpen = false;
  @Input() useCase: UseCase | null = null;
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('use-case-modal-overlay')) {
      this.onClose();
    }
  }
}
