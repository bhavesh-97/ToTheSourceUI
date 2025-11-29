import { Directive, ElementRef, Input, OnInit, AfterViewInit, inject } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

@Directive({
  selector: '[gsap], [gsapFade], [gsapStagger], [gsapParallax], [gsapPin], [gsapText]',
  standalone: true
})
export class GsapMasterDirective implements OnInit, AfterViewInit {
  private el = inject(ElementRef).nativeElement;

  // === MAIN ANIMATION ===
  @Input() gsap?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale-in' | 'rotate-in' | 'flip';
  @Input() gsapFade?: boolean;

  // === STAGGER CHILDREN ===
  @Input() gsapStagger?: string = ''; // selector: ".card"

  // === PARALLAX ===
  @Input() gsapParallax?: number | string = 0.5;

  // === PIN SECTION ===
  @Input() gsapPin?: boolean = false;

  // === TEXT SPLIT ===
  @Input() gsapText?: boolean = false;

  // === CUSTOM OPTIONS ===
  @Input() delay = 0;
  @Input() duration = 1;
  @Input() ease = 'power3.out';
  @Input() start = 'top 85%';

  ngOnInit() {
    const preset = this.gsap || (this.gsapFade ? 'fade-up' : null);

    if (preset) {
      const animations: any = {
        'fade-up': { y: 100, opacity: 0 },
        'fade-down': { y: -100, opacity: 0 },
        'fade-left': { x: -100, opacity: 0 },
        'fade-right': { x: 100, opacity: 0 },
        'scale-in': { scale: 0.8, opacity: 0 },
        'rotate-in': { rotation: -180, opacity: 0 },
        'flip': { rotationX: -90, opacity: 0, transformOrigin: '50% 50%' }
      };

      gsap.from(this.el, {
        ...animations[preset],
        duration: this.duration,
        ease: this.ease,
        delay: this.delay,
        scrollTrigger: {
          trigger: this.el,
          start: this.start,
          toggleActions: 'play none none reverse'
        }
      });
    }

    // STAGGER
    if (this.gsapStagger) {
      gsap.from(this.el.querySelectorAll(this.gsapStagger), {
        y: 80,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: this.el, start: 'top 80%' }
      });
    }

    // PARALLAX
    if (this.gsapParallax !== undefined) {
      const speed = typeof this.gsapParallax === 'string' ? parseFloat(this.gsapParallax) : this.gsapParallax;
      gsap.to(this.el, {
        yPercent: -100 * speed,
        ease: 'none',
        scrollTrigger: { trigger: this.el, scrub: true }
      });
    }

    // PIN
    if (this.gsapPin) {
      ScrollTrigger.create({
        trigger: this.el,
        start: 'top top',
        end: '+=1000',
        pin: true,
        pinSpacing: true
      });
    }

    // TEXT SPLIT
    if (this.gsapText) {
      const split = new SplitText(this.el, { type: 'chars,words' });
      gsap.from(split.chars, {
        y: 50,
        opacity: 0,
        stagger: 0.03,
        duration: 0.8,
        ease: 'back.out(1.7)',
        scrollTrigger: { trigger: this.el, start: 'top 85%' }
      });
    }
  }

  ngAfterViewInit() {
    ScrollTrigger.refresh();
  }
}