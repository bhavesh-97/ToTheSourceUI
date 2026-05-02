import { Component, inject, OnInit, AfterViewInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WebGsapService } from '../../services/web-gsap.service';
import { GsapConfigLoaderService } from '../../../services/gsap-config-loader.service';

interface GsapDemo {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface AnimationPreset {
  name: string;
  selector: string;
  from: any;
  to: any;
  duration: number;
  ease: string;
}

@Component({
  selector: 'app-animations',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="animations-hero">
      <div class="container">
        <h1>GSAP Animations</h1>
        <p>Explore our animation library powered by GSAP</p>
      </div>
    </section>

    <section class="animations-demo">
      <div class="container">
        <h2>Animation Presets</h2>
        <div class="demo-grid">
          @for (demo of demos; track demo.id) {
            <div class="demo-card" (click)="playAnimation(demo)">
              <div class="demo-preview" [id]="'demo-' + demo.id"></div>
              <h3>{{ demo.name }}</h3>
              <p>{{ demo.description }}</p>
              <span class="demo-category">{{ demo.category }}</span>
            </div>
          }
        </div>
      </div>
    </section>

    <section class="animations-showcase">
      <div class="container">
        <h2>Live Demo</h2>
        <div class="showcase-area">
          @for (preset of presets; track preset.name) {
            <div class="showcase-box" [class]="preset.name.toLowerCase().replace(' ', '-')">
              {{ preset.name }}
            </div>
          }
        </div>
        <div class="showcase-controls">
          <button (click)="playAll()" class="play-btn">Play All</button>
          <button (click)="reset()" class="reset-btn">Reset</button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .animations-hero { padding: 8rem 2rem 4rem; text-align: center; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); }
    .animations-hero h1 { font-size: clamp(2.5rem, 6vw, 4rem); margin-bottom: 1rem; }
    .animations-hero p { font-size: 1.25rem; color: rgba(255,255,255,0.7); }
    .animations-demo { padding: 6rem 2rem; background: #0f0f1a; }
    .container { max-width: 1200px; margin: 0 auto; }
    .animations-demo h2 { text-align: center; margin-bottom: 3rem; font-size: 2.5rem; }
    .demo-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
    .demo-card { background: rgba(255,255,255,0.05); border-radius: 16px; padding: 1.5rem; cursor: pointer; transition: transform 0.3s; }
    .demo-card:hover { transform: translateY(-5px); background: rgba(255,255,255,0.08); }
    .demo-preview { aspect-ratio: 16/9; background: linear-gradient(135deg, #333 0%, #555 100%); border-radius: 8px; margin-bottom: 1rem; }
    .demo-card h3 { margin-bottom: 0.5rem; }
    .demo-card p { color: rgba(255,255,255,0.7); font-size: 0.875rem; margin-bottom: 1rem; }
    .demo-category { color: #e94560; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
    .animations-showcase { padding: 6rem 2rem; background: #0a0a14; }
    .animations-showcase h2 { text-align: center; margin-bottom: 3rem; }
    .showcase-area { display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap; margin-bottom: 2rem; }
    .showcase-box { width: 120px; height: 120px; background: #e94560; border-radius: 12px; display: flex; justify-content: center; align-items: center; font-weight: 600; }
    .showcase-controls { display: flex; gap: 1rem; justify-content: center; }
    .play-btn, .reset-btn { padding: 1rem 2rem; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }
    .play-btn { background: #4caf50; color: white; }
    .reset-btn { background: #f44336; color: white; }
  `]
})
export class AnimationsComponent implements OnInit, AfterViewInit, OnDestroy {
  private webGsapService = inject(WebGsapService);
  private gsapLoader = inject(GsapConfigLoaderService);

  demos: GsapDemo[] = [
    { id: 'fade-up', name: 'Fade Up', description: 'Elements fade in from below', category: 'Entrance' },
    { id: 'fade-in', name: 'Fade In', description: 'Simple opacity fade', category: 'Entrance' },
    { id: 'scale-in', name: 'Scale In', description: 'Scale from 0 to 1', category: 'Entrance' },
    { id: 'slide-left', name: 'Slide Left', description: 'Slide from right to left', category: 'Motion' },
    { id: 'slide-right', name: 'Slide Right', description: 'Slide from left to right', category: 'Motion' },
    { id: 'rotate', name: 'Rotate In', description: 'Rotation entrance', category: 'Motion' },
    { id: 'stagger', name: 'Stagger', description: 'Sequential animations', category: 'Advanced' },
    { id: 'bounce', name: 'Bounce', description: 'Bouncy entrance', category: 'Advanced' }
  ];

  presets: AnimationPreset[] = [
    { name: 'Fade Up', selector: '.fade-up', from: { opacity: 0, y: 50 }, to: { opacity: 1, y: 0 }, duration: 1, ease: 'power2.out' },
    { name: 'Scale', selector: '.scale', from: { opacity: 0, scale: 0 }, to: { opacity: 1, scale: 1 }, duration: 0.8, ease: 'back.out(1.7)' },
    { name: 'Slide', selector: '.slide', from: { opacity: 0, x: -100 }, to: { opacity: 1, x: 0 }, duration: 0.8, ease: 'power2.out' },
    { name: 'Rotate', selector: '.rotate', from: { opacity: 0, rotation: -180 }, to: { opacity: 1, rotation: 0 }, duration: 1, ease: 'power2.out' }
  ];

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => this.webGsapService.applyAnimations('gsap', document.querySelector('.animations-hero') as HTMLElement), 100);
  }

  ngOnDestroy() {
    this.webGsapService.killAll();
  }

  playAnimation(demo: GsapDemo) {
    console.log('Playing:', demo.id);
  }

  playAll() {
    console.log('Playing all animations');
  }

  reset() {
    console.log('Reset animations');
  }
}