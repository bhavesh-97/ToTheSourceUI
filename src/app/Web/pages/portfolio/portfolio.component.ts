import { Component, inject, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageDataService } from '../../services/page-data.service';
import { WebGsapService } from '../../services/web-gsap.service';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  client: string;
  year: string;
}

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="portfolio-hero">
      <div class="container">
        <h1>Our Work</h1>
        <p>Showcasing our creative solutions</p>
      </div>
    </section>

    <section class="portfolio-content">
      <div class="container">
        <div class="portfolio-filters">
          <button class="filter-btn active">All</button>
          <button class="filter-btn">Web</button>
          <button class="filter-btn">Mobile</button>
          <button class="filter-btn">Branding</button>
        </div>

        <div class="portfolio-grid">
          @for (item of items; track item.id) {
            <div class="portfolio-item">
              <div class="portfolio-image">
                <div class="portfolio-overlay">
                  <span>View Project</span>
                </div>
              </div>
              <div class="portfolio-info">
                <span class="portfolio-category">{{ item.category }}</span>
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container">
        <h2>Have a Project in Mind?</h2>
        <p>Let's create something amazing together.</p>
        <a routerLink="/Web/contact" class="cta-button">Start a Project</a>
      </div>
    </section>
  `,
  styles: [`
    .portfolio-hero { padding: 8rem 2rem 4rem; text-align: center; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); }
    .portfolio-hero h1 { font-size: clamp(2.5rem, 6vw, 4rem); margin-bottom: 1rem; }
    .portfolio-hero p { font-size: 1.25rem; color: rgba(255,255,255,0.7); }
    .portfolio-content { padding: 6rem 2rem; background: #0f0f1a; }
    .container { max-width: 1200px; margin: 0 auto; }
    .portfolio-filters { display: flex; gap: 1rem; justify-content: center; margin-bottom: 3rem; flex-wrap: wrap; }
    .filter-btn { padding: 0.75rem 1.5rem; background: transparent; border: 1px solid rgba(255,255,255,0.3); border-radius: 50px; color: white; cursor: pointer; transition: all 0.3s; }
    .filter-btn.active, .filter-btn:hover { background: #e94560; border-color: #e94560; }
    .portfolio-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 2rem; }
    .portfolio-item { background: rgba(255,255,255,0.05); border-radius: 16px; overflow: hidden; transition: transform 0.3s; }
    .portfolio-item:hover { transform: translateY(-5px); }
    .portfolio-image { aspect-ratio: 4/3; background: linear-gradient(135deg, #333 0%, #555 100%); position: relative; }
    .portfolio-overlay { position: absolute; inset: 0; background: rgba(233,69,96,0.9); display: flex; justify-content: center; align-items: center; opacity: 0; transition: opacity 0.3s; }
    .portfolio-item:hover .portfolio-overlay { opacity: 1; }
    .portfolio-overlay span { padding: 1rem 2rem; border: 2px solid white; border-radius: 50px; color: white; font-weight: 600; }
    .portfolio-info { padding: 1.5rem; }
    .portfolio-category { color: #e94560; font-size: 0.875rem; font-weight: 600; text-transform: uppercase; }
    .portfolio-item h3 { margin: 0.5rem 0 0.5rem; }
    .portfolio-item p { color: rgba(255,255,255,0.7); font-size: 0.875rem; }
    .cta-section { padding: 6rem 2rem; text-align: center; background: linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%); }
    .cta-section h2 { font-size: 2.5rem; margin-bottom: 1rem; }
    .cta-section p { margin-bottom: 2rem; font-size: 1.2rem; }
    .cta-button { display: inline-block; padding: 1rem 2rem; background: #e94560; color: white; text-decoration: none; border-radius: 50px; font-weight: 600; transition: transform 0.3s; }
    .cta-button:hover { transform: translateY(-3px); }
  `]
})
export class PortfolioComponent implements OnInit, AfterViewInit, OnDestroy {
  private pageDataService = inject(PageDataService);
  private webGsapService = inject(WebGsapService);

  items: PortfolioItem[] = [
    {
      id: '1', title: 'E-Commerce Platform', category: 'Web', description: 'Full-featured online store', client: 'RetailCo', year: '2025',
      image: ''
    },
    {
      id: '2', title: 'Fitness App', category: 'Mobile', description: 'Health tracking application', client: 'FitLife', year: '2025',
      image: ''
    },
    {
      id: '3', title: 'Brand Identity', category: 'Branding', description: 'Complete brand redesign', client: 'TechCorp', year: '2025',
      image: ''
    },
    {
      id: '4', title: 'SaaS Dashboard', category: 'Web', description: 'Analytics platform', client: 'DataFlow', year: '2024',
      image: ''
    },
    {
      id: '5', title: 'Food Delivery App', category: 'Mobile', description: 'On-demand delivery', client: 'QuickEat', year: '2024',
      image: ''
    },
    {
      id: '6', title: 'Corporate Website', category: 'Web', description: 'Business presence', client: 'FinanceHub', year: '2024',
      image: ''
    }
  ];

  ngOnInit() {
    this.pageDataService.getPageContent('portfolio').subscribe(data => {
      if (data) console.log('Portfolio data:', data);
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.webGsapService.applyAnimations('webportfolio', document.querySelector('.portfolio-hero') as HTMLElement), 100);
  }

  ngOnDestroy() {
    this.webGsapService.killAll();
  }
}