import { Component, ElementRef, AfterViewInit, OnDestroy, HostListener, ViewChild, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatedBgComponent } from '../animated-bg/animated-bg.component';
import { HeroSectionData } from './section-interfaces';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, RouterModule, AnimatedBgComponent],
  template: `
    <section class="hero" #heroSection>
      <div class="hero-bg" #heroBg>
        <app-animated-bg variant="hero" color1="#00c896" color2="#00a3d4" color3="#6366f1"></app-animated-bg>
        <div class="hero-grid"></div>
        <div class="glow g1"></div>
        <div class="glow g2"></div>
      </div>
      <div class="hero-inner">
        <div class="hero-content">
          <div class="hero-badge" #badge>
            <i class="fas fa-bolt"></i>
            <span>{{ data.badge }}</span>
          </div>
          <h1 class="hero-title" #title>
            <span class="hero-line">{{ data.line1 }}</span>
            <span class="hero-line hero-line--gradient" #gradientLine>{{ data.line2 }}</span>
          </h1>
          <p class="hero-desc" #desc>{{ data.desc }}</p>
          <div class="hero-actions" #actions>
            <a [routerLink]="data.primaryBtn.link" class="btn btn-primary">{{ data.primaryBtn.text }} <i class="fas fa-arrow-right"></i></a>
            <a [routerLink]="data.secondaryBtn.link" class="btn btn-outline">{{ data.secondaryBtn.text }}</a>
          </div>
        </div>
        <div class="hero-stats" #stats>
          @for (s of data.stats; track s.label) {
            <div class="hero-stat"><span class="hero-stat-num">{{ s.value }}</span><span class="hero-stat-plus">{{ s.suffix }}</span><span class="hero-stat-lbl">{{ s.label }}</span></div>
          }
        </div>
      </div>
      <div class="scroll-hint" #scrollHint>
        <span>SCROLL</span>
        <div class="scroll-line"><div class="scroll-dot"></div></div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .hero {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: #08080f; overflow: hidden; position: relative;
    }
    .hero-bg { position: absolute; inset: 0; z-index: 0; }
    .hero-grid {
      position: absolute; inset: 0;
      background-image: linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px);
      background-size: 65px 65px;
    }
    .glow { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(100px); will-change: transform; }
    .g1 { width: 700px; height: 700px; background: rgba(0,200,150,0.06); top: -20%; right: -15%; }
    .g2 { width: 500px; height: 500px; background: rgba(0,163,212,0.04); bottom: -20%; left: -10%; }
    .hero-inner { position: relative; z-index: 1; width: 100%; }
    .hero-content { text-align: center; padding: 2rem; max-width: 850px; margin: 0 auto; }
    .hero-badge {
      display: inline-flex; align-items: center; gap: 0.4rem;
      font-size: 0.75rem; font-weight: 600; letter-spacing: 0.12em;
      text-transform: uppercase; color: #00c896;
      padding: 0.4rem 1.1rem;
      border: 1px solid rgba(0,200,150,0.1);
      border-radius: 100px; margin-bottom: 2rem;
      background: rgba(0,200,150,0.02);
    }
    .hero-badge i { font-size: 0.6rem; }
    .hero-title { margin-bottom: 1.25rem; }
    .hero-line {
      display: block;
      font-size: clamp(2.5rem, 8vw, 5rem);
      font-weight: 800; line-height: 1.08; letter-spacing: -0.03em; color: #fff;
    }
    .hero-line--gradient {
      background: linear-gradient(135deg, #00c896, #00a3d4, #6366f1);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hero-desc {
      font-size: clamp(0.95rem, 1.4vw, 1.1rem);
      color: rgba(255,255,255,0.35);
      max-width: 540px; margin: 0 auto 2.5rem; line-height: 1.7;
    }
    .hero-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
    .btn {
      display: inline-flex; align-items: center; gap: 0.5rem;
      padding: 0.85rem 2rem; border-radius: 50px;
      text-decoration: none; font-weight: 600;
      font-size: 0.88rem; cursor: pointer; font-family: inherit;
      transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s;
      border: none;
    }
    .btn-primary {
      background: linear-gradient(135deg, #00c896, #00a3d4);
      color: #fff; box-shadow: 0 4px 25px rgba(0,200,150,0.2);
    }
    .btn-primary:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 8px 40px rgba(0,200,150,0.4); }
    .btn-outline {
      background: transparent; border: 1.5px solid rgba(255,255,255,0.12);
      color: rgba(255,255,255,0.75);
    }
    .btn-outline:hover { border-color: rgba(255,255,255,0.3); color: #fff; transform: translateY(-3px); }
    .btn i { font-size: 0.75rem; transition: transform 0.3s; }
    .btn-primary:hover i { transform: translateX(4px); }
    .hero-stats {
      display: flex; gap: 2.5rem; justify-content: center;
      margin-top: 3.5rem; padding-top: 2.5rem;
      border-top: 1px solid rgba(255,255,255,0.03);
      max-width: 600px; margin-left: auto; margin-right: auto;
    }
    .hero-stat { text-align: center; }
    .hero-stat-num { font-size: 1.6rem; font-weight: 800; color: #fff; line-height: 1; }
    .hero-stat-plus { font-size: 1rem; font-weight: 700; color: #00c896; margin-left: 1px; }
    .hero-stat-lbl { display: block; font-size: 0.72rem; color: rgba(255,255,255,0.25); margin-top: 0.2rem; letter-spacing: 0.03em; }
    .scroll-hint {
      position: absolute; bottom: 2.5rem; left: 50%; translate: -50% 0;
      display: flex; flex-direction: column; align-items: center; gap: 0.5rem; z-index: 1;
    }
    .scroll-hint span { font-size: 0.55rem; font-weight: 600; letter-spacing: 0.25em; color: rgba(255,255,255,0.12); }
    .scroll-line { width: 1px; height: 30px; background: rgba(255,255,255,0.04); position: relative; overflow: hidden; }
    .scroll-dot { width: 2px; height: 10px; background: #00c896; border-radius: 2px; position: absolute; top: -10px; left: -0.5px; }
    @media (max-width: 768px) { .hero-stats { gap: 1.5rem; flex-wrap: wrap; } }
    @media (max-width: 640px) { .hero-stats { flex-direction: column; gap: 1.2rem; } }
  `]
})
export class HeroSectionComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) data!: HeroSectionData;
  @ViewChild(AnimatedBgComponent) animatedBg?: AnimatedBgComponent;

  private el = inject(ElementRef);
  private ctx!: gsap.Context;
  private tl = gsap.timeline();

  ngAfterViewInit() {
    gsap.registerPlugin(ScrollTrigger);
    this.ctx = gsap.context(() => {
      this.initHeroAnim();
    }, this.el.nativeElement);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    const x = (e.clientX / window.innerWidth - 0.5);
    const y = (e.clientY / window.innerHeight - 0.5);
    const px = x * 20;
    const py = y * 20;
    gsap.to('.g1', { x: px * 0.3, y: py * 0.3, duration: 1.5, ease: 'power2.out', overwrite: 'auto' });
    gsap.to('.g2', { x: px * -0.2, y: py * -0.2, duration: 1.5, ease: 'power2.out', overwrite: 'auto' });
    gsap.to('.hero-content', { x: px * 0.05, y: py * 0.05, duration: 1.2, ease: 'power2.out', overwrite: 'auto' });
    if (this.animatedBg) this.animatedBg.updateMouse(x, y);
  }

  private initHeroAnim() {
    this.tl
      .from('.hero-badge', { opacity: 0, y: 25, scale: 0.9, duration: 0.7, ease: 'back.out(1.7)' })
      .from('.hero-line', { opacity: 0, y: 60, duration: 1, ease: 'power4.out', stagger: 0.2 }, '-=0.3')
      .from('.hero-desc', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' }, '-=0.5')
      .from('.hero-actions .btn', { opacity: 0, y: 20, scale: 0.95, duration: 0.6, ease: 'back.out(1.4)', stagger: 0.12 }, '-=0.4')
      .from('.hero-stats', { opacity: 0, y: 25, duration: 0.7, ease: 'power3.out' }, '-=0.2')
      .from('.scroll-hint', { opacity: 0, y: 10, duration: 0.5, ease: 'power2.out' }, '-=0.1');

    gsap.to('.scroll-dot', { y: 30, duration: 1.8, repeat: -1, ease: 'power2.inOut', delay: 2.5 });
    gsap.to('.hero-grid', { y: 80, duration: 1, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 } });
    gsap.to('.g1', { y: -30, x: 15, duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.g2', { y: 30, x: -15, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.g1', { scale: 1.3, duration: 1, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 } });
  }

  ngOnDestroy() {
    this.ctx?.revert();
    this.tl?.kill();
    gsap.killTweensOf('*');
    ScrollTrigger.getAll().forEach(t => t.kill());
  }
}
