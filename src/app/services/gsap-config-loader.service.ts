// src/app/services/gsap-config-loader.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable, map } from 'rxjs';
import { GsapConfigApiService, GsapConfig, GsapPage, GsapRule } from './gsap-config-api.service';

@Injectable({ providedIn: 'root' })
export class GsapConfigLoaderService {
  private config: any = null;
  private loaded = false;
  private http = inject(HttpClient);
  private apiService = inject(GsapConfigApiService);

  constructor(private httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async load(): Promise<void> {
    if (this.loaded) return;

    try {
      const data = await firstValueFrom(
        this.http.get('/assets/gsap/gsap-config.json')
      );
      this.config = data;
      this.loaded = true;
    } catch (err) {
      console.error('Failed to load GSAP config:', err);
    }
  }

  async loadFromApi(configName: string = 'default'): Promise<GsapConfig | null> {
    try {
      const response = await firstValueFrom(
        this.apiService.GetConfigByName(configName, false)
      );
      if (response && !response.isError && response.result) {
        const apiConfig = response.result;
        return this.convertApiToGsapConfig(apiConfig);
      }
      return this.getDefaultConfig();
    } catch (err) {
      console.error('Failed to load GSAP config from API:', err);
      return this.getDefaultConfig();
    }
  }

  async getPagesFromApi(configName: string = 'default'): Promise<Record<string, GsapPage>> {
    try {
      const response = await firstValueFrom(
        this.apiService.GetConfigByName(configName, false)
      );
      if (response && !response.isError && response.result?.pages) {
        const pages: Record<string, GsapPage> = {};
        for (const pageData of response.result.pages) {
          const pageKey = pageData.page?.pageKey || pageData.pageKey;
          if (pageKey) {
            pages[pageKey] = {
              label: pageData.page?.label || pageKey,
              rules: this.convertRules(pageData.rules || []),
              callbacks: []
            };
          }
        }
        return pages;
      }
    } catch (err) {
      console.error('Failed to load pages from API:', err);
    }
    return this.getDefaultPages();
  }

  private convertApiToGsapConfig(apiConfig: any): GsapConfig {
    return {
      global: {
        defaults: {
          duration: apiConfig.defaults?.duration || 1,
          ease: apiConfig.defaults?.ease || 'power2.out',
          stagger: apiConfig.defaults?.stagger,
          delay: apiConfig.defaults?.delay,
          repeat: apiConfig.defaults?.repeat,
          yoyo: apiConfig.defaults?.yoyo
        },
        registerPlugins: apiConfig.plugins?.map((p: any) => p.pluginName || p.plugin_name) || ['ScrollTrigger'],
        autoInit: true,
        observeDom: true,
        meta: {
          version: apiConfig.config?.version || '1.0',
          description: apiConfig.config?.description || ''
        },
        version: 1,
        status: apiConfig.config?.status || 'active'
      },
      pages: {}
    };
  }

  private convertRules(apiRules: any[]): GsapRule[] {
    return (apiRules || []).map((r: any) => ({
      id: r.id || r.ruleKey || r.rule_key,
      label: r.label || '',
      selector: r.selector || '',
      from: r.from || {},
      to: r.to || {},
      duration: r.duration || 1,
      ease: r.ease || 'power2.out',
      stagger: r.stagger,
      scrollEnabled: r.scrollEnabled || r.scroll_enabled || false,
      status: r.status || 'published',
      type: r.type || 'tween'
    }));
  }

  getDefaultConfig(): GsapConfig {
    return {
      global: {
        defaults: { duration: 1, ease: 'power2.out', stagger: 0.1 },
        registerPlugins: ['ScrollTrigger'],
        autoInit: true,
        observeDom: true,
        meta: { version: '1.0', description: 'Page-specific GSAP configuration' },
        version: 1,
        status: 'active'
      },
      pages: this.getDefaultPages()
    };
  }

  getDefaultPages(): Record<string, GsapPage> {
    return {
      landing: {
        label: 'Landing',
        rules: [
          { id: 'landingFadeUp', selector: '.fade-up', from: { opacity: 0, y: 60 }, to: { opacity: 1, y: 0 }, duration: 1, ease: 'power2.out', stagger: 0.12, scrollEnabled: true, status: 'published', type: 'tween' },
          { id: 'landingFadeIn', selector: '.fade-in', from: { opacity: 0 }, to: { opacity: 1 }, duration: 0.8, ease: 'power1.out', scrollEnabled: true, status: 'published', type: 'tween' },
          { id: 'heroFade', selector: '.hero-title', from: { opacity: 0, y: 50 }, to: { opacity: 1, y: 0 }, duration: 1.2, ease: 'power2.out', scrollEnabled: false, status: 'published', type: 'tween' }
        ],
        callbacks: []
      },
      home: {
        label: 'Home',
        rules: [
          { id: 'homeFadeUp', selector: '.fade-up', from: { opacity: 0, y: 50 }, to: { opacity: 1, y: 0 }, duration: 1, ease: 'power2.out', stagger: 0.1, scrollEnabled: true, status: 'published', type: 'tween' },
          { id: 'homeContentFade', selector: '.content-fade', from: { opacity: 0, y: 30 }, to: { opacity: 1, y: 0 }, duration: 0.8, ease: 'power1.out', scrollEnabled: true, status: 'published', type: 'tween' },
          { id: 'homeStagger', selector: '.stagger-item', from: { opacity: 0, y: 20 }, to: { opacity: 1, y: 0 }, duration: 0.5, ease: 'power2.out', stagger: 0.1, scrollEnabled: true, status: 'published', type: 'tween' }
        ],
        callbacks: []
      },
      gsap: {
        label: 'GSAP',
        rules: [
          { id: 'gsapFadeUp', selector: '.fade-up', from: { opacity: 0, y: 60 }, to: { opacity: 1, y: 0 }, duration: 1, ease: 'power2.out', stagger: 0.1, scrollEnabled: false, status: 'published', type: 'tween' },
          { id: 'gsapSlideLeft', selector: '.slide-in-left', from: { opacity: 0, x: -100 }, to: { opacity: 1, x: 0 }, duration: 0.8, ease: 'power2.out', scrollEnabled: true, status: 'published', type: 'tween' },
          { id: 'gsapSlideRight', selector: '.slide-in-right', from: { opacity: 0, x: 100 }, to: { opacity: 1, x: 0 }, duration: 0.8, ease: 'power2.out', scrollEnabled: true, status: 'published', type: 'tween' },
          { id: 'gsapScaleIn', selector: '.scale-in', from: { opacity: 0, scale: 0.5 }, to: { opacity: 1, scale: 1 }, duration: 0.8, ease: 'back.out(1.7)', scrollEnabled: true, status: 'published', type: 'tween' },
          { id: 'gsapBlurIn', selector: '.blur-in', from: { opacity: 0, filter: 'blur(10px)' }, to: { opacity: 1, filter: 'blur(0px)' }, duration: 1, ease: 'power2.out', scrollEnabled: true, status: 'published', type: 'tween' },
          { id: 'gsapRotateIn', selector: '.rotate-in', from: { opacity: 0, rotation: -90, transformOrigin: 'center center' }, to: { opacity: 1, rotation: 0 }, duration: 0.8, ease: 'power2.out', scrollEnabled: true, status: 'published', type: 'tween' },
          { id: 'gsapFlipIn', selector: '.flip-in', from: { opacity: 0, rotationY: -90, transformOrigin: 'center center', perspective: 1000 }, to: { opacity: 1, rotationY: 0 }, duration: 1, ease: 'power2.out', scrollEnabled: true, status: 'published', type: 'tween' },
          { id: 'gsapBounceIn', selector: '.bounce-in', from: { opacity: 0, y: -100 }, to: { opacity: 1, y: 0 }, duration: 1, ease: 'bounce.out', scrollEnabled: true, status: 'published', type: 'tween' },
          { id: 'gsapStaggerCard', selector: '.stagger-card', from: { opacity: 0, y: 50, scale: 0.9 }, to: { opacity: 1, y: 0, scale: 1 }, duration: 0.6, ease: 'power2.out', stagger: 0.15, scrollEnabled: true, status: 'published', type: 'tween' }
        ],
        callbacks: []
      },
      template: {
        label: 'Template',
        rules: [
          { id: 'templateFadeIn', selector: '.fade-in', from: { opacity: 0 }, to: { opacity: 1 }, duration: 0.8, ease: 'power1.out', scrollEnabled: false, status: 'published', type: 'tween' },
          { id: 'templateSlideUp', selector: '.slide-up', from: { opacity: 0, y: 30 }, to: { opacity: 1, y: 0 }, duration: 0.6, ease: 'power2.out', scrollEnabled: true, status: 'published', type: 'tween' }
        ],
        callbacks: []
      },
      rolemaster: {
        label: 'Role Master',
        rules: [
          { id: 'roleFadeUp', selector: '.fade-up', from: { opacity: 0, y: 40 }, to: { opacity: 1, y: 0 }, duration: 0.8, ease: 'power2.out', scrollEnabled: true, status: 'published', type: 'tween' },
          { id: 'roleTableFade', selector: '.role-table-row', from: { opacity: 0 }, to: { opacity: 1 }, duration: 0.5, ease: 'power1.out', stagger: 0.05, scrollEnabled: false, status: 'published', type: 'tween' }
        ],
        callbacks: []
      },
      dashboard: {
        label: 'Dashboard',
        rules: [
          { id: 'dashboardFadeUp', selector: '.fade-up', from: { opacity: 0, y: 60 }, to: { opacity: 1, y: 0 }, duration: 1, ease: 'power2.out', stagger: 0.12, scrollEnabled: true, status: 'published', type: 'tween' },
          { id: 'dashboardFadeIn', selector: '.fade-in', from: { opacity: 0 }, to: { opacity: 1 }, duration: 0.8, ease: 'power1.out', scrollEnabled: true, status: 'published', type: 'tween' },
          { id: 'dashboardCardAnim', selector: '.dash-card', from: { opacity: 0, scale: 0.9 }, to: { opacity: 1, scale: 1 }, duration: 0.6, ease: 'back.out(1.7)', stagger: 0.1, scrollEnabled: true, status: 'published', type: 'tween' }
        ],
        callbacks: []
      },
      about: {
        label: 'About',
        rules: [
          { id: 'aboutFadeUp', selector: '.fade-up', from: { opacity: 0, y: 50 }, to: { opacity: 1, y: 0 }, duration: 1, ease: 'power2.out', scrollEnabled: true, status: 'published', type: 'tween' },
          { id: 'aboutReveal', selector: '.content-reveal', from: { opacity: 0, clipPath: 'inset(0 100% 0 0)' }, to: { opacity: 1, clipPath: 'inset(0 0% 0 0)' }, duration: 1, ease: 'power2.out', scrollEnabled: true, status: 'published', type: 'tween' }
        ],
        callbacks: []
      },
      contact: {
        label: 'Contact',
        rules: [
          { id: 'contactFadeUp', selector: '.fade-up', from: { opacity: 0, y: 50 }, to: { opacity: 1, y: 0 }, duration: 1, ease: 'power2.out', scrollEnabled: true, status: 'published', type: 'tween' },
          { id: 'contactFormAnim', selector: '.contact-form-input', from: { opacity: 0, x: -30 }, to: { opacity: 1, x: 0 }, duration: 0.5, ease: 'power2.out', stagger: 0.1, scrollEnabled: false, status: 'published', type: 'tween' }
        ],
        callbacks: []
      },
      default: {
        label: 'Default',
        rules: [
          { id: 'defaultFadeUp', selector: '.fade-up', from: { opacity: 0, y: 50 }, to: { opacity: 1, y: 0 }, duration: 1, ease: 'power2.out', stagger: 0.1, scrollEnabled: true, status: 'published', type: 'tween' },
          { id: 'defaultFadeIn', selector: '.fade-in', from: { opacity: 0 }, to: { opacity: 1 }, duration: 0.8, ease: 'power1.out', scrollEnabled: true, status: 'published', type: 'tween' }
        ],
        callbacks: []
      }
    };
  }

  getConfig() {
    return this.config;
  }

  isLoaded() {
    return this.loaded;
  }
}