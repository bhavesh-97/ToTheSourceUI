import { Component, inject, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatedBgComponent } from '../../components/animated-bg/animated-bg.component';

interface GsapDemo {
  id: string;
  name: string;
  description: string;
  category: string;
}

@Component({
  selector: 'app-animations',
  standalone: true,
  imports: [CommonModule, RouterModule, AnimatedBgComponent],
  template: `
    <section class="animations-hero">
      <div class="hero-bg">
        <app-animated-bg variant="hero" color1="#00c896" color2="#00a3d4" color3="#6366f1"></app-animated-bg>
        <div class="grid-overlay"></div>
        <div class="wave-lines">
          <svg class="wave-svg" viewBox="0 0 1440 400" preserveAspectRatio="none">
            <path class="wave-path w1" d="M0,200 C360,50 720,350 1440,200 L1440,400 L0,400 Z" fill="none" stroke="rgba(0,200,150,0.04)" stroke-width="1"/>
            <path class="wave-path w2" d="M0,250 C360,100 720,300 1440,250 L1440,400 L0,400 Z" fill="none" stroke="rgba(0,163,212,0.03)" stroke-width="1"/>
            <path class="wave-path w3" d="M0,300 C360,150 720,250 1440,300 L1440,400 L0,400 Z" fill="none" stroke="rgba(99,102,241,0.02)" stroke-width="1"/>
          </svg>
        </div>
        <div class="orb a1"></div>
        <div class="orb a2"></div>
        <div class="orb a3"></div>
        <div class="particle-field" #particleField></div>
      </div>
      <div class="hero-content">
        <div class="hero-badge" #badge>
          <i class="fas fa-magic"></i>
          <span>Animation Library</span>
        </div>
        <h1 class="hero-title" #title>
          <span class="title-line">GSAP-Powered</span>
          <span class="title-line gradient-text">Motion Studio</span>
        </h1>
        <p class="hero-desc" #desc>Explore the art of motion — from subtle micro-interactions to cinematic scroll experiences.</p>
        <div class="hero-actions" #actions>
          <span class="btn btn-primary" (click)="scrollToDemos()">Explore Animations <i class="fas fa-arrow-down"></i></span>
          <a routerLink="/contact" class="btn btn-outline">Request Custom Animation</a>
        </div>
      </div>
      <div class="live-preview" #livePreview>
        <div class="lp-bar">
          <span class="lp-dot"></span><span class="lp-dot"></span><span class="lp-dot"></span>
        </div>
        <div class="lp-content">
          <div class="lp-shape lp-shape-1"></div>
          <div class="lp-shape lp-shape-2"></div>
          <div class="lp-shape lp-shape-3"></div>
          <div class="lp-shape lp-shape-4"></div>
        </div>
      </div>
      <div class="scroll-hint" #scrollHint>
        <span>SCROLL</span>
        <div class="scroll-line"><div class="scroll-dot"></div></div>
      </div>
    </section>

    <section class="animations-demo" id="animation-demos">
      <div class="section-header">
        <span class="section-tag">Animation Presets</span>
        <h2 class="section-title">Choose Your Motion</h2>
        <p class="section-desc">Click any card to trigger its animation — each demonstrates a unique GSAP technique.</p>
      </div>

      <div class="demo-grid" #demoGrid>
        @for (demo of demos; track demo.id; let i = $index) {
          <div class="demo-card" (click)="triggerDemo(demo, $event)" [attr.data-idx]="i">
            <div class="demo-visual" [id]="'dv-' + demo.id">
              <div class="demo-visual-shape">
                <i class="fas fa-{{ demo.id === 'fade-up' ? 'arrow-up' : demo.id === 'fade-in' ? 'circle' : demo.id === 'scale-in' ? 'expand-alt' : demo.id === 'slide-left' ? 'arrow-left' : demo.id === 'slide-right' ? 'arrow-right' : demo.id === 'rotate' ? 'sync-alt' : demo.id === 'stagger' ? 'layer-group' : 'arrows-alt' }}"></i>
              </div>
            </div>
            <h3>{{ demo.name }}</h3>
            <p>{{ demo.description }}</p>
            <span class="demo-category">{{ demo.category }}</span>
          </div>
        }
      </div>
    </section>

    <section class="animations-showcase">
      <div class="section-header">
        <span class="section-tag">Live Demo</span>
        <h2 class="section-title">Interactive Sandbox</h2>
        <p class="section-desc">Watch GSAP animations in action. Click Play All or trigger individual boxes.</p>
      </div>

      <div class="showcase-stage" #showcaseStage>
        <div class="stage-glow"></div>
        @for (preset of presets; track preset.name; let i = $index) {
          <div class="showcase-box" [attr.data-name]="preset.name.toLowerCase().replace(' ', '-')" (click)="playPreset($event)">
            <span>{{ preset.name }}</span>
          </div>
        }
      </div>

      <div class="showcase-controls">
        <button (click)="playAllPresets()" class="play-btn">
          <i class="fas fa-play"></i> Play All
        </button>
        <button (click)="resetPresets()" class="reset-btn">
          <i class="fas fa-stop"></i> Reset
        </button>
      </div>

      <div class="code-hint">
        <span>Click individual boxes to replay, or hit Play All for the full experience.</span>
      </div>
    </section>
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
    .animations-hero {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: #08080f; overflow: hidden; position: relative;
    }
    .hero-bg { position: absolute; inset: 0; z-index: 0; }
    .grid-overlay {
      position: absolute; inset: 0;
      background-image: linear-gradient(rgba(255,255,255,0.008) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.008) 1px, transparent 1px);
      background-size: 80px 80px;
    }
    .wave-lines {
      position: absolute; bottom: 0; left: 0; right: 0; height: 40vh;
      overflow: hidden;
    }
    .wave-svg { width: 100%; height: 100%; }
    .orb { position: absolute; border-radius: 50%; pointer-events: none; will-change: transform; }
    .a1 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(0,200,150,0.04) 0%, transparent 70%); top: -10%; left: -5%; }
    .a2 { width: 350px; height: 350px; background: radial-gradient(circle, rgba(0,163,212,0.03) 0%, transparent 70%); bottom: 10%; right: 5%; }
    .a3 { width: 250px; height: 250px; background: radial-gradient(circle, rgba(99,102,241,0.03) 0%, transparent 70%); top: 20%; right: 30%; }

    .particle-field { position: absolute; inset: 0; pointer-events: none; }

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

    /* ── Live Preview ── */
    .live-preview {
      position: absolute; bottom: 6rem; right: 2rem; z-index: 1;
      width: 180px; background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.04);
      border-radius: 12px; overflow: hidden;
      backdrop-filter: blur(10px);
    }
    .lp-bar {
      display: flex; gap: 4px; padding: 8px 10px;
      background: rgba(255,255,255,0.02);
      border-bottom: 1px solid rgba(255,255,255,0.03);
    }
    .lp-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.08); }
    .lp-content {
      display: grid; grid-template-columns: 1fr 1fr; gap: 6px;
      padding: 10px; aspect-ratio: 1;
    }
    .lp-shape { border-radius: 6px; opacity: 0.6; }
    .lp-shape-1 { background: #00c896; }
    .lp-shape-2 { background: #00a3d4; }
    .lp-shape-3 { background: #6366f1; }
    .lp-shape-4 { background: #e94560; }

    @media (max-width: 768px) {
      .live-preview { display: none; }
    }

    /* ── Demo Grid ── */
    .animations-demo { padding: 6rem 2rem 8rem; background: #0c0c18; }
    .demo-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.5rem; max-width: 1100px; margin: 0 auto;
    }
    .demo-card {
      background: rgba(255,255,255,0.012);
      border: 1px solid rgba(255,255,255,0.04);
      border-radius: 18px; padding: 1.5rem;
      cursor: pointer; position: relative; overflow: hidden;
      transition: border-color 0.3s;
      will-change: transform;
    }
    .demo-card:hover { border-color: rgba(0,200,150,0.08); }
    .demo-visual {
      aspect-ratio: 16/9;
      background: rgba(0,0,0,0.15);
      border-radius: 10px; margin-bottom: 1rem;
      display: flex; align-items: center; justify-content: center;
      overflow: hidden;
    }
    .demo-visual-shape {
      width: 50px; height: 50px;
      background: linear-gradient(135deg, rgba(0,200,150,0.08), rgba(0,163,212,0.04));
      border: 1px solid rgba(0,200,150,0.06);
      border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.1rem; color: #00c896;
    }
    .demo-card h3 { font-size: 1rem; font-weight: 600; color: #fff; margin-bottom: 0.4rem; }
    .demo-card p { font-size: 0.8rem; color: rgba(255,255,255,0.35); line-height: 1.5; margin-bottom: 0.75rem; }
    .demo-category {
      font-size: 0.6rem; font-weight: 600; letter-spacing: 0.1em;
      text-transform: uppercase; color: rgba(0,200,150,0.5);
    }

    /* ── Showcase ── */
    .animations-showcase {
      padding: 6rem 2rem 8rem;
      background: linear-gradient(135deg, #08080f, #0c0c18);
    }
    .showcase-stage {
      display: flex; gap: 1.5rem; justify-content: center;
      flex-wrap: wrap; margin-bottom: 2rem;
      max-width: 700px; margin-left: auto; margin-right: auto;
      position: relative; padding: 3rem;
    }
    .stage-glow {
      position: absolute; inset: 0;
      background: radial-gradient(ellipse at 50% 50%, rgba(0,200,150,0.01) 0%, transparent 60%);
      pointer-events: none;
    }
    .showcase-box {
      width: 110px; height: 110px;
      background: linear-gradient(135deg, rgba(0,200,150,0.06), rgba(0,163,212,0.03));
      border: 1px solid rgba(0,200,150,0.06);
      border-radius: 16px;
      display: flex; justify-content: center; align-items: center;
      font-size: 0.7rem; font-weight: 600; color: rgba(255,255,255,0.5);
      cursor: pointer; position: relative;
      transition: border-color 0.3s;
    }
    .showcase-box:hover { border-color: rgba(0,200,150,0.12); }

    .showcase-controls {
      display: flex; gap: 1rem; justify-content: center;
      margin-bottom: 1rem;
    }
    .play-btn, .reset-btn {
      padding: 0.75rem 1.75rem; border: none; border-radius: 50px;
      font-family: inherit; font-size: 0.85rem; font-weight: 600;
      cursor: pointer; display: flex; align-items: center; gap: 0.4rem;
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .play-btn { background: linear-gradient(135deg, #00c896, #00a3d4); color: #fff; box-shadow: 0 4px 20px rgba(0,200,150,0.2); }
    .play-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 30px rgba(0,200,150,0.35); }
    .reset-btn { background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.5); border: 1px solid rgba(255,255,255,0.06); }
    .reset-btn:hover { background: rgba(255,255,255,0.08); transform: translateY(-2px); }

    .code-hint { text-align: center; }
    .code-hint span {
      font-size: 0.75rem; color: rgba(255,255,255,0.15);
      font-family: monospace;
    }

    @media (max-width: 768px) {
      .animations-demo { padding: 4rem 1.5rem 6rem; }
      .animations-showcase { padding: 4rem 1.5rem 6rem; }
      .showcase-stage { padding: 2rem; }
      .showcase-box { width: 90px; height: 90px; }
    }
  `]
})
export class AnimationsComponent implements AfterViewInit, OnDestroy {
  private el = inject(ElementRef);

  demos: GsapDemo[] = [
    { id: 'fade-up', name: 'Fade Up', description: 'Elements fade in from below with a smooth arc', category: 'Entrance' },
    { id: 'fade-in', name: 'Fade In', description: 'Simple opacity transition from 0 to 1', category: 'Entrance' },
    { id: 'scale-in', name: 'Scale In', description: 'Scale from zero with a subtle bounce', category: 'Entrance' },
    { id: 'slide-left', name: 'Slide Left', description: 'Slides in from the right edge', category: 'Motion' },
    { id: 'slide-right', name: 'Slide Right', description: 'Slides in from the left edge', category: 'Motion' },
    { id: 'rotate', name: 'Rotate In', description: 'Full rotation entrance with fade', category: 'Motion' },
    { id: 'stagger', name: 'Stagger', description: 'Sequential staggered timing', category: 'Advanced' },
    { id: 'bounce', name: 'Bounce', description: 'Elastic bounce effect on entrance', category: 'Advanced' },
  ];

  presets = [
    { name: 'Fade Up', from: { opacity: 0, y: 50 }, to: { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' } },
    { name: 'Scale', from: { opacity: 0, scale: 0 }, to: { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(2)' } },
    { name: 'Slide', from: { opacity: 0, x: -120 }, to: { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' } },
    { name: 'Rotate', from: { opacity: 0, rotation: -180 }, to: { opacity: 1, rotation: 0, duration: 0.9, ease: 'power2.out' } },
  ];

  private ctx!: gsap.Context;

  ngAfterViewInit() {
    gsap.registerPlugin(ScrollTrigger);
    this.ctx = gsap.context(() => {
      this.initHeroAnim();
      this.initParticles();
      this.initWaveAnim();
      this.initLivePreviewAnim();
      this.initDemoCardsAnim();
      this.initShowcaseAnim();
    }, this.el.nativeElement);
  }

  ngOnDestroy() {
    this.ctx?.revert();
    gsap.killTweensOf('*');
    ScrollTrigger.getAll().forEach(t => t.kill());
  }

  scrollToDemos() {
    document.getElementById('animation-demos')?.scrollIntoView({ behavior: 'smooth' });
  }

  triggerDemo(demo: GsapDemo, event: MouseEvent) {
    const card = (event.currentTarget as HTMLElement);
    const shape = card.querySelector('.demo-visual-shape') as HTMLElement;
    if (!shape) return;

    gsap.set(shape, { clearProps: 'all' });

    const animMap: Record<string, gsap.TweenVars> = {
      'fade-up': { y: 50, opacity: 0 },
      'fade-in': { opacity: 0 },
      'scale-in': { scale: 0, opacity: 0 },
      'slide-left': { x: 80, opacity: 0 },
      'slide-right': { x: -80, opacity: 0 },
      'rotate': { rotation: 180, opacity: 0, scale: 0.5 },
      'stagger': { y: 20, opacity: 0 },
      'bounce': { scale: 0, opacity: 0 },
    };

    const fromVars = animMap[demo.id] || { y: 30, opacity: 0 };
    gsap.fromTo(shape, fromVars, {
      y: 0, x: 0, opacity: 1, scale: 1, rotation: 0,
      duration: 0.8,
      ease: demo.id === 'bounce' ? 'elastic.out(1, 0.4)' : demo.id === 'scale-in' ? 'back.out(2)' : 'power3.out',
      clearProps: 'x,y'
    });
  }

  playPreset(event: MouseEvent) {
    const box = event.currentTarget as HTMLElement;
    const name = box.getAttribute('data-name');
    const preset = this.presets.find(p => p.name.toLowerCase().replace(' ', '-') === name);
    if (!preset) return;

    gsap.set(box, { clearProps: 'all' });
    gsap.fromTo(box, preset.from, preset.to);
  }

  playAllPresets() {
    const boxes = this.el.nativeElement.querySelectorAll('.showcase-box');
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    boxes.forEach((box: Element, i: number) => {
      const name = (box as HTMLElement).getAttribute('data-name');
      const preset = this.presets.find(p => p.name.toLowerCase().replace(' ', '-') === name);
      gsap.set(box, { clearProps: 'all' });
      if (preset) {
        tl.fromTo(box, preset.from, { ...preset.to, delay: 0 }, i === 0 ? 0 : '-=0.15');
      }
    });
  }

  resetPresets() {
    const boxes = this.el.nativeElement.querySelectorAll('.showcase-box');
    boxes.forEach((box: Element) => {
      gsap.set(box, { clearProps: 'all' });
    });
  }

  private initHeroAnim() {
    gsap.from('.hero-badge', { opacity: 0, y: 25, scale: 0.9, duration: 0.7, ease: 'back.out(1.7)' });
    gsap.from('.title-line', { opacity: 0, y: 60, duration: 1, ease: 'power4.out', stagger: 0.2, delay: 0.3 });
    gsap.from('.hero-desc', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out', delay: 0.7 });
    gsap.from('.hero-actions .btn', { opacity: 0, y: 20, scale: 0.95, duration: 0.6, ease: 'back.out(1.4)', stagger: 0.12, delay: 0.9 });
    gsap.from('.live-preview', { opacity: 0, x: 30, scale: 0.9, duration: 0.7, ease: 'power3.out', delay: 1.1 });
    gsap.from('.scroll-hint', { opacity: 0, y: 10, duration: 0.5, ease: 'power2.out', delay: 1.3 });

    gsap.to('.scroll-dot', { y: 30, duration: 1.8, repeat: -1, ease: 'power2.inOut', delay: 2.5 });
  }

  private initParticles() {
    const field = this.el.nativeElement.querySelector('.particle-field');
    if (!field) return;

    for (let i = 0; i < 30; i++) {
      const dot = document.createElement('div');
      const size = Math.random() * 3 + 1;
      dot.style.cssText = `
        position:absolute; width:${size}px; height:${size}px;
        border-radius:50%; background:rgba(255,255,255,0.03);
        top:${Math.random() * 100}%; left:${Math.random() * 100}%;
      `;
      field.appendChild(dot);

      gsap.to(dot, {
        y: gsap.utils.random(-80, -40),
        x: gsap.utils.random(-40, 40),
        opacity: 0,
        duration: gsap.utils.random(8, 15),
        repeat: -1,
        ease: 'none',
        delay: Math.random() * 5
      });
    }
  }

  private initWaveAnim() {
    gsap.to('.w1', {
      attr: { d: 'M0,200 C360,350 720,50 1440,200 L1440,400 L0,400 Z' },
      duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut'
    });
    gsap.to('.w2', {
      attr: { d: 'M0,250 C360,400 720,200 1440,250 L1440,400 L0,400 Z' },
      duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut'
    });
    gsap.to('.w3', {
      attr: { d: 'M0,300 C360,450 720,150 1440,300 L1440,400 L0,400 Z' },
      duration: 7, repeat: -1, yoyo: true, ease: 'sine.inOut'
    });

    gsap.to('.orb', {
      y: (i: number) => [30, -25, 20][i] || 0,
      x: (i: number) => [20, -30, -15][i] || 0,
      duration: (i: number) => [7, 9, 6][i] || 7,
      repeat: -1, yoyo: true, ease: 'sine.inOut'
    });
  }

  private initLivePreviewAnim() {
    const shapes = this.el.nativeElement.querySelectorAll('.lp-shape');
    const tl = gsap.timeline({ repeat: -1, defaults: { duration: 1.8, ease: 'power2.inOut' } });

    tl.to(shapes[0], { y: -12, x: -8, scale: 1.1 })
      .to(shapes[1], { y: -12, x: 8, scale: 1.1 }, '-=1.5')
      .to(shapes[2], { y: 12, x: -8, scale: 1.1 }, '-=1.5')
      .to(shapes[3], { y: 12, x: 8, scale: 1.1 }, '-=1.5')
      .to(shapes[0], { y: 0, x: 0, scale: 1 })
      .to(shapes[1], { y: 0, x: 0, scale: 1 }, '-=1.5')
      .to(shapes[2], { y: 0, x: 0, scale: 1 }, '-=1.5')
      .to(shapes[3], { y: 0, x: 0, scale: 1 }, '-=1.5');
  }

  private initDemoCardsAnim() {
    gsap.from('.demo-card', {
      opacity: 0, y: 40, scale: 0.97,
      duration: 0.7, ease: 'power3.out',
      stagger: { amount: 0.5, from: 'start' },
      scrollTrigger: { trigger: '.demo-grid', start: 'top 80%', toggleActions: 'play none none none' }
    });

    this.el.nativeElement.querySelectorAll('.demo-card').forEach((card: Element) => {
      const c = card as HTMLElement;
      c.addEventListener('mouseenter', () => {
        gsap.to(c, { y: -6, borderColor: 'rgba(0,200,150,0.1)', duration: 0.3, ease: 'power2.out' });
        gsap.to(c.querySelector('.demo-visual-shape'), { scale: 1.1, duration: 0.3, ease: 'back.out(2)' });
      });
      c.addEventListener('mouseleave', () => {
        gsap.to(c, { y: 0, borderColor: 'rgba(255,255,255,0.04)', duration: 0.3, ease: 'power2.out' });
        gsap.to(c.querySelector('.demo-visual-shape'), { scale: 1, duration: 0.3, ease: 'power2.out' });
      });
    });
  }

  private initShowcaseAnim() {
    gsap.from('.showcase-box', {
      opacity: 0, y: 40, scale: 0.9, rotation: -5,
      duration: 0.8, ease: 'power3.out',
      stagger: { amount: 0.4, from: 'start' },
      scrollTrigger: { trigger: '.showcase-stage', start: 'top 80%', toggleActions: 'play none none none' }
    });

    gsap.from('.play-btn, .reset-btn', {
      opacity: 0, y: 20,
      duration: 0.5, ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: { trigger: '.showcase-controls', start: 'top 85%', toggleActions: 'play none none none' }
    });
  }
}
