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
            path: 'main',
            component: MainComponent,
            canActivate: [authGuard],
            children: [
                        {   path: '', 
                            redirectTo: 'dashboard', 
                            pathMatch: 'full' 
                        },
                        {
                            path: 'dashboard',
                            loadComponent: () => import('./main/dashboard/dashboard').then(m => m.Dashboard),
                            canActivate: [authGuard]
                        },
                        {
                            path: 'gsap',
                            loadComponent: () => import('./main/gsap-master/gsap-master').then(m => m.GsapMaster),
                            canActivate: [authGuard]
                        },                        
                        {
                            path: 'template',
                            loadComponent: () => import('./main/template-master/template-master').then(m => m.TemplateMaster),
                            canActivate: [authGuard]
                        },
                         {
                            path: 'rolemaster',
                            loadComponent: () => import('./main/rolemaster/rolemaster').then(m => m.Rolemaster),
                            canActivate: [authGuard]
                        },
                         {
                            path: 'menuresoursemaster',
                            loadComponent: () => import('./main/menu-resource-master/menu-resource-master').then(m => m.MenuResourceMaster),
                            canActivate: [authGuard]
                        },
                        {
                            path: 'menumappingmaster',
                            loadComponent: () => import('./main/menu-mapping-master/menu-mapping-master').then(m => m.MenuMappingMaster),
                            canActivate: [authGuard]
                        },
                      ],
          },
];