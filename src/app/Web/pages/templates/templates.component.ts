import { Component, inject, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatedBgComponent } from '../../components/animated-bg/animated-bg.component';

interface Template {
  id: string;
  name: string;
  type: string;
  html: string;
  preview: string;
}

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [CommonModule, RouterModule, AnimatedBgComponent],
  template: `
    <section class="templates-hero">
      <div class="hero-bg">
        <app-animated-bg variant="hero" color1="#00c896" color2="#00a3d4" color3="#6366f1"></app-animated-bg>
        <div class="grid-overlay"></div>
        <div class="orb o1"></div>
        <div class="orb o2"></div>
        <div class="orb o3"></div>
        <div class="orb o4"></div>
        <div class="hero-mesh"></div>
      </div>
      <div class="hero-content">
        <div class="hero-badge" #badge>
          <i class="fas fa-layer-group"></i>
          <span>Website Templates</span>
        </div>
        <h1 class="hero-title" #title>
          <span class="title-line">Ready-Made</span>
          <span class="title-line gradient-text">Digital Blueprints</span>
        </h1>
        <p class="hero-desc" #desc>Jumpstart your next project with professionally designed, fully responsive website templates.</p>
        <div class="hero-actions" #actions>
          <span class="btn btn-primary" (click)="scrollToTemplates()">Browse Templates <i class="fas fa-arrow-down"></i></span>
          <a routerLink="/contact" class="btn btn-outline">Custom Request</a>
        </div>
      </div>
      <div class="scroll-hint" #scrollHint>
        <span>SCROLL</span>
        <div class="scroll-line"><div class="scroll-dot"></div></div>
      </div>
    </section>

    <section class="templates-content" id="templates-grid">
      <div class="section-header">
        <span class="section-tag">Template Library</span>
        <h2 class="section-title">Choose Your Foundation</h2>
        <p class="section-desc">Every template is built with modern best practices, ready to customize and deploy.</p>
      </div>

      <div class="templates-filter" #filterBar>
        @for (f of filters; track f; let i = $index) {
          <button class="filter-btn" [class.active]="activeFilter === f" (click)="setFilter(f)" [attr.data-idx]="i">{{ f }}</button>
        }
        <div class="filter-active-bg" #activeBg></div>
      </div>

      <div class="templates-grid" #templateGrid>
        @for (template of filteredTemplates; track template.id; let i = $index) {
          <div class="template-card" (click)="previewTemplate(template)" [attr.data-idx]="i">
            <div class="card-glow"></div>
            <div class="template-preview">
              <div class="preview-placeholder">
                <i class="fas fa-{{ template.type === 'Landing' ? 'rocket' : template.type === 'Business' ? 'briefcase' : template.type === 'Portfolio' ? 'palette' : 'newspaper' }}"></i>
              </div>
              <div class="preview-overlay">
                <span>Preview <i class="fas fa-arrow-right"></i></span>
              </div>
            </div>
            <div class="template-info">
              <div class="template-meta">
                <span class="template-type">{{ template.type }}</span>
              </div>
              <h3>{{ template.name }}</h3>
            </div>
          </div>
        }
      </div>
    </section>

    @if (selectedTemplate) {
      <div class="template-modal" #modalOverlay (click)="closePreview()">
        <div class="modal-bg"></div>
        <div class="modal-content" #modalContent (click)="$event.stopPropagation()">
          <button class="modal-close" (click)="closePreview()">&times;</button>
          <div class="modal-header">
            <div class="modal-badge">{{ selectedTemplate.type }}</div>
            <h2>{{ selectedTemplate.name }}</h2>
          </div>
          <div class="modal-body">
            <div class="modal-preview-area" [innerHTML]="selectedTemplate.html"></div>
          </div>
          <div class="modal-footer">
            <span class="btn btn-primary" (click)="closePreview()">Use This Template <i class="fas fa-arrow-right"></i></span>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display: block; }

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
    .section-header { text-align: center; margin-bottom: 3rem; }

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

    /* ── Hero ── */
    .templates-hero {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: #08080f; overflow: hidden; position: relative;
    }
    .hero-bg { position: absolute; inset: 0; z-index: 0; }
    .grid-overlay {
      position: absolute; inset: 0;
      background-image: linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px);
      background-size: 70px 70px;
    }
    .hero-mesh {
      position: absolute; inset: 0;
      background:
        radial-gradient(ellipse at 15% 30%, rgba(0,200,150,0.03) 0%, transparent 50%),
        radial-gradient(ellipse at 85% 70%, rgba(0,163,212,0.02) 0%, transparent 50%);
      pointer-events: none;
    }
    .orb { position: absolute; border-radius: 50%; pointer-events: none; will-change: transform; }
    .o1 { width: 600px; height: 600px; background: radial-gradient(circle, rgba(0,200,150,0.05) 0%, transparent 70%); top: -15%; right: -10%; }
    .o2 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(0,163,212,0.04) 0%, transparent 70%); bottom: -15%; left: -8%; }
    .o3 { width: 300px; height: 300px; background: radial-gradient(circle, rgba(99,102,241,0.03) 0%, transparent 70%); top: 25%; left: 40%; }
    .o4 { width: 200px; height: 200px; background: radial-gradient(circle, rgba(0,200,150,0.03) 0%, transparent 70%); top: 10%; left: 15%; }

    .hero-content { position: relative; z-index: 1; text-align: center; padding: 2rem; max-width: 750px; }
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
    .title-line {
      display: block;
      font-size: clamp(2.5rem, 8vw, 4.5rem);
      font-weight: 800; line-height: 1.08; letter-spacing: -0.03em; color: #fff;
    }
    .gradient-text {
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

    .scroll-hint {
      position: absolute; bottom: 2.5rem; left: 50%; translate: -50% 0;
      display: flex; flex-direction: column; align-items: center; gap: 0.5rem; z-index: 1;
    }
    .scroll-hint span { font-size: 0.55rem; font-weight: 600; letter-spacing: 0.25em; color: rgba(255,255,255,0.12); }
    .scroll-line { width: 1px; height: 30px; background: rgba(255,255,255,0.04); position: relative; overflow: hidden; }
    .scroll-dot { width: 2px; height: 10px; background: #00c896; border-radius: 2px; position: absolute; top: -10px; left: -0.5px; }

    /* ── Content ── */
    .templates-content { padding: 6rem 2rem 8rem; background: #0c0c18; }

    /* ── Filter ── */
    .templates-filter {
      display: flex; gap: 0.5rem; justify-content: center; margin-bottom: 3rem;
      flex-wrap: wrap; position: relative;
    }
    .filter-btn {
      padding: 0.6rem 1.4rem; background: transparent;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 50px; color: rgba(255,255,255,0.4);
      cursor: pointer; font-family: inherit; font-size: 0.82rem;
      font-weight: 500; transition: color 0.3s; position: relative; z-index: 1;
    }
    .filter-btn.active { color: #fff; }
    .filter-btn:hover { color: rgba(255,255,255,0.7); }

    /* ── Grid ── */
    .templates-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem; max-width: 1200px; margin: 0 auto;
    }
    .template-card {
      background: rgba(255,255,255,0.012);
      border: 1px solid rgba(255,255,255,0.04);
      border-radius: 18px; overflow: hidden;
      cursor: pointer; position: relative;
      transition: border-color 0.4s;
      will-change: transform;
    }
    .template-card:hover { border-color: rgba(0,200,150,0.12); }
    .card-glow {
      position: absolute; inset: 0; border-radius: 18px;
      background: linear-gradient(135deg, rgba(0,200,150,0.03), transparent 50%);
      opacity: 0; transition: opacity 0.5s; pointer-events: none;
    }
    .template-card:hover .card-glow { opacity: 1; }

    .template-preview {
      aspect-ratio: 16/10;
      display: flex; justify-content: center; align-items: center;
      position: relative; overflow: hidden;
    }
    .preview-placeholder {
      width: 100%; height: 100%;
      display: flex; align-items: center; justify-content: center;
      font-size: 2.5rem; color: rgba(255,255,255,0.06);
    }
    .preview-overlay {
      position: absolute; inset: 0;
      background: rgba(0,0,0,0.3);
      display: flex; align-items: center; justify-content: center;
      opacity: 0; transition: opacity 0.4s;
      backdrop-filter: blur(2px);
    }
    .template-card:hover .preview-overlay { opacity: 1; }
    .preview-overlay span {
      color: #fff; font-size: 0.85rem; font-weight: 600;
      display: flex; align-items: center; gap: 0.4rem;
      transform: translateY(10px); transition: transform 0.4s;
    }
    .template-card:hover .preview-overlay span { transform: translateY(0); }

    .template-info { padding: 1.25rem 1.5rem 1.5rem; }
    .template-meta { margin-bottom: 0.3rem; }
    .template-type {
      font-size: 0.65rem; font-weight: 600; letter-spacing: 0.1em;
      text-transform: uppercase; color: #00c896; opacity: 0.7;
    }
    .template-info h3 {
      font-size: 1rem; font-weight: 600; color: #fff;
      margin: 0;
    }

    /* ── Modal ── */
    .template-modal {
      position: fixed; inset: 0; z-index: 1000;
      display: flex; justify-content: center; align-items: center;
      padding: 2rem;
    }
    .modal-bg {
      position: absolute; inset: 0;
      background: rgba(0,0,0,0.7);
      backdrop-filter: blur(8px);
    }
    .modal-content {
      position: relative;
      background: linear-gradient(135deg, #0c0c18, #101020);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 20px; padding: 2.5rem;
      max-width: 720px; width: 100%;
      max-height: 90vh; overflow: auto;
      box-shadow: 0 30px 80px rgba(0,0,0,0.5);
    }
    .modal-close {
      position: absolute; top: 1rem; right: 1rem;
      width: 36px; height: 36px; border-radius: 50%;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.06);
      color: rgba(255,255,255,0.5); font-size: 1.3rem;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: background 0.3s, color 0.3s;
    }
    .modal-close:hover { background: rgba(255,255,255,0.08); color: #fff; }
    .modal-header { margin-bottom: 1.5rem; }
    .modal-badge {
      display: inline-block;
      font-size: 0.65rem; font-weight: 600; letter-spacing: 0.1em;
      text-transform: uppercase; color: #00c896; opacity: 0.7;
      margin-bottom: 0.5rem;
    }
    .modal-header h2 { font-size: 1.5rem; font-weight: 700; color: #fff; margin: 0; }
    .modal-body {
      background: rgba(0,0,0,0.2);
      border-radius: 12px; padding: 2rem;
      min-height: 200px;
    }
    .modal-footer { margin-top: 1.5rem; text-align: center; }
    .modal-footer .btn i { font-size: 0.75rem; }

    @media (max-width: 768px) {
      .templates-content { padding: 4rem 1.5rem 6rem; }
      .templates-grid { grid-template-columns: 1fr; max-width: 400px; margin: 0 auto; }
      .modal-content { padding: 1.5rem; }
    }
  `]
})
export class TemplatesComponent implements AfterViewInit, OnDestroy {
  private sanitizer = inject(DomSanitizer);
  private el = inject(ElementRef);

  filters = ['All', 'Landing', 'Business', 'Portfolio', 'Content'];
  activeFilter = 'All';
  selectedTemplate: Template | null = null;

  templates: Template[] = [
    { id: '1', name: 'Modern Hero', type: 'Landing', html: '<div class="preview-frame"><h1 style="font-size:2rem;font-weight:800;margin-bottom:0.5rem;">Modern Hero</h1><p style="color:rgba(255,255,255,0.5);">Bold headline with CTA</p></div>', preview: 'landing' },
    { id: '2', name: 'Business Pro', type: 'Business', html: '<div class="preview-frame"><h2 style="font-size:1.5rem;font-weight:700;margin-bottom:0.5rem;">Business Pro</h2><p style="color:rgba(255,255,255,0.5);">Corporate layout with sections</p></div>', preview: 'business' },
    { id: '3', name: 'Creative Portfolio', type: 'Portfolio', html: '<div class="preview-frame"><h2 style="font-size:1.5rem;font-weight:700;margin-bottom:0.5rem;">Portfolio</h2><p style="color:rgba(255,255,255,0.5);">Showcase your work elegantly</p></div>', preview: 'palette' },
    { id: '4', name: 'E-Commerce', type: 'Business', html: '<div class="preview-frame"><h2 style="font-size:1.5rem;font-weight:700;margin-bottom:0.5rem;">E-Commerce</h2><p style="color:rgba(255,255,255,0.5);">Product listings & checkout</p></div>', preview: 'business' },
    { id: '5', name: 'Blog Standard', type: 'Content', html: '<div class="preview-frame"><h2 style="font-size:1.5rem;font-weight:700;margin-bottom:0.5rem;">Blog</h2><p style="color:rgba(255,255,255,0.5);">Article layout with sidebar</p></div>', preview: 'newspaper' },
    { id: '6', name: 'Startup Landing', type: 'Landing', html: '<div class="preview-frame"><h1 style="font-size:2rem;font-weight:800;margin-bottom:0.5rem;">Startup</h1><p style="color:rgba(255,255,255,0.5);">High-converting landing page</p></div>', preview: 'landing' },
    { id: '7', name: 'Dashboard UI', type: 'Business', html: '<div class="preview-frame"><h2 style="font-size:1.5rem;font-weight:700;margin-bottom:0.5rem;">Dashboard</h2><p style="color:rgba(255,255,255,0.5);">Analytics & metrics layout</p></div>', preview: 'business' },
    { id: '8', name: 'Agency Showcase', type: 'Portfolio', html: '<div class="preview-frame"><h2 style="font-size:1.5rem;font-weight:700;margin-bottom:0.5rem;">Agency</h2><p style="color:rgba(255,255,255,0.5);">Services & case studies</p></div>', preview: 'palette' },
  ];

  get filteredTemplates(): Template[] {
    if (this.activeFilter === 'All') return this.templates;
    return this.templates.filter(t => t.type === this.activeFilter);
  }

  private ctx!: gsap.Context;

  ngAfterViewInit() {
    gsap.registerPlugin(ScrollTrigger);
    this.ctx = gsap.context(() => {
      this.initHeroAnim();
      this.initFloatingOrbs();
      this.initFilterAnim();
      this.initGridAnim();
    }, this.el.nativeElement);
  }

  ngOnDestroy() {
    this.ctx?.revert();
    gsap.killTweensOf('*');
    ScrollTrigger.getAll().forEach(t => t.kill());
  }

  setFilter(f: string) {
    this.activeFilter = f;
  }

  scrollToTemplates() {
    document.getElementById('templates-grid')?.scrollIntoView({ behavior: 'smooth' });
  }

  previewTemplate(template: Template) {
    this.selectedTemplate = template;
    setTimeout(() => {
      const content = this.el.nativeElement.querySelector('.modal-content') as HTMLElement;
      const bg = this.el.nativeElement.querySelector('.modal-bg') as HTMLElement;
      if (content) {
        gsap.fromTo(bg, { opacity: 0 }, { opacity: 1, duration: 0.3 });
        gsap.fromTo(content, { opacity: 0, scale: 0.92, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power3.out' });
      }
    }, 50);
  }

  closePreview() {
    const content = this.el.nativeElement.querySelector('.modal-content') as HTMLElement;
    const bg = this.el.nativeElement.querySelector('.modal-bg') as HTMLElement;
    if (content) {
      gsap.to(content, { opacity: 0, scale: 0.92, y: 20, duration: 0.3, ease: 'power2.in', onComplete: () => { this.selectedTemplate = null; } });
      gsap.to(bg, { opacity: 0, duration: 0.3 });
    } else {
      this.selectedTemplate = null;
    }
  }

  private initHeroAnim() {
    gsap.from('.hero-badge', { opacity: 0, y: 25, scale: 0.9, duration: 0.7, ease: 'back.out(1.7)' });
    gsap.from('.title-line', { opacity: 0, y: 60, duration: 1, ease: 'power4.out', stagger: 0.2, delay: 0.3 });
    gsap.from('.hero-desc', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out', delay: 0.7 });
    gsap.from('.hero-actions .btn', { opacity: 0, y: 20, scale: 0.95, duration: 0.6, ease: 'back.out(1.4)', stagger: 0.12, delay: 0.9 });
    gsap.from('.scroll-hint', { opacity: 0, y: 10, duration: 0.5, ease: 'power2.out', delay: 1.2 });

    gsap.to('.scroll-dot', { y: 30, duration: 1.8, repeat: -1, ease: 'power2.inOut', delay: 2 });
  }

  private initFloatingOrbs() {
    gsap.to('.o1', { y: -40, x: 25, duration: 7, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.o2', { y: 40, x: -25, duration: 9, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.o3', { y: -25, x: 35, duration: 6.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.o4', { y: 30, x: -15, duration: 5.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  }

  private initFilterAnim() {
    const buttons = this.el.nativeElement.querySelectorAll('.filter-btn');
    buttons.forEach((btn: Element) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b: Element) => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    gsap.from('.filter-btn', {
      opacity: 0, y: 20, duration: 0.5, ease: 'power3.out',
      stagger: 0.07,
      scrollTrigger: { trigger: '.templates-filter', start: 'top 85%', toggleActions: 'play none none none' }
    });
  }

  private initGridAnim() {
    gsap.from('.template-card', {
      opacity: 0, y: 50, scale: 0.97,
      duration: 0.8, ease: 'power3.out',
      stagger: { amount: 0.6, from: 'start' },
      scrollTrigger: {
        trigger: '.templates-grid', start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    // Hover tilt effect
    this.el.nativeElement.querySelectorAll('.template-card').forEach((card: Element) => {
      const c = card as HTMLElement;
      c.addEventListener('mouseenter', () => {
        gsap.to(c, { y: -6, duration: 0.4, ease: 'power2.out' });
        gsap.to(c.querySelector('.preview-placeholder'), { scale: 1.05, duration: 0.4, ease: 'power2.out' });
      });
      c.addEventListener('mouseleave', () => {
        gsap.to(c, { y: 0, duration: 0.4, ease: 'power2.out' });
        gsap.to(c.querySelector('.preview-placeholder'), { scale: 1, duration: 0.4, ease: 'power2.out' });
      });
    });
  }
}
