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
    const hasST = rule.scrollTrigger?.enabled ?? false;

    const mediaHtml = rule.media && rule.media.type !== 'none' && rule.media.selector === rule.selector
      ? this.getMediaElement(rule.media)
      : '';

    const targetEls = Array.from(els).filter((el): el is HTMLElement => !this.animated.has(el));

    if (!targetEls.length) return;

    targetEls.forEach(el => {
      if (mediaHtml) {
        el.innerHTML += mediaHtml;
      }
      if (rule.styles) {
        gsap.set(el, rule.styles);
      }
      this.animated.add(el);
    });

    const stTrigger = rule.scrollTrigger?.trigger
      ? document.querySelector(rule.scrollTrigger.trigger)
      : targetEls;

    const stConfig = hasST ? {
      trigger: stTrigger,
      start: rule.scrollTrigger.start || 'top 85%',
      end: rule.scrollTrigger.end || 'bottom top',
      scrub: rule.scrollTrigger.scrub ?? false,
      toggleActions: (rule.scrollTrigger.scrub ?? false) ? undefined : 'play none none reverse',
      immediateRender: true
    } : undefined;

    const animVars = {
      ...rule.to,
      duration,
      ease,
      stagger: rule.stagger?.each ?? 0,
      scrollTrigger: stConfig,
      immediateRender: true,
      onComplete: () => this.runCallback(config, rule.onComplete)
    };

    gsap.fromTo(targetEls, rule.from, animVars);
  }

  private timeline(rule: any, config: any) {
    const container = document.querySelector(rule.selector) as HTMLElement;
    if (!container) return;

    const hasST = rule.scrollTrigger?.enabled ?? false;

    // Apply media and styles to container
    if (rule.media && rule.media.type !== 'none' && rule.media.selector === rule.selector) {
      container.innerHTML += this.getMediaElement(rule.media);
    }
    if (rule.styles) {
      gsap.set(container, rule.styles);
    }

    let sequence = (rule.sequence || [])
      .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

    const targetSteps: { el: HTMLElement; from: any; to: any }[] = [];

    sequence.forEach((step: any) => {
      const el = container.querySelector(step.selector) as HTMLElement;
      if (!el || this.animated.has(el)) return;

      const stepMediaHtml = step.media && step.media.type !== 'none' && step.media.selector === step.selector
        ? this.getMediaElement(step.media)
        : '';
      if (stepMediaHtml) {
        el.innerHTML += stepMediaHtml;
      }
      if (step.styles) {
        gsap.set(el, step.styles);
      }
      this.animated.add(el);
      targetSteps.push({
        el,
        from: step.from,
        to: step.to
      });
    });

    this.animated.add(container);

    if (!targetSteps.length) return;

    const tlDefaults = {
      duration: rule.defaults?.duration ?? config.global?.defaults?.duration ?? 1,
      ease: rule.defaults?.ease ?? config.global?.defaults?.ease ?? 'power2.out'
    };

    const tlVars: any = {
      defaults: tlDefaults
    };

    if (hasST) {
      tlVars.scrollTrigger = {
        trigger: rule.scrollTrigger.trigger || container,
        start: rule.scrollTrigger.start || 'top 80%',
        end: rule.scrollTrigger.end || 'bottom top',
        scrub: rule.scrollTrigger.scrub ?? false,
        toggleActions: (rule.scrollTrigger.scrub ?? false) ? undefined : 'play none none reverse',
        immediateRender: true
      };
    }

    const tl = gsap.timeline(tlVars);

    targetSteps.forEach(({ el, from, to }) => {
      tl.fromTo(el, from, { ...to, immediateRender: true });
    });
  }

  private getMediaElement(media: any): string {
    const cleanSelector = media.selector ? media.selector.replace(/^[.#]/, '') : '';
    switch (media.type) {
      case 'image': return `<img src="${media.url}" class="${cleanSelector}" alt="" style="max-width: 100%; height: auto;">`;
      case 'video': return `<video src="${media.url}" class="${cleanSelector}" controls style="max-width: 100%; height: auto;"></video>`;
      case 'audio': return `<audio src="${media.url}" class="${cleanSelector}" controls></audio>`;
      default: return '';
    }
  }

  private runCallback(config: any, name?: string) {
    if (!name) return;
    const cb = config.callbacks?.find((c: any) => c.name === name);
    if (cb?.script) new Function(cb.script)();
  }
}