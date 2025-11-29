import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Directive({
  selector: '[lazyPreview]'
})
export class LazyPreviewDirective implements OnInit, OnDestroy {
  @Input() rootMargin = '100px';
  @Input() threshold = 0.1;
  @Output() visible = new EventEmitter<void>();

  private observer?: IntersectionObserver;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (!('IntersectionObserver' in window)) {
      setTimeout(() => this.visible.emit(), 0);
      return;
    }

    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.visible.emit();
          this.observer?.unobserve(this.el.nativeElement);
        }
      });
    }, { root: null, rootMargin: this.rootMargin, threshold: this.threshold });

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
