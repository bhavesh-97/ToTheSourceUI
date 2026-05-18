import { Injectable, signal } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { GsapRule, CssStyleValue } from '../../CMS/main/gsap-master/gsap-interface';

@Injectable({
  providedIn: 'root'
})
export class WebGsapService {
  private currentPage = signal<string>('');
  private configLoaded = signal<boolean>(false);
  private configName = 'default';

  constructor(private http: HttpClient) {
    this.init();
  }

  async init() {
    gsap.registerPlugin(ScrollTrigger);
  }

  async loadPageAnimations(pageKey: string): Promise<GsapRule[]> {
    try {
      const apiUrl = `${environment.CMSUrl}/GsapConfig/name/${this.configName}`;
      const response = await firstValueFrom(this.http.get<any>(apiUrl));
      
      if (response && !response.isError && response.result) {
        const pages = response.result.pages || [];
        const pageData = pages.find((p: any) => 
          p.page?.pageKey?.toLowerCase() === pageKey.toLowerCase() || 
          p.pageKey?.toLowerCase() === pageKey.toLowerCase()
        );
        
        if (pageData && pageData.rules) {
          return this.convertApiRules(pageData.rules);
        }
      }
      
      return this.getDefaultRules(pageKey);
    } catch (err) {
      console.error('Failed to load page animations from API:', err);
      return this.getDefaultRules(pageKey);
    }
  }

  private convertApiRules(apiRules: any[]): GsapRule[] {
    return (apiRules || []).map((r: any) => ({
      ruleId: r.id || r.ruleKey || r.RuleKey || `rule-${Math.random()}`,
      label: r.label || r.Label || '',
      selector: r.selector || r.Selector || '',
      from: r.from || r.From || r.fromProperties || { opacity: 0, y: 30 },
      to: r.to || r.To || r.toProperties || { opacity: 1, y: 0 },
      duration: r.duration || r.Duration || 1,
      ease: r.ease || r.Ease || 'power2.out',
      stagger: r.stagger || r.Stagger,
      delay: r.delay || r.Delay || 0,
      repeat: r.repeat || r.Repeat || 0,
      yoyo: r.yoyo || r.Yoyo || false,
      paused: r.paused || r.Paused || false,
      scrollEnabled: r.scrollEnabled || r.ScrollEnabled || false,
      status: r.status || r.Status || 'Published',
      type: r.type || r.Type || 'fromTo',
      pageId: r.pageId || r.PageId || '',
      styles: r.styles || r.Styles || {}
    }));
  }

  private parseFromTo(data: any): Record<string, any> {
    if (!data) return { opacity: 0, y: 30 };
    if (typeof data === 'string') {
      return this.parseCssInput(data);
    }
    if (typeof data === 'object') return data;
        return { opacity: 0, y: 30 };
      }

  private parseCssInput(input: string): Record<string, any> {
    if (!input) return {};
    const trimmed = input.trim();

    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (typeof parsed === 'object' && parsed !== null) return parsed;
      } catch (e) {}
    }

    const cssRules: Record<string, any> = {};
    const classMatch = trimmed.match(/\.([a-zA-Z_-][a-zA-Z0-9_-]*)\s*\{([^}]*)\}/);
    if (classMatch && classMatch[2]) {
      const declarations = classMatch[2].split(';').filter(d => d.trim());
      declarations.forEach(decl => {
        const [prop, val] = decl.split(':').map(s => s.trim());
        if (prop && val) {
          const camelProp = this.kebabToCamel(prop);
          const numVal = parseFloat(val);
          cssRules[camelProp] = isNaN(numVal) ? val : numVal;
        }
      });
      return cssRules;
    }

    const styleProps = trimmed.split(';').filter(s => s.trim());
    styleProps.forEach(style => {
      const [prop, val] = style.split(':').map(s => s.trim());
      if (prop && val) {
        const camelProp = this.kebabToCamel(prop);
        const numVal = parseFloat(val);
        cssRules[camelProp] = isNaN(numVal) ? val : numVal;
      }
    });

    return cssRules;
  }

  private kebabToCamel(str: string): string {
    return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
  }

  applyAnimations(pageKey: string, container: HTMLElement) {
    this.loadPageAnimations(pageKey).then(rules => {
      this.executeRules(rules, container);
    });
  }

private executeRules(rules: GsapRule[], container: HTMLElement) {
    rules.forEach(rule => {
      if (rule.status !== 'published' && rule.status !== 'Published') return;

      const elements = container.querySelectorAll(rule.selector);
      if (!elements.length) return;

      const from = this.parseFromTo(rule.from as CssStyleValue);
      const to = this.parseFromTo(rule.to as CssStyleValue);
      const styles = this.parseFromTo(rule.styles as CssStyleValue);
      const stagger = typeof rule.stagger === 'number' ? rule.stagger : 0;

      elements.forEach(el => {
        if (Object.keys(styles).length > 0) {
          Object.entries(styles).forEach(([prop, value]) => {
            try {
              (el as HTMLElement).style.setProperty(prop, String(value));
            } catch (e) {}
          });
        }
      });

      if (rule.scrollEnabled) {
        gsap.fromTo(elements, from, {
          ...to,
          duration: rule.duration || 1,
          ease: rule.ease || 'power2.out',
          stagger: stagger,
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        });
      } else {
        gsap.fromTo(elements, from, {
          ...to,
          duration: rule.duration || 1,
          ease: rule.ease || 'power2.out',
          stagger: stagger
        });
      }
    });
  }

  private getDefaultRules(pageKey: string): GsapRule[] {
    return [];
  }

  killAll() {
    gsap.killTweensOf('*');
    ScrollTrigger.getAll().forEach(t => t.kill());
  }

  refresh() {
    ScrollTrigger.refresh();
  }
}