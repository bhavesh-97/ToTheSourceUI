import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TemplatePlaceholder } from '../../../shared/template-placeholder/template-placeholder';
import { GsapMasterDirective } from '../../../directives/gsap-master.directive';
import { WebGsapService } from '../../services/web-gsap.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, TemplatePlaceholder, GsapMasterDirective],
  template: `
    <!-- ══ HERO ══ -->
    <section class="hero" #heroSection>
      <div class="hero-bg" gsap="fade-up">
        <div class="grid-overlay"></div>
        <div class="hero-orb orb-1"></div>
        <div class="hero-orb orb-2"></div>
        <div class="hero-orb orb-3"></div>
        <div class="hero-orb orb-4"></div>
      </div>

      <div class="hero-content-wrapper">
        <app-template-placeholder
          templateType="landing-hero"
          [fallbackContent]="heroFallback">
        </app-template-placeholder>
      </div>

      <div class="scroll-indicator" gsap="fade-up">
        <span class="scroll-label">Scroll</span>
        <div class="scroll-line"><div class="scroll-dot" #scrollDot></div></div>
      </div>
    </section>

    <!-- ══ SERVICES ══ -->
    <section class="services" #servicesSection>
      <app-template-placeholder
        templateType="landing-services"
        [fallbackContent]="servicesFallback">
      </app-template-placeholder>
    </section>

    <!-- ══ STATS ══ -->
    <section class="stats" #statsSection>
      <app-template-placeholder
        templateType="landing-stats"
        [fallbackContent]="statsFallback">
      </app-template-placeholder>
    </section>

    <!-- ══ CTA ══ -->
    <section class="cta" #ctaSection>
      <app-template-placeholder
        templateType="landing-cta"
        [fallbackContent]="ctaFallback">
      </app-template-placeholder>
    </section>
  `,
  styles: [`
    :host { display: block; }

    ::ng-deep app-template-placeholder .loading-placeholder,
    ::ng-deep app-template-placeholder .error-placeholder {
      display: none;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.875rem 2rem;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: box-shadow 0.3s;
      position: relative;
      overflow: hidden;
    }
    .btn-primary {
      background: linear-gradient(135deg, #00c896, #00a3d4);
      color: #fff;
      box-shadow: 0 4px 25px rgba(0,200,150,0.25);
    }
    .btn-primary:hover { box-shadow: 0 8px 40px rgba(0,200,150,0.4); }
    .btn-secondary {
      background: transparent;
      border: 1.5px solid rgba(255,255,255,0.2);
      color: rgba(255,255,255,0.85);
    }
    .btn-secondary:hover {
      border-color: rgba(255,255,255,0.5);
      color: #fff;
    }
    .btn-lg {
      padding: 1rem 2.5rem;
      font-size: 1rem;
    }
    .btn-arrow { transition: transform 0.3s; }
    .btn-secondary:hover .btn-arrow { transform: translateX(3px); }

    .section-tag {
      display: inline-block;
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #00c896;
      margin-bottom: 0.75rem;
    }
    .section-title {
      font-size: clamp(2rem, 5vw, 3rem);
      font-weight: 700;
      color: #fff;
      margin-bottom: 1rem;
    }
    .section-desc {
      font-size: clamp(0.9rem, 1.5vw, 1.1rem);
      color: rgba(255,255,255,0.55);
      max-width: 560px;
      margin: 0 auto;
      line-height: 1.7;
    }
    .section-header { text-align: center; margin-bottom: 4rem; }

    /* ── Hero ── */
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      background: #0a0a14;
    }
    .hero-bg {
      position: absolute;
      inset: 0;
      z-index: 0;
    }
    .grid-overlay {
      position: absolute; inset: 0;
      background-image: linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
      background-size: 60px 60px;
    }
    .hero-orb {
      position: absolute; border-radius: 50%; pointer-events: none;
    }
    .orb-1 {
      width: 650px; height: 650px;
      background: radial-gradient(circle, rgba(0,200,150,0.12) 0%, transparent 70%);
      top: -20%; right: -10%;
    }
    .orb-2 {
      width: 450px; height: 450px;
      background: radial-gradient(circle, rgba(0,163,212,0.08) 0%, transparent 70%);
      bottom: -15%; left: -5%;
    }
    .orb-3 {
      width: 350px; height: 350px;
      background: radial-gradient(circle, rgba(233,69,96,0.06) 0%, transparent 70%);
      top: 30%; left: 50%;
    }
    .orb-4 {
      width: 250px; height: 250px;
      background: radial-gradient(circle, rgba(0,200,150,0.06) 0%, transparent 70%);
      top: 15%; left: 10%;
    }

    .hero-content-wrapper {
      position: relative; z-index: 1;
      display: flex; align-items: center; justify-content: center;
      width: 100%;
    }
    ::ng-deep .hero-content {
      text-align: center; padding: 2rem; max-width: 800px;
    }
    ::ng-deep .hero-tagline {
      display: inline-block;
      font-size: 0.8rem; font-weight: 600; letter-spacing: 0.2em;
      text-transform: uppercase; color: #00c896;
      padding: 0.4rem 1rem;
      border: 1px solid rgba(0,200,150,0.15);
      border-radius: 100px;
      margin-bottom: 1.5rem;
      background: rgba(0,200,150,0.04);
    }
    ::ng-deep .hero-title { margin-bottom: 1.5rem; }
    ::ng-deep .title-line {
      display: block;
      font-size: clamp(2.8rem, 10vw, 6rem);
      font-weight: 800; line-height: 1.1; color: #fff;
    }
    ::ng-deep .title-line:first-child { letter-spacing: -0.02em; }
    ::ng-deep .gradient-text {
      background: linear-gradient(135deg, #00c896, #00a3d4, #6366f1);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    ::ng-deep .hero-subtitle {
      font-size: clamp(0.95rem, 1.8vw, 1.2rem);
      color: rgba(255,255,255,0.55);
      line-height: 1.7;
      max-width: 550px; margin: 0 auto 2.5rem;
    }
    ::ng-deep .hero-actions {
      display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;
    }

    .scroll-indicator {
      position: absolute; bottom: 2.5rem; left: 50%;
      translate: -50% 0;
      display: flex; flex-direction: column; align-items: center;
      gap: 0.5rem; z-index: 1;
    }
    .scroll-label {
      font-size: 0.7rem; font-weight: 600; letter-spacing: 0.15em;
      text-transform: uppercase; color: rgba(255,255,255,0.3);
    }
    .scroll-line {
      width: 1px; height: 40px;
      background: rgba(255,255,255,0.1);
      position: relative; overflow: hidden;
    }
    .scroll-dot {
      width: 3px; height: 14px;
      background: #00c896; border-radius: 3px;
      position: absolute; top: -14px; left: -1px;
    }

    /* ── Services ── */
    .services { padding: 8rem 2rem; background: #0f0f1a; position: relative; }
    ::ng-deep .services-grid {
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 2rem; max-width: 1100px; margin: 0 auto;
    }
    ::ng-deep .service-card {
      background: rgba(255,255,255,0.025);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 20px; padding: 2.5rem 2rem;
      text-align: center; position: relative; overflow: hidden;
      cursor: default; backdrop-filter: blur(10px);
    }
    ::ng-deep .service-card::before {
      content: '';
      position: absolute; inset: 0; border-radius: 20px; padding: 1px;
      background: linear-gradient(135deg, rgba(0,200,150,0.1), rgba(0,163,212,0.05), transparent 60%);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor; mask-composite: exclude;
      pointer-events: none;
    }
    ::ng-deep .card-icon {
      width: 56px; height: 56px; border-radius: 16px;
      background: linear-gradient(135deg, rgba(0,200,150,0.1), rgba(0,163,212,0.05));
      border: 1px solid rgba(0,200,150,0.1);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 1.5rem; font-size: 1.3rem; color: #00c896;
    }
    ::ng-deep .service-card h3 {
      font-size: 1.2rem; font-weight: 600; color: #fff; margin-bottom: 0.75rem;
    }
    ::ng-deep .service-card p {
      font-size: 0.9rem; color: rgba(255,255,255,0.5); line-height: 1.6;
    }
    ::ng-deep .card-connector {
      position: absolute; bottom: 0; left: 50%;
      width: 0; height: 2px;
      background: linear-gradient(90deg, #00c896, #00a3d4);
      translate: -50% 0; border-radius: 2px;
    }

    /* ── Stats ── */
    .stats {
      padding: 6rem 2rem; background: #0a0a14;
      position: relative; overflow: hidden;
    }
    ::ng-deep .stats-grid {
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 2rem; max-width: 800px; margin: 0 auto; position: relative; z-index: 1;
    }
    ::ng-deep .stat-item { text-align: center; padding: 2rem 1rem; position: relative; }
    ::ng-deep .stat-item + .stat-item::before {
      content: '';
      position: absolute; left: -1rem; top: 50%; translate: 0 -50%;
      width: 1px; height: 60px; background: rgba(255,255,255,0.06);
    }
    ::ng-deep .stat-number-wrapper {
      display: flex; align-items: baseline; justify-content: center; gap: 0;
    }
    ::ng-deep .stat-number {
      font-size: clamp(2.5rem, 6vw, 4rem);
      font-weight: 800; color: #fff; line-height: 1;
    }
    ::ng-deep .stat-suffix {
      font-size: clamp(1.5rem, 3vw, 2rem);
      font-weight: 700; color: #00c896; line-height: 1;
    }
    ::ng-deep .stat-label {
      display: block; font-size: 0.9rem;
      color: rgba(255,255,255,0.45); margin-top: 0.5rem; font-weight: 400;
    }

    /* ── CTA ── */
    .cta {
      padding: 8rem 2rem; position: relative; overflow: hidden;
      background: linear-gradient(135deg, #0a0a14 0%, #0f0f1a 50%, #1a1a2e 100%);
    }
    ::ng-deep .cta-content {
      position: relative; z-index: 1; text-align: center;
      max-width: 650px; margin: 0 auto;
    }
    ::ng-deep .cta-title {
      font-size: clamp(1.8rem, 5vw, 3rem);
      font-weight: 700; color: #fff;
      margin-bottom: 1rem; line-height: 1.2;
    }
    ::ng-deep .cta-subtitle {
      font-size: clamp(0.95rem, 1.5vw, 1.15rem);
      color: rgba(255,255,255,0.55); margin-bottom: 2.5rem;
    }

    /* ── Responsive ── */
    @media (max-width: 900px) {
      ::ng-deep .services-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 768px) {
      ::ng-deep .title-line {
        font-size: clamp(2rem, 12vw, 3.5rem) !important;
      }
      .services { padding: 5rem 1.5rem; }
      .stats { padding: 4rem 1.5rem; }
      .cta { padding: 5rem 1.5rem; }
      ::ng-deep .stat-item + .stat-item::before { height: 40px; }
    }
    @media (max-width: 640px) {
      ::ng-deep .services-grid { grid-template-columns: 1fr; max-width: 400px; }
      ::ng-deep .stats-grid { grid-template-columns: 1fr; gap: 0; }
      ::ng-deep .stat-item + .stat-item::before {
        left: 50%; top: 0; width: 40px; height: 1px; translate: -50% 0;
      }
      ::ng-deep .stat-item { padding: 1.5rem 1rem; }
      ::ng-deep .hero-actions .btn { flex: 1; justify-content: center; min-width: 200px; }
    }
  `]
})
export class LandingComponent implements AfterViewInit, OnDestroy {
  private elementRef = inject(ElementRef);
  private webGsapService = inject(WebGsapService);

  @ViewChild('heroSection') heroSection!: ElementRef;
  @ViewChild('servicesSection') servicesSection!: ElementRef;
  @ViewChild('statsSection') statsSection!: ElementRef;
  @ViewChild('ctaSection') ctaSection!: ElementRef;
  @ViewChild('scrollDot') scrollDot!: ElementRef;

  heroFallback = `<div class="hero-content">
    <span class="hero-tagline">TO THE SOURCE</span>
    <h1 class="hero-title">
      <span class="title-line">We Craft</span>
      <span class="title-line gradient-text">Digital Excellence</span>
    </h1>
    <p class="hero-subtitle">Transform your brand with cutting-edge digital solutions that drive real results.</p>
    <div class="hero-actions">
      <a href="/services" class="btn btn-primary">Get Started</a>
      <a href="/portfolio" class="btn btn-secondary">
        <span>View Our Work</span>
        <svg class="btn-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </a>
    </div>
  </div>`;

  servicesFallback = `<div class="section-header">
    <span class="section-tag">What We Do</span>
    <h2 class="section-title">Our Services</h2>
    <p class="section-desc">We deliver end-to-end digital solutions that elevate your brand and drive measurable growth.</p>
  </div>
  <div class="services-grid">
    <div class="service-card">
      <div class="card-icon"><i class="fas fa-palette"></i></div>
      <h3>UI/UX Design</h3>
      <p>Beautiful interfaces crafted with precision that delight users and drive engagement across every touchpoint.</p>
      <div class="card-connector"></div>
    </div>
    <div class="service-card">
      <div class="card-icon"><i class="fas fa-code"></i></div>
      <h3>Web Development</h3>
      <p>High-performance web applications built with modern frameworks for speed, scalability, and reliability.</p>
      <div class="card-connector"></div>
    </div>
    <div class="service-card">
      <div class="card-icon"><i class="fas fa-chart-line"></i></div>
      <h3>Digital Strategy</h3>
      <p>Data-driven growth strategies that transform your digital presence into measurable business results.</p>
      <div class="card-connector"></div>
    </div>
  </div>`;

  statsFallback = `<div class="stats-grid">
    <div class="stat-item">
      <div class="stat-number-wrapper"><span class="stat-number" data-target="200">0</span><span class="stat-suffix">+</span></div>
      <span class="stat-label">Projects Delivered</span>
    </div>
    <div class="stat-item">
      <div class="stat-number-wrapper"><span class="stat-number" data-target="50">0</span><span class="stat-suffix">+</span></div>
      <span class="stat-label">Global Clients</span>
    </div>
    <div class="stat-item">
      <div class="stat-number-wrapper"><span class="stat-number" data-target="12">0</span><span class="stat-suffix">+</span></div>
      <span class="stat-label">Years Experience</span>
    </div>
  </div>`;

  ctaFallback = `<div class="cta-content">
    <h2 class="cta-title">Ready to Transform Your Vision?</h2>
    <p class="cta-subtitle">Let's create something extraordinary together.</p>
    <a href="/contact" class="btn btn-primary btn-lg">Start Your Project</a>
  </div>`;

  private tl: gsap.core.Timeline | null = null;
  private counterTweens: gsap.core.Tween[] = [];

  constructor() {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.webGsapService.applyAnimations('landing', this.elementRef.nativeElement);
      this.initOrbFloat();
      this.initScrollDotAnim();
      this.initCardHovers();
      this.initCounterAnim();
    }, 400);
  }

  ngOnDestroy() {
    this.tl?.kill();
    this.counterTweens.forEach(t => t.kill());
    this.webGsapService.killAll();
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const el = this.elementRef.nativeElement;
    const hero = el.querySelector('.hero-content');
    if (!hero) return;
    const x = (event.clientX / window.innerWidth - 0.5) * 8;
    const y = (event.clientY / window.innerHeight - 0.5) * 8;
    gsap.to(hero, { x, y, duration: 0.8, ease: 'power2.out', overwrite: 'auto' });
  }

  private initOrbFloat() {
    const el = this.elementRef.nativeElement;
    const orbs = el.querySelectorAll('.hero-orb');
    orbs.forEach((orb: Element, i: number) => {
      gsap.to(orb, {
        y: 20 + (i % 2 === 0 ? 10 : -10),
        x: (i % 3 === 0 ? 15 : -15),
        duration: 6 + i * 0.8,
        repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.4
      });
    });
  }

  private initScrollDotAnim() {
    if (this.scrollDot) {
      gsap.to(this.scrollDot.nativeElement, {
        y: 40, duration: 1.5, repeat: -1, ease: 'power2.inOut', delay: 2.2
      });
    }
  }

  private initCardHovers() {
    const el = this.elementRef.nativeElement;
    el.querySelectorAll('.service-card').forEach((card: Element) => {
      card.addEventListener('mouseenter', () => {
        const c = card as HTMLElement;
        gsap.to(c, { y: -8, duration: 0.3, ease: 'power2.out' });
        gsap.to(c.querySelector('.card-icon'), { scale: 1.1, duration: 0.3, ease: 'power2.out' });
        const conn = c.querySelector('.card-connector') as HTMLElement;
        if (conn) gsap.to(conn, { width: '60%', duration: 0.4, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', () => {
        const c = card as HTMLElement;
        gsap.to(c, { y: 0, duration: 0.3, ease: 'power2.out' });
        gsap.to(c.querySelector('.card-icon'), { scale: 1, duration: 0.3, ease: 'power2.out' });
        const conn = c.querySelector('.card-connector') as HTMLElement;
        if (conn) gsap.to(conn, { width: '0%', duration: 0.4, ease: 'power2.out' });
      });
    });
  }

  private initCounterAnim() {
    const el = this.elementRef.nativeElement;
    const numbers = el.querySelectorAll('.stat-number[data-target]');
    numbers.forEach((numEl: Element) => {
      const target = parseInt((numEl as HTMLElement).getAttribute('data-target') || '0');
      const obj = { val: 0 };
      const tween = gsap.to(obj, {
        val: target, duration: 2.2, ease: 'power2.out',
        onUpdate: () => { (numEl as HTMLElement).textContent = String(Math.floor(obj.val)); },
        scrollTrigger: { trigger: numEl.closest('.stats'), start: 'top 80%', once: true }
      });
      this.counterTweens.push(tween);
    });
  }
}
