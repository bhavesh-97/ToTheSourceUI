import { Routes } from '@angular/router';
import { authGuard } from '../authentication/guards/auth-guard';

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
];