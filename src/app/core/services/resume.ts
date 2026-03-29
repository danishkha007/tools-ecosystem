import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Resume } from '../models/resume';

// Demo data to show when user hasn't entered any information
const DEMO_RESUME: Resume = {
  personal: {
    name: 'John Doe',
    jobTitle: 'Senior Software Engineer',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/johndoe',
    website: 'https://johndoe.com'
  },
  summary: 'Results-driven software engineer with 5+ years of experience in building scalable web applications. Proven track record of leading teams and delivering projects that increased revenue by 30%. Passionate about cloud architecture and mentoring junior developers.',
  coreCompetencies: `• Cloud Architecture (AWS, Azure)
• Agile Methodologies & Scrum
• System Design & Scalability
• Team Leadership & Mentorship
• CI/CD Pipelines & DevOps
• Microservices & API Design`,
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes', 'SQL', 'MongoDB'],
  experience: [
    {
      company: 'TechCorp Inc.',
      role: 'Senior Software Engineer',
      startDate: 'Jan 2022',
      endDate: 'Present',
      isCurrentJob: true,
      description: 'Leading a team of 5 engineers in developing cloud-native applications.',
      achievements: [
        'Led development of microservices architecture reducing latency by 40%',
        'Mentored 5 junior developers, promoting 2 to senior roles',
        'Implemented CI/CD pipeline reducing deployment time by 60%',
        'Increased system uptime from 99.5% to 99.99%'
      ]
    },
    {
      company: 'StartupXYZ',
      role: 'Software Engineer',
      startDate: 'Mar 2019',
      endDate: 'Dec 2021',
      isCurrentJob: false,
      description: 'Full-stack development of e-commerce platform.',
      achievements: [
        'Built customer-facing portal serving 50k+ monthly users',
        'Reduced page load time by 50% through optimization',
        'Integrated payment systems processing $1M+ annually'
      ]
    }
  ],
  education: [
    {
      institute: 'Stanford University',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      graduationDate: 'May 2019',
      gpa: '3.8/4.0',
      achievements: 'Magna Cum Laude, Dean\'s List'
    }
  ],
  certifications: [
    {
      name: 'AWS Solutions Architect Professional',
      issuer: 'Amazon Web Services',
      date: 'March 2023',
      expiryDate: 'March 2026'
    },
    {
      name: 'Google Cloud Professional Developer',
      issuer: 'Google',
      date: 'January 2022'
    }
  ],
  projects: [
    {
      name: 'E-commerce Platform',
      description: 'Built a full-stack e-commerce platform serving 10k+ users with 99.9% uptime.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      link: 'https://github.com/johndoe/ecommerce'
    }
  ],
  languages: [
    { language: 'English', proficiency: 'Native' },
    { language: 'Spanish', proficiency: 'Conversational' }
  ],
  style: {
    fontFamily: 'Arial',
    fontSize: 12,
    color: '#000000'
  }
};

@Injectable({
  providedIn: 'root'
})
export class ResumeService {

  private resumeData = new BehaviorSubject<Resume>(DEMO_RESUME);

  resume$ = this.resumeData.asObservable();

  updateResume(data: Partial<Resume>) {
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