// src/app/CMS/main/main.component.ts
import { Component, ViewChild, AfterViewInit, OnDestroy, inject, signal, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subject, filter, debounceTime, takeUntil } from 'rxjs';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { TextPlugin } from 'gsap/TextPlugin';
import { CustomEase } from 'gsap/CustomEase';
import { HeaderComponent } from '../../@theme/components/header/header.component';
import { SidebarComponent } from '../../@theme/components/sidebar/sidebar';
import { FooterComponent } from '../../@theme/components';
import { GsapMasterService } from './gsap-master/gsap-master.service';
import { GsapConfigLoaderService } from '../../services/gsap-config-loader.service';
import { ConfirmationService } from 'primeng/api';

const GSAP_PLUGINS: Record<string, any> = {
  scrolltrigger: ScrollTrigger,
  draggable: Draggable,
  scrolltoplugin: ScrollToPlugin,
  textplugin: TextPlugin,
  customease: CustomEase,
};

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
  private zone = inject(NgZone);
  private currentPage = '';
  private destroyed$ = new Subject<void>();

  constructor(private confirmationService: ConfirmationService) {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngAfterViewInit() {
    const initialPage = this.getPageFromUrl(this.router.url);
    console.log('[GSAP Main] Initial page:', initialPage);
    if (initialPage) {
      this.currentPage = initialPage;
      this.loadPageConfig(initialPage);
    }
    
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      debounceTime(500),
      takeUntil(this.destroyed$)
    ).subscribe(() => this.onRouteChange());
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
    gsap.killTweensOf('*');
    ScrollTrigger.getAll().forEach(st => st.kill());
  }

  private onRouteChange() {
    const url = this.router.url;
    const page = this.getPageFromUrl(url);
    console.log('[GSAP Main] Route changed:', url, '| Page:', page);
    
    if (page !== this.currentPage) {
      console.log('[GSAP Main] Page changed, loading config for:', page);
      this.currentPage = page;
      this.zone.run(() => this.loadPageConfig(page));
    } else {
      console.log('[GSAP Main] Same page, reloading config for:', page);
      this.currentPage = page;
      this.configLoader.clearCache(page);
      this.zone.run(() => this.loadPageConfig(page));
    }
  }

  private getPageFromUrl(url: string): string {
    const segments = url.split('/').filter(s => s);
    return segments[segments.length - 1] || '';
  }

  private async loadPageConfig(page: string) {
    if (!page) return;
    
    console.log('[GSAP Main] loadPageConfig called for:', page);
    
    try {
      const config = await this.configLoader.load(page);
      console.log('[GSAP Main] Config loaded:', page, '| global:', !!config?.global, '| pages keys:', Object.keys(config?.pages || {}));
      
      const pages = config?.pages || {};
      const pageData = pages[page];
      console.log('[GSAP Main] pageData for', page, ':', pageData ? 'found' : 'null', '| rules:', pageData?.rules?.length || 0);
      
      if (!pageData) {
        console.log('[GSAP Main] No pageData found for:', page, '| Available pages:', Object.keys(pages));
        return;
      }
      
      if (!pageData.rules?.length) {
        console.log('[GSAP Main] No rules for:', page);
        return;
      }
      
      const publishedRules = pageData.rules.filter((r: any) => {
        console.log('[GSAP Main] Rule status:', r.status, '| selector:', r.selector);
        const s = String(r.status || '').toLowerCase();
        return s === '1' || s === 'published' || s === 'active';
      });
      console.log('[GSAP Main] Published rules:', page, '| Count:', publishedRules.length);
      
      if (!publishedRules.length) return;

      const pageConfig = {
        global: config.global,
        rules: pageData.rules,
        callbacks: pageData.callbacks || []
      };
      
      setTimeout(() => {
        console.log('[GSAP Main] Running applyGsapAnimations for:', page, '| Rules:', publishedRules.length);
        this.applyGsapAnimations(pageConfig);
      }, 300);
    } catch (err) {
      console.warn('[GSAP Main] GSAP config load error:', err);
    }
  }

  private registerPlugins(plugins: string[]) {
    plugins?.forEach((name: string) => {
      const key = name.toLowerCase();
      const plugin = GSAP_PLUGINS[key];
      if (plugin) {
        gsap.registerPlugin(plugin);
      }
    });
  }

  private applyGsapAnimations(config: any) {
    gsap.killTweensOf('*');
    ScrollTrigger.getAll().forEach(st => st.kill());

    const plugins: string[] = config?.global?.registerPlugins || ['ScrollTrigger'];
    this.registerPlugins(plugins);

    const rules = (config?.rules || []).filter((r: any) => {
      const s = String(r.status || '').toLowerCase();
      return s === '1' || s === 'published' || s === 'active';
    });
    
    console.log('[GSAP Main] applyGsapAnimations, rules count:', rules.length);
    
    rules.forEach((rule: any) => {
      const elements = document.querySelectorAll(rule.selector);
      console.log('[GSAP Main] Selector:', rule.selector, '| Found:', elements.length, '| Type:', rule.type, '| Scroll:', rule.scrollEnabled);
      if (!elements.length) return;

      const from = (rule.from && typeof rule.from === 'object' && Object.keys(rule.from).length > 0) ? rule.from : { opacity: 0 };
      const to = (rule.to && typeof rule.to === 'object' && Object.keys(rule.to).length > 0) ? rule.to : { opacity: 1 };
      const duration = Number(rule.duration) || 1;
      const ease = String(rule.ease) || 'power2.out';
      const stagger = Number(rule.stagger) || 0;
      const delay = Number(rule.delay) || 0;
      const scrollEnabled = Boolean(rule.scrollEnabled);

      gsap.set(elements, from);

      const tweenConfig: any = {
        ...to,
        duration,
        ease,
        stagger,
        delay,
        immediateRender: false,
        overwrite: 'auto'
      };

      if (scrollEnabled) {
        tweenConfig.scrollTrigger = {
          trigger: elements[0],
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        };
      }

      gsap.fromTo(elements, from, tweenConfig);
      console.log('[GSAP Main] Animation applied for:', rule.selector, '| from:', from, '| to:', to);
    });
    
    ScrollTrigger.refresh();
  }

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