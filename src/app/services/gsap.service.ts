import { Injectable, AfterViewInit, OnDestroy } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { GsapConfigLoaderService } from './gsap-config-loader.service';

@Injectable({ providedIn: 'root' })
export class GsapService implements AfterViewInit, OnDestroy {
  private observer!: MutationObserver;
  private animated = new WeakSet<HTMLElement>();

  constructor(private loader: GsapConfigLoaderService) {
    gsap.registerPlugin(ScrollTrigger);
    this.loader.load();
  }

  ngAfterViewInit(): void {
    this.observer = new MutationObserver(() => this.run());
    this.observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => this.run(), 100); // Safety
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    ScrollTrigger.getAll().forEach(st => st.kill());
  }

  private run() {
    const config = this.loader.getConfig();
    if (!config?.rules) return;

    config.rules.forEach((rule: any) => {
      if (rule.status !== 'published') return;

      if (rule.type === 'tween') this.tween(rule, config);
      if (rule.type === 'timeline') this.timeline(rule, config);
    });

    ScrollTrigger.refresh();
  }

  private tween(rule: any, config: any) {
    const els = document.querySelectorAll(rule.selector);
    if (!els.length) return;

    const def = config.global?.defaults || {};
    const duration = rule.duration ?? def.duration ?? 1.2;
    const ease = rule.ease ?? def.ease ?? 'power3.out';

    els.forEach(el => {
      if (this.animated.has(el)) return;

      gsap.fromTo(el, rule.from, {
        ...rule.to,
        duration,
        ease,
        stagger: rule.stagger?.each ?? 0,
        scrollTrigger: rule.scrollTrigger?.enabled ? {
          trigger: rule.scrollTrigger.trigger || el,
          start: rule.scrollTrigger.start || 'top 85%',
          end: rule.scrollTrigger.end || 'bottom top',
          scrub: rule.scrollTrigger.scrub ?? false,
          toggleActions: 'play none none reverse',
        } : null,
        onComplete: () => this.runCallback(config, rule.onComplete)
      });

      this.animated.add(el as HTMLElement);
    });
  }

  private timeline(rule: any, config: any) {
    const container = document.querySelector(rule.selector);
    if (!container || this.animated.has(container)) return;

    const tl = gsap.timeline({
      scrollTrigger: rule.scrollTrigger?.enabled ? {
        trigger: rule.scrollTrigger.trigger || container,
        start: rule.scrollTrigger.start || 'top 80%',
        scrub: rule.scrollTrigger.scrub ?? false,
      } : undefined,
      defaults: {
        duration: rule.defaults?.duration ?? config.global?.defaults?.duration ?? 1,
        ease: rule.defaults?.ease ?? config.global?.defaults?.ease ?? 'power2.out',
      }
    });

    (rule.sequence || [])
      .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
      .forEach((step: any) => {
        const el = container.querySelector(step.selector);
        if (el) tl.fromTo(el, step.from, step.to);
      });

    this.animated.add(container as HTMLElement);
  }

  private runCallback(config: any, name?: string) {
    if (!name) return;
    const cb = config.callbacks?.find((c: any) => c.name === name);
    if (cb?.script) new Function(cb.script)();
  }
}