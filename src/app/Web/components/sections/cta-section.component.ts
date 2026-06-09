import { Component, ElementRef, AfterViewInit, OnDestroy, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CtaSectionData } from './section-interfaces';

@Component({
  selector: 'app-cta-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="section cta-section">
      <div class="cta-glow"></div>
      <div class="cta-inner">
        <h2>{{ data.title }}</h2>
        <p>{{ data.desc }}</p>
        <a [routerLink]="data.btnLink" class="btn btn-primary btn-lg">{{ data.btnText }} <i class="fas fa-arrow-right"></i></a>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .section { padding: 6rem 2rem; position: relative; overflow: hidden; }
    .cta-section { background: linear-gradient(135deg, #08080f, #0c0c18, #101020); text-align: center; }
    .cta-glow {
      position: absolute; inset: 0;
      background: radial-gradient(ellipse at 30% 50%, rgba(0,200,150,0.03) 0%, transparent 60%),
                  radial-gradient(ellipse at 70% 50%, rgba(0,163,212,0.02) 0%, transparent 60%);
      pointer-events: none;
    }
    .cta-inner { position: relative; z-index: 1; max-width: 620px; margin: 0 auto; }
    .cta-inner h2 { font-size: clamp(1.8rem, 3.5vw, 2.7rem); font-weight: 700; margin-bottom: 1rem; color: #fff; }
    .cta-inner p { font-size: 1rem; color: rgba(255,255,255,0.35); margin-bottom: 2.5rem; }
    .btn {
      display: inline-flex; align-items: center; gap: 0.5rem;
      padding: 0.85rem 2rem; border-radius: 50px;
      text-decoration: none; font-weight: 600;
      font-size: 0.88rem; cursor: pointer; font-family: inherit;
      transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s;
      border: none;
    }
    .btn-primary {
      background: linear-gradient(135deg, #00c896, #00a3d4); color: #fff;
      box-shadow: 0 4px 25px rgba(0,200,150,0.2);
    }
    .btn-primary:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 8px 40px rgba(0,200,150,0.4); }
    .btn-lg { padding: 1rem 2.5rem; font-size: 1rem; }
    .btn i { font-size: 0.75rem; transition: transform 0.3s; }
    .btn-primary:hover i { transform: translateX(4px); }
  `]
})
export class CtaSectionComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) data!: CtaSectionData;
  private el = inject(ElementRef);
  private ctx!: gsap.Context;

  ngAfterViewInit() {
    gsap.registerPlugin(ScrollTrigger);
    this.ctx = gsap.context(() => this.initAnim(), this.el.nativeElement);
  }

  private initAnim() {
    gsap.from('.cta-inner > *', {
      opacity: 0, y: 30, duration: 0.7, ease: 'power3.out', stagger: 0.15,
      scrollTrigger: { trigger: '.cta-section', start: 'top 80%', toggleActions: 'play none none none' }
    });
  }

  ngOnDestroy() { this.ctx?.revert(); }
}
