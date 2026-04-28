import { Injectable } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { GsapService, GsapAnimationOptions, GsapTimelineOptions, GsapSequenceStep } from './gsap.service';

export type EasingType = 'none' | 'power1' | 'power2' | 'power3' | 'power4' | 'back' | 'elastic' | 'bounce' | 'circ' | 'expo' | 'sine';
export type EaseDirection = 'in' | 'out' | 'inOut';

@Injectable({ providedIn: 'root' })
export class GsapApiService {
  private namedTimelines = new Map<string, gsap.core.Timeline>();
  private namedTweens = new Map<string, gsap.core.Tween[]>();
  private scrollTriggers: ScrollTrigger[] = [];

  constructor(private gsapService: GsapService) {
    gsap.registerPlugin(ScrollTrigger);
  }

  fadeIn(selector: string, options?: Partial<GsapAnimationOptions>): gsap.core.Tween {
    return this.gsapService.to(selector, { opacity: 1, visibility: 'visible' }, options?.scrollTrigger);
  }

  fadeOut(selector: string, options?: Partial<GsapAnimationOptions>): gsap.core.Tween {
    return this.gsapService.to(selector, { opacity: 0, visibility: 'hidden' }, options?.scrollTrigger);
  }

  fadeUp(selector: string, distance: number = 50, options?: Partial<GsapAnimationOptions>): gsap.core.Tween {
    return this.gsapService.fromTo(
      selector,
      { opacity: 0, y: distance },
      { opacity: 1, y: 0 },
      options?.scrollTrigger
    );
  }

  fadeDown(selector: string, distance: number = -50, options?: Partial<GsapAnimationOptions>): gsap.core.Tween {
    return this.gsapService.fromTo(
      selector,
      { opacity: 0, y: distance },
      { opacity: 1, y: 0 },
      options?.scrollTrigger
    );
  }

  fadeLeft(selector: string, distance: number = -50, options?: Partial<GsapAnimationOptions>): gsap.core.Tween {
    return this.gsapService.fromTo(
      selector,
      { opacity: 0, x: distance },
      { opacity: 1, x: 0 },
      options?.scrollTrigger
    );
  }

  fadeRight(selector: string, distance: number = 50, options?: Partial<GsapAnimationOptions>): gsap.core.Tween {
    return this.gsapService.fromTo(
      selector,
      { opacity: 0, x: distance },
      { opacity: 1, x: 0 },
      options?.scrollTrigger
    );
  }

  scaleIn(selector: string, fromScale: number = 0, options?: Partial<GsapAnimationOptions>): gsap.core.Tween {
    return this.gsapService.fromTo(
      selector,
      { scale: fromScale, opacity: 0 },
      { scale: 1, opacity: 1 },
      options?.scrollTrigger
    );
  }

  scaleOut(selector: string, toScale: number = 0, options?: Partial<GsapAnimationOptions>): gsap.core.Tween {
    return this.gsapService.fromTo(
      selector,
      { scale: 1, opacity: 1 },
      { scale: toScale, opacity: 0 },
      options?.scrollTrigger
    );
  }

  rotateIn(selector: string, fromRotation: number = -180, options?: Partial<GsapAnimationOptions>): gsap.core.Tween {
    return this.gsapService.fromTo(
      selector,
      { rotation: fromRotation, opacity: 0, transformOrigin: 'center center' },
      { rotation: 0, opacity: 1 },
      options?.scrollTrigger
    );
  }

  flip(selector: string, options?: Partial<GsapAnimationOptions>): gsap.core.Tween {
    return this.gsapService.fromTo(
      selector,
      { rotationY: 0, opacity: 1 },
      { rotationY: 180, opacity: 0, transformOrigin: 'center center', perspective: 1000 },
      options?.scrollTrigger
    );
  }

  slideInFromBottom(selector: string, options?: Partial<GsapAnimationOptions>): gsap.core.Tween {
    return this.gsapService.fromTo(
      selector,
      { y: '100%', opacity: 0 },
      { y: 0, opacity: 1, ease: 'power3.out' },
      options?.scrollTrigger
    );
  }

  slideInFromTop(selector: string, options?: Partial<GsapAnimationOptions>): gsap.core.Tween {
    return this.gsapService.fromTo(
      selector,
      { y: '-100%', opacity: 0 },
      { y: 0, opacity: 1, ease: 'power3.out' },
      options?.scrollTrigger
    );
  }

  blurIn(selector: string, fromBlur: number = 10, options?: Partial<GsapAnimationOptions>): gsap.core.Tween {
    return this.gsapService.fromTo(
      selector,
      { filter: `blur(${fromBlur}px)`, opacity: 0 },
      { filter: 'blur(0px)', opacity: 1 },
      options?.scrollTrigger
    );
  }

  blurOut(selector: string, toBlur: number = 10, options?: Partial<GsapAnimationOptions>): gsap.core.Tween {
    return this.gsapService.fromTo(
      selector,
      { filter: 'blur(0px)', opacity: 1 },
      { filter: `blur(${toBlur}px)`, opacity: 0 },
      options?.scrollTrigger
    );
  }

  shake(selector: string, intensity: number = 10, options?: Partial<GsapAnimationOptions>): gsap.core.Tween {
    return this.gsapService.fromTo(
      selector,
      { x: 0 },
      { x: intensity, ease: 'none', yoyo: true, repeat: 3, duration: 0.1 },
      options?.scrollTrigger
    );
  }

  wobble(selector: string, options?: Partial<GsapAnimationOptions>): gsap.core.Tween {
    return this.gsapService.fromTo(
      selector,
      { rotation: 0, transformOrigin: 'bottom center' },
      { rotation: 15, ease: 'elastic.out(1, 3)', yoyo: true, repeat: 1, duration: 0.5 },
      options?.scrollTrigger
    );
  }

  bounce(selector: string, distance: number = 50, options?: Partial<GsapAnimationOptions>): gsap.core.Tween {
    return this.gsapService.fromTo(
      selector,
      { y: -distance, opacity: 0 },
      { y: 0, opacity: 1, ease: 'bounce.out', duration: 1 },
      options?.scrollTrigger
    );
  }

  pulse(selector: string, scale: number = 1.1, options?: Partial<GsapAnimationOptions>): gsap.core.Tween {
    return this.gsapService.fromTo(
      selector,
      { scale: 1 },
      { scale, ease: 'power1.inOut', yoyo: true, repeat: -1, duration: 0.5 },
      options?.scrollTrigger
    );
  }

  spin(selector: string, degrees: number = 360, duration: number = 1, options?: Partial<GsapAnimationOptions>): gsap.core.Tween {
    return this.gsapService.to(selector, { rotation: degrees, ease: 'none', duration }, options?.scrollTrigger);
  }

  typewriter(selector: string, options?: Partial<GsapAnimationOptions>): gsap.core.Tween {
    const elements = document.querySelectorAll(selector);
    const texts: string[] = [];
    
    elements.forEach(el => {
      if (el instanceof HTMLElement) {
        texts.push(el.innerText);
        el.innerText = '';
      }
    });

    return gsap.to(selector, {
      duration: texts.reduce((acc, t) => acc + t.length * 0.05, 0),
      onUpdate: function() {
        const index = Math.floor(this.progress() * texts.join('').length);
        let charIndex = 0;
        elements.forEach((el, i) => {
          if (el instanceof HTMLElement) {
            const targetLength = Math.min(index - charIndex, texts[i].length);
            el.innerText = texts[i].substring(0, Math.max(0, targetLength));
            charIndex += texts[i].length;
          }
        });
      },
      onComplete: () => {
        elements.forEach((el, i) => {
          if (el instanceof HTMLElement) el.innerText = texts[i];
        });
      },
      ease: 'none'
    } as any);
  }

  staggerFadeIn(selector: string, stagger: number = 0.1, options?: Partial<GsapAnimationOptions>): gsap.core.Tween {
    return this.gsapService.createStagger(
      selector,
      { opacity: 1, y: 0 },
      stagger,
      options?.scrollTrigger
    );
  }

  staggerFadeUp(selector: string, stagger: number = 0.1, yDistance: number = 30, options?: Partial<GsapAnimationOptions>): gsap.core.Tween {
    return this.gsapService.createStagger(
      selector,
      { opacity: 1, y: 0 },
      stagger,
      options?.scrollTrigger
    );
  }

  createTimeline(name: string, options?: GsapTimelineOptions): gsap.core.Timeline {
    const tl = gsap.timeline({
      scrollTrigger: options?.scrollTrigger,
      defaults: options?.defaults,
      paused: options?.paused
    });
    this.namedTimelines.set(name, tl);
    return tl;
  }

  getTimeline(name: string): gsap.core.Timeline | undefined {
    return this.namedTimelines.get(name);
  }

  timeline(name: string): GsapTimelineBuilder2 {
    return new GsapTimelineBuilder2(this.namedTimelines, name);
  }

  sequence(name: string, steps: { selector: string; animation: string; options?: any }[]): gsap.core.Timeline {
    const tl = gsap.timeline();
    
    steps.forEach((step, index) => {
      const animFn = (this as any)[step.animation];
      if (typeof animFn === 'function') {
        animFn.call(this, step.selector, step.options);
      }
    });

    this.namedTimelines.set(name, tl);
    return tl;
  }

  play(name: string): void {
    this.namedTimelines.get(name)?.play();
  }

  pause(name: string): void {
    this.namedTimelines.get(name)?.pause();
  }

  reverse(name: string): void {
    this.namedTimelines.get(name)?.reverse();
  }

  restart(name: string): void {
    this.namedTimelines.get(name)?.restart();
  }

  seek(name: string, position: number | string): void {
    this.namedTimelines.get(name)?.seek(position);
  }

  progress(name: string, progress: number): void {
    this.namedTimelines.get(name)?.progress(progress);
  }

  kill(name: string): void {
    const tl = this.namedTimelines.get(name);
    if (tl) {
      tl.kill();
      this.namedTimelines.delete(name);
    }
  }

  killAll(): void {
    this.namedTimelines.forEach(tl => tl.kill());
    this.namedTimelines.clear();
    this.namedTweens.forEach(tweens => tweens.forEach(t => t.kill()));
    this.namedTweens.clear();
    ScrollTrigger.getAll().forEach(st => st.kill());
  }

  setGlobalDefaults(duration: number = 1, ease: string = 'power2.out'): void {
    gsap.defaults({ duration, ease });
  }

  createScrollTrigger(
    trigger: string,
    callback: (self: ScrollTrigger) => void,
vars?: Partial<ScrollTrigger.Vars>
  ): ScrollTrigger {
    return this.gsapService.createScrollTrigger(trigger, callback, vars as any);
  }

  onEnter(selector: string, vars: gsap.TweenVars): ScrollTrigger {
    return ScrollTrigger.create({
      trigger: selector,
      start: 'top 80%',
      onEnter: () => gsap.to(selector, vars)
    });
  }

  onLeave(selector: string, vars: gsap.TweenVars): ScrollTrigger {
    return ScrollTrigger.create({
      trigger: selector,
      start: 'top 20%',
      onLeave: () => gsap.to(selector, vars)
    });
  }

  whileInView(selector: string, vars: gsap.TweenVars, options?: Partial<ScrollTrigger.Vars>): ScrollTrigger {
    return ScrollTrigger.create({
      trigger: selector,
      start: 'top bottom',
      end: 'bottom top',
      toggleActions: 'play none none reverse',
      ...options,
      onEnter: () => gsap.to(selector, { ...vars, duration: vars.duration ?? 1, ease: vars.ease ?? 'power2.out' })
    });
  }

  pinSection(trigger: string, content: string, vars?: Partial<ScrollTrigger.Vars>): gsap.core.Timeline {
    return this.gsapService.createPinnedSection(trigger, content, vars as any);
  }

  parallax(trigger: string, element: string, speed: number = 0.5): ScrollTrigger {
    return this.gsapService.createParallax(trigger, element, speed);
  }

  horizontalScroll(
    trigger: string,
    container: string,
    xPercent: number = -100,
    scrub: boolean | number = true
  ): gsap.core.Tween {
    return this.gsapService.createHorizontalScroll(trigger, container, xPercent, scrub);
  }

  batch_animate(selector: string, vars: gsap.TweenVars): void {
    this.gsapService.batch(selector, vars);
  }

  matchMedia(desktop?: () => void, tablet?: () => void, mobile?: () => void): void {
    this.gsapService.matchMedia({ desktop, tablet, mobile });
  }

  ease(type: EasingType, direction: EaseDirection = 'out'): string {
    const directions = { in: '.in', out: '.out', inOut: '.inOut' };
    const eases: Record<EasingType, string> = {
      none: 'none',
      power1: 'power1',
      power2: 'power2',
      power3: 'power3',
      power4: 'power4',
      back: `back${directions.inOut}`,
      elastic: `elastic${direction === 'in' ? '.in' : '.out'}`,
      bounce: 'bounce.out',
      circ: `circ${directions.inOut}`,
      expo: `expo${directions.inOut}`,
      sine: `sine${directions.inOut}`
    };
    return eases[type] || 'power2.out';
  }

  refresh(): void {
    ScrollTrigger.refresh();
  }

  update(): void {
    ScrollTrigger.update();
  }
}

export class GsapTimelineBuilder2 {
  private timeline?: gsap.core.Timeline;
  private timelinesMap: Map<string, gsap.core.Timeline>;

  constructor(timelines: Map<string, gsap.core.Timeline>, name: string) {
    this.timelinesMap = timelines;
    this.timeline = timelines.get(name) || gsap.timeline();
    timelines.set(name, this.timeline);
  }

  add(options: GsapAnimationOptions, position?: string | number): GsapTimelineBuilder2 {
    const { selector, from, to, duration, ease, stagger, delay, repeat, yoyo, onComplete } = options;
    
    const elements = Array.from(document.querySelectorAll(selector));
    if (!elements.length) return this;

    const animVars: gsap.TweenVars = {
      ...to,
      duration: duration ?? 1,
      ease: ease ?? 'power2.out',
      stagger: stagger ?? 0,
      delay: delay ?? 0,
      repeat: repeat ?? 0,
      yoyo: yoyo ?? false
    };

    if (from) {
      this.timeline!.fromTo(elements, from, animVars, position);
    } else {
      this.timeline!.to(elements, animVars, position);
    }

    return this;
  }

  fadeIn(selector: string, position?: string | number): GsapTimelineBuilder2 {
    return this.add({ selector, to: { opacity: 1, visibility: 'visible' } }, position);
  }

  fadeUp(selector: string, yDistance: number = 50, position?: string | number): GsapTimelineBuilder2 {
    return this.add({ selector, from: { opacity: 0, y: yDistance }, to: { opacity: 1, y: 0 } }, position);
  }

  scaleIn(selector: string, position?: string | number): GsapTimelineBuilder2 {
    return this.add({ selector, from: { scale: 0, opacity: 0 }, to: { scale: 1, opacity: 1 } }, position);
  }

  rotateIn(selector: string, position?: string | number): GsapTimelineBuilder2 {
    return this.add({ 
      selector, 
      from: { rotation: -180, opacity: 0, transformOrigin: 'center center' }, 
      to: { rotation: 0, opacity: 1 } 
    }, position);
  }

  stagger(selector: string, yDistance: number = 30, staggerVal: number = 0.1, position?: string | number): GsapTimelineBuilder2 {
    return this.add({ 
      selector, 
      from: { opacity: 0, y: yDistance }, 
      to: { opacity: 1, y: 0 },
      stagger: staggerVal
    }, position);
  }

  toTimeline(): gsap.core.Timeline {
    return this.timeline!;
  }

  play(): void {
    this.timeline!.play();
  }

  pause(): void {
    this.timeline!.pause();
  }

  reverse(): void {
    this.timeline!.reverse();
  }

  restart(): void {
    this.timeline!.restart();
  }

  kill(): void {
    this.timeline!.kill();
  }
}