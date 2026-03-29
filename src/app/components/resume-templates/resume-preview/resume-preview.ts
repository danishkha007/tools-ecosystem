import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeService } from '../../../core/services/resume';

@Component({
  selector: 'app-resume-preview',
  templateUrl: './resume-preview.html',
  styleUrls: ['./resume-preview.scss'],
  imports: [CommonModule]
})
export class ResumePreviewComponent {
  resume$;
  
  constructor(private resumeService: ResumeService) {
    this.resume$ = this.resumeService.resume$;
  }
}