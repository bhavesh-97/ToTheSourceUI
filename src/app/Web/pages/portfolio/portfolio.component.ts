import { Component, inject, OnInit, AfterViewInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageDataService, PageContent } from '../../services/page-data.service';
import { WebGsapService } from '../../services/web-gsap.service';
import { AnimatedBgComponent } from '../../components/animated-bg/animated-bg.component';

interface ProjectItem { id: string; title: string; category: string; description: string; client: string; }

@Component({
  selector: 'app-portfolio',
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
        <span class="section-tag">{{ showcaseTag }}</span>
        <h2 class="section-title">{{ showcaseTitle }}</h2>
        <p class="section-desc">{{ showcaseDesc }}</p>
      </div>
      <div class="filter-bar fade-up">
        <button class="filter-btn" [class.active]="activeFilter() === 'All'" (click)="setFilter('All')">All</button>
        @for (cat of categories; track cat) {
          <button class="filter-btn" [class.active]="activeFilter() === cat" (click)="setFilter(cat)">{{ cat }}</button>
        }
      </div>
      <div class="portfolio-grid">
        @for (item of filteredItems(); track item.id) {
          <div class="portfolio-card fade-up">
            <div class="portfolio-thumb">
              <i class="fas fa-folder-open"></i>
              <div class="portfolio-thumb-overlay">
                <span>View Case Study</span>
              </div>
            </div>
            <div class="portfolio-body">
              <span class="portfolio-cat">{{ item.category }}</span>
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
              <span class="portfolio-client">{{ item.client }}</span>
            </div>
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
    .section-header { text-align: center; margin-bottom: 3rem; }
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
      transition: transform 0.3s, box-shadow 0.3s; border: none;
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
    .page-hero h1 { font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 800; letter-spacing: -0.03em; margin-bottom: 1rem; }
    .page-hero p { font-size: 1.1rem; color: rgba(255,255,255,0.4); }

    .filter-bar {
      display: flex; gap: 0.75rem; justify-content: center;
      margin-bottom: 3rem; flex-wrap: wrap;
    }
    .filter-btn {
      padding: 0.6rem 1.4rem; background: transparent;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 50px; color: rgba(255,255,255,0.5);
      font-size: 0.8rem; font-weight: 500; cursor: pointer; font-family: inherit;
      transition: all 0.3s;
    }
    .filter-btn.active, .filter-btn:hover {
      background: rgba(0,200,150,0.08);
      border-color: rgba(0,200,150,0.15);
      color: #00c896;
    }

    .portfolio-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem; max-width: 1200px; margin: 0 auto;
    }
    .portfolio-card {
      background: rgba(255,255,255,0.012);
      border: 1px solid rgba(255,255,255,0.04);
      border-radius: 18px; overflow: hidden;
      transition: border-color 0.3s, transform 0.3s;
    }
    .portfolio-card:hover {
      border-color: rgba(0,200,150,0.1);
      transform: translateY(-4px);
    }
    .portfolio-thumb {
      aspect-ratio: 16/10;
      background: linear-gradient(135deg, #12121e, #16162a);
      display: flex; align-items: center; justify-content: center;
      position: relative; overflow: hidden;
    }
    .portfolio-thumb i { font-size: 2rem; color: rgba(255,255,255,0.03); }
    .portfolio-thumb-overlay {
      position: absolute; inset: 0;
      background: rgba(0,200,150,0.04);
      display: flex; align-items: center; justify-content: center;
      opacity: 0; transition: opacity 0.3s;
    }
    .portfolio-card:hover .portfolio-thumb-overlay { opacity: 1; }
    .portfolio-thumb-overlay span {
      padding: 0.6rem 1.5rem;
      border: 1px solid rgba(0,200,150,0.2);
      border-radius: 50px;
      color: #00c896; font-size: 0.78rem; font-weight: 600;
    }
    .portfolio-body { padding: 1.5rem; }
    .portfolio-cat {
      font-size: 0.7rem; font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.1em; color: #00c896;
    }
    .portfolio-body h3 {
      font-size: 1.05rem; font-weight: 600; color: #fff;
      margin: 0.5rem 0 0.4rem;
    }
    .portfolio-body p { font-size: 0.82rem; color: rgba(255,255,255,0.4); line-height: 1.6; margin-bottom: 0.75rem; }
    .portfolio-client { font-size: 0.75rem; color: rgba(255,255,255,0.2); }

    .section-cta {
      background: linear-gradient(135deg, #08080f, #0c0c18, #101020);
      text-align: center;
    }
    .cta-inner { max-width: 620px; margin: 0 auto; }
    .cta-inner h2 { font-size: clamp(1.8rem, 3.5vw, 2.7rem); font-weight: 700; margin-bottom: 1rem; }
    .cta-inner p { font-size: 1rem; color: rgba(255,255,255,0.4); margin-bottom: 2.5rem; }

    @media (max-width: 768px) { .section { padding: 5rem 1.5rem; } }
  `]
})
export class PortfolioComponent implements OnInit, AfterViewInit, OnDestroy {
  private pageDataService = inject(PageDataService);
  private webGsapService = inject(WebGsapService);

  tag = 'Our Work';
  title = 'Portfolio';
  subtitle = 'Real projects, real results for global brands.';

  showcaseTag = 'Showcase';
  showcaseTitle = 'Selected Projects';
  showcaseDesc = 'A glimpse into the solutions we have delivered across industries.';
  activeFilter = signal<string>('All');
  categories = ['Web', 'Mobile', 'Cloud', 'AI'];

  allItems: ProjectItem[] = [
    { id: '1', title: 'E-Commerce Platform', category: 'Web', description: 'Full-featured online store with AI-powered recommendations.', client: 'RetailCo' },
    { id: '2', title: 'Fitness Tracking App', category: 'Mobile', description: 'Cross-platform health and wellness application.', client: 'FitLife' },
    { id: '3', title: 'Cloud Migration', category: 'Cloud', description: 'Enterprise infrastructure migration to AWS.', client: 'FinanceHub' },
    { id: '4', title: 'AI Chatbot Platform', category: 'AI', description: 'Intelligent customer service automation solution.', client: 'TechCorp' },
    { id: '5', title: 'SaaS Dashboard', category: 'Web', description: 'Real-time analytics and reporting dashboard.', client: 'DataFlow' },
    { id: '6', title: 'Food Delivery App', category: 'Mobile', description: 'On-demand delivery with real-time tracking.', client: 'QuickEat' },
  ];

  ctaTitle = 'Have a Project in Mind?';
  ctaDesc = "Let's create something amazing together.";
  ctaBtn = 'Start a Project';

  get filteredItems() {
    return signal(this.activeFilter() === 'All'
      ? this.allItems
      : this.allItems.filter(i => i.category === this.activeFilter()));
  }

  setFilter(cat: string) {
    this.activeFilter.set(cat);
  }

  ngOnInit() {
    this.pageDataService.getPageContent('portfolio').subscribe(data => {
      if (data) console.log('Portfolio data:', data);
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
      this.webGsapService.applyAnimations('webportfolio', document.querySelector('.page-hero') as HTMLElement);
    }, 100);
  }

  ngOnDestroy() {
    ScrollTrigger.getAll().forEach(t => t.kill());
    gsap.killTweensOf('*');
  }
}
