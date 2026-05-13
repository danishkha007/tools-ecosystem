import { Routes } from '@angular/router';
import { buildCategoryRoutes } from './core/services/tool-category-route-registry';
import { buildToolRoutes } from './core/services/tool-component-registry';
import { TOOL_DATA } from './core/services/data.service';

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
  ...buildCategoryRoutes(TOOL_DATA.tools),
  ...buildToolRoutes(TOOL_DATA.tools)
];
