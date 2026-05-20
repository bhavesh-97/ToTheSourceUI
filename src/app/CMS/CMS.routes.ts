import { Routes } from '@angular/router';
import { authGuard } from '../authentication/guards/auth-guard';
import { MainComponent } from './main/main';
import { gsapAnimationResolver } from './main/gsap-animation.resolver';

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
              { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
              {
                  path: 'dashboard',
                  loadComponent: () => import('./main/dashboard/dashboard').then(m => m.Dashboard),
                  canActivate: [authGuard],
                  resolve: { gsapConfig: gsapAnimationResolver }
              },
              {
                  path: 'gsap',
                  loadComponent: () => import('./main/gsap-master/gsap-master').then(m => m.GsapMaster),
                  canActivate: [authGuard],
                  resolve: { gsapConfig: gsapAnimationResolver }
              },
              {
                  path: 'gsap-demo',
                  loadComponent: () => import('./main/gsap-demo/gsap-demo').then(m => m.GsapDemoComponent),
                  resolve: { gsapConfig: gsapAnimationResolver }
              },                        
              {
                  path: 'template',
                  loadComponent: () => import('./main/template-master/template-master').then(m => m.TemplateMaster),
                  canActivate: [authGuard],
                  resolve: { gsapConfig: gsapAnimationResolver }
              },
              {
                  path: 'rolemaster',
                  loadComponent: () => import('./main/rolemaster/rolemaster').then(m => m.Rolemaster),
                  canActivate: [authGuard],
                  resolve: { gsapConfig: gsapAnimationResolver }
              },
              {
                  path: 'menuresoursemaster',
                  loadComponent: () => import('./main/menu-resource-master/menu-resource-master').then(m => m.MenuResourceMaster),
                  canActivate: [authGuard],
                  resolve: { gsapConfig: gsapAnimationResolver }
              },
              {
                  path: 'menumappingmaster',
                  loadComponent: () => import('./main/menu-mapping-master/menu-mapping-master').then(m => m.MenuMappingMaster),
                  canActivate: [authGuard],
                  resolve: { gsapConfig: gsapAnimationResolver }
              },
              {
                  path: 'menurightsmaster',
                  loadComponent: () => import('./main/menu-rights-master/menu-rights-master').then(m => m.MenuRightsMaster),
                  canActivate: [authGuard],
                  resolve: { gsapConfig: gsapAnimationResolver }
              },
              {
                  path: 'lookupmaster',
                  loadComponent: () => import('./main/lookup-master/lookup-master').then(m => m.LookupMaster),
                  canActivate: [authGuard],
                  resolve: { gsapConfig: gsapAnimationResolver }
              },
          ],
     },
];