import { Component, ElementRef, AfterViewInit, OnDestroy, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { StatsSectionData } from './section-interfaces';

@Component({
  selector: 'app-stats-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="section stats-section">
      <div class="stats-glow"></div>
      <div class="stats-grid">
        @for (item of data.items; track item.label) {
          <div class="stat-item">
            <div class="stat-val"><span class="stat-num" [attr.data-target]="item.value">0</span><span class="stat-sfx">{{ item.suffix }}</span></div>
            <span class="stat-lbl">{{ item.label }}</span>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .section { padding: 6rem 2rem; position: relative; overflow: hidden; }
    .stats-section { background: linear-gradient(135deg, #08080f, #0c0c18); }
    .stats-glow {
      position: absolute; inset: 0;
      background: radial-gradient(ellipse at 50% 0%, rgba(0,200,150,0.02) 0%, transparent 60%);
      pointer-events: none;
    }
    .stats-grid {
      display: grid; grid-template-columns: repeat(4, 1fr);
      gap: 2rem; max-width: 800px; margin: 0 auto; position: relative; z-index: 1;
    }
    .stat-item { text-align: center; padding: 2rem 1rem; }
    .stat-val { display: flex; align-items: baseline; justify-content: center; }
    .stat-num { font-size: clamp(2.3rem, 4.5vw, 3.2rem); font-weight: 800; color: #fff; line-height: 1; }
    .stat-sfx { font-size: clamp(1.1rem, 2vw, 1.6rem); font-weight: 700; color: #00c896; }
    .stat-lbl { display: block; font-size: 0.82rem; color: rgba(255,255,255,0.25); margin-top: 0.4rem; }
    @media (max-width: 1024px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 640px) { .stats-grid { grid-template-columns: 1fr; } }
  `]
})
export class StatsSectionComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) data!: StatsSectionData;
  private el = inject(ElementRef);
  private ctx!: gsap.Context;

  ngAfterViewInit() {
    gsap.registerPlugin(ScrollTrigger);
    this.ctx = gsap.context(() => this.initAnim(), this.el.nativeElement);
  }

  private initAnim() {
    gsap.from('.stat-item', {
      opacity: 0, y: 40, duration: 0.8, ease: 'power3.out', stagger: 0.15,
      scrollTrigger: { trigger: '.stats-grid', start: 'top 80%', toggleActions: 'play none none none' }
    });
    const nums = this.el.nativeElement.querySelectorAll('.stat-num[data-target]');
    ScrollTrigger.batch(nums, {
      start: 'top 85%', once: true,
      onEnter: (batch) => {
        batch.forEach((el: Element) => {
          const target = parseInt(el.getAttribute('data-target') || '0');
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target, duration: 2.2, ease: 'power3.out',
            onUpdate: () => { el.textContent = String(Math.floor(obj.val)); }
          });
        });
      }
    });
  }

  ngOnDestroy() { this.ctx?.revert(); }
}
