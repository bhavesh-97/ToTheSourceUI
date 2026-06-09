import { Component, ElementRef, AfterViewInit, OnDestroy, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ServicesSectionData } from './section-interfaces';

@Component({
  selector: 'app-services-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="section alt">
      <div class="section-header">
        <span class="section-tag">{{ data.tag }}</span>
        <h2 class="section-title">{{ data.title }}</h2>
        <p class="section-desc">{{ data.desc }}</p>
      </div>
      <div class="services-grid">
        @for (svc of data.services; track svc.title; let i = $index) {
          <div class="service-card" [attr.data-idx]="i">
            <div class="sc-icon"><i [class]="svc.icon"></i></div>
            <h3>{{ svc.title }}</h3>
            <p>{{ svc.description }}</p>
            <a [routerLink]="svc.link || '/services'" class="sc-link">{{ svc.linkText || 'Learn More' }} <i class="fas fa-arrow-right"></i></a>
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
    .services-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem; max-width: 1200px; margin: 0 auto;
    }
    .service-card {
      background: rgba(255,255,255,0.012); border: 1px solid rgba(255,255,255,0.04);
      border-radius: 18px; padding: 2.5rem 2rem;
      position: relative; overflow: hidden; backdrop-filter: blur(10px); will-change: transform;
    }
    .service-card::before {
      content: ''; position: absolute; inset: 0; border-radius: 18px;
      background: linear-gradient(135deg, rgba(0,200,150,0.03), transparent 50%);
      opacity: 0; transition: opacity 0.5s; pointer-events: none;
    }
    .service-card:hover::before { opacity: 1; }
    .sc-icon {
      width: 50px; height: 50px; border-radius: 14px;
      background: linear-gradient(135deg, rgba(0,200,150,0.08), rgba(0,163,212,0.04));
      border: 1px solid rgba(0,200,150,0.06);
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 1.25rem; font-size: 1.15rem; color: #00c896; will-change: transform;
    }
    .service-card h3 { font-size: 1.1rem; font-weight: 600; color: #fff; margin-bottom: 0.6rem; }
    .service-card p { font-size: 0.85rem; color: rgba(255,255,255,0.35); line-height: 1.65; }
    .sc-link {
      display: inline-flex; align-items: center; gap: 0.3rem;
      margin-top: 1.25rem; font-size: 0.8rem; font-weight: 600;
      color: #00c896; text-decoration: none;
    }
  `]
})
export class ServicesSectionComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) data!: ServicesSectionData;
  private el = inject(ElementRef);
  private ctx!: gsap.Context;

  ngAfterViewInit() {
    gsap.registerPlugin(ScrollTrigger);
    this.ctx = gsap.context(() => this.initAnim(), this.el.nativeElement);
  }

  private initAnim() {
    const cards = this.el.nativeElement.querySelectorAll('.service-card');
    gsap.from(cards, {
      opacity: 0, y: 60, scale: 0.95, duration: 0.9, ease: 'power3.out',
      stagger: { amount: 0.6, from: 'start' },
      scrollTrigger: { trigger: '.services-grid', start: 'top 80%', toggleActions: 'play none none none' }
    });
    cards.forEach((card: Element) => {
      const c = card as HTMLElement;
      const icon = c.querySelector('.sc-icon') as HTMLElement;
      const link = c.querySelector('.sc-link') as HTMLElement;
      c.addEventListener('mouseenter', () => {
        gsap.to(c, { y: -8, borderColor: 'rgba(0,200,150,0.15)', duration: 0.4, ease: 'power2.out' });
        gsap.to(icon, { scale: 1.1, duration: 0.3, ease: 'back.out(2)' });
        if (link) gsap.to(link, { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' });
      });
      c.addEventListener('mouseleave', () => {
        gsap.to(c, { y: 0, borderColor: 'rgba(255,255,255,0.04)', duration: 0.4, ease: 'power2.out' });
        gsap.to(icon, { scale: 1, duration: 0.3, ease: 'power2.out' });
        if (link) gsap.to(link, { opacity: 0, x: -6, duration: 0.3, ease: 'power2.out' });
      });
    });
  }

  ngOnDestroy() { this.ctx?.revert(); }
}
