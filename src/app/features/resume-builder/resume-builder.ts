import { Component, OnInit, ViewChild, ElementRef, Type, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeFormComponent } from "../../components/resume-form/resume-form";
import { ResumeService } from '../../core/services/resume.service';
import { ResumeData } from '../../core/models/resume-data.model';
import html2pdf from 'html2pdf.js';
import { Tool } from '../../core/models/tool-data.model';
import { DataService } from '@core/services/data.service';

@Component({
  selector: 'app-resume-builder',
  standalone: true,
  imports: [CommonModule, ResumeFormComponent],
  templateUrl: './resume-builder.html',
  styleUrl: './resume-builder.scss',
})
export class ResumeBuilder implements OnInit {
  @ViewChild(ResumeFormComponent) resumeFormComponent!: ResumeFormComponent;
  @ViewChild('resumePreview') resumePreview!: ElementRef;

  toolId = 'resume-builder';
  toolData: Tool | undefined;

  resumeTemplateData = {
    'template-1': {
      name: 'Classic',
      description: 'A clean and traditional resume layout that highlights your experience and skills in a straightforward manner.',
      thumbnail: 'assets/resume-templates/template-1/thumbnail.png'
    },
    'template-2': {
      name: 'Modern',
      description: 'A contemporary design with bold headings and a two-column layout to make your resume stand out.',
      thumbnail: 'assets/resume-templates/template-2/thumbnail.png'
    }
  };

  resumeTemplate?: Type<unknown>;

  resumeProgress = 0;
  selectedTemplate: 'template-1' | 'template-2'= 'template-1';
  showTemplateModal = false;
  currentStep = 0;
  formSteps = [
    'Personal Info',
    'Summary',
    'Skills',
    'Experience',
    'Education',
    'Additional'
  ];

  constructor(
    private resumeService: ResumeService,
    private dataService: DataService,
    private cdr: ChangeDetectorRef
  ) {
    this.toolData = this.dataService.getToolDataById(this.toolId);
  }

  async ngOnInit(): Promise<void> {
    this.selectTemplate(this.selectedTemplate);
    this.resumeTemplate = await loadResumeTemplateComponentById(this.selectedTemplate);
    this.resumeService.resume$.subscribe(resume => {
      this.calculateProgress(resume);
    });
  }

  closeTemplateModal() {
    this.showTemplateModal = false;
  }

  selectTemplate(template: 'template-1' | 'template-2') {
    this.selectedTemplate = template;
    this.loadSelectedTemplate();
    this.cdr.detectChanges();
  }

  ngOnChanges() {
    this.loadSelectedTemplate();
  }

  private async loadSelectedTemplate() {
    try {
      this.resumeTemplate = await loadResumeTemplateComponentById(this.selectedTemplate);
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading template component:', error);
    }
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

  calculateProgress(resume: ResumeData): void {
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

export function loadResumeTemplateComponentById(selectedTemplate: string): Promise<Type<unknown>> {
    const loadComponent = resumeTemplateComponentLoaders[selectedTemplate];

    if (!loadComponent) {
        throw new Error(`No component registered for selected template "${selectedTemplate}"`);
    }

    return loadComponent();
}

type ResumeTemplateComponentLoader = () => Promise<Type<unknown>>;
const resumeTemplateComponentLoaders: Record<string, ResumeTemplateComponentLoader> = {
  'template-1': () => import('@components/resume-templates/template-1/template-1').then(m => m.ResumeTemplateOneComponent),
  'template-2': () => import('@components/resume-templates/template-2/template-2').then(m => m.ResumeTemplateTwoComponent),
};
