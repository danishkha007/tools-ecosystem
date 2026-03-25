import { Component } from '@angular/core';
import { ResumeService } from '../../core/services/resume';

@Component({
  selector: 'app-style-panel',
  templateUrl: './style-panel.html'
})
export class StylePanelComponent {

  constructor(private resumeService: ResumeService) {}

  updateStyle(field: string, value: any) {
    const current = this.resumeService.getValue();

    this.resumeService.updateResume({
      style: {
        ...current.style,
        [field]: value
      }
    });
  }
}