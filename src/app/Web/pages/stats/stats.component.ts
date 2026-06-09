import { Component, inject, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageDataService, PageContent } from '../../services/page-data.service';
import { WebGsapService } from '../../services/web-gsap.service';
import { AnimatedBgComponent } from '../../components/animated-bg/animated-bg.component';

interface StatCard { label: string; value: number; suffix: string; icon: string; desc: string; }

@Component({
  selector: 'app-stats',
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
      <div class="stat-grid">
        @for (s of stats; track s.label) {
          <div class="stat-card fade-up">
            <div class="stat-card-icon"><i [class]="s.icon"></i></div>
            <div class="stat-card-value">
              <span class="stat-card-num" [attr.data-count]="s.value">0</span>
              <span class="stat-card-suffix">{{ s.suffix }}</span>
            </div>
            <h4>{{ s.label }}</h4>
            <p>{{ s.desc }}</p>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .section { padding: 6rem 2rem; }
    .section-alt { background: #0c0c18; }
    .section-tag {
      display: inline-flex; align-items: center; gap: 0.4rem;
      font-size: 0.7rem; font-weight: 700; letter-spacing: 0.15em;
      text-transform: uppercase; color: #00c896;
      padding: 0.35rem 1rem;
      border: 1px solid rgba(0,200,150,0.1);
      border-radius: 100px; margin-bottom: 1rem;
      background: rgba(0,200,150,0.02);
    }
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

    .stat-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem; max-width: 1100px; margin: 0 auto;
    }
    .stat-card {
      background: rgba(255,255,255,0.012);
      border: 1px solid rgba(255,255,255,0.04);
      border-radius: 18px; padding: 2.5rem 2rem;
      text-align: center;
      transition: border-color 0.3s;
    }
    .stat-card:hover { border-color: rgba(0,200,150,0.08); }
    .stat-card-icon {
      width: 52px; height: 52px; border-radius: 14px;
      background: linear-gradient(135deg, rgba(0,200,150,0.06), rgba(0,163,212,0.03));
      border: 1px solid rgba(0,200,150,0.05);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 1.25rem; font-size: 1.15rem; color: #00c896;
    }
    .stat-card-value { display: flex; align-items: baseline; justify-content: center; margin-bottom: 0.75rem; }
    .stat-card-num {
      font-size: clamp(2.2rem, 4vw, 3rem);
      font-weight: 800; color: #fff; line-height: 1;
    }
    .stat-card-suffix {
      font-size: clamp(1rem, 1.8vw, 1.5rem);
      font-weight: 700; color: #00c896;
    }
    .stat-card h4 { font-size: 1rem; font-weight: 600; color: #fff; margin-bottom: 0.4rem; }
    .stat-card p { font-size: 0.82rem; color: rgba(255,255,255,0.4); line-height: 1.6; }

    @media (max-width: 768px) { .section { padding: 5rem 1.5rem; } }
  `]
})
export class StatsComponent implements OnInit, AfterViewInit, OnDestroy {
  private pageDataService = inject(PageDataService);
  private webGsapService = inject(WebGsapService);

  tag = 'By the Numbers';
  title = 'Our Impact';
  subtitle = 'Measurable results that reflect our commitment to excellence.';

  stats: StatCard[] = [
    { label: 'Projects Delivered', value: 200, suffix: '+', icon: 'fas fa-rocket', desc: 'Successfully delivered across industries worldwide' },
    { label: 'Global Clients', value: 50, suffix: '+', icon: 'fas fa-globe', desc: 'Trusted by leading brands across 15+ countries' },
    { label: 'Years Experience', value: 12, suffix: '+', icon: 'fas fa-calendar', desc: 'A decade of driving digital transformation' },
    { label: 'Client Satisfaction', value: 98, suffix: '%', icon: 'fas fa-heart', desc: 'Consistently exceeding client expectations' },
  ];

  ngOnInit() {
    this.pageDataService.getPageContent('stats').subscribe(data => {
      if (data) console.log('Stats data:', data);
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

      document.querySelectorAll('.stat-card-num[data-count]').forEach(el => {
        ScrollTrigger.create({
          trigger: el, start: 'top 90%',
          onEnter: () => {
            const target = parseInt(el.getAttribute('data-count') || '0');
            let current = 0;
            const step = Math.max(1, Math.floor(target / 50));
            const timer = setInterval(() => {
              current += step;
              if (current >= target) { current = target; clearInterval(timer); }
              el.textContent = String(current);
            }, 25);
          },
          once: true
        });
      });

      this.webGsapService.applyAnimations('webstats', document.querySelector('.page-hero') as HTMLElement);
    }, 100);
  }

  ngOnDestroy() {
    ScrollTrigger.getAll().forEach(t => t.kill());
    gsap.killTweensOf('*');
  }
}
