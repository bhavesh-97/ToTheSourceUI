import { Component, inject, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageDataService } from '../../services/page-data.service';
import { WebGsapService } from '../../services/web-gsap.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="services-hero">
      <div class="container">
        <h1>Our Services</h1>
        <p>Comprehensive solutions for your digital needs</p>
      </div>
    </section>

    <section class="services-list">
      <div class="container">
        @for (service of services; track service.title; let i = $index) {
          <div class="service-row" [class.reverse]="i % 2 === 1">
            <div class="service-content">
              <h2>{{ service.title }}</h2>
              <p>{{ service.description }}</p>
              <ul>
                @for (item of service.features; track item) {
                  <li>{{ item }}</li>
                }
              </ul>
              <a routerLink="/Web/contact" class="service-btn">Get Started</a>
            </div>
            <div class="service-visual">
              <div class="visual-placeholder">{{ service.icon }}</div>
            </div>
          </div>
        }
      </div>
    </section>

    <section class="process-section">
      <div class="container">
        <h2>Our Process</h2>
        <div class="process-steps">
          @for (step of processSteps; track step.title; let i = $index) {
            <div class="process-step">
              <div class="step-number">{{ i + 1 }}</div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.description }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .services-hero { padding: 8rem 2rem 4rem; text-align: center; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); }
    .services-hero h1 { font-size: clamp(2.5rem, 6vw, 4rem); margin-bottom: 1rem; }
    .services-hero p { font-size: 1.25rem; color: rgba(255,255,255,0.7); }
    .services-list { padding: 6rem 2rem; background: #0f0f1a; }
    .container { max-width: 1200px; margin: 0 auto; }
    .service-row { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; padding: 4rem 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .service-row.reverse { direction: rtl; }
    .service-row.reverse > * { direction: ltr; }
    .service-content h2 { font-size: 2rem; margin-bottom: 1rem; color: #e94560; }
    .service-content p { color: rgba(255,255,255,0.8); line-height: 1.8; margin-bottom: 1.5rem; }
    .service-content ul { list-style: none; padding: 0; margin-bottom: 2rem; }
    .service-content li { padding: 0.5rem 0; color: rgba(255,255,255,0.7); }
    .service-content li::before { content: '✓'; color: #e94560; margin-right: 0.5rem; }
    .service-btn { display: inline-block; padding: 1rem 2rem; background: #e94560; color: white; text-decoration: none; border-radius: 50px; font-weight: 600; transition: transform 0.3s, box-shadow 0.3s; }
    .service-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(233,69,96,0.3); }
    .service-visual { display: flex; justify-content: center; align-items: center; }
    .visual-placeholder { width: 100%; aspect-ratio: 1; background: linear-gradient(135deg, rgba(233,69,96,0.2) 0%, rgba(15,52,96,0.2) 100%); border-radius: 16px; display: flex; justify-content: center; align-items: center; font-size: 4rem; }
    .process-section { padding: 6rem 2rem; background: #0a0a14; }
    .process-section h2 { text-align: center; margin-bottom: 3rem; font-size: 2.5rem; }
    .process-steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; }
    .process-step { background: rgba(255,255,255,0.05); padding: 2rem; border-radius: 16px; text-align: center; }
    .step-number { width: 50px; height: 50px; background: #e94560; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 1.5rem; font-weight: 700; margin: 0 auto 1rem; }
    .process-step h3 { margin-bottom: 0.5rem; }
    .process-step p { color: rgba(255,255,255,0.7); }
    @media (max-width: 768px) { .service-row { grid-template-columns: 1fr; } .service-row.reverse { direction: ltr; } }
  `]
})
export class ServicesComponent implements OnInit, AfterViewInit, OnDestroy {
  private pageDataService = inject(PageDataService);
  private webGsapService = inject(WebGsapService);

  services = [
    { title: 'Web Development', description: 'Custom web applications built with cutting-edge technologies', icon: '💻', features: ['Responsive Design', 'Fast Performance', 'SEO Optimized', 'CMS Integration'] },
    { title: 'Mobile Apps', description: 'Native and cross-platform mobile applications', icon: '📱', features: ['iOS & Android', 'Offline Support', 'Push Notifications', 'Analytics'] },
    { title: 'UI/UX Design', description: 'User-centered design that converts visitors to customers', icon: '🎨', features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'] },
    { title: 'Digital Marketing', description: 'Strategic marketing to grow your online presence', icon: '📈', features: ['SEO', 'Social Media', 'Content Strategy', 'PPC Campaigns'] }
  ];
  processSteps = [
    { title: 'Discovery', description: 'We learn about your business and goals' },
    { title: 'Strategy', description: 'We create a roadmap for success' },
    { title: 'Development', description: 'We build your solution' },
    { title: 'Launch', description: 'We deploy and monitor performance' }
  ];

  ngOnInit() {
    this.pageDataService.getServicesContent().subscribe(data => {
      if (data) console.log('Services data:', data);
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.webGsapService.applyAnimations('services', document.querySelector('.services-hero') as HTMLElement), 100);
  }

  ngOnDestroy() {
    this.webGsapService.killAll();
  }
}