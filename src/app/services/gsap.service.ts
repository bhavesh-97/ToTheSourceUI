import { Injectable, OnDestroy, NgZone } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';
import { GsapConfigLoaderService } from './gsap-config-loader.service';

export interface GsapAnimationOptions {
  selector: string;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  duration?: number;
  ease?: string;
  stagger?: number;
  delay?: number;
  repeat?: number;
  yoyo?: boolean;
  scrollTrigger?: ScrollTrigger.Vars;
  onComplete?: () => void;
  onStart?: () => void;
  onUpdate?: () => void;
}

export interface GsapTimelineOptions {
  scrollTrigger?: ScrollTrigger.Vars;
  defaults?: gsap.TweenVars;
  paused?: boolean;
}

export interface GsapSequenceStep {
  selector: string;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  position?: string | number;
  duration?: number;
}

export interface GsapScrollOptions {
  trigger: string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean | string;
  pinSpacing?: boolean;
  anticipatePin?: number;
  toggleActions?: string;
  markers?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
}

@Injectable({ providedIn: 'root' })
export class GsapService implements OnDestroy {
  private animated = new WeakSet<HTMLElement>();
  private timelines = new Map<string, gsap.core.Timeline>();
  private tweens: gsap.core.Tween[] = [];
  private initialized = false;

  constructor(
    private loader: GsapConfigLoaderService,
    private zone: NgZone
  ) {
    this.registerPlugins();
  }

  private registerPlugins() {
    if (this.initialized) return;
    
    gsap.registerPlugin(ScrollTrigger, Observer);
    this.initialized = true;
  }

  get gsap() {
    return gsap;
  }

  get scrollTrigger() {
    return ScrollTrigger;
  }

  get observer() {
    return Observer;
  }

  animate(options: GsapAnimationOptions): gsap.core.Tween {
    const { selector, from, to, duration, ease, stagger, delay, repeat, yoyo, scrollTrigger, onComplete, onStart, onUpdate } = options;
    
    const elements = this.getElements(selector);
    if (!elements.length) {
      console.warn(`GSAP: No elements found for selector: ${selector}`);
      return null as any;
    }

    const animOptions: gsap.TweenVars = {
      ...to,
      duration: duration ?? 1,
      ease: ease ?? 'power2.out',
      stagger: stagger ?? 0,
      delay: delay ?? 0,
      repeat: repeat ?? 0,
      yoyo: yoyo ?? false,
      onComplete: onComplete ? () => this.zone.run(onComplete) : undefined,
      onStart: onStart ? () => this.zone.run(onStart) : undefined,
      onUpdate: onUpdate ? () => this.zone.run(onUpdate) : undefined,
    };

    if (scrollTrigger) {
      (animOptions as any).scrollTrigger = scrollTrigger;
    }

    const tween = from 
      ? gsap.fromTo(elements, from, animOptions)
      : gsap.to(elements, animOptions);

    this.tweens.push(tween);
    return tween;
  }

  from(selector: string, vars: gsap.TweenVars, scrollTrigger?: ScrollTrigger.Vars): gsap.core.Tween {
    return this.animate({ selector, from: vars, to: {}, scrollTrigger });
  }

  to(selector: string, vars: gsap.TweenVars, scrollTrigger?: ScrollTrigger.Vars): gsap.core.Tween {
    return this.animate({ selector, to: vars, scrollTrigger });
  }

  fromTo(selector: string, fromVars: gsap.TweenVars, toVars: gsap.TweenVars, scrollTrigger?: ScrollTrigger.Vars): gsap.core.Tween {
    return this.animate({ selector, from: fromVars, to: toVars, scrollTrigger });
  }

  timeline(name?: string, options?: GsapTimelineOptions): GsapTimelineBuilder {
    const tl = gsap.timeline({
      scrollTrigger: options?.scrollTrigger,
      defaults: options?.defaults,
      paused: options?.paused
    });
    
    if (name) {
      this.timelines.set(name, tl);
    }
    
    return new GsapTimelineBuilder(tl, this);
  }

  addToTimeline(name: string, tween: gsap.core.Tween, position?: string | number): boolean {
    const tl = this.timelines.get(name);
    if (!tl) return false;
    tl.add(tween, position);
    return true;
  }

  getTimeline(name: string): gsap.core.Timeline | undefined {
    return this.timelines.get(name);
  }

  killTimeline(name: string): void {
    const tl = this.timelines.get(name);
    if (tl) {
      tl.kill();
      this.timelines.delete(name);
    }
  }

  killAll(): void {
    this.tweens.forEach(t => t.kill());
    this.tweens = [];
    this.timelines.forEach(tl => tl.kill());
    this.timelines.clear();
    ScrollTrigger.getAll().forEach(st => st.kill());
  }

set(selector: string, vars: gsap.TweenVars): gsap.core.Tween {
    const elements = this.getElements(selector);
    return gsap.set(elements, vars);
  }

  get(selector: string): HTMLElement[] {
    return this.getElements(selector);
  }

  querySelector(selector: string): HTMLElement | null {
    return document.querySelector(selector);
  }

  querySelectorAll(selector: string): HTMLElement[] {
    return this.getElements(selector);
  }

  createStagger(selector: string, vars: gsap.TweenVars, stagger: number = 0.1, scrollTrigger?: ScrollTrigger.Vars): gsap.core.Tween {
    const elements = this.getElements(selector);
    if (!elements.length) return null as any;

    const animVars: gsap.TweenVars = {
      ...vars,
      stagger,
      onComplete: vars.onComplete ? () => this.zone.run(() => vars.onComplete!()) : undefined
    };

    if (scrollTrigger) {
      (animVars as any).scrollTrigger = scrollTrigger;
    }

    const tween = gsap.fromTo(elements, { opacity: 0, y: 50 }, animVars);
    this.tweens.push(tween);
    return tween;
  }

  createScrollTrigger(trigger: string, callback: (self: ScrollTrigger) => void, vars?: ScrollTrigger.Vars): ScrollTrigger {
    // Factory - callers should use ScrollTrigger.create() directly with trigger element
    return null as any;
  }

  createPinnedSection(trigger: string, content: string, vars?: ScrollTrigger.Vars): gsap.core.Timeline {
    const triggerEl = document.querySelector(trigger);
    const contentEl = document.querySelector(content);
    if (!triggerEl || !contentEl) {
      console.warn('GSAP Pin: Elements not found');
      return null as any;
    }
    const pinVars = { trigger: triggerEl, start: 'top top', end: '+=300', pin: contentEl, pinSpacing: vars?.pinSpacing ?? true, scrub: vars?.scrub ?? true };
    return gsap.timeline({ scrollTrigger: { ...pinVars, ...vars } });
  }

  createParallax(trigger: string, element: string, speed: number = 0.5, y: number = -100): ScrollTrigger {
    const triggerEl = document.querySelector(trigger);
    const el = document.querySelector(element);
    if (!triggerEl || !el) return null as any;
    return ScrollTrigger.create({
      trigger: triggerEl, start: 'top bottom', end: 'bottom top',
      onUpdate: (self) => { const progress = self.progress; gsap.set(el, { y: y * progress * speed * (1 - progress) }); }
    });
  }

  createHorizontalScroll(trigger: string, container: string, xPercent: number = -100, scrub: boolean | number = true): gsap.core.Tween {
    const triggerEl = document.querySelector(trigger);
    const containerEl = document.querySelector(container);
    if (!triggerEl || !containerEl) return null as any;
    return gsap.to(containerEl, {
      xPercent, ease: 'none',
      scrollTrigger: { trigger: triggerEl, start: 'top top', end: () => `+=${(containerEl as HTMLElement).offsetWidth}`, scrub, pin: true, anticipatePin: 1 }
    });
  }

  batch(selector: string, vars: gsap.TweenVars, scrollTrigger?: ScrollTrigger.Vars): void {
    ScrollTrigger.batch(selector, {
      onEnter: (elements) => gsap.fromTo(elements, { opacity: 0, y: 30 }, { ...vars, opacity: 1, y: 0, stagger: 0.15, overwrite: 'auto' }),
      onLeave: (elements) => gsap.to(elements, { ...vars, opacity: 0, y: -30, overwrite: 'auto' }),
      onEnterBack: (elements) => gsap.fromTo(elements, { opacity: 0, y: -30 }, { ...vars, opacity: 1, y: 0, stagger: 0.15, overwrite: 'auto' }),
      onLeaveBack: (elements) => gsap.to(elements, { ...vars, opacity: 0, y: 30, overwrite: 'auto' })
    });
  }

  matchMedia(vars: { desktop?: () => void; tablet?: () => void; mobile?: () => void }): void {
    const mm = gsap.matchMedia();
    if (vars.desktop) mm.add('(min-width: 1024px)', vars.desktop);
    if (vars.tablet) mm.add('(min-width: 768px) and (max-width: 1023px)', vars.tablet);
    if (vars.mobile) mm.add('(max-width: 767px)', vars.mobile);
  }

  getElements(selector: string): HTMLElement[] {
    if (!selector) return [];
    return Array.from(document.querySelectorAll(selector)).filter((el): el is HTMLElement => el instanceof HTMLElement);
  }

  isAnimated(element: HTMLElement): boolean {
    return this.animated.has(element);
  }

  markAnimated(element: HTMLElement): void {
    this.animated.add(element);
  }

  ngOnDestroy(): void {
    this.killAll();
  }
}

export class GsapTimelineBuilder {
  private timeline: gsap.core.Timeline;

  constructor(timeline: gsap.core.Timeline, private service: GsapService) {
    this.timeline = timeline;
  }

  add(options: GsapAnimationOptions, position?: string | number): GsapTimelineBuilder {
    const { selector, from, to, duration, ease, stagger, delay, repeat, yoyo, onComplete, onStart } = options;
    
    const elements = this.service.getElements(selector);
    if (!elements.length) return this;

    const animVars: gsap.TweenVars = {
      ...to,
      duration: duration ?? 1,
      ease: ease ?? 'power2.out',
      stagger: stagger ?? 0,
      delay: delay ?? 0,
      repeat: repeat ?? 0,
      yoyo: yoyo ?? false,
      onComplete: onComplete ? () => this.service['zone'].run(onComplete) : undefined,
      onStart: onStart ? () => this.service['zone'].run(onStart) : undefined
    };

    if (from) {
      this.timeline.fromTo(elements, from, animVars, position);
    } else {
      this.timeline.to(elements, animVars, position);
    }

    return this;
  }

  from(selector: string, vars: gsap.TweenVars, position?: string | number): GsapTimelineBuilder {
    return this.add({ selector, from: vars }, position);
  }

  to(selector: string, vars: gsap.TweenVars, position?: string | number): GsapTimelineBuilder {
    return this.add({ selector, to: vars }, position);
  }

  addLabel(label: string, position?: string | number): GsapTimelineBuilder {
    this.timeline.addLabel(label, position);
    return this;
  }

  addCallback(callback: () => void, position: string | number): GsapTimelineBuilder {
    this.timeline.call(callback, undefined, position);
    return this;
  }

  set(selector: string, vars: gsap.TweenVars, position?: string | number): GsapTimelineBuilder {
    const elements = this.service.getElements(selector);
    this.timeline.set(elements, vars, position);
    return this;
  }

  toTimeline(): gsap.core.Timeline {
    return this.timeline;
  }
}