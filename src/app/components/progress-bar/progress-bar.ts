import { Component } from '@angular/core';
import { ResumeService } from '../../core/services/resume';

@Component({
  selector: 'app-progress-bar',
  template: `
    <div class="progress">
      <div class="bar" [style.width.%]="progress"></div>
    </div>
    <p>{{progress}}% Complete</p>
  `,
  styles: [`
    .progress { height: 8px; background: #eee; }
    .bar { height: 8px; background: green; }
  `]
})
export class ProgressBarComponent {

  progress = 0;

  constructor(private service: ResumeService) {
    this.service.resume$.subscribe(data => {
      let filled = 0;

      if (data.personal.name) filled++;
      if (data.personal.email) filled++;
      if (data.summary) filled++;
      if (data.skills.length) filled++;

      this.progress = (filled / 4) * 100;
    });
  }
}