import { Injectable, AfterViewInit } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { GsapConfigLoaderService } from './gsap-config-loader.service';

@Injectable({
  providedIn: 'root'
})
export class GsapService implements AfterViewInit {

  private observer!: MutationObserver;

  constructor(private configLoader: GsapConfigLoaderService) {
    gsap.registerPlugin(ScrollTrigger);
    this.initGlobalObserver();
  }

  ngAfterViewInit(): void {
    this.applyAnimationsToExistingElements();
  }

  // Watch the DOM for any new elements added
  private initGlobalObserver() {
    this.observer = new MutationObserver(() => {
      this.applyAnimationsToExistingElements();
    });
    this.observer.observe(document.body, { childList: true, subtree: true });
  }

  private applyAnimationsToExistingElements() {
    debugger;
    const config = this.configLoader.getConfig();
    if (!config) return;

    config.rules.forEach((rule: any) => {
      const elements = document.querySelectorAll(rule.selector);
      elements.forEach(el => {
        if ((el as any).__gsapAnimated) return; // skip already animated
        if (rule.type === 'tween') this.applyTweenToElement(rule, el as HTMLElement);
        if (rule.type === 'timeline') this.applyTimelineToElement(rule, el as HTMLElement);
        (el as any).__gsapAnimated = true;
      });
    });
  }

  private applyTweenToElement(rule: any, el: HTMLElement) {
    const trigger = rule.scrollTrigger?.enabled
      ? {
          trigger: el,
          start: rule.scrollTrigger.start || 'top 80%',
          scrub: rule.scrollTrigger.scrub || false
        }
      : undefined;

    gsap.fromTo(el, rule.from, { ...rule.to, stagger: rule.stagger?.each, scrollTrigger: trigger });
  }

  private applyTimelineToElement(rule: any, el: HTMLElement) {
    const tl = gsap.timeline({
      defaults: rule.defaults,
      scrollTrigger: rule.scrollTrigger?.enabled
        ? {
            trigger: el,
            start: rule.scrollTrigger.start || 'top 80%',
            scrub: rule.scrollTrigger.scrub || false
          }
        : undefined
    });

    rule.sequence?.sort((a: any, b: any) => a.order - b.order).forEach((step: any) => {
      const stepEl = el.querySelector(step.selector);
      if (stepEl) tl.fromTo(stepEl, step.from, step.to);
    });
  }
}
