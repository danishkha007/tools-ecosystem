import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumePreviewComponent } from "../../components/resume-templates/resume-preview/resume-preview";
import { ResumePreviewAtsComponent } from "../../components/resume-templates/resume-preview-ats/resume-preview-ats";
import { ResumeFormComponent } from "../../components/resume-form/resume-form";
import { ResumeService } from '../../core/services/resume';
import { Resume } from '../../core/models/resume';
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-resume-builder',
  standalone: true,
  imports: [CommonModule, ResumePreviewComponent, ResumePreviewAtsComponent, ResumeFormComponent],
  templateUrl: './resume-builder.html',
  styleUrl: './resume-builder.scss',
})
export class ResumeBuilder implements OnInit {
  @ViewChild(ResumeFormComponent) resumeFormComponent!: ResumeFormComponent;
  @ViewChild('resumePreview') resumePreview!: ElementRef;
  
  resumeProgress = 0;
  selectedTemplate: 'modern' | 'ats' = 'modern';
  showTemplateModal = true;
  currentStep = 0;
  
  formSteps = [
    'Personal Info',
    'Summary',
    'Skills',
    'Experience',
    'Education',
    'Additional'
  ];
  
  constructor(private resumeService: ResumeService) {}
  
  ngOnInit() {
    this.resumeService.resume$.subscribe(resume => {
      this.calculateProgress(resume);
    });
  }
  
  closeTemplateModal() {
    this.showTemplateModal = false;
  }
  
  selectTemplate(template: 'modern' | 'ats') {
    this.selectedTemplate = template;
  }
  
  goToStep(step: number) {
    if (step >= 0 && step < this.formSteps.length && step <= this.currentStep) {
      this.currentStep = step;
    }
  }
  
  nextStep() {
    if (this.resumeFormComponent) {
      const isComplete = this.resumeFormComponent.isStepComplete(this.currentStep);
      if (!isComplete) {
        this.resumeFormComponent.markCurrentStepTouched();
        return;
      }
    }
    
    if (this.currentStep < this.formSteps.length - 1) {
      this.currentStep++;
    }
  }
  
  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }
  
  onStepChange(step: number) {
    this.currentStep = step;
  }
  
  downloadPdf() {
    const resume = this.resumeService.getValue();
    const element = this.resumePreview.nativeElement;
    
    const filename = resume.personal?.name 
      ? resume.personal.name.replace(/\s+/g, '_') + '.pdf' 
      : 'resume.pdf';
    
    const opt: any = {
      margin: 10,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
  }
  
  calculateProgress(resume: Resume): void {
    let filledFields = 0;
    const totalFields = 10;
    
    if (resume.personal?.name) filledFields++;
    if (resume.personal?.email) filledFields++;
    if (resume.personal?.phone) filledFields++;
    if (resume.personal?.jobTitle) filledFields++;
    
    if (resume.summary) filledFields++;
    if (resume.skills?.length) filledFields++;
    if (resume.experience?.length) filledFields++;
    if (resume.education?.length) filledFields++;
    if (resume.certifications?.length) filledFields++;
    if (resume.projects?.length) filledFields++;
    
    this.resumeProgress = Math.round((filledFields / totalFields) * 100);
  }
}
