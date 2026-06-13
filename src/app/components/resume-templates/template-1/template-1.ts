import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeService } from '../../../core/services/resume.service';

@Component({
  selector: 'app-resume-template-one',
  templateUrl: './template-1.html',
  styleUrls: ['./template-1.scss'],
  imports: [CommonModule]
})
export class ResumeTemplateOneComponent {
  resume$;
  
  constructor(private resumeService: ResumeService) {
    this.resume$ = this.resumeService.resume$;
  }
  getAchievements(achievements: string): string[] {
    return achievements.split('\n').filter(line => line.trim() !== '');
  }
}