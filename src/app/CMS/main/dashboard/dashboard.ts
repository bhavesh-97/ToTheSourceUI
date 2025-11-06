import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, QueryList, ViewChildren } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { ProgressBarModule } from 'primeng/progressbar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { gsap } from 'gsap';
import { DashboardService } from './dashboard.service';
import { forkJoin } from 'rxjs';
import Chart from 'chart.js/auto';
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, CardModule, ButtonModule, ChartModule,AvatarModule,ProgressBarModule,BadgeModule,TagModule,TableModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements AfterViewInit {
  private dashboardService = inject(DashboardService);

  @ViewChildren('counter') counters!: QueryList<ElementRef>;
  @ViewChildren('sparkline') sparklineCanvases!: QueryList<ElementRef>;
  @ViewChildren('cardEl') cardEls!: QueryList<ElementRef>;

  summaryCards: any[] = [];
  recentPosts: any[] = [];
  trafficData: any = {};
  notifications: any[] = [];
  activities: any[] = [];
  quickActions: any[] = [];
  userName = 'Admin';
  currentTime = new Date();

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' as const } }
  };

  ngOnInit() {
    this.loadAllData();
    setInterval(() => this.currentTime = new Date(), 1000);

    this.quickActions = [
      { label: 'Create New Post', icon: 'pi pi-plus', action: () => this.createNewPost() },
      { label: 'Upload Media', icon: 'pi pi-upload', action: () => {} },
      { label: 'Manage Categories', icon: 'pi pi-tags', action: () => {} },
      { label: 'View Analytics', icon: 'pi pi-chart-line', action: () => {} }
    ];
  }

  ngAfterViewInit() {
    setTimeout(() => this.initGSAP(), 300);
  }

  loadAllData() {
    forkJoin({
      summary: this.dashboardService.GetSummary(true),
      posts: this.dashboardService.GetRecentPosts(),
      traffic: this.dashboardService.GetTrafficData(),
      notifications: this.dashboardService.GetNotifications(),
      activities: this.dashboardService.GetActivities(),
      pie: this.dashboardService.GetPieChartData()
    }).subscribe(res => {
      this.summaryCards = res.summary.result.cards;
      this.recentPosts = res.posts.result;
      this.trafficData = res.traffic.result;
      this.notifications = res.notifications.result;
      this.activities = res.activities.result;

      setTimeout(() => this.animateCountersAndSparklines(), 600);
    });
  }

  initGSAP() {
    gsap.from('.glass-header', { y: -50, opacity: 0, duration: 1, ease: 'back.out' });
    gsap.from('.summary-card', {
      y: 100, opacity: 0, duration: 1, stagger: 0.15, ease: 'elastic.out(1,0.5)',
      scrollTrigger: { trigger: '.summary-card', start: 'top 85%' }
    });
  }

 animateCountersAndSparklines() {
    this.counters.forEach((el: ElementRef<HTMLHeadingElement>, i: number) => {
      const target = this.summaryCards[i]?.value || 0;
      gsap.to(el.nativeElement, {
        innerText: target,
        duration: 3,
        ease: 'power3.out',
        snap: { innerText: 1 },
        onUpdate: () => {
          el.nativeElement.textContent = Math.ceil(Number(el.nativeElement.innerText)).toLocaleString();
        }
      });
    });

    this.sparklineCanvases.forEach((canvasRef: ElementRef<HTMLCanvasElement>, i: number) => {
      const ctx = canvasRef.nativeElement.getContext('2d');
      if (!ctx) return;

      const data = this.summaryCards[i]?.sparkline || [15, 35, 25, 75, 55, 95, 80];

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: Array(7).fill(''),
          datasets: [{
            data,
            borderColor: '#a78bfa',
            backgroundColor: 'rgba(167, 139, 250, 0.2)',
            tension: 0.5,
            fill: true,
            pointRadius: 0,
            borderWidth: 3
          }]
        },
        options: {
          animation: { duration: 2000, easing: 'easeOutQuart' },
          plugins: { legend: { display: false } },
          scales: { x: { display: false }, y: { display: false } }
        }
      });
    });
  }

  createNewPost() {
    gsap.to(window, { duration: 0.8, scrollTo: 0 });
    // Navigate to create post
  }

  // logout() {
  //   // logout
  // }
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