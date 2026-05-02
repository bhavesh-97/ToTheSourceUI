import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { GsapConfig, GsapGlobal, GsapGlobalDefaults, GsapGlobalMeta, GsapPage, GsapRule } from '../CMS/main/gsap-master/gsap-interface';

@Injectable({ providedIn: 'root' })
export class GsapConfigLoaderService {
  private config: GsapConfig | null = null;
  private http = inject(HttpClient);

  async load(configName: string = 'default'): Promise<GsapConfig> {
    if (this.config) return this.config;
    return this.loadFromApi(configName);
  }

  async loadFromApi(configName: string = 'default'): Promise<GsapConfig> {
    try {
      const apiUrl = `${environment.CMSUrl}/GsapConfig/name/${configName}`;
      const response = await firstValueFrom(this.http.get<any>(apiUrl));
      
      if (response && !response.isError && response.result) {
        return this.convertApiToGsapConfig(response.result);
      }
      return this.getDefaultConfig();
    } catch (err) {
      console.error('Failed to load GSAP config from API:', err);
      return this.getDefaultConfig();
    }
  }

  async getPagesFromApi(configName: string = 'default'): Promise<Record<string, GsapPage>> {
    try {
      const apiUrl = `${environment.CMSUrl}/GsapConfig/name/${configName}`;
      const response = await firstValueFrom(this.http.get<any>(apiUrl));
      
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
    const defaults: GsapGlobalDefaults = {
      duration: apiConfig.defaults?.duration || 1,
      ease: apiConfig.defaults?.ease || 'power2.out',
      stagger: apiConfig.defaults?.stagger,
      delay: apiConfig.defaults?.delay,
      repeat: apiConfig.defaults?.repeat,
      yoyo: apiConfig.defaults?.yoyo,
      pageId: 0
    };

    const meta: GsapGlobalMeta = {
      version: apiConfig.config?.version || '1.0',
      description: apiConfig.config?.description || ''
    };

    const global: GsapGlobal = {
      defaults,
      registerPlugins: apiConfig.plugins?.map((p: any) => p.pluginName || p.PluginName) || ['ScrollTrigger'],
      autoInit: true,
      observeDom: true,
      meta,
      version: 1,
      status: apiConfig.config?.status || 'Active',
      pageId: ''
    };

    const pages: Record<string, GsapPage> = {};
    if (apiConfig.pages) {
      for (const pageData of apiConfig.pages) {
        const pageKey = pageData.page?.pageKey || pageData.pageKey;
        if (pageKey) {
          pages[pageKey] = {
            label: pageData.page?.label || pageKey,
            rules: this.convertRules(pageData.rules || []),
            callbacks: []
          };
        }
      }
    }

    return { global, pages };
  }

  private convertRules(apiRules: any[]): GsapRule[] {
    return (apiRules || []).map((r: any) => ({
      ruleId: r.ruleId || r.id || r.ruleKey || r.RuleKey || `rule-${Math.random()}`,
      label: r.label || r.Label || '',
      selector: r.selector || r.Selector || '',
      from: this.convertFromTo(r.from || r.From),
      to: this.convertFromTo(r.to || r.To),
      duration: r.duration || r.Duration || 1,
      ease: r.ease || r.Ease || 'power2.out',
      stagger: r.stagger || r.Stagger,
      scrollEnabled: r.scrollEnabled || r.ScrollEnabled || false,
      status: r.status || r.Status || 'Published',
      type: r.type || r.Type || 'tween',
      pageId: r.pageId || r.PageId || ''
    }));
  }

  private convertFromTo(from: any): Record<string, any> {
    return from || {};
  }

  getDefaultConfig(): GsapConfig {
    return {
      global: {
        defaults: {
          duration: 1, ease: 'power2.out', stagger: 0.1,
          pageId: 0
        },
        registerPlugins: ['ScrollTrigger'],
        autoInit: true,
        observeDom: true,
        meta: { version: '1.0', description: 'Default GSAP configuration' },
        version: 1,
        status: 'Active',
        pageId: ''
      },
      pages: this.getDefaultPages()
    };
  }

  getDefaultPages(): Record<string, GsapPage> {
    return {
      home: {
        label: 'Home',
        rules: [
          {
            ruleId: 0, 
            selector: '.fade-up', 
            from: { opacity: 0, y: 50 }, 
            to: { opacity: 1, y: 0 }, 
            duration: 1, 
            ease: 'power2.out', 
            stagger: 0.1, 
            scrollEnabled: true, 
            status: 'Published', 
            type: 'tween',
            pageId: 0
          }
        ],
        callbacks: []
      }
    };
  }

  getConfig() {
    return this.config;
  }

  isLoaded() {
    return this.config !== null;
  }
}