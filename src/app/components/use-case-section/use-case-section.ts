import { ChangeDetectorRef, Component, Input, input, output } from '@angular/core';
import { UseCase, UseCasesSection } from '../../core/models/tool-data.model';
import { UseCaseModalComponent } from "../use-case-modal/use-case-modal";

@Component({
  selector: 'app-use-case-section',
  standalone: true,
  imports: [UseCaseModalComponent],
  templateUrl: './use-case-section.html',
  styleUrl: './use-case-section.scss'
})
export class UseCaseSectionComponent {
  constructor(private cdr: ChangeDetectorRef) { }
  @Input() useCasesSection: UseCasesSection = {} as UseCasesSection;


  // label = input.required<string>();
  // title = input.required<string>();
  // description = input.required<string>();
  // useCases = input.required<UseCase[]>();

  useCaseClick = output<{ useCase: UseCase; event: MouseEvent }>();
  showUseCaseModal: boolean = false;
  currentUseCase: UseCase | null = null;

  onUseCaseClick(event: MouseEvent, useCase: UseCase): void {
    if (useCase.link) {
      event.preventDefault();
      this.useCaseClick.emit({ useCase, event });
      window.open(useCase.link, '_blank');
    }
  }
  closeUseCaseModal(): void {
    this.showUseCaseModal = false;
    this.currentUseCase = null;
    this.cdr.detectChanges();
  }
  openUseCaseModal(useCaseId: number): void {
    this.currentUseCase = this.useCasesSection.useCases[useCaseId];
    this.showUseCaseModal = true;
    this.cdr.detectChanges();
  }
}