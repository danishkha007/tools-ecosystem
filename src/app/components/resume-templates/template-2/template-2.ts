import { Component, inject } from '@angular/core';
import { ResumeService } from '../../../core/services/resume.service';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-resume-template-2',
  standalone: true,
  templateUrl: './template-2.html',
  styleUrls: ['./template-2.scss'],
  imports: [AsyncPipe, NgIf, CommonModule]
})
export class ResumeTemplateTwoComponent {
  private resumeService = inject(ResumeService);
  resume$ = this.resumeService.resume$;
  getAchievements(achievements: string): string[] {
    return achievements.split('\n').filter(line => line.trim() !== '');
  }
}