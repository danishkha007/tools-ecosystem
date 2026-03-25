import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ResumeService } from '../../core/services/resume';

@Component({
  selector: 'app-resume-form',
  templateUrl: './resume-form.html',
  imports: [ ReactiveFormsModule ]
})
export class ResumeFormComponent {
  form!: FormGroup;
  constructor(private fb: FormBuilder, private resumeService: ResumeService) {
  }
  ngOnInit() {
    this.form = this.fb.group({
      name: '',
      email: '',
      phone: '',
      summary: '',
      skills: ''
    });

    this.form.valueChanges.subscribe(val => {
      this.resumeService.updateResume({
        personal: {
          name: val.name || '',
          email: val.email || '',
          phone: val.phone || ''
        },
        summary: val.summary || '',
        skills: val.skills ? val.skills.split(',') : []
      });
    });
  }
}