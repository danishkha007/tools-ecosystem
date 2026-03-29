import { Component, inject } from '@angular/core';
import { ResumeService } from '../../../core/services/resume';
import { AsyncPipe, NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'app-resume-preview-ats',
  standalone: true,
  templateUrl: './resume-preview-ats.html',
  styleUrls: ['./resume-preview-ats.scss'],
  imports: [AsyncPipe, NgIf, NgStyle]
})
export class ResumePreviewAtsComponent {
  private resumeService = inject(ResumeService);
  resume$ = this.resumeService.resume$;
}