import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/dashboard/dashboard').then(m => m.DashboardComponent)
  },
  {
    path: 'resume',
    loadComponent: () =>
      import('./features/resume-builder/resume-builder').then(m => m.ResumeBuilder)
  },
  {
    path: 'pdf-merge',
    loadComponent: () =>
      import('./features/pdf-merge/pdf-merge').then(m => m.PdfMergeComponent)
  },
  {
    path: 'image-compress',
    loadComponent: () =>
      import('./features/image-compressor/image-compressor').then(m => m.ImageCompressor)
  }
];