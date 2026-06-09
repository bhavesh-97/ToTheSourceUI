import { Directive, ElementRef, Input, OnInit, OnDestroy, inject, AfterViewInit } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Directive({
  selector: '[gsapAnimate]',
  standalone: true
})
export class GsapAnimateDirective implements OnInit, AfterViewInit, OnDestroy {
  private el = inject(ElementRef);

  @Input('gsapAnimate') animationType: string = 'fadeUp';
  @Input() gsapSelector?: string;
  @Input() gsapDuration?: number;
  @Input() gsapDelay?: number;
  @Input() gsapEase?: string;
  @Input() gsapScroll?: boolean;
  @Input() gsapStagger?: number;
  @Input() gsapFrom?: any;
  @Input() gsapTo?: any;
  @Input() gsapRepeat?: number;
  @Input() gsapYoyo?: boolean;

  private tween: gsap.core.Tween | null = null;

  ngOnInit() {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.applyAnimation();
    }, 100);
  }

  private applyAnimation() {
    const element = this.gsapSelector
      ? this.el.nativeElement.querySelector(this.gsapSelector)
      : this.el.nativeElement;

    if (!element) return;

    const duration = this.gsapDuration ?? 1;
    const delay = this.gsapDelay ?? 0;
    const ease = this.gsapEase || 'power2.out';
    const stagger = this.gsapStagger ?? 0;

    const scrollOptions: any = this.gsapScroll !== false ? {
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    } : {};

    const vars: any = {
      duration,
      delay,
      ease,
      stagger,
      ...scrollOptions
    };

    if (this.gsapRepeat !== undefined) vars.repeat = this.gsapRepeat;
    if (this.gsapYoyo !== undefined) vars.yoyo = this.gsapYoyo;

    if (this.gsapFrom && this.gsapTo) {
      this.tween = gsap.fromTo(element, this.gsapFrom, { ...this.gsapTo, ...vars });
    } else {
      switch (this.animationType) {
        case 'fadeUp':
          this.tween = gsap.fromTo(element, { opacity: 0, y: 30 }, { opacity: 1, y: 0, ...vars });
          break;
        case 'fadeDown':
          this.tween = gsap.fromTo(element, { opacity: 0, y: -30 }, { opacity: 1, y: 0, ...vars });
          break;
        case 'fadeLeft':
          this.tween = gsap.fromTo(element, { opacity: 0, x: -30 }, { opacity: 1, x: 0, ...vars });
          break;
        case 'fadeRight':
          this.tween = gsap.fromTo(element, { opacity: 0, x: 30 }, { opacity: 1, x: 0, ...vars });
          break;
        case 'scaleIn':
          this.tween = gsap.fromTo(element, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, ...vars });
          break;
        case 'zoomIn':
          this.tween = gsap.fromTo(element, { opacity: 0, scale: 1.2 }, { opacity: 1, scale: 1, ...vars });
          break;
        case 'slideUp':
          this.tween = gsap.fromTo(element, { y: 60 }, { y: 0, ...vars });
          break;
        case 'blurIn':
          this.tween = gsap.fromTo(element, { opacity: 0, filter: 'blur(10px)' }, { opacity: 1, filter: 'blur(0px)', ...vars });
          break;
        case 'rotateIn':
          this.tween = gsap.fromTo(element, { opacity: 0, rotation: -15 }, { opacity: 1, rotation: 0, ...vars });
          break;
        case 'elasticPop':
          this.tween = gsap.fromTo(element, { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, ease: 'elastic.out(1, 0.5)', ...vars });
          break;
        default:
          this.tween = gsap.fromTo(element, { opacity: 0, y: 30 }, { opacity: 1, y: 0, ...vars });
      }
    }
  }

  ngOnDestroy() {
    if (this.tween) {
      this.tween.kill();
      this.tween = null;
    }
  }
}

@Directive({
  selector: '[gsapAuto]',
  standalone: true
})
export class GsapAutoDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef);
  private observer: MutationObserver | null = null;

  @Input() gsapAutoSelector?: string;
  @Input() gsapAutoType: string = 'fadeUp';
  @Input() gsapAutoStagger: number = 0.1;
  @Input() gsapAutoDuration: number = 0.8;
  @Input() gsapAutoScroll: boolean = true;

  ngOnInit() {
    gsap.registerPlugin(ScrollTrigger);

    setTimeout(() => this.applyAuto(), 200);

    this.observer = new MutationObserver(() => {
      this.applyAuto();
    });
    this.observer.observe(this.el.nativeElement, { childList: true, subtree: true });
  }

  private applyAuto() {
    const container = this.el.nativeElement;
    const selector = this.gsapAutoSelector || '> *';

    const elements = container.querySelectorAll(selector);

    if (elements.length === 0) return;

    const scrollOptions: any = this.gsapAutoScroll ? {
      scrollTrigger: {
        trigger: container,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    } : {};

    switch (this.gsapAutoType) {
      case 'fadeUp':
        gsap.fromTo(elements,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: this.gsapAutoDuration, stagger: this.gsapAutoStagger, ...scrollOptions }
        );
        break;
      case 'fadeLeft':
        gsap.fromTo(elements,
          { opacity: 0, x: -40 },
          { opacity: 1, x: 0, duration: this.gsapAutoDuration, stagger: this.gsapAutoStagger, ...scrollOptions }
        );
        break;
      case 'fadeRight':
        gsap.fromTo(elements,
          { opacity: 0, x: 40 },
          { opacity: 1, x: 0, duration: this.gsapAutoDuration, stagger: this.gsapAutoStagger, ...scrollOptions }
        );
        break;
      case 'scaleIn':
        gsap.fromTo(elements,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: this.gsapAutoDuration, stagger: this.gsapAutoStagger, ...scrollOptions }
        );
        break;
      case 'stagger':
        gsap.fromTo(elements,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: this.gsapAutoDuration, stagger: this.gsapAutoStagger, ...scrollOptions }
        );
        break;
    }
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
