import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ResumeData } from '../models/resume-data.model';
import demoResumeData from '../data/resume-data.json';

// Demo data to show when user hasn't entered any information
const DEMO_RESUME: ResumeData = demoResumeData;

@Injectable({
  providedIn: 'root'
})
export class ResumeService {

  private resumeData = new BehaviorSubject<ResumeData>(DEMO_RESUME);

  resume$ = this.resumeData.asObservable();

  updateResume(data: Partial<ResumeData>) {
    const currentData = this.resumeData.value;
    const updatedData = { ...currentData, ...data };
    
    // Check if user has entered any personal information
    const hasUserData = currentData.personal.name !== DEMO_RESUME.personal.name || 
                      currentData.personal.email !== DEMO_RESUME.personal.email;
    
    // If user has provided their own data, merge it; otherwise keep demo data
    if (data.personal && data.personal.name && data.personal.name !== 'John Doe') {
      // Merge user data with demo structure where needed
      this.resumeData.next({
        ...DEMO_RESUME,
        ...data,
        personal: { ...DEMO_RESUME.personal, ...data.personal }
      });
    } else {
      this.resumeData.next(updatedData);
    }
  }

  getValue() {
    return this.resumeData.value;
  }

  // Check if currently showing demo data
  isShowingDemoData(): boolean {
    const data = this.resumeData.value;
    return data.personal.name === DEMO_RESUME.personal.name;
  }

  // Reset to demo data
  resetToDemo() {
    this.resumeData.next(DEMO_RESUME);
  }
}