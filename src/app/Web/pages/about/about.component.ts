import { Component, inject, OnInit, AfterViewInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageDataService, PageContent } from '../../services/page-data.service';
import { WebGsapService } from '../../services/web-gsap.service';
import { AnimatedBgComponent } from '../../components/animated-bg/animated-bg.component';

interface ValueItem { title: string; description: string; icon: string; }
interface TeamMember { name: string; role: string; initials: string; }

@Component({
  selector: 'app-about',
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
      <div class="split-row">
        <div class="split-text fade-up">
          <span class="section-tag">{{ storyTag }}</span>
          <h2 class="section-title">{{ storyTitle }}</h2>
          <p>{{ storyContent }}</p>
        </div>
        <div class="split-visual fade-up">
          <div class="visual-block">
            <i class="fas fa-circle-nodes"></i>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-header fade-up">
        <span class="section-tag">{{ valuesTag }}</span>
        <h2 class="section-title">{{ valuesTitle }}</h2>
        <p class="section-desc">{{ valuesDesc }}</p>
      </div>
      <div class="grid-3">
        @for (v of values; track v.title) {
          <div class="card card-hover fade-up">
            <div class="card-icon"><i [class]="v.icon"></i></div>
            <h3>{{ v.title }}</h3>
            <p>{{ v.description }}</p>
          </div>
        }
      </div>
    </section>

    <section class="section section-alt">
      <div class="section-header fade-up">
        <span class="section-tag">{{ teamTag }}</span>
        <h2 class="section-title">{{ teamTitle }}</h2>
        <p class="section-desc">{{ teamDesc }}</p>
      </div>
      <div class="team-grid">
        @for (m of team; track m.name) {
          <div class="team-card fade-up">
            <div class="team-avatar">{{ m.initials }}</div>
            <h4>{{ m.name }}</h4>
            <span>{{ m.role }}</span>
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
      font-weight: 700; color: #fff;
      margin-bottom: 0.75rem; line-height: 1.15;
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
    .grid-3 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem; max-width: 1100px; margin: 0 auto;
    }

    .page-hero {
      padding: 10rem 2rem 5rem; text-align: center;
      position: relative; overflow: hidden; background: #08080f;
    }
    .page-hero-bg { position: absolute; inset: 0; z-index: 0; }
    .page-hero .glow {
      position: absolute; border-radius: 50%; pointer-events: none;
      filter: blur(80px);
    }
    .page-hero .glow-1 { width: 500px; height: 500px; background: rgba(0,200,150,0.05); top: -20%; right: -10%; }
    .page-hero .glow-2 { width: 400px; height: 400px; background: rgba(0,163,212,0.03); bottom: -20%; left: -10%; }
    .page-hero-content { position: relative; z-index: 1; max-width: 700px; margin: 0 auto; }
    .page-hero h1 {
      font-size: clamp(2.5rem, 6vw, 4rem);
      font-weight: 800; letter-spacing: -0.03em; margin-bottom: 1rem;
    }
    .page-hero p { font-size: 1.1rem; color: rgba(255,255,255,0.4); }

    .split-row {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 4rem; max-width: 1200px; margin: 0 auto; align-items: center;
    }
    .split-text p { color: rgba(255,255,255,0.5); line-height: 1.8; font-size: 0.95rem; }
    .visual-block {
      aspect-ratio: 4/3;
      background: linear-gradient(135deg, rgba(0,200,150,0.04), rgba(0,163,212,0.02));
      border: 1px solid rgba(255,255,255,0.04);
      border-radius: 20px;
      display: flex; align-items: center; justify-content: center;
      font-size: 3rem; color: rgba(0,200,150,0.15);
    }

    .card {
      background: rgba(255,255,255,0.012);
      border: 1px solid rgba(255,255,255,0.04);
      border-radius: 18px; padding: 2.5rem 2rem;
      cursor: default; backdrop-filter: blur(10px);
      transition: border-color 0.3s;
    }
    .card-hover:hover { border-color: rgba(0,200,150,0.12); }
    .card-icon {
      width: 50px; height: 50px; border-radius: 14px;
      background: linear-gradient(135deg, rgba(0,200,150,0.08), rgba(0,163,212,0.04));
      border: 1px solid rgba(0,200,150,0.06);
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 1.25rem; font-size: 1.15rem; color: #00c896;
    }
    .card h3 { font-size: 1.1rem; font-weight: 600; color: #fff; margin-bottom: 0.6rem; }
    .card p { font-size: 0.85rem; color: rgba(255,255,255,0.4); line-height: 1.65; }

    .team-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem; max-width: 900px; margin: 0 auto;
    }
    .team-card { text-align: center; padding: 2rem 1rem; }
    .team-avatar {
      width: 70px; height: 70px; border-radius: 50%;
      background: linear-gradient(135deg, rgba(0,200,150,0.06), rgba(0,163,212,0.03));
      border: 1px solid rgba(0,200,150,0.06);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 1rem;
      font-size: 1.1rem; font-weight: 700; color: #00c896;
    }
    .team-card h4 { font-size: 1rem; font-weight: 600; color: #fff; margin-bottom: 0.25rem; }
    .team-card span { font-size: 0.8rem; color: rgba(255,255,255,0.35); }

    .section-cta {
      background: linear-gradient(135deg, #08080f, #0c0c18, #101020);
      text-align: center; position: relative; overflow: hidden;
    }
    .cta-inner { max-width: 620px; margin: 0 auto; }
    .cta-inner h2 {
      font-size: clamp(1.8rem, 3.5vw, 2.7rem);
      font-weight: 700; margin-bottom: 1rem;
    }
    .cta-inner p { font-size: 1rem; color: rgba(255,255,255,0.4); margin-bottom: 2.5rem; }

    @media (max-width: 768px) {
      .section { padding: 5rem 1.5rem; }
      .split-row { grid-template-columns: 1fr; gap: 2rem; }
    }
  `]
})
export class AboutComponent implements OnInit, AfterViewInit, OnDestroy {
  private pageDataService = inject(PageDataService);
  private webGsapService = inject(WebGsapService);

  tag = 'About Us';
  title = 'Who We Are';
  subtitle = 'A digital technology company powering transformation for enterprises worldwide.';

  storyTag = 'Our Story';
  storyTitle = 'Driven by Purpose';
  storyContent = 'Founded with a vision to bridge the gap between business and technology, we have grown into a trusted partner for global enterprises. Our team of experts combines deep domain knowledge with cutting-edge technical skills to deliver solutions that make a real impact.';

  valuesTag = 'Principles';
  valuesTitle = 'What Guides Us';
  valuesDesc = 'Our core values shape every decision we make and every solution we deliver.';
  values: ValueItem[] = [
    { title: 'Innovation First', description: 'We challenge conventions and push boundaries to deliver breakthrough solutions.', icon: 'fas fa-lightbulb' },
    { title: 'Client Partnership', description: 'We build lasting relationships through transparency, trust, and shared success.', icon: 'fas fa-handshake' },
    { title: 'Technical Excellence', description: 'We maintain the highest standards of quality, security, and performance.', icon: 'fas fa-shield' },
  ];

  teamTag = 'Leadership';
  teamTitle = 'Meet Our Team';
  teamDesc = 'Experienced leaders driving digital transformation across industries.';
  team: TeamMember[] = [
    { name: 'Arjun Mehta', role: 'CEO & Founder', initials: 'AM' },
    { name: 'Priya Sharma', role: 'Chief Technology Officer', initials: 'PS' },
    { name: 'Vikram Singh', role: 'VP of Engineering', initials: 'VS' },
    { name: 'Neha Patel', role: 'Head of Design', initials: 'NP' },
  ];

  ctaTitle = 'Want to Know More?';
  ctaDesc = "Let's discuss how we can partner to achieve your goals.";
  ctaBtn = 'Get in Touch';
  private ctx: any;

  ngOnInit() {
    this.pageDataService.getAboutContent().subscribe(data => {
      if (data) {
        const story = data.sections.find(s => s.sectionKey === 'story');
        if (story) this.storyContent = story.content;
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
      this.webGsapService.applyAnimations('about', document.querySelector('.page-hero') as HTMLElement);
    }, 100);
  }

  ngOnDestroy() {
    ScrollTrigger.getAll().forEach(t => t.kill());
    gsap.killTweensOf('*');
  }
}
