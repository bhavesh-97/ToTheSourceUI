import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { GsapConfig, GsapGlobal, GsapGlobalDefaults, GsapGlobalMeta, GsapPage, GsapRule } from '../CMS/main/gsap-master/gsap-interface';

function parseJson(val: any): Record<string, any> {
  if (!val) return {};
  if (typeof val === 'object') return val;
  try { return JSON.parse(String(val)); } catch { return {}; }
}

@Injectable({ providedIn: 'root' })
export class GsapConfigLoaderService {
  private configCache: Map<string, GsapConfig> = new Map();
  private http = inject(HttpClient);

  async load(configName: string = 'default'): Promise<GsapConfig> {
    if (this.configCache.has(configName)) {
      console.log('[GSAP Loader] Cache hit:', configName);
      return this.configCache.get(configName)!;
    }
    
    console.log('[GSAP Loader] Cache miss, loading from API:', configName);
    const result = await this.loadFromApi(configName);
    
    console.log('[GSAP Loader] Cache miss, loading from API: result', result);
    if (result) {
      this.configCache.set(configName, result);
      console.log('[GSAP Loader] Loaded & cached:', configName, '| Pages:', Object.keys(result?.pages || {}).join(', '));
      return result;
    }
    return this.getDefaultConfig();
  }

  getConfig(): GsapConfig | null {
    for (const config of this.configCache.values()) {
      return config;
    }
    return null;
  }

  isLoaded(): boolean {
    return this.configCache.size > 0;
  }

  clearCache(pageKey?: string): void {
    if (pageKey) {
      console.log('[GSAP Loader] Clearing cache for:', pageKey);
      this.configCache.delete(pageKey);
    } else {
      console.log('[GSAP Loader] Clearing all cache');
      this.configCache.clear();
    }
  }

  async loadFromApi(configName: string = 'default'): Promise<GsapConfig | null> {
    try {
      const apiUrl = `${environment.CMSUrl}/GsapConfig/name/${configName}`;
      const response = await firstValueFrom(this.http.get<any>(apiUrl));
      
      console.log('[GSAP Loader] Cache miss, loading from API response:', response);
      if (response && !response.isError && response.result) {
        return this.convertApiToGsapConfig(response.result);
      }
      return null;
    } catch (err) {
      console.error('Failed to load GSAP config from API:', err);
      return null;
    }
  }

  private convertApiToGsapConfig(apiResult: any): GsapConfig | null {
    if (!apiResult) return null;

    const globalData = apiResult.global || {};
    const defaults = globalData.defaults || {};

    const global: GsapGlobal = {
      defaults: {
        duration: Number(defaults.duration) || 1,
        ease: String(defaults.ease) || 'power2.out',
        stagger: Number(defaults.stagger) || 0.1,
        delay: Number(defaults.delay) || 0,
        repeat: Number(defaults.repeat) || 0,
        yoyo: Boolean(defaults.yoyo) || false,
        pageId: 0
      },
      registerPlugins: Array.isArray(globalData.registerPlugins) ? globalData.registerPlugins : [],
      autoInit: true,
      observeDom: true,
      meta: { version: '1.0', description: '' },
      version: 1,
      status: globalData.status || 'Active',
      pageId: ''
    };

    const pages: Record<string, GsapPage> = {};
    const pagesData = apiResult.pages || {};

    for (const [pageKey, pageData] of Object.entries(pagesData)) {
      const pd = pageData as any;
      pages[pageKey] = {
        label: pd.label || pageKey,
        rules: this.convertRules(pd.rules || []),
        callbacks: this.convertCallbacks(pd.callbacks || [])
      };
    }

    return { global, pages, plugins: [] };
  }

  private convertRules(apiRules: any[]): GsapRule[] {
    return (apiRules || []).map((r: any) => ({
      ruleId: Number(r.ruleid) || 0,
      label: r.label || '',
      selector: r.selector || '',
      from: parseJson(r.from),
      to: parseJson(r.to),
      duration: Number(r.duration) || 1,
      ease: String(r.ease) || 'power2.out',
      stagger: Number(r.stagger) || 0.1,
      delay: Number(r.delay) || 0,
      repeat: Number(r.repeat) || 0,
      yoyo: Boolean(r.yoyo) || false,
      paused: Boolean(r.paused) || false,
      scrollEnabled: Boolean(r.scrollEnabled) || false,
      status: String(r.status) === '1' ? 'Published' : (r.status || 'Published'),
      type: String(r.type) || 'tween',
      pageId: Number(r.pageId) || 0,
      styles: parseJson(r.styles),
      sortOrder: Number(r.sortOrder) || 0,
    }));
  }

  private convertCallbacks(apiCallbacks: any[]): any[] {
    return (apiCallbacks || []).map((c: any) => ({
      id: Number(c.callbackId) || 0,
      eventName: c.eventName || '',
      handlerName: c.handlerName || '',
      handlerCode: c.handlerCode || ''
    }));
  }

  getDefaultConfig(): GsapConfig {
    return {
      global: {
        defaults: { duration: 1, ease: 'power2.out', stagger: 0.1, pageId: 0, delay: 0, repeat: 0, yoyo: false },
        registerPlugins: ['ScrollTrigger'],
        autoInit: true, observeDom: true,
        meta: { version: '1.0', description: '' },
        version: 1, status: 'Active', pageId: ''
      },
      pages: {}, plugins: []
    };
  }

  getDefaultPages(): Record<string, GsapPage> {
    return {
      home: {
        label: 'Home',
        rules: [{
          ruleId: 0, selector: '.fade-up',
          from: { opacity: 0, y: 50 }, to: { opacity: 1, y: 0 },
          duration: 1, ease: 'power2.out', stagger: 0.1,
          scrollEnabled: true, status: 'Published', type: 'tween', pageId: 0
        }],
        callbacks: []
      }
    };
  }
}