import { Component } from '@angular/core';
import { ResumePreviewComponent } from "../../components/resume-preview/resume-preview";
import { ProgressBarComponent } from "../../components/progress-bar/progress-bar";
import { StylePanelComponent } from "../../components/style-panel/style-panel";
import { ResumeFormComponent } from "../../components/resume-form/resume-form";

@Component({
  selector: 'app-resume-builder',
  standalone: true,
  templateUrl: './resume-builder.html',
  styleUrl: './resume-builder.scss',
  imports: [ResumePreviewComponent, ProgressBarComponent, StylePanelComponent, ResumeFormComponent],
})
export class ResumeBuilder {}
