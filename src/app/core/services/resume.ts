import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Resume } from '../models/resume';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {

  private resumeData = new BehaviorSubject<Resume>({
    personal: { name: '', email: '', phone: '' },
    summary: '',
    skills: [],
    experience: [],
    education: [],
    style: {
      fontFamily: 'Arial',
      fontSize: 14,
      color: '#000000'
    }
  });

  resume$ = this.resumeData.asObservable();

  updateResume(data: Partial<Resume>) {
    this.resumeData.next({
      ...this.resumeData.value,
      ...data
    });
  }

  getValue() {
    return this.resumeData.value;
  }
}