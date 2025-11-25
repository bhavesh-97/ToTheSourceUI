// src/app/CMS/main/main.component.ts
import { Component, ViewChild, AfterViewInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { gsap } from 'gsap';
import { HeaderComponent } from '../../@theme/components/header/header.component';
import { SidebarComponent } from '../../@theme/components/sidebar/sidebar';
import { FooterComponent } from '../../@theme/components';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class MainComponent{
 isDark = signal(false);

  ngAfterViewInit() {
    // Load Particles.js
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js';
    script.onload = () => {
      (window as any).particlesJS('particles-js', {
        particles: {
          number: { value: 60 },
          color: { value: '#a78bfa' },
          shape: { type: 'circle' },
          opacity: { value: 0.4, random: true },
          size: { value: 3, random: true },
          line_linked: { enable: true, distance: 150, color: '#a78bfa', opacity: 0.2, width: 1 },
          move: { enable: true, speed: 1.5 }
        },
        interactivity: { events: { onhover: { enable: true, mode: 'repulse' } } },
        retina_detect: true
      });
    };
    document.body.appendChild(script);
  }

  toggleDark() {
    this.isDark.update(v => !v);
  }
}