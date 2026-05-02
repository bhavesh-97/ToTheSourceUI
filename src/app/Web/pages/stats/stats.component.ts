import { Component, inject, OnInit, AfterViewInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageDataService } from '../../services/page-data.service';
import { WebGsapService } from '../../services/web-gsap.service';

interface StatItem {
  label: string;
  value: string;
  icon: string;
  change: string;
  trend: 'up' | 'down';
}

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="stats-hero">
      <div class="container">
        <h1>Our Statistics</h1>
        <p>Numbers that define our success</p>
      </div>
    </section>

    <section class="stats-content">
      <div class="container">
        <div class="stats-grid">
          @for (stat of stats; track stat.label) {
            <div class="stat-card">
              <div class="stat-icon">{{ stat.icon }}</div>
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
              <div class="stat-change" [class.positive]="stat.trend === 'up'" [class.negative]="stat.trend === 'down'">
                {{ stat.change }}
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <section class="stats-details">
      <div class="container">
        <h2>Detailed Breakdown</h2>
        <div class="details-grid">
          <div class="detail-card">
            <h3>Projects Completed</h3>
            <p>50+ projects delivered successfully to clients worldwide</p>
          </div>
          <div class="detail-card">
            <h3>Client Satisfaction</h3>
            <p>98% of clients recommend our services</p>
          </div>
          <div class="detail-card">
            <h3>Years of Experience</h3>
            <p>5+ years in the digital industry</p>
          </div>
          <div class="detail-card">
            <h3>Team Members</h3>
            <p>Expert team of 10+ professionals</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .stats-hero { padding: 8rem 2rem 4rem; text-align: center; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); }
    .stats-hero h1 { font-size: clamp(2.5rem, 6vw, 4rem); margin-bottom: 1rem; }
    .stats-hero p { font-size: 1.25rem; color: rgba(255,255,255,0.7); }
    .stats-content { padding: 6rem 2rem; background: #0f0f1a; }
    .container { max-width: 1200px; margin: 0 auto; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; }
    .stat-card { background: rgba(255,255,255,0.05); padding: 2rem; border-radius: 16px; text-align: center; transition: transform 0.3s; }
    .stat-card:hover { transform: translateY(-5px); }
    .stat-icon { font-size: 3rem; margin-bottom: 1rem; }
    .stat-value { font-size: 3rem; font-weight: 700; color: #e94560; }
    .stat-label { font-size: 1.1rem; margin-bottom: 0.5rem; }
    .stat-change { font-size: 0.875rem; }
    .stat-change.positive { color: #4caf50; }
    .stat-change.negative { color: #f44336; }
    .stats-details { padding: 6rem 2rem; background: #0a0a14; }
    .stats-details h2 { text-align: center; margin-bottom: 3rem; font-size: 2.5rem; }
    .details-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; }
    .detail-card { background: rgba(255,255,255,0.05); padding: 2rem; border-radius: 16px; }
    .detail-card h3 { color: #e94560; margin-bottom: 0.5rem; }
    .detail-card p { color: rgba(255,255,255,0.7); }
  `]
})
export class StatsComponent implements OnInit, AfterViewInit, OnDestroy {
  private pageDataService = inject(PageDataService);
  private webGsapService = inject(WebGsapService);
  private statsData = signal<any>(null);

  stats: StatItem[] = [
    { label: 'Projects Completed', value: '50+', icon: '🎯', change: '+25%', trend: 'up' },
    { label: 'Happy Clients', value: '120+', icon: '😊', change: '+18%', trend: 'up' },
    { label: 'Years Experience', value: '5+', icon: '📅', change: '+1 year', trend: 'up' },
    { label: 'Team Members', value: '10+', icon: '👥', change: '+5', trend: 'up' }
  ];

  ngOnInit() {
    this.loadStats();
  }

  ngAfterViewInit() {
    setTimeout(() => this.webGsapService.applyAnimations('webstats', document.querySelector('.stats-hero') as HTMLElement), 100);
  }

  ngOnDestroy() {
    this.webGsapService.killAll();
  }

  private loadStats() {
    this.pageDataService.getPageContent('stats').subscribe(data => {
      if (data) {
        this.statsData.set(data);
      }
    });
  }
}