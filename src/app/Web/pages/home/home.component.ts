import { Component, inject, OnInit, AfterViewInit, OnDestroy, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageDataService, PageContent } from '../../services/page-data.service';
import { AnimatedBgComponent } from '../../components/animated-bg/animated-bg.component';

interface ServiceItem { title: string; description: string; icon: string; }
interface TestimonialItem { quote: string; author: string; role: string; initials: string; }

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, AnimatedBgComponent],
  template: `
    <!-- ═══ HERO ═══ -->
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
            <span>{{ heroBadge }}</span>
          </div>
          <h1 class="hero-title" #title>
            <span class="hero-line">{{ heroLine1 }}</span>
            <span class="hero-line hero-line--gradient" #gradientLine>{{ heroLine2 }}</span>
          </h1>
          <p class="hero-desc" #desc>{{ heroDesc }}</p>
          <div class="hero-actions" #actions>
            <a routerLink="/contact" class="btn btn-primary">Start Your Journey <i class="fas fa-arrow-right"></i></a>
            <a routerLink="/portfolio" class="btn btn-outline">View Our Work</a>
          </div>
        </div>
        <div class="hero-stats" #stats>
          <div class="hero-stat"><span class="hero-stat-num">200</span><span class="hero-stat-plus">+</span><span class="hero-stat-lbl">Projects Delivered</span></div>
          <div class="hero-stat"><span class="hero-stat-num">50</span><span class="hero-stat-plus">+</span><span class="hero-stat-lbl">Global Clients</span></div>
          <div class="hero-stat"><span class="hero-stat-num">12</span><span class="hero-stat-plus">+</span><span class="hero-stat-lbl">Years Experience</span></div>
        </div>
      </div>
      <div class="scroll-hint" #scrollHint>
        <span>SCROLL</span>
        <div class="scroll-line"><div class="scroll-dot"></div></div>
      </div>
    </section>

    <!-- ═══ SERVICES ═══ -->
    <section class="section alt" #servicesSection>
      <div class="section-header">
        <span class="section-tag">{{ servicesTag }}</span>
        <h2 class="section-title">{{ servicesTitle }}</h2>
        <p class="section-desc">{{ servicesDesc }}</p>
      </div>
      <div class="services-grid" #servicesGrid>
        @for (svc of services; track svc.title; let i = $index) {
          <div class="service-card" [attr.data-idx]="i" #serviceCards>
            <div class="sc-icon"><i [class]="svc.icon"></i></div>
            <h3>{{ svc.title }}</h3>
            <p>{{ svc.description }}</p>
            <a routerLink="/services" class="sc-link">Learn More <i class="fas fa-arrow-right"></i></a>
          </div>
        }
      </div>
    </section>

    <!-- ═══ STATS ═══ -->
    <section class="section stats-section" #statsSection>
      <div class="stats-glow"></div>
      <div class="stats-grid" #statsGrid>
        <div class="stat-item"><div class="stat-val"><span class="stat-num" data-target="200">0</span><span class="stat-sfx">+</span></div><span class="stat-lbl">Projects Delivered</span></div>
        <div class="stat-item"><div class="stat-val"><span class="stat-num" data-target="50">0</span><span class="stat-sfx">+</span></div><span class="stat-lbl">Global Clients</span></div>
        <div class="stat-item"><div class="stat-val"><span class="stat-num" data-target="12">0</span><span class="stat-sfx">+</span></div><span class="stat-lbl">Years Experience</span></div>
        <div class="stat-item"><div class="stat-val"><span class="stat-num" data-target="98">0</span><span class="stat-sfx">%</span></div><span class="stat-lbl">Client Satisfaction</span></div>
      </div>
    </section>

    <!-- ═══ CLIENTS ═══ -->
    <section class="section" #clientsSection>
      <div class="section-header">
        <span class="section-tag">{{ clientsTag }}</span>
        <h2 class="section-title">{{ clientsTitle }}</h2>
      </div>
      <div class="clients-track-wrap">
        <div class="clients-track" #clientsTrack>
          <span class="client-logo">Tata Play</span>
          <span class="client-logo">Tabcorp</span>
          <span class="client-logo">Alibaba</span>
          <span class="client-logo">Maruti Suzuki</span>
          <span class="client-logo">Ooredoo</span>
          <span class="client-logo">Majid Al Futtaim</span>
          <span class="client-logo">Fortis</span>
          <span class="client-logo">Sony</span>
          <span class="client-logo">HDFC</span>
          <span class="client-logo">Indigo</span>
          <!-- dup for seamless loop -->
          <span class="client-logo">Tata Play</span>
          <span class="client-logo">Tabcorp</span>
          <span class="client-logo">Alibaba</span>
          <span class="client-logo">Maruti Suzuki</span>
          <span class="client-logo">Ooredoo</span>
          <span class="client-logo">Majid Al Futtaim</span>
          <span class="client-logo">Fortis</span>
          <span class="client-logo">Sony</span>
          <span class="client-logo">HDFC</span>
          <span class="client-logo">Indigo</span>
        </div>
      </div>
    </section>

    <!-- ═══ TESTIMONIALS ═══ -->
    <section class="section alt" #testimonialsSection>
      <div class="section-header">
        <span class="section-tag">{{ testimonialsTag }}</span>
        <h2 class="section-title">{{ testimonialsTitle }}</h2>
        <p class="section-desc">{{ testimonialsDesc }}</p>
      </div>
      <div class="testimonials-grid" #testimonialsGrid>
        @for (t of testimonials; track t.author; let i = $index) {
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

    <!-- ═══ CTA ═══ -->
    <section class="section cta-section" #ctaSection>
      <div class="cta-glow"></div>
      <div class="cta-inner" #ctaInner>
        <h2>{{ ctaTitle }}</h2>
        <p>{{ ctaDesc }}</p>
        <a routerLink="/contact" class="btn btn-primary btn-lg">{{ ctaBtn }} <i class="fas fa-arrow-right"></i></a>
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
    .btn-lg { padding: 1rem 2.5rem; font-size: 1rem; }
    .btn i { font-size: 0.75rem; transition: transform 0.3s; }
    .btn-primary:hover i { transform: translateX(4px); }

    /* ── Hero ── */
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
    .g3 { width: 350px; height: 350px; background: rgba(99,102,241,0.04); top: 30%; left: 50%; }
    .g4 { width: 250px; height: 250px; background: rgba(0,200,150,0.04); top: 15%; left: 10%; }

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
    .scroll-dot {
      width: 2px; height: 10px; background: #00c896; border-radius: 2px;
      position: absolute; top: -10px; left: -0.5px;
    }

    /* ── Services ── */
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem; max-width: 1200px; margin: 0 auto;
    }
    .service-card {
      background: rgba(255,255,255,0.012);
      border: 1px solid rgba(255,255,255,0.04);
      border-radius: 18px; padding: 2.5rem 2rem;
      position: relative; overflow: hidden;
      backdrop-filter: blur(10px);
      will-change: transform;
    }
    .service-card::before {
      content: ''; position: absolute; inset: 0; border-radius: 18px;
      background: linear-gradient(135deg, rgba(0,200,150,0.03), transparent 50%);
      opacity: 0; transition: opacity 0.5s;
      pointer-events: none;
    }
    .service-card:hover::before { opacity: 1; }
    .sc-icon {
      width: 50px; height: 50px; border-radius: 14px;
      background: linear-gradient(135deg, rgba(0,200,150,0.08), rgba(0,163,212,0.04));
      border: 1px solid rgba(0,200,150,0.06);
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 1.25rem; font-size: 1.15rem; color: #00c896;
      will-change: transform;
    }
    .service-card h3 { font-size: 1.1rem; font-weight: 600; color: #fff; margin-bottom: 0.6rem; }
    .service-card p { font-size: 0.85rem; color: rgba(255,255,255,0.35); line-height: 1.65; }
    .sc-link {
      display: inline-flex; align-items: center; gap: 0.3rem;
      margin-top: 1.25rem; font-size: 0.8rem; font-weight: 600;
      color: #00c896; text-decoration: none;
    }

    /* ── Stats ── */
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

    /* ── Clients ── */
    .clients-track-wrap { overflow: hidden; max-width: 1000px; margin: 0 auto; }
    .clients-track { display: flex; gap: 3rem; width: max-content; padding: 1rem 0; }
    .client-logo {
      font-size: 0.85rem; font-weight: 600; color: rgba(255,255,255,0.15);
      letter-spacing: 0.05em; white-space: nowrap;
      transition: color 0.3s; flex-shrink: 0;
    }
    .client-logo:hover { color: rgba(255,255,255,0.4); }

    /* ── Testimonials ── */
    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem; max-width: 1100px; margin: 0 auto;
    }
    .testimonial-card {
      background: rgba(255,255,255,0.012);
      border: 1px solid rgba(255,255,255,0.04);
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

    /* ── CTA ── */
    .cta-section { background: linear-gradient(135deg, #08080f, #0c0c18, #101020); text-align: center; }
    .cta-glow {
      position: absolute; inset: 0;
      background: radial-gradient(ellipse at 30% 50%, rgba(0,200,150,0.03) 0%, transparent 60%),
                  radial-gradient(ellipse at 70% 50%, rgba(0,163,212,0.02) 0%, transparent 60%);
      pointer-events: none;
    }
    .cta-inner { position: relative; z-index: 1; max-width: 620px; margin: 0 auto; }
    .cta-inner h2 { font-size: clamp(1.8rem, 3.5vw, 2.7rem); font-weight: 700; margin-bottom: 1rem; }
    .cta-inner p { font-size: 1rem; color: rgba(255,255,255,0.35); margin-bottom: 2.5rem; }

    @media (max-width: 1024px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 768px) { .section { padding: 5rem 1.5rem; } .hero-stats { gap: 1.5rem; flex-wrap: wrap; } }
    @media (max-width: 640px) { .stats-grid { grid-template-columns: 1fr; } .hero-stats { flex-direction: column; gap: 1.2rem; } }
  `]
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private pageDataService = inject(PageDataService);
  private el = inject(ElementRef);

  @ViewChild(AnimatedBgComponent) animatedBg?: AnimatedBgComponent;

  heroBadge = 'Driving Innovation, Delivering Excellence';
  heroLine1 = 'We Build Digital';
  heroLine2 = 'Products That Scale';
  heroDesc = 'We design and engineer digital platforms with Cloud, Data, and AI at the core — helping enterprises transform and grow.';
  heroStats = [
    { label: 'Projects Delivered', value: '200', suffix: '+' },
    { label: 'Global Clients', value: '50', suffix: '+' },
    { label: 'Years Experience', value: '12', suffix: '+' },
  ];

  servicesTag = 'What We Do';
  servicesTitle = 'Our Services';
  servicesDesc = 'End-to-end capabilities to ideate, build, scale, and optimize digital products.';
  services: ServiceItem[] = [
    { title: 'Generative AI', description: 'Leverage GenAI to automate workflows, generate insights, and create intelligent products.', icon: 'fas fa-brain' },
    { title: 'Cloud & DevOps', description: 'Scalable cloud infrastructure and DevOps pipelines that accelerate delivery and reduce costs.', icon: 'fas fa-cloud' },
    { title: 'Data Engineering', description: 'Build robust data platforms, real-time pipelines, and analytics solutions.', icon: 'fas fa-database' },
    { title: 'Digital Engineering', description: 'Full-stack product engineering — from web and mobile to microservices and APIs.', icon: 'fas fa-code' },
    { title: 'Digital Experience', description: 'Human-centered design that creates intuitive, accessible, and delightful experiences.', icon: 'fas fa-palette' },
    { title: 'Quality Engineering', description: 'AI-powered test automation and QA strategies that ensure bulletproof quality.', icon: 'fas fa-bullseye' },
  ];

  clientsTag = 'Trusted By';
  clientsTitle = 'Leading Brands Worldwide';

  testimonialsTag = 'Client Voices';
  testimonialsTitle = 'What Our Partners Say';
  testimonialsDesc = 'Hear from the leaders we have worked with across the globe.';
  testimonials: TestimonialItem[] = [
    { quote: 'Competent, enabling & partnership driven. They brought deep technical expertise and a collaborative spirit to every phase.', author: 'Prithwish Mukherjee', role: 'Marketing Head, Tata Play Fiber', initials: 'PM' },
    { quote: 'Reliable, diligent and swift. Their team consistently delivered high-quality work ahead of schedule.', author: 'Takeshi Ashida', role: 'GM — Overseas Business, Anim Times', initials: 'TA' },
    { quote: 'Superb, enriching, agile partnership. They truly understand digital transformation from strategy to execution.', author: 'Ana-Maria Korner', role: 'Regional Head Brand & Digital, Hilti', initials: 'AK' },
  ];

  ctaTitle = 'Ready to Build Something Extraordinary?';
  ctaDesc = "Let's discuss how we can help you achieve your digital transformation goals.";
  ctaBtn = 'Start a Conversation';

  private tl = gsap.timeline();
  private ctx!: gsap.Context;
  private marqueeTween: gsap.core.Tween | null = null;

  ngOnInit() {
    this.pageDataService.getPageContent('home').subscribe(data => {
      if (data) {
        const hero = data.sections.find(s => s.sectionKey === 'hero');
        if (hero) { this.heroBadge = hero.title || this.heroBadge; this.heroDesc = hero.content || this.heroDesc; }
      }
    });
  }

  ngAfterViewInit() {
    gsap.registerPlugin(ScrollTrigger);
    this.ctx = gsap.context(() => {
      this.initHeroAnim();
      this.initGlowParallax();
      this.initServicesAnim();
      this.initStatsAnim();
      this.initClientsMarquee();
      this.initTestimonialsAnim();
      this.initCtaAnim();
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
    const hero = this.el.nativeElement.querySelector('.hero');

    // Hero entrance timeline
    this.tl
      .from('.hero-badge', { opacity: 0, y: 25, scale: 0.9, duration: 0.7, ease: 'back.out(1.7)' })
      .from('.hero-line', { opacity: 0, y: 60, duration: 1, ease: 'power4.out', stagger: 0.2 }, '-=0.3')
      .from('.hero-desc', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' }, '-=0.5')
      .from('.hero-actions .btn', { opacity: 0, y: 20, scale: 0.95, duration: 0.6, ease: 'back.out(1.4)', stagger: 0.12 }, '-=0.4')
      .from('.hero-stats', { opacity: 0, y: 25, duration: 0.7, ease: 'power3.out' }, '-=0.2')
      .from('.scroll-hint', { opacity: 0, y: 10, duration: 0.5, ease: 'power2.out' }, '-=0.1');

    // Scroll-dot bounce loop
    gsap.to('.scroll-dot', {
      y: 30, duration: 1.8, repeat: -1, ease: 'power2.inOut', delay: 2.5
    });

    // Parallax hero grid on scroll
    gsap.to('.hero-grid', {
      y: 80, duration: 1,
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1.5 }
    });
  }

  private initGlowParallax() {
    gsap.to('.g1', { y: -30, x: 15, duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.g2', { y: 30, x: -15, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.g1', {
      scale: 1.3, duration: 1,
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 }
    });
  }

  private initServicesAnim() {
    const cards = this.el.nativeElement.querySelectorAll('.service-card');

    // Staggered card entrance
    gsap.from(cards, {
      opacity: 0, y: 60, scale: 0.95,
      duration: 0.9, ease: 'power3.out',
      stagger: { amount: 0.6, from: 'start' },
      scrollTrigger: {
        trigger: '.services-grid', start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    // Hover animations
    cards.forEach((card: Element) => {
      const c = card as HTMLElement;
      const icon = c.querySelector('.sc-icon') as HTMLElement;
      const link = c.querySelector('.sc-link') as HTMLElement;

      c.addEventListener('mouseenter', () => {
        gsap.to(c, { y: -8, borderColor: 'rgba(0,200,150,0.15)', duration: 0.4, ease: 'power2.out' });
        gsap.to(icon, { scale: 1.1, duration: 0.3, ease: 'back.out(2)' });
        gsap.to(link, { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' });
      });
      c.addEventListener('mouseleave', () => {
        gsap.to(c, { y: 0, borderColor: 'rgba(255,255,255,0.04)', duration: 0.4, ease: 'power2.out' });
        gsap.to(icon, { scale: 1, duration: 0.3, ease: 'power2.out' });
        gsap.to(link, { opacity: 0, x: -6, duration: 0.3, ease: 'power2.out' });
      });
    });
  }

  private initStatsAnim() {
    const nums = this.el.nativeElement.querySelectorAll('.stat-num[data-target]');

    ScrollTrigger.batch(nums, {
      start: 'top 85%',
      once: true,
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

    // Entrance animation for stat items
    gsap.from('.stat-item', {
      opacity: 0, y: 40, duration: 0.8, ease: 'power3.out',
      stagger: 0.15,
      scrollTrigger: { trigger: '.stats-grid', start: 'top 80%', toggleActions: 'play none none none' }
    });
  }

  private initClientsMarquee() {
    const track = this.el.nativeElement.querySelector('.clients-track');
    if (!track) return;

    // Entrance
    gsap.from('.client-logo', {
      opacity: 0, y: 20, duration: 0.6, ease: 'power3.out',
      stagger: 0.05,
      scrollTrigger: { trigger: '.clients-track-wrap', start: 'top 85%', toggleActions: 'play none none none' }
    });

    // Infinite marquee
    const totalWidth = track.scrollWidth / 2;
    this.marqueeTween = gsap.to(track, {
      x: -totalWidth,
      duration: 40,
      repeat: -1,
      ease: 'none',
      paused: true
    });

    // Play after entrance
    setTimeout(() => {
      if (this.marqueeTween) {
        this.marqueeTween.play(0);
      }
    }, 800);

    // Pause on hover
    track.addEventListener('mouseenter', () => this.marqueeTween?.pause());
    track.addEventListener('mouseleave', () => this.marqueeTween?.resume());
  }

  private initTestimonialsAnim() {
    gsap.from('.testimonial-card', {
      opacity: 0, y: 50, rotationX: 5,
      duration: 0.8, ease: 'power3.out',
      stagger: { amount: 0.5, from: 'start' },
      scrollTrigger: {
        trigger: '.testimonials-grid', start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  }

  private initCtaAnim() {
    gsap.from('.cta-inner > *', {
      opacity: 0, y: 30,
      duration: 0.7, ease: 'power3.out',
      stagger: 0.15,
      scrollTrigger: {
        trigger: '.cta-section', start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  }

  ngOnDestroy() {
    this.ctx?.revert();
    this.tl?.kill();
    if (this.marqueeTween) this.marqueeTween.kill();
    ScrollTrigger.getAll().forEach(t => t.kill());
    gsap.killTweensOf('*');
  }
}
