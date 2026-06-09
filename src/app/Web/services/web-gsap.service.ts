import { Injectable, signal, inject } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GsapConfigLoaderService } from '../../services/gsap-config-loader.service';
import { GsapRule, CssStyleValue, GsapConfig } from '../../CMS/main/gsap-master/gsap-interface';

@Injectable({
  providedIn: 'root'
})
export class WebGsapService {
  private currentPage = signal<string>('');
  private configLoaded = signal<boolean>(false);
  private config: GsapConfig | null = null;
  private configLoader = inject(GsapConfigLoaderService);

  async init(): Promise<void> {
    gsap.registerPlugin(ScrollTrigger);
    this.config = await this.configLoader.load();
    this.configLoaded.set(true);
  }

  async loadPageAnimations(pageKey: string): Promise<GsapRule[]> {
    if (!this.config) {
      this.config = await this.configLoader.load(pageKey);
    }

    const pageKeyLower = pageKey.toLowerCase();
    const page = this.config?.pages?.[pageKeyLower];

    if (page?.rules?.length) {
      return page.rules;
    }

    for (const [key, pageData] of Object.entries(this.config?.pages || {})) {
      if (key.toLowerCase() === pageKeyLower && pageData.rules?.length) {
        return pageData.rules;
      }
    }

    return this.getDefaultRules(pageKey);
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
    let trimmed = input.trim();

    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (typeof parsed === 'object' && parsed !== null) return parsed;
      } catch (e) {}
      trimmed = trimmed.replace(/^\{/, '').replace(/\}$/, '').trim();
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
  //  console.log('[GSAP] applyAnimations called for:', pageKey);
  //  console.log('[GSAP] Container:', container);
    this.loadPageAnimations(pageKey).then(rules => {
      // console.log('[GSAP] Rules loaded for', pageKey, ':', rules);
      // console.log('[GSAP] Rules count:', rules.length);
      this.executeRules(rules, container);
    });
  }

private executeRules(rules: GsapRule[], container: HTMLElement) {
    rules.forEach(rule => {
      // console.log('[GSAP] Processing rule:', rule.selector, 'status:', rule.status);
      if (rule.status !== 'published' && rule.status !== 'Published') {
        // console.log('[GSAP] Skipping rule - not published');
        return;
      }

      const elements = container.querySelectorAll(rule.selector);
      // console.log('[GSAP] Elements found for', rule.selector, ':', elements.length);
      if (!elements.length) {
        // console.log('[GSAP] Skipping rule - no elements found');
        return;
      }

      const from = this.parseFromTo(rule.from as CssStyleValue);
      const to = this.parseFromTo(rule.to as CssStyleValue);
      const styles = this.parseFromTo(rule.styles as CssStyleValue);
      const stagger = typeof rule.stagger === 'number' ? rule.stagger : 0;
      // console.log('[GSAP] from:', JSON.stringify(from), 'to:', JSON.stringify(to));

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