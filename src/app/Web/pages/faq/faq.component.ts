import { Component, inject, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageDataService, PageContent } from '../../services/page-data.service';
import { WebGsapService } from '../../services/web-gsap.service';
import { AnimatedBgComponent } from '../../components/animated-bg/animated-bg.component';

interface FAQ { question: string; answer: string; open: boolean; }

@Component({
  selector: 'app-faq',
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
      <div class="faq-container fade-up">
        @for (item of faqs; track item.question; let i = $index) {
          <div class="faq-item" [class.faq-item--open]="item.open" (click)="toggleFAQ(i)">
            <div class="faq-q">
              <span>{{ item.question }}</span>
              <i class="fas" [class.fa-chevron-up]="item.open" [class.fa-chevron-down]="!item.open"></i>
            </div>
            @if (item.open) {
              <div class="faq-a">
                <p>{{ item.answer }}</p>
              </div>
            }
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
    .section-tag {
      display: inline-flex; align-items: center; gap: 0.4rem;
      font-size: 0.7rem; font-weight: 700; letter-spacing: 0.15em;
      text-transform: uppercase; color: #00c896;
      padding: 0.35rem 1rem;
      border: 1px solid rgba(0,200,150,0.1);
      border-radius: 100px; margin-bottom: 1rem;
      background: rgba(0,200,150,0.02);
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

    .faq-container { max-width: 750px; margin: 0 auto; display: flex; flex-direction: column; gap: 0.75rem; }
    .faq-item {
      background: rgba(255,255,255,0.012);
      border: 1px solid rgba(255,255,255,0.04);
      border-radius: 14px; overflow: hidden; cursor: pointer;
      transition: border-color 0.3s;
    }
    .faq-item:hover { border-color: rgba(255,255,255,0.08); }
    .faq-item--open { border-color: rgba(0,200,150,0.08); }
    .faq-q {
      display: flex; justify-content: space-between; align-items: center;
      padding: 1.25rem 1.5rem;
      font-size: 0.95rem; font-weight: 500; color: #fff;
    }
    .faq-q i { font-size: 0.7rem; color: rgba(255,255,255,0.2); transition: color 0.3s; }
    .faq-item--open .faq-q i { color: #00c896; }
    .faq-a { padding: 0 1.5rem 1.25rem; }
    .faq-a p { color: rgba(255,255,255,0.45); line-height: 1.7; font-size: 0.88rem; }

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
export class FaqComponent implements OnInit, AfterViewInit, OnDestroy {
  private pageDataService = inject(PageDataService);
  private webGsapService = inject(WebGsapService);

  tag = 'Help Center';
  title = 'Frequently Asked Questions';
  subtitle = 'Find answers to common questions about our services and process.';

  faqs: FAQ[] = [
    { question: 'What services does To The Source offer?', answer: 'We offer end-to-end digital transformation services including Generative AI, Cloud & DevOps, Data Engineering, Digital Engineering, Digital Experience (UX/UI), and Quality Engineering.', open: false },
    { question: 'How do you approach a new project?', answer: 'We start with a discovery phase to understand your business, goals, and challenges. Then we create a detailed roadmap, followed by agile development with regular check-ins and iterations.', open: false },
    { question: 'What is your typical engagement model?', answer: 'We offer flexible engagement models including dedicated teams, fixed-price projects, and time & material. The right model depends on your project scope and requirements.', open: false },
    { question: 'Do you sign NDAs?', answer: 'Yes, we absolutely sign non-disclosure agreements to protect your proprietary information and intellectual property. Your confidentiality is our priority.', open: false },
    { question: 'What technologies do you specialize in?', answer: 'We work with modern tech stacks including AWS, Azure, GCP, React, Angular, Node.js, Python, and AI/ML frameworks. We choose the best technology for each specific use case.', open: false },
    { question: 'How do you ensure project quality?', answer: 'Quality is built into our process. We follow code reviews, automated testing, CI/CD pipelines, and dedicated QA engineering to ensure every deliverable meets the highest standards.', open: false },
    { question: 'Can you scale the team up or down?', answer: 'Absolutely. Our engagement model allows for flexible team scaling based on project needs. We can quickly ramp up or down as your requirements evolve.', open: false },
    { question: 'How do you handle communication?', answer: 'We assign a dedicated project manager and use tools like Slack, Jira, and weekly status calls to ensure transparent and timely communication throughout the engagement.', open: false },
  ];

  ctaTitle = 'Still Have Questions?';
  ctaDesc = 'We are here to help. Reach out to us for any inquiries.';
  ctaBtn = 'Contact Us';

  ngOnInit() {
    this.pageDataService.getPageContent('faq').subscribe(data => {
      if (data) console.log('FAQ data:', data);
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
      this.webGsapService.applyAnimations('webfaq', document.querySelector('.page-hero') as HTMLElement);
    }, 100);
  }

  ngOnDestroy() {
    ScrollTrigger.getAll().forEach(t => t.kill());
    gsap.killTweensOf('*');
  }

  toggleFAQ(index: number) {
    this.faqs = this.faqs.map((faq, i) => ({
      ...faq,
      open: i === index ? !faq.open : false
    }));
  }
}
