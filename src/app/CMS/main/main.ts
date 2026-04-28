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
  private loaded = false;
  
  constructor(private confirmationService: ConfirmationService) {
    gsap.registerPlugin(ScrollTrigger);
  }
  
  async ngAfterViewInit() {
    await this.loadGsapConfig();
  }
  
  private async loadGsapConfig() {
    if (this.loaded) return;
    this.loaded = true;
    
    try {
      await this.configLoader.load();
      const config = this.configLoader.getConfig();
      
      if (config?.rules) {
        this.applyGsapAnimations(config);
      }
    } catch (err) {
      console.warn('GSAP config load error:', err);
    }
  }
  
  private applyGsapAnimations(config: any) {
    const rules = config.rules?.filter((r: any) => r.status === 'published') || [];
    
    rules.forEach((rule: any) => {
      const elements = document.querySelectorAll(rule.selector);
      if (!elements.length) return;
      
      const from = rule.from || { opacity: 0, y: 30 };
      const to = rule.to || { opacity: 1, y: 0 };
      const duration = rule.duration || config.global?.defaults?.duration || 1;
      const ease = rule.ease || config.global?.defaults?.ease || 'power2.out';
      const stagger = rule.stagger || config.global?.defaults?.stagger || 0;
      
      if (rule.type === 'tween') {
        gsap.fromTo(elements, from, {
          ...to,
          duration,
          ease,
          stagger,
          scrollTrigger: rule.scrollEnabled ? {
            trigger: rule.trigger || rule.selector,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          } : undefined
        });
      }
    });
    
    ScrollTrigger.refresh();
    console.log('GSAP animations applied:', rules.length, 'rules');
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
    this.loaded = false;
    this.loadGsapConfig();
  }
}