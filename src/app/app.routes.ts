import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/dashboard/dashboard').then(m => m.DashboardComponent)
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./features/about/about').then(m => m.AboutComponent)
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./features/contact/contact').then(m => m.ContactComponent)
  },
  {
    path: 'resume-builder',
    loadComponent: () =>
      import('./features/resume-builder/resume-builder').then(m => m.ResumeBuilder)
  },
  {
    path: 'merge-pdf',
    loadComponent: () =>
      import('./features/pdf-merge/pdf-merge').then(m => m.PdfMergeComponent)
  },
  {
    path: 'image-compress',
    loadComponent: () =>
      import('./features/image-compressor/image-compressor').then(m => m.ImageCompressor)
  },
  {
    path: 'compress-pdf',
    loadComponent: () =>
      import('./features/pdf-compress/pdf-compress').then(m => m.PdfCompressComponent)
  },
  {
    path: 'gann-hexagonal-support-resistance-calculator',
    loadComponent: () =>
      import('./features/calculators/gann/hexagonal-support-resistance/hexagonal-sr-calculator').then(m => m.GannCalculator)
  }
];
