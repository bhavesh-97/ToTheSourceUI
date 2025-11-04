import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, CardModule, ButtonModule, ChartModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
@ViewChildren('progress') progressBars!: QueryList<ElementRef>;

  metrics: Metric[] = [
    { title: 'Total Revenue', value: 125000, change: 12.5, icon: 'pi-dollar', color: '#10b981' },
    { title: 'Active Users', value: 4500, change: -3.2, icon: 'pi-users', color: '#3b82f6' },
    { title: 'Orders Today', value: 320, change: 8.1, icon: 'pi-shopping-cart', color: '#f59e0b' },
    { title: 'Conversion Rate', value: 3.4, change: 1.2, icon: 'pi-percentage', color: '#8b5cf6' }
  ];

  lineData: any = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Revenue',
      data: [65, 72, 68, 95, 125, 140],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16,185,129,0.1)',
      tension: .4,
      fill: true
    }]
  };

  pieData: any = {
    labels: ['Electronics', 'Fashion', 'Books', 'Others'],
    datasets: [{
      data: [300, 150, 100, 50],
      backgroundColor: ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981']
    }]
  };

  chartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' as const } }
  };

  ngAfterViewInit() {
    const cards = document.querySelectorAll('.metric-card');

    // 1. Card entrance
    gsap.fromTo(cards,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: .7, stagger: .12, ease: 'back.out(1.4)' }
    );

    // 2. Progress bars
    this.progressBars.forEach((el, i) => {
      const change = this.metrics[i].change;
      const width = Math.min(Math.abs(change) * 5, 100); // safe now
      gsap.to(el.nativeElement, {
        width: `${width}%`,
        duration: 1.2,
        delay: .4 + i * .1,
        ease: 'elastic.out'
      });
    });

    // 3. Chart draw-in on scroll
    ScrollTrigger.create({
      trigger: '.charts-grid',
      start: 'top 80%',
      onEnter: () => {
        document.querySelectorAll('.chart-wrapper canvas').forEach((c, i) => {
          gsap.fromTo(c, { drawSVG: '0%' }, {
            drawSVG: '100%',
            duration: 2,
            delay: i * .3,
            ease: 'power3.out'
          });
        });
      }
    });
  }
}
interface Metric {
  title: string;
  value: number;
  change: number;        // % change
  icon: string;
  color: string;          // Tailwind-like or hex
  trend?: 'up' | 'down';  // For arrow
}