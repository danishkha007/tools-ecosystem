import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumePreviewComponent } from "../../components/resume-templates/resume-preview/resume-preview";
import { ResumePreviewAtsComponent } from "../../components/resume-templates/resume-preview-ats/resume-preview-ats";
import { ResumeFormComponent } from "../../components/resume-form/resume-form";
import { FaqSectionComponent, FaqItem } from "../../components/faq-section/faq-section";
import { UseCaseModalComponent } from "../../components/use-case-modal/use-case-modal";
import { ResumeService } from '../../core/services/resume';
import { Resume } from '../../core/models/resume';
import { ToolConfigService } from '../../core/services/tool-config';
import html2pdf from 'html2pdf.js';
import { ToolHeaderComponent } from "../../components/tool-header/tool-header";
import { ToolData, ToolSEO, UseCase } from '../../core/models/tool-data.model';
import { SeoService } from '../../core/services/seo.service';
import { ToolDataService } from '../../core/services/tool-data.service';
import { AboutSectionComponent } from "../../components/about-section/about-section";
import { FeaturesSectionComponent } from "../../components/features-section/features-section";
import { UseCaseSectionComponent } from "../../components/use-case-section/use-case-section";

@Component({
  selector: 'app-resume-builder',
  standalone: true,
  imports: [CommonModule, ResumePreviewComponent, ResumePreviewAtsComponent, ResumeFormComponent, FaqSectionComponent, ToolHeaderComponent, AboutSectionComponent, FeaturesSectionComponent, UseCaseSectionComponent],
  templateUrl: './resume-builder.html',
  styleUrl: './resume-builder.scss',
})
export class ResumeBuilder implements OnInit {
  @ViewChild(ResumeFormComponent) resumeFormComponent!: ResumeFormComponent;
  @ViewChild('resumePreview') resumePreview!: ElementRef;

  toolData: ToolData = {} as ToolData;

  resumeProgress = 0;
  selectedTemplate: 'modern' | 'ats' = 'modern';
  showTemplateModal = true;
  currentStep = 0;

  // SEO data
  seoTitle = '';
  seoMetaDescription = '';
  seoH1 = '';
  seoH2 = '';
  faqs: FaqItem[] = [];
  faqTitle = 'Frequently Asked Questions';
  faqAccentColor = '#2f84ff';
  expandedFaqIndex: number | null = 0;

  formSteps = [
    'Personal Info',
    'Summary',
    'Skills',
    'Experience',
    'Education',
    'Additional'
  ];

  // Use Case Modal State
  showUseCaseModal = false;
  currentUseCase: UseCase | null = null;

  // Use Case Data for Resume Builder
  useCaseDetails: { [key: number]: UseCase } = {
    1: {
      title: 'Job Seekers',
      description: 'Create a professional resume that stands out to recruiters and passes ATS screening. Our free resume builder helps you showcase your skills and experience effectively.',
      benefits: [
        'ATS-optimized templates that pass applicant tracking systems',
        'Professional formatting that impresses recruiters',
        'Easy-to-edit sections for quick updates',
        'Multiple template options to match your industry'
      ],
      icon: 'user',
      color: '#dbeafe'
    },
    2: {
      title: 'Career Changers',
      description: 'Highlight transferable skills and showcase your potential to employers in new industries. Our resume builder helps you position yourself for success.',
      benefits: [
        'Focus on transferable skills and achievements',
        'Industry-neutral language that works everywhere',
        'Functional resume sections to highlight abilities',
        'Tips for explaining career transitions'
      ],
      icon: 'briefcase',
      color: '#d1fae5'
    },
    3: {
      title: 'Fresh Graduates',
      description: 'Build an impressive entry-level resume that gets noticed despite limited work experience. Turn your education and activities into assets.',
      benefits: [
        'Templates designed for entry-level positions',
        'Highlight education, internships, and projects',
        'Showcase leadership and extracurricular activities',
        'Focus on soft skills and potential'
      ],
      icon: 'graduation',
      color: '#fef3c7'
    },
    4: {
      title: 'Professionals',
      description: 'Update and modernize your existing resume with contemporary design and formatting. Impress hiring managers with a polished, professional document.',
      benefits: [
        'Executive-level templates and designs',
        'Showcase career progression and achievements',
        'Modern formatting that stands out',
        'Senior-level language and positioning'
      ],
      icon: 'briefcase',
      color: '#fce7f3'
    }
  };

  constructor(
    private resumeService: ResumeService,
    private toolConfigService: ToolConfigService,
    private seoService: SeoService,
    private toolDataService: ToolDataService
  ) {
    const tool = this.toolDataService.getToolById('resume-builder');
    if (tool) {
      this.toolData = tool;
    }
  }

  ngOnInit(): void {
    this.seoService.setSeoData(this.toolData.seo);
    this.resumeService.resume$.subscribe(resume => {
      this.calculateProgress(resume);
    });

    // Load SEO data from tool config
    this.loadSeoData();
  }

  loadSeoData() {
    const tools = this.toolConfigService.getAllTools();
    const resumeTool = tools.find(t => t.id === 'resume');

    if (resumeTool && resumeTool.seo) {
      const seo: ToolSEO = resumeTool.seo;
      this.seoTitle = seo.title;
      this.seoMetaDescription = seo.metaDescription;
      this.seoH1 = seo.h1;
      this.seoH2 = seo.h2;
      this.faqs = seo.faqs || [];

      // Set document title and meta description
      document.title = seo.title || 'MyToolTrove';

      // Update meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', seo.metaDescription || '');
    }
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

  // Use Case Modal Methods
  openUseCaseModal(useCaseId: number): void {
    this.currentUseCase = this.useCaseDetails[useCaseId];
    this.showUseCaseModal = true;
  }

  closeUseCaseModal(): void {
    this.showUseCaseModal = false;
    this.currentUseCase = null;
  }
  // Scroll to top of page
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
