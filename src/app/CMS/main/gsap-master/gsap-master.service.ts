// src/app/@core/services/gsap-master.service.ts
import { inject, Injectable, NgZone } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { TextPlugin } from 'gsap/TextPlugin';
import { CustomEase } from 'gsap/CustomEase';
import { Flip } from 'gsap/Flip';
import { delay, Observable, of, from, map } from 'rxjs';
import { HttpClient, HttpContext } from '@angular/common/http';
import { GsapConfigLoaderService } from '../../../services/gsap-config-loader.service';
import { environment } from '../../../../environments/environment';
import { GsapConfig, GsapPage, GsapRule, CssStyleValue, GsapCallback, MGsapPage, GsapAssetConfig } from './gsap-interface';
import { ENCRYPTION_CONTEXT } from '../../../interceptors/encryption-interceptor';
import { JsonResponseModel } from '../../../models/JsonResponseModel';

interface PreviewElement {
  element: HTMLElement;
  ruleLabel: string;
  selector: string;
  originalStyles: Record<string, string>;
}
@Injectable({ providedIn: 'root' })
export class GsapMasterService {
  private zone = inject(NgZone);
  private loader = inject(GsapConfigLoaderService);
  private previewElements: HTMLElement[] = [];
  private currentTimeline?: gsap.core.Timeline;
  private http = inject(HttpClient);
  private baseUrl = environment.CMSUrl;
  private activeTweens: gsap.core.Tween[] = [];
  private registeredPlugins: string[] = [];

  parseCssStyleValue(input: CssStyleValue): Record<string, string> {
    if (!input) return {};
    if (typeof input === 'object') return input;
    if (typeof input !== 'string') return {};

    const trimmed = input.trim();

    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (typeof parsed === 'object' && parsed !== null) return parsed as Record<string, string>;
      } catch (e) {}
    }

    const cssRules: Record<string, string> = {};
    const classMatch = trimmed.match(/\.([a-zA-Z_-][a-zA-Z0-9_-]*)\s*\{([^}]*)\}/);
    if (classMatch && classMatch[2]) {
      const declarations = classMatch[2].split(';').filter(d => d.trim());
      declarations.forEach(decl => {
        const [prop, val] = decl.split(':').map(s => s.trim());
        if (prop && val) {
          const camelProp = this.kebabToCamel(prop);
          cssRules[camelProp] = val;
        }
      });
      return cssRules;
    }

    const styleProps = trimmed.split(';').filter(s => s.trim());
    styleProps.forEach(style => {
      const [prop, val] = style.split(':').map(s => s.trim());
      if (prop && val) {
        const camelProp = this.kebabToCamel(prop);
        cssRules[camelProp] = val;
      }
    });

    return cssRules;
  }

  private kebabToCamel(str: string): string {
    return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
  }

  async getConfigsFromApi(configName: string = 'default'): Promise<GsapConfig> {
    return this.loader.load(configName);
  }

  getConfigs(projectCode: string): Observable<GsapConfig> {
    return from(this.getConfigsFromApi(projectCode)).pipe(
      map(config => config as GsapConfig),
      delay(100)
    );
  }
  
  getConfigForPage(pageId: string): Observable<GsapConfig | null> {
    return from(this.getConfigForPageAsync(pageId)).pipe(delay(50));
  }

  getConfigForPageFromCache(pageId: string): GsapConfig | null {
    const cachedConfig = this.loader.getConfig();
    const pages = cachedConfig?.pages;
    if (!pages || !pages[pageId]) return null;
    return {
      global: cachedConfig?.global || this.getDefaultGlobal(),
      plugins: cachedConfig?.plugins || this.getDefaultPlugin(),
      pages: { [pageId]: pages[pageId] },
      rules: pages[pageId].rules || [],
      callbacks: pages[pageId].callbacks || []
    };
  }

  getPagesFromCache(): Record<string, any> | null {
    return this.loader.getConfig()?.pages || null;
  }

async getConfigForPageAsync(pageId: string): Promise<GsapConfig | null> {
    const config = await this.loader.load(pageId);
    const pages = config?.pages || {};
    if (!pages[pageId]) return null;
    return {
      global: config.global || this.getDefaultGlobal(),
      plugins: config.plugins || this.getDefaultPlugin(),
      pages: { [pageId]: pages[pageId] },
      rules: pages[pageId].rules || [],
      callbacks: pages[pageId].callbacks || []
    };
  }
  
  //#region Default Configs
  
  getDefaultConfig(): GsapConfig {
    return this.loader.getDefaultConfig();
  }
  
  getConfig(pageId: string): GsapConfig {
    return this.getDefaultConfig();
  }
  
  private getDefaultGlobal(): any {
    return {
      defaults: { duration: 1, ease: 'power2.out' },
      registerPlugins: ['ScrollTrigger'],
      autoInit: true,
      meta: { version: '1.0', description: 'GSAP config' },
      version: 1,
      status: 'published'
    };
  }

  private getDefaultPlugin(): any {
    return {
      pluginId: 0,
      pageId: 0,
      pluginName: '',
      enabled: true
    };
  }
  //#region Asset Config Loading

  getAssetConfigs(): Observable<GsapAssetConfig[]> {
    return from(this.loadAssetConfigs());
  }

  private async loadAssetConfigs(): Promise<GsapAssetConfig[]> {
    const configs: GsapAssetConfig[] = [];
    const assetFiles = [
      { label: 'Landing GSAP Master Config', fileName: 'landing-gsap-master-config.json' },
      { label: 'Landing GSAP Config', fileName: 'landing-gsap-config.json' },
      { label: 'Landing Config', fileName: 'landing-config.json' },
      { label: 'Templates', fileName: 'templates.json' },
    ];

    for (const asset of assetFiles) {
      try {
        const res = await fetch(`assets/gsap/${asset.fileName}`);
        const data = await res.json();
        configs.push({ ...asset, config: data, description: data.description || data.name || '' });
      } catch (e) {
        console.warn(`Failed to load asset ${asset.fileName}:`, e);
      }
    }
    return configs;
  }

  importConfigFromAsset(assetConfig: any): GsapConfig {
    const config = assetConfig.config;

    if (config.gsap) {
      return this.normalizeGsapConfig(config.gsap, config);
    }

    if (config.global || config.pages) {
      return this.normalizeGsapConfig(config, config);
    }

    if (config.configName || config.pageId) {
      return this.normalizeFlatConfig(config);
    }

    return this.getDefaultConfig();
  }

  private normalizeGsapConfig(gsap: any, parent: any): GsapConfig {
    const defaults = gsap.global?.defaults || {};
    const pages = gsap.pages || {};
    const rules = gsap.rules || [];
    const allRules: GsapRule[] = [];
    const allCallbacks: GsapCallback[] = [];

    if (gsap.callbacks) {
      gsap.callbacks.forEach((cb: any) => {
        allCallbacks.push({
          name: cb.name || '',
          script: cb.script || '',
          eventName: cb.name || '',
          handlerName: cb.name || '',
          handlerCode: cb.script || ''
        });
      });
    }

    if (rules.length > 0) {
      rules.forEach((r: any) => {
        const rule = this.normalizeRule(r, defaults);
        allRules.push(rule);
        if (r.callbacks) {
          r.callbacks.forEach((cb: any) => {
            allCallbacks.push({
              callbackId: cb.callbackId || 0,
              ruleId: r.id || 0,
              eventName: cb.name || '',
              handlerName: cb.name || '',
              handlerCode: cb.script || '',
              name: cb.name || '',
              script: cb.script || ''
            });
          });
        }
      });
    }

    if (pages) {
      Object.keys(pages).forEach(pageKey => {
        const page = pages[pageKey];
        if (page.rules) {
          page.rules.forEach((r: any) => {
            const rule = this.normalizeRule(r, defaults);
            allRules.push(rule);
          });
        }
        if (page.callbacks) {
          page.callbacks.forEach((cb: any) => {
            allCallbacks.push({
              callbackId: cb.callbackId || 0,
              ruleId: 0,
              eventName: cb.name || '',
              handlerName: cb.name || '',
              handlerCode: cb.script || '',
              name: cb.name || '',
              script: cb.script || ''
            });
          });
        }
      });
    }

    const plugins: any[] = (gsap.global?.registerPlugins || []).map((name: string) => ({
      pluginId: 0,
      pageId: 0,
      pluginName: name,
      enabled: true
    }));

    return {
      global: {
        pageId: '',
        defaults: {
          defaultsId: 0,
          pageId: 0,
          duration: defaults.duration || 1,
          ease: defaults.ease || 'power2.out',
          stagger: defaults.stagger || 0,
          delay: defaults.delay || 0,
          repeat: defaults.repeat || 0,
          yoyo: defaults.yoyo || false
        },
        registerPlugins: gsap.global?.registerPlugins || ['ScrollTrigger'],
        autoInit: gsap.global?.autoInit ?? true,
        observeDom: true,
        meta: { version: gsap.version || '1.0', description: parent.description || '' }
      },
      plugins,
      pages: {},
      rules: allRules,
      callbacks: allCallbacks
    };
  }

  private normalizeFlatConfig(config: any): GsapConfig {
    const defaults = config.globalDefaults || {};
    const plugins = (config.plugins || []).map((p: any) => ({
      pluginId: p.pluginID || p.pluginId || 0,
      pageId: p.pageId || 0,
      plugid: p.plugid || 0,
      pluginName: p.pluginName || '',
      enabled: p.enabled ?? true
    }));

    const rules = (config.rules || []).map((r: any) => this.normalizeRule(r, defaults));

    return {
      global: {
        pageId: String(config.pageId || ''),
        defaults: {
          defaultsId: 0,
          pageId: config.pageId || 0,
          duration: defaults.duration || 1,
          ease: defaults.ease || 'power2.out',
          stagger: defaults.stagger || 0,
          delay: defaults.delay || 0,
          repeat: defaults.repeat || 0,
          yoyo: defaults.yoyo || false
        },
        registerPlugins: plugins.map((p: any) => p.pluginName || p.plugid).filter(Boolean),
        autoInit: true,
        observeDom: true,
        meta: { version: '1.0', description: '' }
      },
      plugins,
      pages: {},
      rules,
      callbacks: config.callbacks || []
    };
  }

  private normalizeRule(r: any, defaults?: any): GsapRule {
    const parseValue = (val: any): any => {
      if (!val) return val;
      if (typeof val === 'object') return val;
      if (typeof val === 'string') {
        if (val.startsWith('{') || val.startsWith('[')) {
          try {
            const parsed = JSON.parse(val.replace(/'/g, '"'));
            return parsed;
          } catch (e) {
            return val.replace(/['"]/g, '').trim();
          }
        }
        return val.replace(/['"]/g, '').trim();
      }
      return val;
    };

    const from = r.from ? parseValue(r.from) : undefined;
    const to = r.to ? parseValue(r.to) : undefined;
    const styles = r.styles ? parseValue(r.styles) : undefined;

    let scrollTrigger: any = undefined;
    if (r.scrollEnabled || r.scrollTrigger) {
      if (typeof r.scrollTrigger === 'object') {
        scrollTrigger = r.scrollTrigger;
      } else if (typeof r.scrollTrigger === 'string') {
        try {
          scrollTrigger = JSON.parse(r.scrollTrigger.replace(/'/g, '"'));
        } catch (e) {
          scrollTrigger = { trigger: r.selector, start: 'top 85%' };
        }
      } else {
        scrollTrigger = { trigger: r.selector, start: 'top 85%' };
      }
    }

    return {
      ruleId: r.ruleId || r.ruleid || 0,
      pageId: r.pageId || 0,
      ruleKey: r.ruleKey || r.id || '',
      label: r.label || '',
      selector: r.selector || '',
      from,
      to,
      styles,
      duration: r.duration ?? defaults?.duration ?? 1,
      ease: r.ease || defaults?.ease || 'power2.out',
      stagger: r.stagger ?? defaults?.stagger ?? 0,
      delay: r.delay ?? defaults?.delay ?? 0,
      repeat: r.repeat ?? defaults?.repeat ?? 0,
      yoyo: r.yoyo ?? defaults?.yoyo ?? false,
      paused: r.paused ?? false,
      scrollEnabled: r.scrollEnabled ?? !!r.scrollTrigger,
      status: r.status || 'Published',
      type: r.type || 'fromTo',
      sortOrder: r.sortOrder || 0,
      scrollTrigger,
      timelineSteps: r.timelineSteps || [],
      media: r.media || { type: 'none', url: '', id: '', selector: '' },
    };
  }

  //#endregion Asset Config Loading

  //#region Animation Controls
    
  runCode(code: string, container: HTMLElement) {
    this.killCurrent();
    this.createPreviewElements(container);

    // Safely eval code in zone (GSAP is DOM-safe)
    try {
      this.zone.runOutsideAngular(() => {
        const func = new Function('gsap', 'elements', code);
        func(gsap, this.previewElements);
      });
    } catch (error) {
      console.error('GSAP Code Error:', error);
    }
  }
  private createPreviewElements(container: HTMLElement, rules?: GsapRule[]) {
    container.innerHTML = '';
    this.previewElements = [];
    this.activeTweens.forEach(t => t.kill());
    this.activeTweens = [];

    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#a29bfe', '#fd79a8'];
    const shapes = ['border-radius: 8px;', 'border-radius: 50%;', 'border-radius: 0;', 'clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);'];

    if (!rules || rules.length === 0) {
      rules = [{
        selector: '.gsap-box',
        label: 'Default Box',
        type: 'fromTo',
        duration: 1,
        ease: 'power2.out',
        from: { opacity: 0, y: 30 },
        to: { opacity: 1, y: 0 },
        status: 'published'
      }];
    }

    rules.forEach((rule, index) => {
      if (rule.status !== 'published') return;
      if (!rule.selector || rule.selector.trim() === '') return;

      const colorIndex = index % colors.length;
      const shapeIndex = index % shapes.length;
      const element = document.createElement('div');
      const baseStyles: Record<string, string> = {
        'position': 'absolute',
        'width': '80px',
        'height': '80px',
        'background-color': colors[colorIndex],
        'display': 'flex',
        'align-items': 'center',
        'justify-content': 'center',
        'color': '#fff',
        'font-weight': 'bold',
        'font-size': '12px',
        'box-shadow': '0 4px 12px rgba(0,0,0,0.15)',
        'left': `${30 + (index % 4) * 100}px`,
        'top': `${30 + Math.floor(index / 4) * 110}px`,
        'transition': 'transform 0.2s ease',
        'cursor': 'pointer',
        'z-index': '1',
        ...this.parseCssStyleValue(rule.styles as CssStyleValue)
      };

      element.className = `preview-element preview-element-${index}`;
      element.setAttribute('data-rule-index', String(index));
      element.setAttribute('data-rule-label', rule.label || `Rule ${index + 1}`);
      element.setAttribute('title', `Selector: ${rule.selector}\nType: ${rule.type}\nDuration: ${rule.duration}s`);

      Object.entries(baseStyles).forEach(([prop, value]) => {
        try { element.style.setProperty(prop, value); } catch {}
      });

      if (shapes[shapeIndex]) {
        const [prop, val] = shapes[shapeIndex].split(':').map(s => s.trim());
        try { element.style.setProperty(prop, val); } catch {}
      }

      const labelSpan = document.createElement('span');
      labelSpan.textContent = rule.label?.substring(0, 8) || String(index + 1);
      labelSpan.style.pointerEvents = 'none';
      element.appendChild(labelSpan);

      container.appendChild(element);
      this.previewElements.push(element);
    });

    if (this.previewElements.length === 0) {
      container.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #999;">
          <div style="font-size: 48px; margin-bottom: 16px;">🎬</div>
          <div style="font-size: 16px; font-weight: 500;">No Rules to Preview</div>
          <div style="font-size: 13px; margin-top: 8px;">Add rules with valid selectors to see the animation preview</div>
        </div>
      `;
    }
  }

  killCurrent() {
    this.activeTweens.forEach(t => t.kill());
    this.activeTweens = [];
    this.currentTimeline?.kill();
    this.previewElements.forEach(el => {
      if (el.parentNode) el.parentNode.removeChild(el);
    });
    this.previewElements = [];
  }

  private applyStylesToElement(el: HTMLElement, styles: Record<string, string>): void {
    if (!styles || Object.keys(styles).length === 0) return;
    Object.entries(styles).forEach(([prop, value]) => {
      try {
        el.style.setProperty(prop, value);
      } catch (e) {}
    });
  }

  createInteractiveElements(container: HTMLElement, rules: GsapRule[]) {
    container.innerHTML = `
      <div class="preview-toolbar" style="display: flex; gap: 8px; padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0; flex-wrap: wrap;">
        <button class="preview-btn" data-action="play" style="padding: 8px 16px; border: none; border-radius: 6px; background: #fff; color: #667eea; cursor: pointer; font-weight: 600; transition: all 0.2s;">▶ Play</button>
        <button class="preview-btn" data-action="replay" style="padding: 8px 16px; border: none; border-radius: 6px; background: #fff; color: #764ba2; cursor: pointer; font-weight: 600; transition: all 0.2s;">↻ Replay</button>
        <button class="preview-btn" data-action="pause" style="padding: 8px 16px; border: none; border-radius: 6px; background: #fff; color: #e74c3c; cursor: pointer; font-weight: 600; transition: all 0.2s;">⏸ Pause</button>
        <button class="preview-btn" data-action="reverse" style="padding: 8px 16px; border: none; border-radius: 6px; background: #fff; color: #3498db; cursor: pointer; font-weight: 600; transition: all 0.2s;">⏪ Reverse</button>
        <button class="preview-btn" data-action="stagger" style="padding: 8px 16px; border: none; border-radius: 6px; background: #fff; color: #27ae60; cursor: pointer; font-weight: 600; transition: all 0.2s;">✨ Stagger</button>
      </div>
      <div class="preview-content" style="padding: 20px; background: #f8f9fa; min-height: 300px; position: relative; display: flex; flex-wrap: wrap; gap: 20px; align-items: flex-start; align-content: flex-start;"></div>
    `;

    const content = container.querySelector('.preview-content') as HTMLElement;
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#a29bfe', '#fd79a8', '#00b894', '#e17055'];

    rules.forEach((rule, index) => {
      if (rule.status !== 'published') return;

      const element = document.createElement('div');
      element.className = `preview-rule-element rule-${index}`;
      element.setAttribute('data-rule-index', String(index));
      element.setAttribute('title', `${rule.label || 'Rule'}\n${rule.selector}\nDuration: ${rule.duration}s`);

      const baseStyles: Record<string, string> = {
        'width': '100px',
        'height': '100px',
        'background-color': colors[index % colors.length],
        'border-radius': '12px',
        'display': 'flex',
        'align-items': 'center',
        'justify-content': 'center',
        'color': '#fff',
        'font-weight': 'bold',
        'font-size': '11px',
        'text-align': 'center',
        'word-break': 'break-word',
        'padding': '8px',
        'box-shadow': '0 4px 15px rgba(0,0,0,0.2)',
        'cursor': 'pointer',
        'transition': 'transform 0.3s ease, box-shadow 0.3s ease'
      };

      if (rule.styles && typeof rule.styles === 'object') {
        Object.assign(baseStyles, this.parseCssStyleValue(rule.styles as CssStyleValue));
      }

      Object.entries(baseStyles).forEach(([prop, value]) => {
        try { element.style.setProperty(prop, value); } catch {}
      });

      const label = document.createElement('span');
      label.innerHTML = `<strong>${rule.label || 'Rule'}</strong><br><small>${rule.type}</small>`;
      label.style.pointerEvents = 'none';
      element.appendChild(label);

      element.addEventListener('mouseenter', () => {
        element.style.transform = 'scale(1.1)';
        element.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
      });
      element.addEventListener('mouseleave', () => {
        element.style.transform = 'scale(1)';
        element.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
      });

      content.appendChild(element);
      this.previewElements.push(element);
    });

    container.querySelectorAll('.preview-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action');
        this.handlePreviewAction(action || 'play');
      });
    });

    if (this.previewElements.length === 0) {
      content.innerHTML = `
        <div style="width: 100%; text-align: center; padding: 40px; color: #999;">
          <div style="font-size: 48px; margin-bottom: 12px;">📋</div>
          <div style="font-size: 16px;">No published rules to preview</div>
          <div style="font-size: 13px; margin-top: 8px; color: #777;">Create rules and set status to "Published" to see them here</div>
        </div>
      `;
    }
  }

  private handlePreviewAction(action: string) {
    switch (action) {
      case 'play':
        this.playAnimation();
        break;
      case 'replay':
        this.activeTweens.forEach(t => t.restart());
        break;
      case 'pause':
        this.pauseAnimation();
        break;
      case 'reverse':
        this.activeTweens.forEach(t => t.reverse());
        break;
      case 'stagger':
        this.activeTweens.forEach(t => {
          if (t.vars && t.vars.stagger) {
            t.restart();
          }
        });
        break;
    }
  }

  applyAnimations(config: GsapConfig, container: HTMLElement) {
    this.zone.runOutsideAngular(() => {
      this.activeTweens.forEach(t => t.kill());
      this.activeTweens = [];

      this.previewElements.forEach(el => {
        if (el.parentNode) el.parentNode.removeChild(el);
      });
      this.previewElements = [];

      const toolbar = container.querySelector('.preview-toolbar');
      const content = container.querySelector('.preview-content');
      const header = container.querySelector('.preview-header');
      if (toolbar) toolbar.remove();
      if (content) content.remove();
      if (header) header.remove();

      const globalDefaults = config.global?.defaults;
      const plugins = config.global?.registerPlugins || [];
      const callbacks = config.callbacks || [];

      this.registerPlugins(plugins);

      this.setGlobalDefaults(globalDefaults);

      const hasRules = config.rules && config.rules.length > 0 && config.rules.some(r => r.status === 'published');

      if (!hasRules) {
        const containerHtml = this.createEmptyStateHtml(plugins, globalDefaults);
        container.innerHTML = containerHtml;
        return;
      }

      this.createInteractiveElements(container, config.rules || []);

      const timeline = gsap.timeline();

      if (config.rules) {
        config.rules.forEach((rule: GsapRule, index: number) => {
          if (rule.status !== 'published') return;

          const el = container.querySelector(`.rule-${index}`) as HTMLElement;
          if (!el) return;

          const tween = this.createTweenFromRule(rule, el, globalDefaults, plugins);
          if (tween) {
            timeline.add(tween);
            this.activeTweens.push(tween);
          }

          this.attachRuleCallbacks(tween, callbacks, rule, index);
        });
      }

      const headerHtml = this.createHeaderHtml(plugins, config.rules?.length || 0, globalDefaults);
      container.insertAdjacentHTML('afterbegin', headerHtml);
    });
  }

  private registerPlugins(plugins: string[]) {
    plugins.forEach((pluginName: string) => {
      const pluginLower = pluginName.toLowerCase().replace(/\s+/g, '');
      if (this.registeredPlugins.includes(pluginLower)) return;

      try {
        switch (pluginLower) {
          case 'scrolltrigger':
            gsap.registerPlugin(ScrollTrigger);
            this.registeredPlugins.push('scrolltrigger');
            break;
          case 'draggable':
            gsap.registerPlugin(Draggable);
            this.registeredPlugins.push('draggable');
            break;
          case 'scrolltoplugin':
            gsap.registerPlugin(ScrollToPlugin);
            this.registeredPlugins.push('scrolltoplugin');
            break;
          case 'textplugin':
            gsap.registerPlugin(TextPlugin);
            this.registeredPlugins.push('textplugin');
            break;
          case 'customease':
            gsap.registerPlugin(CustomEase);
            this.registeredPlugins.push('customease');
            break;
          case 'flip':
            gsap.registerPlugin(Flip);
            this.registeredPlugins.push('flip');
            break;
          case 'motionpathplugin':
            try {
              const MotionPathPlugin = (gsap as any).MotionPathPlugin;
              if (MotionPathPlugin) gsap.registerPlugin(MotionPathPlugin);
              this.registeredPlugins.push('motionpathplugin');
            } catch (e) { console.warn('MotionPathPlugin not available:', e); }
            break;
          case 'morphsvgplugin':
            try {
              const MorphSVGPlugin = (gsap as any).MorphSVGPlugin;
              if (MorphSVGPlugin) gsap.registerPlugin(MorphSVGPlugin);
              this.registeredPlugins.push('morphsvgplugin');
            } catch (e) { console.warn('MorphSVGPlugin not available:', e); }
            break;
          case 'drawsvgplugin':
            try {
              const DrawSVGPlugin = (gsap as any).DrawSVGPlugin;
              if (DrawSVGPlugin) gsap.registerPlugin(DrawSVGPlugin);
              this.registeredPlugins.push('drawsvgplugin');
            } catch (e) { console.warn('DrawSVGPlugin not available:', e); }
            break;
          case 'splittext':
            try {
              const SplitText = (gsap as any).SplitText;
              if (SplitText) this.registeredPlugins.push('splittext');
            } catch (e) { console.warn('SplitText not available:', e); }
            break;
          case 'inertiaplugin':
            try {
              const InertiaPlugin = (gsap as any).InertiaPlugin;
              if (InertiaPlugin) gsap.registerPlugin(InertiaPlugin);
              this.registeredPlugins.push('inertiaplugin');
            } catch (e) { console.warn('InertiaPlugin not available:', e); }
            break;
          case 'cssruleplugin':
            try {
              const CSSRulePlugin = (gsap as any).CSSRulePlugin;
              if (CSSRulePlugin) gsap.registerPlugin(CSSRulePlugin);
              this.registeredPlugins.push('cssruleplugin');
            } catch (e) { console.warn('CSSRulePlugin not available:', e); }
            break;
          case 'observer':
            try {
              const Observer = (gsap as any).Observer;
              if (Observer) gsap.registerPlugin(Observer);
              this.registeredPlugins.push('observer');
            } catch (e) { console.warn('Observer not available:', e); }
            break;
          case 'physics2dplugin':
          case 'physicspropsplugin':
          case 'scrambletextplugin':
          case 'easelplugin':
          case 'pixiplugin':
          case 'gsdevtools':
            try {
              const PluginCtr = (gsap as any)[pluginName];
              if (PluginCtr) gsap.registerPlugin(PluginCtr);
              this.registeredPlugins.push(pluginLower);
            } catch (e) { console.warn(`${pluginName} not available:`, e); }
            break;
          default:
            try {
              const PluginCtr = (gsap as any)[pluginName];
              if (PluginCtr) gsap.registerPlugin(PluginCtr);
              this.registeredPlugins.push(pluginLower);
            } catch (e) { console.warn(`Plugin ${pluginName} not available:`, e); }
        }
      } catch (e) {
        console.warn(`Plugin ${pluginName} not available:`, e);
      }
    });
  }

  private setGlobalDefaults(defaults?: any) {
    if (!defaults) return;

    const gsapDefaults: any = {};
    if (defaults.duration !== undefined) gsapDefaults.duration = defaults.duration;
    if (defaults.ease) gsapDefaults.ease = defaults.ease;
    if (defaults.stagger !== undefined) gsapDefaults.stagger = defaults.stagger;
    if (defaults.delay !== undefined) gsapDefaults.delay = defaults.delay;
    if (defaults.repeat !== undefined) gsapDefaults.repeat = defaults.repeat;
    if (defaults.yoyo !== undefined) gsapDefaults.yoyo = defaults.yoyo;

    if (Object.keys(gsapDefaults).length > 0) {
      gsap.defaults(gsapDefaults);
    }
  }

  private buildScrollTriggerVars(rule: GsapRule, el: HTMLElement, plugins: string[]): any {
    const hasScrollTrigger = plugins.some(p =>
      p.toLowerCase().replace(/\s+/g, '') === 'scrolltrigger'
    );
    if (!hasScrollTrigger) return null;

    if (rule.scrollTrigger && typeof rule.scrollTrigger === 'object' && Object.keys(rule.scrollTrigger).length > 0) {
      const st = rule.scrollTrigger as any;
      return {
        trigger: st.trigger || el,
        start: st.start || 'top 85%',
        end: st.end || 'bottom 20%',
        scrub: st.scrub ?? false,
        pin: st.pin ?? false,
        markers: st.markers ?? false,
        toggleActions: st.toggleActions || 'play none none reverse',
        once: st.once ?? false,
        pinSpacing: st.pinSpacing ?? true,
        anticipatePin: st.anticipatePin ?? 0,
        fastScrollEnd: st.fastScrollEnd ?? false,
        horizontal: st.horizontal ?? false,
        invalidateOnRefresh: st.invalidateOnRefresh ?? false,
        ...(st.onEnter ? { onEnter: st.onEnter } : {}),
        ...(st.onLeave ? { onLeave: st.onLeave } : {}),
        ...(st.onEnterBack ? { onEnterBack: st.onEnterBack } : {}),
        ...(st.onLeaveBack ? { onLeaveBack: st.onLeaveBack } : {}),
        ...(st.snap !== undefined ? { snap: st.snap } : {}),
      };
    }

    if (rule.scrollEnabled) {
      return {
        trigger: el,
        start: 'top 85%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
        markers: false
      };
    }

    return null;
  }

  private createTweenFromRule(rule: GsapRule, el: HTMLElement, globalDefaults?: any, plugins: string[] = []): any {
    const parsedFrom = this.parseCssStyleValue(rule.from as CssStyleValue);
    const parsedTo = this.parseCssStyleValue(rule.to as CssStyleValue);
    const parsedStyles = this.parseCssStyleValue(rule.styles as CssStyleValue);

    const fromHasValues = parsedFrom && typeof parsedFrom === 'object' && Object.keys(parsedFrom).length > 0;
    const toHasValues = parsedTo && typeof parsedTo === 'object' && Object.keys(parsedTo).length > 0;

    const defaultDuration = globalDefaults?.duration || 1;
    const defaultEase = globalDefaults?.ease || 'power2.out';

    if (Object.keys(parsedStyles).length > 0) {
      this.applyStylesToElement(el, parsedStyles);
    }

    const pluginLower = (p: string) => p.toLowerCase().replace(/\s+/g, '');

    const ruleType = (rule.type || 'fromTo').toLowerCase();
    const duration = rule.duration !== undefined && rule.duration !== null ? rule.duration : defaultDuration;
    const ease = rule.ease || defaultEase;
    const stagger = rule.stagger !== undefined && rule.stagger !== null ? rule.stagger : (globalDefaults?.stagger || 0);
    const delay = rule.delay !== undefined ? rule.delay : (globalDefaults?.delay || 0);
    const repeat = rule.repeat !== undefined ? rule.repeat : (globalDefaults?.repeat || 0);
    const yoyo = rule.yoyo !== undefined ? rule.yoyo : (globalDefaults?.yoyo || false);
    const repeatDelay = rule.repeatDelay ?? undefined;
    const yoyoEase = rule.yoyoEase ?? undefined;

    const vars: any = {
      duration,
      ease,
      delay: Number(delay) || 0,
      repeat: Number(repeat) || 0,
      yoyo: Boolean(yoyo) || undefined,
      paused: Boolean(rule.paused) || undefined,
      immediateRender: rule.immediateRender ?? undefined,
      lazy: rule.lazy ?? undefined,
      overwrite: rule.overwrite ?? undefined,
    };

    if (repeat > 0 && repeatDelay) vars.repeatDelay = repeatDelay;
    if (yoyo && yoyoEase) vars.yoyoEase = yoyoEase;
    if (stagger > 0) vars.stagger = stagger;

    const scrollTriggerVars = this.buildScrollTriggerVars(rule, el, plugins);
    if (scrollTriggerVars) vars.scrollTrigger = scrollTriggerVars;

    let tween: gsap.core.Tween | gsap.core.Timeline;

    switch (ruleType) {
      case 'to':
        const toValues = toHasValues ? parsedTo : { opacity: 1, y: 0, scale: 1 };
        tween = gsap.to(el, { ...vars, ...toValues });
        break;

      case 'from':
        const fromValues = fromHasValues ? parsedFrom : { opacity: 0, y: 30, scale: 0.8 };
        tween = gsap.from(el, { ...vars, ...fromValues });
        break;

      case 'set':
        const setValues = toHasValues ? parsedTo : {};
        tween = gsap.set(el, setValues);
        break;

      case 'timeline':
        if (rule.timelineSteps && rule.timelineSteps.length > 0) {
          const timelineVars: any = {
            delay: vars.delay || 0,
            repeat: vars.repeat || 0,
            yoyo: vars.yoyo || false,
            paused: vars.paused || false,
            ...(scrollTriggerVars ? { scrollTrigger: scrollTriggerVars } : {})
          };
          if (repeatDelay) timelineVars.repeatDelay = repeatDelay;
          const tl = gsap.timeline(timelineVars);
          let totalTime = 0;
          rule.timelineSteps.forEach((step) => {
            const stepFrom = this.parseCssStyleValue(step.from as CssStyleValue);
            const stepTo = this.parseCssStyleValue(step.to as CssStyleValue);
            const stepDuration = step.duration || 1;
            const stepEase = step.ease || defaultEase;
            const stepDelay = step.delay || 0;

            const stepVars: any = { duration: stepDuration, ease: stepEase, delay: stepDelay };
            if (Object.keys(stepFrom).length > 0) stepVars.from = stepFrom;
            if (Object.keys(stepTo).length > 0) {
              tl.to(el, { ...stepTo, ...stepVars }, totalTime);
            } else if (Object.keys(stepFrom).length > 0) {
              tl.from(el, stepVars, totalTime);
            }
            totalTime += stepDelay + stepDuration;
          });
          return tl as any;
        } else {
          const fromVal = fromHasValues ? parsedFrom : { opacity: 0, y: 30, scale: 0.8 };
          const toVal = toHasValues ? parsedTo : { opacity: 1, y: 0, scale: 1 };
          tween = gsap.fromTo(el, fromVal, { ...vars, ...toVal });
        }
        break;

      case 'keyframes':
        if (toHasValues && Array.isArray(parsedTo)) {
          vars.keyframes = parsedTo;
          tween = gsap.to(el, vars);
        } else {
          const fromVal = fromHasValues ? parsedFrom : { opacity: 0, y: 30, scale: 0.8 };
          const toVal = toHasValues ? parsedTo : { opacity: 1, y: 0, scale: 1 };
          tween = gsap.fromTo(el, fromVal, { ...vars, ...toVal });
        }
        break;

      default:
        const fromVal = fromHasValues ? parsedFrom : { opacity: 0, y: 30, scale: 0.8 };
        const toVal = toHasValues ? parsedTo : { opacity: 1, y: 0, scale: 1 };
        tween = gsap.fromTo(el, fromVal, { ...vars, ...toVal });
    }

    const tooltipText = `Rule: ${rule.label || 'Untitled'}\nType: ${ruleType}\nDuration: ${duration}s\nEase: ${ease}\nStagger: ${typeof stagger === 'number' ? stagger + 's' : JSON.stringify(stagger)}\nDelay: ${delay}s`;
    el.setAttribute('title', tooltipText);

    return tween;
  }

  private attachRuleCallbacks(tween: gsap.core.Tween | null, allCallbacks: GsapCallback[], rule: GsapRule, ruleIndex: number) {
    if (!tween) return;

    const ruleCallbacks = allCallbacks.filter(cb =>
      cb.ruleId === rule.ruleId || cb.ruleId === ruleIndex
    );

    ruleCallbacks.forEach(cb => {
      const eventName = (cb.eventName || cb.name || '').toLowerCase();
      const handlerCode = cb.handlerCode || cb.script || '';

      if (handlerCode) {
        try {
          const handler = new Function('tween', 'element', handlerCode);
          switch (eventName) {
            case 'onstart':
            case 'on start':
              tween.eventCallback('onStart', () => handler(tween, tween.targets()[0]));
              break;
            case 'onupdate':
            case 'on update':
              tween.eventCallback('onUpdate', () => handler(tween, tween.targets()[0]));
              break;
            case 'oncomplete':
            case 'on complete':
              tween.eventCallback('onComplete', () => handler(tween, tween.targets()[0]));
              break;
            case 'onrepeat':
            case 'on repeat':
              tween.eventCallback('onRepeat', () => handler(tween, tween.targets()[0]));
              break;
            case 'onreversecomplete':
            case 'on reverse complete':
              tween.eventCallback('onReverseComplete', () => handler(tween, tween.targets()[0]));
              break;
          }
        } catch (e) {
          console.warn(`Failed to attach callback ${eventName}:`, e);
        }
      }
    });
  }

  private createEmptyStateHtml(plugins: string[], globalDefaults?: any): string {
    return `
      <div class="preview-header" style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); flex-wrap: wrap; gap: 8px;">
        <div class="preview-badges">
          ${plugins.length > 0 ? plugins.map(p => `<span class="badge bg-light text-dark me-1">${p}</span>`).join('') : '<span class="badge bg-warning text-dark">No Plugins</span>'}
        </div>
        <div style="color: white; font-size: 12px;">
          Defaults: duration=${globalDefaults?.duration || 1}, ease=${globalDefaults?.ease || 'power2.out'}, stagger=${globalDefaults?.stagger || 0.1}
        </div>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: calc(100% - 50px); color: #999;">
        <div style="font-size: 48px; margin-bottom: 16px;">🎬</div>
        <div style="font-size: 16px; font-weight: 500;">No Rules to Preview</div>
        <div style="font-size: 13px; margin-top: 8px;">Add rules with valid selectors to see the animation preview</div>
      </div>
    `;
  }

  private createHeaderHtml(plugins: string[], ruleCount: number, globalDefaults?: any): string {
    return `
      <div class="preview-header" style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); flex-wrap: wrap; gap: 8px;">
        <div class="preview-badges">
          ${plugins.length > 0 ? plugins.map(p => `<span class="badge bg-light text-dark me-1">${p}</span>`).join('') : '<span class="badge bg-warning text-dark">No Plugins</span>'}
          <span class="badge bg-info text-white ms-2">${ruleCount} Rule(s)</span>
        </div>
        <div style="color: white; font-size: 12px;">
          <span>Default: ${globalDefaults?.duration || 1}s | ${globalDefaults?.ease || 'power2.out'} | ${globalDefaults?.stagger || 0.1}s stagger</span>
        </div>
      </div>
    `;
  }

  pauseAnimation() {
    this.activeTweens.forEach(t => t.pause());
    gsap.globalTimeline.pause();
  }

  playAnimation() {
    this.activeTweens.forEach(t => t.play());
    gsap.globalTimeline.play();
  }

  autoRefreshPreview(config: GsapConfig, container: HTMLElement) {
    this.zone.runOutsideAngular(() => {
      this.activeTweens.forEach(t => t.kill());
      this.activeTweens = [];

      const elements = container.querySelectorAll('.preview-rule-element');
      if (!elements.length) {
        this.applyAnimations(config, container);
        return;
      }

      if (config.rules) {
        config.rules.forEach((rule: GsapRule, index: number) => {
          if (rule.status !== 'published') return;

          const el = container.querySelector(`.rule-${index}`) as HTMLElement;
          if (!el) return;

          gsap.set(el, { clearProps: 'all' });

          const parsedFrom = this.parseCssStyleValue(rule.from as CssStyleValue);
          const parsedTo = this.parseCssStyleValue(rule.to as CssStyleValue);

          const from = Object.keys(parsedFrom).length > 0 ? parsedFrom : { opacity: 0, y: 30, scale: 0.8 };
          const to = Object.keys(parsedTo).length > 0 ? parsedTo : { opacity: 1, y: 0, scale: 1 };

          const tween = gsap.fromTo(el, from, {
            ...to,
            duration: rule.duration || 1,
            ease: rule.ease || 'power2.out',
            delay: rule.delay || 0
          });
          this.activeTweens.push(tween);
        });
      }
    });
  }
  //#endregion Animation Controls
  
  //#region GSAP API 
 GetAllConfigs(encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(
      `${this.baseUrl}/GsapConfig/GetAllConfig`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  GetConfigById(configId: string, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(
      `${this.baseUrl}/GsapConfig/${configId}`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  GetConfigByName(configName: string, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(
      `${this.baseUrl}/GsapConfig/name/${configName}`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  GetPage(pageId: string, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(
      `${this.baseUrl}/GsapConfig/page/${pageId}`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  GetRule(ruleId: string, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(
      `${this.baseUrl}/GsapConfig/rule/${ruleId}`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }
  GetPluginsByPageId(pageId: string, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(
      `${this.baseUrl}/GsapConfig/plugins/${pageId}`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  GetRulesByPageId(pageId: string, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(
      `${this.baseUrl}/GsapConfig/GetRulesbyPageId/${pageId}`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  GetCallbacksByPageId(pageId: string, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(
      `${this.baseUrl}/GsapConfig/callbacks/${pageId}`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  GetGlobalDefaultsByPageId(pageId: string, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(
      `${this.baseUrl}/GsapConfig/globaldefaults/${pageId}`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  SaveGlobalDefaults(globalDefaults: any, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.post<JsonResponseModel>(
      `${this.baseUrl}/GsapConfig/globaldefaults`,
      globalDefaults,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  SaveConfig(config: any, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.put<JsonResponseModel>(
      `${this.baseUrl}/GsapConfig`,
      config,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  SavePage(page: any, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.post<JsonResponseModel>(
      `${this.baseUrl}/GsapConfig/SavePage`,
      page,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  SaveRule(rule: any, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.put<JsonResponseModel>(
      `${this.baseUrl}/GsapConfig/rule`,
      rule,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  DeleteRule(ruleId: string, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.delete<JsonResponseModel>(
      `${this.baseUrl}/GsapConfig/rule/${ruleId}`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  SavePlugins(pageId: string, pluginIds: string[], encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.post<JsonResponseModel>(
      `${this.baseUrl}/GsapConfig/plugins`,
      { pageId, pluginIds },
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  DeletePage(pageId: any, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.post<JsonResponseModel>(
      `${this.baseUrl}/GsapConfig/DeletePage/${pageId}`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  SaveCallback(callback: any, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.post<JsonResponseModel>(
      `${this.baseUrl}/GsapConfig/callback`,
      callback,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

// Mock save
  saveConfig(projectCode: string, config: GsapConfig): Observable<any> {
    return of({ success: true });
  }

  SaveGsapConfig(config: any, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.post<JsonResponseModel>(
      `${this.baseUrl}/GsapConfig/SaveConfig`,
      config,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }
  //#endregion GSAP API 
   
}