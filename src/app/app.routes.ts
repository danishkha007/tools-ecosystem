import { Routes } from '@angular/router';
import { buildCategoryRoutes, buildToolRoutes } from './core/services/registry.service';
import { TOOL_DATA } from './core/services/data.service';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home').then(m => m.HomeComponent)
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about/about').then(m => m.AboutComponent)
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact').then(m => m.ContactComponent)
  },
  {
    path: 'tools',
    loadComponent: () =>
      import('./pages/tools/tools').then(m => m.ToolsPageComponent)
  },
  ...buildCategoryRoutes(TOOL_DATA.tools),
  ...buildToolRoutes(TOOL_DATA.tools)
];
