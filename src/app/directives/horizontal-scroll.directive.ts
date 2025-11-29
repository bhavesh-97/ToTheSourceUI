import { Directive, ElementRef, AfterViewInit, Input } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LenisService } from '../services/lenis.service';

@Directive({
  selector: '[horizontalScroll]',
  standalone: true
})
export class HorizontalScrollDirective implements AfterViewInit {
  @Input() speed = 1;

  constructor(private el: ElementRef, private lenis: LenisService) {}

  ngAfterViewInit() {
    const panels = this.el.nativeElement.querySelectorAll('.h-panel');
    const container = this.el.nativeElement;

    gsap.to(panels, {
      xPercent: -100 * (panels.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: container,
        pin: true,
        scrub: 1,
        end: () => "+=" + container.offsetWidth * this.speed,
        invalidateOnRefresh: true,
      }
    });

    ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: () => "+=" + container.offsetWidth * this.speed,
      onUpdate: self => {
        document.body.style.setProperty('--scroll-progress', `${self.progress}`);
      }
    });
  }
}