import { Injectable, signal } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { GsapRule } from '../../CMS/main/gsap-master/gsap-interface';

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
      from: this.parseFromTo(r.from || r.From || r.fromProperties),
      to: this.parseFromTo(r.to || r.To || r.toProperties),
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
      pageId: r.pageId || r.PageId || ''
    }));
  }

  private parseFromTo(data: any): Record<string, any> {
    if (!data) return { opacity: 0, y: 30 };
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch {
        return { opacity: 0, y: 30 };
      }
    }
    return data || { opacity: 0, y: 30 };
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

      const from = rule.from || { opacity: 0, y: 30 };
      const to = rule.to || { opacity: 1, y: 0 };
      const stagger = typeof rule.stagger === 'number' ? rule.stagger : 0;

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