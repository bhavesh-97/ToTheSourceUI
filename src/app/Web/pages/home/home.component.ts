import { Component, inject, OnInit, AfterViewInit, ElementRef, ViewChild, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageDataService} from '../../services/page-data.service';
import { WebGsapService } from '../../services/web-gsap.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="hero-section" #heroSection>
      <div class="hero-bg"></div>
      <div class="hero-content">
        <h1 class="hero-title">{{ heroTitle }}</h1>
        <p class="hero-subtitle">{{ heroSubtitle }}</p>
        <div class="hero-cta">
          <a routerLink="/Web/services" class="cta-button primary">Our Services</a>
          <a routerLink="/Web/contact" class="cta-button secondary">Contact Us</a>
        </div>
      </div>
    </section>

    <section class="features-section" #featuresSection>
      <div class="container">
        <h2 class="section-title">Why Choose Us</h2>
        <div class="features-grid">
          @for (feature of features; track feature.title) {
            <div class="feature-card">
              <div class="feature-icon">{{ feature.icon }}</div>
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <section class="cta-section" #ctaSection>
      <div class="container">
        <h2>Ready to Get Started?</h2>
        <p>Let's build something amazing together.</p>
        <a routerLink="/Web/contact" class="cta-button">Contact Today</a>
      </div>
    </section>
  `,
  styles: [`
    .hero-section {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }
    .hero-bg {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      z-index: 0;
    }
    .hero-content {
      position: relative;
      z-index: 1;
      text-align: center;
      padding: 2rem;
      max-width: 900px;
    }
    .hero-title {
      font-size: clamp(2.5rem, 8vw, 5rem);
      font-weight: 700;
      margin-bottom: 1rem;
    }
    .hero-subtitle {
      font-size: clamp(1rem, 2.5vw, 1.5rem);
      margin-bottom: 2rem;
      color: rgba(255,255,255,0.8);
    }
    .hero-cta {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
    .cta-button {
      padding: 1rem 2rem;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .cta-button.primary {
      background: #e94560;
      color: white;
    }
    .cta-button.secondary {
      background: transparent;
      border: 2px solid white;
      color: white;
    }
    .cta-button:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }

    .features-section {
      padding: 6rem 2rem;
      background: #0f0f1a;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .section-title {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 3rem;
    }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
    }
    .feature-card {
      background: rgba(255,255,255,0.05);
      padding: 2rem;
      border-radius: 16px;
      text-align: center;
    }
    .feature-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    .feature-card h3 {
      margin-bottom: 1rem;
    }
    .feature-card p {
      color: rgba(255,255,255,0.7);
    }

    .cta-section {
      padding: 6rem 2rem;
      text-align: center;
      background: linear-gradient(135deg, #e94560 0%, #0f3460 100%);
    }
    .cta-section h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    .cta-section p {
      margin-bottom: 2rem;
      font-size: 1.2rem;
    }
    .cta-section .cta-button {
      display: inline-block;
      background: white;
      color: #e94560;
    }
  `]
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('heroSection') heroSection!: ElementRef;
  @ViewChild('featuresSection') featuresSection!: ElementRef;
  @ViewChild('ctaSection') ctaSection!: ElementRef;

  private pageDataService = inject(PageDataService);
  private webGsapService = inject(WebGsapService);

  heroTitle = 'To The Source';
  heroSubtitle = 'We build exceptional digital experiences that drive results';

  features = [
    { icon: '🚀', title: 'Innovation', description: 'Cutting-edge solutions for modern challenges' },
    { icon: '💎', title: 'Quality', description: 'Premium results with attention to detail' },
    { icon: '🤝', title: 'Partnership', description: 'Long-term relationships built on trust' }
  ];

  ngOnInit() {
    this.pageDataService.getPageContent('home').subscribe(data => {
      if (data) {
        const hero = data.sections.find(s => s.sectionKey === 'hero');
        if (hero) {
          this.heroTitle = hero.title || this.heroTitle;
          this.heroSubtitle = hero.content || this.heroSubtitle;
        }
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.heroSection?.nativeElement) {
        this.webGsapService.applyAnimations('webhome', this.heroSection.nativeElement);
      }
      if (this.featuresSection?.nativeElement) {
        this.webGsapService.applyAnimations('webhome', this.featuresSection.nativeElement);
      }
    }, 100);
  }

  ngOnDestroy() {
    this.webGsapService.killAll();
  }
}