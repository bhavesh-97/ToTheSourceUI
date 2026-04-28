import { Injectable, OnDestroy, NgZone } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GsapConfigLoaderService } from './gsap-config-loader.service';

export interface GsapRuleConfig {
  id: string;
  selector: string;
  trigger?: string;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  duration?: number;
  ease?: string;
  stagger?: number;
  delay?: number;
  repeat?: number;
  yoyo?: boolean;
  scrollTrigger?: ScrollTrigger.Vars;
  scrollEnabled?: boolean;
  status?: string;
  priority?: number;
  onComplete?: string;
  onStart?: string;
  onUpdate?: string;
  type?: 'tween' | 'timeline' | 'flip' | 'batch';
}

export interface GsapGlobalConfig {
  defaults: {
    duration: number;
    ease: string;
    stagger: number;
  };
  registerPlugins: string[];
  autoInit: boolean;
  observeDom: boolean;
  debug: boolean;
}

export interface GsapFullConfig {
  global: GsapGlobalConfig;
  rules: GsapRuleConfig[];
  callbacks: { name: string; script: string }[];
}

@Injectable({ providedIn: 'root' })
export class GsapAutoService implements OnDestroy {
  private observer!: MutationObserver;
  private appliedRules = new Map<string, gsap.core.Tween[]>();
  private timelines = new Map<string, gsap.core.Timeline>();
  private processedElements = new WeakSet<Element>();
  private initialized = false;
  private config: GsapFullConfig | null = null;
  private autoPlay = false;
  private pollingInterval: any;

  constructor(
    private loader: GsapConfigLoaderService,
    private zone: NgZone
  ) {
    this.registerPlugins();
  }

  private registerPlugins() {
    if (this.initialized) return;
    gsap.registerPlugin(ScrollTrigger);
    this.initialized = true;
  }

  async init(): Promise<void> {
    await this.loader.load();
    this.config = this.loader.getConfig() as GsapFullConfig;
    
    if (this.config?.global?.autoInit ?? true) {
      this.startAutoApply();
    }
  }

  startAutoApply(): void {
    if (this.autoPlay) return;
    
    // Check if config is loaded, if not try to load
    if (!this.config || !this.config.rules) {
      this.config = this.loader.getConfig() as GsapFullConfig;
    }
    
    if (!this.config || !this.config.rules) {
      console.warn('No GSAP config found - please load config first');
      return;
    }
    
    this.autoPlay = true;
    
    this.zone.runOutsideAngular(() => {
      setTimeout(() => this.applyAllRules(), 300);
      if (this.config?.global?.observeDom ?? true) {
        this.observeDomChanges();
      }
      this.pollingInterval = setInterval(() => this.applyAllRules(), 3000);
    });
  }

  stopAutoApply() {
    this.autoPlay = false;
    this.observer?.disconnect();
    clearInterval(this.pollingInterval);
  }

  private observeDomChanges() {
    this.observer = new MutationObserver(() => {
      this.applyAllRules();
    });
    
    if (document.body) {
      this.observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  applyAllRules(): void {
    if (!this.config) return;

    const rules = this.config.rules
      .filter(r => r.status === 'published')
      .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

    rules.forEach(rule => {
      if (rule.type === 'tween') {
        this.applyTweenRule(rule);
      } else if (rule.type === 'timeline') {
        this.applyTimelineRule(rule);
      } else if (rule.type === 'batch') {
        this.applyBatchRule(rule);
      }
    });

    ScrollTrigger.refresh();
  }

  private applyTweenRule(rule: GsapRuleConfig): void {
    const elements = document.querySelectorAll(rule.selector);
    if (!elements.length) return;

    const alreadyAnimated = Array.from(elements).every(el => this.processedElements.has(el));
    if (alreadyAnimated) return;

    elements.forEach(el => this.processedElements.add(el));

    const from = rule.from ?? { opacity: 0, y: 30 };
    const to = rule.to ?? { opacity: 1, y: 0 };
    
    const animVars: gsap.TweenVars = {
      ...to,
      duration: rule.duration ?? this.config?.global?.defaults?.duration ?? 1,
      ease: rule.ease ?? this.config?.global?.defaults?.ease ?? 'power2.out',
      stagger: rule.stagger ?? this.config?.global?.defaults?.stagger ?? 0,
      delay: rule.delay ?? 0,
      repeat: rule.repeat ?? 0,
      yoyo: rule.yoyo ?? false,
      scrollTrigger: rule.scrollEnabled ? (rule.scrollTrigger ?? { trigger: rule.trigger ?? rule.selector, start: 'top 85%' }) : undefined,
      onComplete: () => this.executeCallback(rule.onComplete)
    };

    const key = `${rule.id}-${rule.selector}`;
    this.appliedRules.get(key)?.forEach(t => t.kill());
    
    const tween = gsap.fromTo(elements, from, animVars);
    this.appliedRules.set(key, [tween]);
  }

  private applyTimelineRule(rule: GsapRuleConfig): void {
    const container = document.querySelector(rule.selector);
    if (!container) return;

    if (this.processedElements.has(container)) return;
    this.processedElements.add(container);

    const tl = gsap.timeline({
      scrollTrigger: rule.scrollEnabled ? (rule.scrollTrigger ?? { trigger: rule.selector, start: 'top 80%' }) : undefined
    });

    const children = container.querySelectorAll(':scope > *');
    if (children.length) {
      tl.fromTo(children, 
        rule.from ?? { opacity: 0, y: 30 },
        { 
          ...rule.to ?? { opacity: 1, y: 0 },
          duration: rule.duration ?? 1,
          ease: rule.ease ?? 'power2.out',
          stagger: rule.stagger ?? 0.1
        }
      );
    } else {
      tl.fromTo(container,
        rule.from ?? { opacity: 0 },
        { ...rule.to ?? { opacity: 1 }, duration: rule.duration ?? 1 }
      );
    }

    if (rule.id) {
      this.timelines.set(rule.id, tl);
    }
  }

  private applyBatchRule(rule: GsapRuleConfig): void {
    ScrollTrigger.batch(rule.selector, {
      onEnter: (elements) => {
        gsap.fromTo(elements, 
          rule.from ?? { opacity: 0, y: 30 },
          { ...rule.to ?? { opacity: 1, y: 0 }, duration: rule.duration ?? 0.5, stagger: rule.stagger ?? 0.1, overwrite: 'auto' }
        );
      },
      onLeave: (elements) => {
        gsap.to(elements, { ...rule.to ?? { opacity: 0, y: -30 }, overwrite: 'auto' });
      },
      onEnterBack: (elements) => {
        gsap.fromTo(elements, 
          rule.from ?? { opacity: 0, y: -30 },
          { ...rule.to ?? { opacity: 1, y: 0 }, duration: rule.duration ?? 0.5, stagger: rule.stagger ?? 0.1, overwrite: 'auto' }
        );
      },
      onLeaveBack: (elements) => {
        gsap.to(elements, { ...rule.to ?? { opacity: 0, y: 30 }, overwrite: 'auto' });
      }
    });
  }

  applyToElement(selector: string, ruleId?: string): void {
    if (!this.config) return;
    
    const rule = ruleId 
      ? this.config.rules.find(r => r.id === ruleId)
      : this.config.rules.find(r => r.selector === selector);
    
    if (rule) {
      this.applyTweenRule(rule);
    }
  }

  applyToClass(className: string): void {
    this.applyAllRules();
  }

  refresh(): void {
    this.applyAllRules();
  }

  killAll(): void {
    this.appliedRules.forEach(tweens => tweens.forEach(t => t.kill()));
    this.appliedRules.clear();
    this.timelines.forEach(tl => tl.kill());
    this.timelines.clear();
    ScrollTrigger.getAll().forEach(st => st.kill());
  }

  get gsap() { return gsap; }
  get scrollTrigger() { return ScrollTrigger; }
  getTimeline(id: string) { return this.timelines.get(id); }
  getConfig() { return this.config; }

  private executeCallback(name?: string): void {
    if (!name || !this.config) return;
    const cb = this.config.callbacks?.find(c => c.name === name);
    if (cb?.script) {
      try { new Function(cb.script)(); } 
      catch (e) { console.error('GSAP callback error:', e); }
    }
  }

  ngOnDestroy(): void {
    this.stopAutoApply();
    this.killAll();
  }
}