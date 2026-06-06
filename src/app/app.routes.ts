import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./Web/Web.routes').then(m => m.WebRoutes),
  },
  {
    path: 'CMS',
    loadChildren: () => import('./CMS/CMS.routes').then(m => m.CMSRoutes)
  },
  // {
  //   path: '',
  //   redirectTo: 'Web',
  //   pathMatch: 'full'
  // },
  {
    path: '**',
    redirectTo: ''
  }
];
