import { Component, ElementRef, AfterViewInit, OnDestroy, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TestimonialsSectionData } from './section-interfaces';

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="section alt">
      <div class="section-header">
        <span class="section-tag">{{ data.tag }}</span>
        <h2 class="section-title">{{ data.title }}</h2>
        <p class="section-desc">{{ data.desc }}</p>
      </div>
      <div class="testimonials-grid">
        @for (t of data.testimonials; track t.author; let i = $index) {
          <div class="testimonial-card" [attr.data-idx]="i">
            <div class="t-quote"><i class="fas fa-quote-left"></i> {{ t.quote }}</div>
            <div class="t-author">
              <div class="t-avatar">{{ t.initials }}</div>
              <div><strong>{{ t.author }}</strong><span>{{ t.role }}</span></div>
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .section { padding: 6rem 2rem; position: relative; overflow: hidden; }
    .alt { background: #0c0c18; }
    .section-header { text-align: center; margin-bottom: 4rem; }
    .section-tag {
      display: inline-flex; align-items: center; gap: 0.4rem;
      font-size: 0.7rem; font-weight: 700; letter-spacing: 0.15em;
      text-transform: uppercase; color: #00c896;
      padding: 0.35rem 1rem; border: 1px solid rgba(0,200,150,0.1);
      border-radius: 100px; margin-bottom: 1rem;
      background: rgba(0,200,150,0.02);
    }
    .section-title {
      font-size: clamp(1.8rem, 4vw, 2.8rem);
      font-weight: 700; color: #fff; margin-bottom: 0.75rem; line-height: 1.15;
    }
    .section-desc {
      font-size: clamp(0.85rem, 1.2vw, 1rem);
      color: rgba(255,255,255,0.35);
      max-width: 520px; margin: 0 auto; line-height: 1.7;
    }
    .testimonials-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem; max-width: 1100px; margin: 0 auto;
    }
    .testimonial-card {
      background: rgba(255,255,255,0.012); border: 1px solid rgba(255,255,255,0.04);
      border-radius: 18px; padding: 2rem;
      transition: border-color 0.3s, transform 0.3s;
    }
    .testimonial-card:hover { border-color: rgba(0,200,150,0.08); transform: translateY(-3px); }
    .t-quote { font-size: 0.88rem; color: rgba(255,255,255,0.45); line-height: 1.65; margin-bottom: 1.5rem; font-style: italic; }
    .t-quote i { color: #00c896; opacity: 0.15; margin-right: 0.3rem; font-size: 0.7rem; }
    .t-author { display: flex; align-items: center; gap: 0.85rem; }
    .t-avatar {
      width: 40px; height: 40px; border-radius: 50%;
      background: linear-gradient(135deg, rgba(0,200,150,0.08), rgba(0,163,212,0.04));
      border: 1px solid rgba(0,200,150,0.06);
      display: flex; align-items: center; justify-content: center;
      font-size: 0.75rem; font-weight: 700; color: #00c896; flex-shrink: 0;
    }
    .t-author strong { display: block; font-size: 0.82rem; font-weight: 600; color: #fff; }
    .t-author span { font-size: 0.7rem; color: rgba(255,255,255,0.25); }
  `]
})
export class TestimonialsSectionComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) data!: TestimonialsSectionData;
  private el = inject(ElementRef);
  private ctx!: gsap.Context;

  ngAfterViewInit() {
    gsap.registerPlugin(ScrollTrigger);
    this.ctx = gsap.context(() => this.initAnim(), this.el.nativeElement);
  }

  private initAnim() {
    gsap.from('.testimonial-card', {
      opacity: 0, y: 50, rotationX: 5, duration: 0.8, ease: 'power3.out',
      stagger: { amount: 0.5, from: 'start' },
      scrollTrigger: { trigger: '.testimonials-grid', start: 'top 80%', toggleActions: 'play none none none' }
    });
  }

  ngOnDestroy() { this.ctx?.revert(); }
}
