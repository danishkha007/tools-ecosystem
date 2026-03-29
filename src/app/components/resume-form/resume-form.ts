import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ResumeService } from '../../core/services/resume';
import { Resume } from '../../core/models/resume';

@Component({
  selector: 'app-resume-form',
  standalone: true,
  templateUrl: './resume-form.html',
  styleUrls: ['./resume-form.scss'],
  imports: [ReactiveFormsModule]
})
export class ResumeFormComponent implements OnInit {
  @Input() currentStep = 0;
  
  form!: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private resumeService: ResumeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      // Personal Information - Required fields marked
      name: ['', Validators.required],
      jobTitle: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      location: [''],
      linkedin: [''],
      website: [''],
      
      // Summary & Skills
      summary: ['', Validators.required],
      coreCompetencies: [''],
      skills: ['', Validators.required],
      
      // Work Experience - array, can be empty
      experience: this.fb.array([]),
      
      // Education - always requires at least one entry
      education: this.fb.array([]),
      
      // Certifications
      certifications: this.fb.array([]),
      
      // Projects
      projects: this.fb.array([]),
      
      // Languages
      languages: this.fb.array([])
    });

    // Add one education entry by default
    this.addEducation();

    this.form.valueChanges.subscribe(val => {
      this.resumeService.updateResume({
        personal: {
          name: val.name || '',
          email: val.email || '',
          phone: val.phone || '',
          linkedin: val.linkedin || '',
          website: val.website || '',
          location: val.location || '',
          jobTitle: val.jobTitle || ''
        },
        summary: val.summary || '',
        coreCompetencies: val.coreCompetencies || '',
        skills: val.skills ? val.skills.split(',').map((s: string) => s.trim()) : [],
        experience: val.experience || [],
        education: val.education || [],
        certifications: val.certifications || [],
        projects: val.projects || [],
        languages: val.languages || [],
        style: {
          fontFamily: 'Arial',
          fontSize: 12,
          color: '#000000'
        }
      });
    });
  }

  // Check if field is required and touched/empty
  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.hasError('required') && field.touched);
  }

  // Check if field is valid
  isFieldValid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.valid && field.touched);
  }

  // Check if current step has all required fields filled
  isStepComplete(step: number): boolean {
    switch (step) {
      case 0: // Personal Info
        const name = this.form.get('name');
        const jobTitle = this.form.get('jobTitle');
        const email = this.form.get('email');
        const phone = this.form.get('phone');
        return !!(
          name?.valid &&
          jobTitle?.valid &&
          email?.valid &&
          phone?.valid
        );
      case 1: // Summary - only summary is required here (skills is step 2)
        return !!this.form.get('summary')?.valid;
      case 2: // Skills
        return !!this.form.get('skills')?.valid;
      case 3: // Experience - optional, can skip if empty
        const expArr = this.form.get('experience') as FormArray;
        if (expArr.length === 0) return true; // Can skip if empty
        // Check if all entries with data have required fields
        for (let i = 0; i < expArr.length; i++) {
          const role = expArr.at(i).get('role')?.value;
          const company = expArr.at(i).get('company')?.value;
          // If user started filling, require both fields
          if (role || company) {
            if (!role || !role.trim() || !company || !company.trim()) {
              return false; // Block if partially filled
            }
          }
        }
        return true; // Can proceed (empty or complete)
      case 4: // Education - always required at least one
        const eduArr = this.form.get('education') as FormArray;
        if (eduArr.length === 0) return false; // Must have at least one
        // Check all education entries
        for (let i = 0; i < eduArr.length; i++) {
          const degree = eduArr.at(i).get('degree')?.value;
          const institute = eduArr.at(i).get('institute')?.value;
          if (!degree || !degree.trim() || !institute || !institute.trim()) {
            return false; // Block if any required field is empty
          }
        }
        return true; // All filled
      case 5: // Additional - certifications, projects, languages are optional
        return true;
      default:
        return false;
    }
  }

  // Mark all required fields in current step as touched to show validation errors
  markCurrentStepTouched(): void {
    switch (this.currentStep) {
      case 0: // Personal Info
        this.form.get('name')?.markAsTouched();
        this.form.get('jobTitle')?.markAsTouched();
        this.form.get('email')?.markAsTouched();
        this.form.get('phone')?.markAsTouched();
        break;
      case 1: // Summary - only mark summary as touched
        this.form.get('summary')?.markAsTouched();
        break;
      case 2: // Skills
        this.form.get('skills')?.markAsTouched();
        break;
      case 3: // Experience - only mark touched if entries exist
        const experience = this.form.get('experience') as FormArray;
        experience.controls.forEach(exp => {
          exp.get('role')?.markAsTouched();
          exp.get('company')?.markAsTouched();
        });
        break;
      case 4: // Education - mark all education fields as touched
        const education = this.form.get('education') as FormArray;
        education.controls.forEach(edu => {
          edu.get('degree')?.markAsTouched();
          edu.get('institute')?.markAsTouched();
        });
        break;
      case 5: // Additional - no validation needed
        break;
    }
  }

  // Experience FormArray - expose as array for template iteration
  get experienceControls(): any[] {
    return (this.form.get('experience') as FormArray).controls;
  }

  addExperience() {
    const exp = this.fb.group({
      company: ['', Validators.required],
      role: ['', Validators.required],
      startDate: [''],
      endDate: [''],
      isCurrentJob: [false],
      description: [''],
      achievements: ['']
    });
    (this.form.get('experience') as FormArray).push(exp);
    this.cdr.detectChanges();
  }

  removeExperience(index: number) {
    (this.form.get('experience') as FormArray).removeAt(index);
    this.cdr.detectChanges();
  }

  // Education FormArray
  get educationControls(): any[] {
    return (this.form.get('education') as FormArray).controls;
  }

  addEducation() {
    const edu = this.fb.group({
      institute: ['', Validators.required],
      degree: ['', Validators.required],
      field: [''],
      graduationDate: [''],
      gpa: [''],
      achievements: ['']
    });
    (this.form.get('education') as FormArray).push(edu);
    this.cdr.detectChanges();
  }

  removeEducation(index: number) {
    const eduArr = this.form.get('education') as FormArray;
    // Don't allow removing if only one entry remains
    if (eduArr.length > 1) {
      eduArr.removeAt(index);
      this.cdr.detectChanges();
    }
  }

  // Certification FormArray
  get certificationControls(): any[] {
    return (this.form.get('certifications') as FormArray).controls;
  }

  addCertification() {
    const cert = this.fb.group({
      name: [''],
      issuer: [''],
      date: [''],
      expiryDate: ['']
    });
    (this.form.get('certifications') as FormArray).push(cert);
    this.cdr.detectChanges();
  }

  removeCertification(index: number) {
    (this.form.get('certifications') as FormArray).removeAt(index);
    this.cdr.detectChanges();
  }

  // Project FormArray
  get projectControls(): any[] {
    return (this.form.get('projects') as FormArray).controls;
  }

  addProject() {
    const proj = this.fb.group({
      name: [''],
      description: [''],
      technologies: [''],
      link: ['']
    });
    (this.form.get('projects') as FormArray).push(proj);
    this.cdr.detectChanges();
  }

  removeProject(index: number) {
    (this.form.get('projects') as FormArray).removeAt(index);
    this.cdr.detectChanges();
  }

  // Language FormArray
  get languageControls(): any[] {
    return (this.form.get('languages') as FormArray).controls;
  }

  addLanguage() {
    const lang = this.fb.group({
      language: [''],
      proficiency: ['']
    });
    (this.form.get('languages') as FormArray).push(lang);
    this.cdr.detectChanges();
  }

  removeLanguage(index: number) {
    (this.form.get('languages') as FormArray).removeAt(index);
    this.cdr.detectChanges();
  }
}