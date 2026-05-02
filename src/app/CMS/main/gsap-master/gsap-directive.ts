import { Directive, ElementRef, Input, OnInit, OnDestroy, inject } from '@angular/core';
// import { GsapAutoService } from '../../../services/gsap-auto.service';

@Directive({
  selector: '[gsapAnimate]',
  standalone: true
})
export class GsapAnimateDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef);
  // private gsap = inject(GsapAutoService);

  @Input('gsapAnimate') animationType = 'fadeUp';
  @Input() gsapSelector?: string;
  @Input() gsapDuration?: number;
  @Input() gsapDelay?: number;
  @Input() gsapScroll = true;

  ngOnInit() {
    setTimeout(() => {
      const selector = this.gsapSelector || this.el.nativeElement.className?.split(' ')[0] || '';
      if (selector) {
        // this.gsap.applyToElement(`.${selector}`, this.animationType);
      }
    }, 500);
  }

  ngOnDestroy() {}
}

@Directive({
  selector: '[gsapAuto]',
  standalone: true
})
export class GsapAutoDirective implements OnInit, OnDestroy {
  // private gsap = inject(GsapAutoService);

  ngOnInit() {
    // this.gsap.startAutoApply();
  }

  ngOnDestroy() {
    // this.gsap.stopAutoApply();
  }
}