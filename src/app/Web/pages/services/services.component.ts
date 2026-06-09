import { Component, inject, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageDataService, PageContent } from '../../services/page-data.service';
import { WebGsapService } from '../../services/web-gsap.service';
import { AnimatedBgComponent } from '../../components/animated-bg/animated-bg.component';

interface ServiceDetail { title: string; description: string; features: string[]; icon: string; }
interface ProcessStep { step: string; description: string; }

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule, AnimatedBgComponent],
  template: `
    <section class="page-hero">
      <div class="page-hero-bg">
        <app-animated-bg variant="section" color1="#00c896" color2="#00a3d4" color3="#6366f1"></app-animated-bg>
        <div class="glow glow-1"></div>
        <div class="glow glow-2"></div>
      </div>
      <div class="page-hero-content">
        <span class="section-tag">{{ tag }}</span>
        <h1>{{ title }}</h1>
        <p>{{ subtitle }}</p>
      </div>
    </section>

    <section class="section section-alt">
      <div class="section-header fade-up">
        <span class="section-tag">{{ servicesTag }}</span>
        <h2 class="section-title">{{ servicesTitle }}</h2>
        <p class="section-desc">{{ servicesDesc }}</p>
      </div>
      <div class="services-list">
        @for (s of services; track s.title; let i = $index) {
          <div class="service-row fade-up" [class.service-row--reverse]="i % 2 === 1">
            <div class="service-info">
              <div class="service-icon"><i [class]="s.icon"></i></div>
              <h3>{{ s.title }}</h3>
              <p>{{ s.description }}</p>
              <ul class="service-features">
                @for (f of s.features; track f) {
                  <li><i class="fas fa-check"></i> {{ f }}</li>
                }
              </ul>
              <a routerLink="/contact" class="btn btn-primary">Get Started <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="service-visual">
              <div class="visual-placeholder">
                <i [class]="s.icon"></i>
              </div>
            </div>
          </div>
        }
      </div>
    </section>

    <section class="section">
      <div class="section-header fade-up">
        <span class="section-tag">{{ processTag }}</span>
        <h2 class="section-title">{{ processTitle }}</h2>
        <p class="section-desc">{{ processDesc }}</p>
      </div>
      <div class="process-track">
        @for (p of process; track p.step; let i = $index) {
          <div class="process-step fade-up">
            <div class="process-num">{{ i + 1 }}</div>
            <h4>{{ p.step }}</h4>
            <p>{{ p.description }}</p>
          </div>
        }
      </div>
    </section>

    <section class="section section-cta">
      <div class="cta-inner fade-up">
        <h2>{{ ctaTitle }}</h2>
        <p>{{ ctaDesc }}</p>
        <a routerLink="/contact" class="btn btn-primary btn-lg">{{ ctaBtn }} <i class="fas fa-arrow-right"></i></a>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .section { padding: 6rem 2rem; }
    .section-alt { background: #0c0c18; }
    .section-header { text-align: center; margin-bottom: 4rem; }
    .section-tag {
      display: inline-flex; align-items: center; gap: 0.4rem;
      font-size: 0.7rem; font-weight: 700; letter-spacing: 0.15em;
      text-transform: uppercase; color: #00c896;
      padding: 0.35rem 1rem;
      border: 1px solid rgba(0,200,150,0.1);
      border-radius: 100px; margin-bottom: 1rem;
      background: rgba(0,200,150,0.02);
    }
    .section-title {
      font-size: clamp(1.8rem, 4vw, 2.8rem);
      font-weight: 700; color: #fff; margin-bottom: 0.75rem; line-height: 1.15;
    }
    .section-desc {
      font-size: clamp(0.85rem, 1.2vw, 1rem);
      color: rgba(255,255,255,0.4);
      max-width: 520px; margin: 0 auto; line-height: 1.7;
    }
    .btn {
      display: inline-flex; align-items: center; gap: 0.5rem;
      padding: 0.85rem 2rem; border-radius: 50px;
      text-decoration: none; font-weight: 600;
      font-size: 0.88rem; cursor: pointer; font-family: inherit;
      transition: transform 0.3s, box-shadow 0.3s;
      border: none;
    }
    .btn-primary {
      background: linear-gradient(135deg, #00c896, #00a3d4);
      color: #fff; box-shadow: 0 4px 25px rgba(0,200,150,0.2);
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 35px rgba(0,200,150,0.35); }
    .btn-lg { padding: 1rem 2.5rem; font-size: 1rem; }
    .btn i { font-size: 0.75rem; }
    .fade-up { opacity: 0; transform: translateY(40px); }

    .page-hero {
      padding: 10rem 2rem 5rem; text-align: center;
      position: relative; overflow: hidden; background: #08080f;
    }
    .page-hero-bg { position: absolute; inset: 0; z-index: 0; }
    .page-hero .glow {
      position: absolute; border-radius: 50%; pointer-events: none; filter: blur(80px);
    }
    .page-hero .glow-1 { width: 500px; height: 500px; background: rgba(0,200,150,0.05); top: -20%; right: -10%; }
    .page-hero .glow-2 { width: 400px; height: 400px; background: rgba(0,163,212,0.03); bottom: -20%; left: -10%; }
    .page-hero-content { position: relative; z-index: 1; max-width: 700px; margin: 0 auto; }
    .page-hero h1 {
      font-size: clamp(2.5rem, 6vw, 4rem);
      font-weight: 800; letter-spacing: -0.03em; margin-bottom: 1rem;
    }
    .page-hero p { font-size: 1.1rem; color: rgba(255,255,255,0.4); }

    .services-list { max-width: 1200px; margin: 0 auto; }
    .service-row {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 4rem; align-items: center;
      padding: 4rem 0;
      border-bottom: 1px solid rgba(255,255,255,0.03);
    }
    .service-row:last-child { border-bottom: none; }
    .service-info h3 {
      font-size: 1.6rem; font-weight: 700; color: #fff;
      margin-bottom: 0.75rem;
    }
    .service-info p { color: rgba(255,255,255,0.45); line-height: 1.7; margin-bottom: 1.5rem; font-size: 0.92rem; }
    .service-icon {
      width: 48px; height: 48px; border-radius: 14px;
      background: linear-gradient(135deg, rgba(0,200,150,0.08), rgba(0,163,212,0.04));
      border: 1px solid rgba(0,200,150,0.06);
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 1rem; font-size: 1.1rem; color: #00c896;
    }
    .service-features { list-style: none; padding: 0; margin-bottom: 2rem; }
    .service-features li {
      padding: 0.35rem 0;
      font-size: 0.85rem; color: rgba(255,255,255,0.5);
      display: flex; align-items: center; gap: 0.5rem;
    }
    .service-features li i { color: #00c896; font-size: 0.65rem; }
    .service-visual { display: flex; align-items: center; justify-content: center; }
    .visual-placeholder {
      width: 100%; aspect-ratio: 1;
      background: linear-gradient(135deg, rgba(0,200,150,0.03), rgba(0,163,212,0.02));
      border: 1px solid rgba(255,255,255,0.03);
      border-radius: 20px;
      display: flex; align-items: center; justify-content: center;
      font-size: 4rem; color: rgba(0,200,150,0.08);
    }

    .process-track {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.5rem; max-width: 1000px; margin: 0 auto;
    }
    .process-step {
      text-align: center; padding: 2rem 1.5rem;
      background: rgba(255,255,255,0.012);
      border: 1px solid rgba(255,255,255,0.04);
      border-radius: 18px;
    }
    .process-num {
      width: 48px; height: 48px; border-radius: 50%;
      background: linear-gradient(135deg, rgba(0,200,150,0.08), rgba(0,163,212,0.04));
      border: 1px solid rgba(0,200,150,0.06);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 1rem;
      font-size: 1.1rem; font-weight: 700; color: #00c896;
    }
    .process-step h4 { font-size: 1rem; font-weight: 600; color: #fff; margin-bottom: 0.5rem; }
    .process-step p { font-size: 0.82rem; color: rgba(255,255,255,0.4); line-height: 1.6; }

    .section-cta {
      background: linear-gradient(135deg, #08080f, #0c0c18, #101020);
      text-align: center; position: relative; overflow: hidden;
    }
    .cta-inner { max-width: 620px; margin: 0 auto; }
    .cta-inner h2 { font-size: clamp(1.8rem, 3.5vw, 2.7rem); font-weight: 700; margin-bottom: 1rem; }
    .cta-inner p { font-size: 1rem; color: rgba(255,255,255,0.4); margin-bottom: 2.5rem; }

    @media (max-width: 768px) {
      .section { padding: 5rem 1.5rem; }
      .service-row { grid-template-columns: 1fr; gap: 2rem; }
      .service-row--reverse .service-visual { order: -1; }
    }
  `]
})
export class ServicesComponent implements OnInit, AfterViewInit, OnDestroy {
  private pageDataService = inject(PageDataService);
  private webGsapService = inject(WebGsapService);

  tag = 'What We Deliver';
  title = 'Our Services';
  subtitle = 'Comprehensive digital capabilities from strategy to execution.';

  servicesTag = 'Capabilities';
  servicesTitle = 'End-to-End Solutions';
  servicesDesc = 'We deliver results across the full digital transformation spectrum.';
  services: ServiceDetail[] = [
    { title: 'Generative AI', description: 'Harness the power of AI to automate processes, generate insights, and create intelligent products that adapt and learn.', icon: 'fas fa-brain', features: ['LLM Integration', 'Automation Pipelines', 'Intelligent Search', 'Content Generation'] },
    { title: 'Cloud & DevOps', description: 'Scalable, secure cloud infrastructure with automated CI/CD pipelines for faster, reliable deployments.', icon: 'fas fa-cloud', features: ['AWS/Azure/GCP', 'Infrastructure as Code', 'Container Orchestration', 'Monitoring & Logging'] },
    { title: 'Data Engineering', description: 'End-to-end data platforms that turn raw data into actionable insights with real-time processing.', icon: 'fas fa-database', features: ['Data Pipelines', 'Warehousing', 'Real-time Analytics', 'Data Governance'] },
    { title: 'Digital Experience', description: 'User-centered design and development that creates intuitive, accessible digital products.', icon: 'fas fa-palette', features: ['UX Research', 'Design Systems', 'Web & Mobile', 'Accessibility'] },
  ];

  processTag = 'Approach';
  processTitle = 'How We Work';
  processDesc = 'A proven methodology for delivering results, every time.';
  process: ProcessStep[] = [
    { step: 'Discover', description: 'We dive deep into your business, goals, and challenges.' },
    { step: 'Strategize', description: 'We create a roadmap with clear milestones and deliverables.' },
    { step: 'Build', description: 'Agile development with continuous feedback and iteration.' },
    { step: 'Scale', description: 'We deploy, monitor, and optimize for growth.' },
  ];

  ctaTitle = 'Ready to Get Started?';
  ctaDesc = "Let's discuss your project and find the right solution.";
  ctaBtn = 'Talk to Us';

  ngOnInit() {
    this.pageDataService.getServicesContent().subscribe(data => {
      if (data) {
        const intro = data.sections.find(s => s.sectionKey === 'intro');
        if (intro) this.subtitle = intro.content || this.subtitle;
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      gsap.registerPlugin(ScrollTrigger);
      gsap.from('.page-hero-content', { opacity: 0, y: 40, duration: 1, ease: 'power4.out' });
      document.querySelectorAll('.fade-up').forEach(el => {
        gsap.from(el, {
          opacity: 0, y: 50, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
        });
      });
      this.webGsapService.applyAnimations('services', document.querySelector('.page-hero') as HTMLElement);
    }, 100);
  }

  ngOnDestroy() {
    ScrollTrigger.getAll().forEach(t => t.kill());
    gsap.killTweensOf('*');
  }
}
