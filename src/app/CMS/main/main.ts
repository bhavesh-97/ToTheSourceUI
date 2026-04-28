// src/app/CMS/main/main.component.ts
import { Component, ViewChild, AfterViewInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeaderComponent } from '../../@theme/components/header/header.component';
import { SidebarComponent } from '../../@theme/components/sidebar/sidebar';
import { FooterComponent } from '../../@theme/components';
import { GsapConfigLoaderService } from '../../services/gsap-config-loader.service';
import { GsapMasterService } from './gsap-master/gsap-master.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
  templateUrl: './main.html',
  styleUrl: './main.css',
  providers: [ConfirmationService]
})
export class MainComponent implements AfterViewInit, OnDestroy {
  @ViewChild(RouterOutlet) outlet!: RouterOutlet;
  
  private configLoader = inject(GsapConfigLoaderService);
  private gsapMasterService = inject(GsapMasterService);
  private router = inject(Router);
  private currentPage = '';
  
  constructor(private confirmationService: ConfirmationService) {
    gsap.registerPlugin(ScrollTrigger);
  }
  
  async ngAfterViewInit() {
    this.router.events.subscribe(() => {
      this.onRouteChange();
    });
    setTimeout(() => this.onRouteChange(), 500);
  }
  
  private onRouteChange() {
    const url = this.router.url;
    const page = this.getPageFromUrl(url);
    
    if (page !== this.currentPage) {
      this.currentPage = page;
      this.loadPageConfig(page);
    }
  }
  
  private getPageFromUrl(url: string): string {
    const segments = url.split('/').filter(s => s);
    return segments[segments.length - 1] || 'default';
  }
  
  private async loadPageConfig(page: string) {
    try {
      await this.configLoader.load();
      
      // Get config specifically for this page
      const pageConfig = await this.gsapMasterService.getConfigForPage(page).toPromise();
      
      if (pageConfig?.rules?.length) {
        this.applyGsapAnimations(pageConfig);
        console.log(`GSAP loaded for page: ${page}`, pageConfig.rules.length, 'rules');
      }
    } catch (err) {
      console.warn('GSAP config load error:', err);
    }
  }
  
  private applyGsapAnimations(config: any) {
    gsap.killTweensOf('*');
    ScrollTrigger.getAll().forEach(st => st.kill());
    
    const rules = config?.rules?.filter((r: any) => r.status === 'published') || [];
    
    rules.forEach((rule: any) => {
      const elements = document.querySelectorAll(rule.selector);
      if (!elements.length) return;
      
      const from = rule.from || { opacity: 0, y: 30 };
      const to = rule.to || { opacity: 1, y: 0 };
      const duration = rule.duration || config.global?.defaults?.duration || 1;
      const ease = rule.ease || config.global?.defaults?.ease || 'power2.out';
      const stagger = rule.stagger?.each || config.global?.defaults?.stagger || 0;
      
      if (rule.type === 'tween') {
        gsap.fromTo(elements, from, {
          ...to,
          duration,
          ease,
          stagger,
          scrollTrigger: rule.scrollTrigger?.enabled ? {
            trigger: rule.scrollTrigger?.trigger || rule.selector,
            start: rule.scrollTrigger?.start || 'top 85%',
            end: rule.scrollTrigger?.end || 'bottom top',
            toggleActions: 'play none none reverse'
          } : undefined
        });
      }
    });
    
    ScrollTrigger.refresh();
  }
  
  ngOnDestroy() {}
  
  isDark = signal(false);
  
  toggleDark() {
    this.isDark.update(v => !v);
    const body = document.body;
    if (this.isDark()) {
      body.classList.add('dark-theme');
    } else {
      body.classList.remove('dark-theme');
    }
  }
  
  refreshGsap() {
    this.loadPageConfig(this.currentPage);
  }
  
  loadPage(pageName: string) {
    if (pageName && pageName !== this.currentPage) {
      this.currentPage = pageName;
      this.loadPageConfig(pageName);
    }
  }
}