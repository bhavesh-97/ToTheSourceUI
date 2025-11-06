import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, QueryList, ViewChildren } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LoginService } from '../../../authentication/login/login.service';
import { DashboardService } from './dashboard.service';
import { JsonResponseModel } from '../../../models/JsonResponseModel';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, CardModule, ButtonModule, ChartModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
@ViewChildren('progress') progressBars!: QueryList<ElementRef>;

  private dashboardService = inject(DashboardService);
  private loginService = inject(LoginService);

  metrics: Metric[] = [];
  lineData: ChartData | null = null;
  pieData: ChartData | null = null;

  chartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' as const } }
  };

  constructor() {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  logout() {
    this.loginService.logout();
  }

  loadDashboardData(): void {
    // 1️⃣ Metrics
    this.dashboardService.GetDashboardMetrics().subscribe({
      next: (res: JsonResponseModel) => {
        if (!res.isError) {
          this.metrics = res.result;
        }
      },
      error: err => console.error('Error loading metrics', err)
    });

    // 2️⃣ Line Chart
    this.dashboardService.GetLineChartData().subscribe({
      next: (res: JsonResponseModel) => {
        if (!res.isError) {
          this.lineData = res.result;
        }
      },
      error: err => console.error('Error loading line data', err)
    });

    // 3️⃣ Pie Chart
    this.dashboardService.GetPieChartData().subscribe({
      next: (res: JsonResponseModel) => {
        if (!res.isError) {
          this.pieData = res.result;
        }
      },
      error: err => console.error('Error loading pie data', err)
    });
  }

  ngAfterViewInit(): void {
    const cards = document.querySelectorAll('.metric-card');

    // 1️⃣ Card entrance animation
    gsap.fromTo(cards,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: .7, stagger: .12, ease: 'back.out(1.4)' }
    );

    // 2️⃣ Animated progress bars
    this.progressBars.forEach((el, i) => {
      const change = this.metrics[i]?.change ?? 0;
      const width = Math.min(Math.abs(change) * 5, 100); // cap at 100%
      gsap.to(el.nativeElement, {
        width: `${width}%`,
        duration: 1.2,
        delay: .4 + i * .1,
        ease: 'elastic.out'
      });
    });

    // 3️⃣ Chart draw-in animation on scroll
    ScrollTrigger.create({
      trigger: '.charts-grid',
      start: 'top 80%',
      onEnter: () => {
        document.querySelectorAll('.chart-wrapper canvas').forEach((canvas, i) => {
          gsap.fromTo(canvas, { opacity: 0, scale: 0.95 }, {
            opacity: 1,
            scale: 1,
            duration: 1,
            delay: i * .2,
            ease: 'power3.out'
          });
        });
      }
    });
  }
}
export interface Metric {
  title: string;
  value: number;
  change: number;
  icon: string;
  color: string;
}

export interface ChartDataset {
  label?: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
  backgroundColors?: string[];
  tension?: number;
  fill?: boolean;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}