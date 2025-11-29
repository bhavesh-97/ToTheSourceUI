import { Injectable, OnDestroy } from '@angular/core';
import Lenis from '@studio-freight/lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';

@Injectable({ providedIn: 'root' })
export class LenisService implements OnDestroy {
  lenis?: Lenis;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initLenis();
    }
  }

  private initLenis() {
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1,
    });

    // GSAP proxy
    ScrollTrigger.scrollerProxy(window, {
      scrollTop: (value) => {
        if (value !== undefined) {
          this.lenis?.scrollTo(value, { immediate: true });
        }
        return this.lenis?.scroll;
      },
      getBoundingClientRect: () => ({
        top: 0, left: 0,
        width: window.innerWidth,
        height: window.innerHeight
      }),
    });

    this.lenis.on('scroll', () => ScrollTrigger.update());

    gsap.ticker.add((time) => {
      this.lenis?.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  scrollTo(target: string | number | HTMLElement, offset = 0) {
    this.lenis?.scrollTo(target, { offset });
  }

  stop() { this.lenis?.stop(); }
  start() { this.lenis?.start(); }

  ngOnDestroy() {
    this.lenis?.destroy();
  }
}
