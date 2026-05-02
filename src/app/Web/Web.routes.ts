import { Routes } from '@angular/router';
import { WebLayoutComponent } from './web-layout/web-layout.component';

export const WebRoutes: Routes = [
  {
    path: '',
    component: WebLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
      { path: 'about', loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent) },
      { path: 'services', loadComponent: () => import('./pages/services/services.component').then(m => m.ServicesComponent) },
      { path: 'contact', loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent) },
      { path: 'blog', loadComponent: () => import('./pages/blog/blog.component').then(m => m.BlogComponent) },
      { path: 'portfolio', loadComponent: () => import('./pages/portfolio/portfolio.component').then(m => m.PortfolioComponent) },
      { path: 'faq', loadComponent: () => import('./pages/faq/faq.component').then(m => m.FaqComponent) },
      { path: 'stats', loadComponent: () => import('./pages/stats/stats.component').then(m => m.StatsComponent) },
      { path: 'animations', loadComponent: () => import('./pages/animations/animations.component').then(m => m.AnimationsComponent) },
      { path: 'templates', loadComponent: () => import('./pages/templates/templates.component').then(m => m.TemplatesComponent) },
    ]
  }
];