import { Routes } from '@angular/router';
import { authGuard } from '../authentication/guards/auth-guard';
import { OneColumnLayoutComponent, ThreeColumnsLayoutComponent, TwoColumnsLayoutComponent } from '../@theme/layouts';
import { MainComponent } from './main/main';

export const CMSRoutes: Routes = [    
     {
              path: '',
              redirectTo: 'login',
              pathMatch: 'full'
     },
     {
            path: 'login',
            loadComponent: () => import('../authentication/login/login').then(m => m.Login)
     },
     {
            path: 'dashboard',
            loadComponent: () => import('./main/dashboard/dashboard').then(m => m.Dashboard),
            canActivate: [authGuard]
     },
     {
    path: 'main',
    component: MainComponent,
//     canActivate: [() => inject(AuthService).isLoggedIn()],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./main/dashboard/dashboard')
          .then(m => m.Dashboard),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];