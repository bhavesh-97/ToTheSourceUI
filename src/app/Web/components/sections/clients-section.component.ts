import { Component, ElementRef, AfterViewInit, OnDestroy, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ClientsSectionData } from './section-interfaces';

@Component({
  selector: 'app-clients-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="section">
      <div class="section-header">
        <span class="section-tag">{{ data.tag }}</span>
        <h2 class="section-title">{{ data.title }}</h2>
      </div>
      <div class="clients-track-wrap">
        <div class="clients-track">
          @for (logo of data.logos; track logo) {
            <span class="client-logo">{{ logo }}</span>
          }
          @for (logo of data.logos; track logo) {
            <span class="client-logo">{{ logo }}</span>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .section { padding: 6rem 2rem; position: relative; overflow: hidden; }
    .section-header { text-align: center; margin-bottom: 4rem; }
    .section-tag {
      display: inline-flex; align-items: center; gap: 0.4rem;
      font-size: 0.7rem; font-weight: 700; letter-spacing: 0.15em;
      text-transform: uppercase; color: #00c896;
      padding: 0.35rem 1rem; border: 1px solid rgba(0,200,150,0.1);
      border-radius: 100px; margin-bottom: 1rem;
      background: rgba(0,200,150,0.02);
    }
    .section-title {
      font-size: clamp(1.8rem, 4vw, 2.8rem);
      font-weight: 700; color: #fff; margin-bottom: 0.75rem; line-height: 1.15;
    }
    .clients-track-wrap { overflow: hidden; max-width: 1000px; margin: 0 auto; }
    .clients-track { display: flex; gap: 3rem; width: max-content; padding: 1rem 0; }
    .client-logo {
      font-size: 0.85rem; font-weight: 600; color: rgba(255,255,255,0.15);
      letter-spacing: 0.05em; white-space: nowrap;
      transition: color 0.3s; flex-shrink: 0;
    }
    .client-logo:hover { color: rgba(255,255,255,0.4); }
  `]
})
export class ClientsSectionComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) data!: ClientsSectionData;
  private el = inject(ElementRef);
  private ctx!: gsap.Context;
  private marqueeTween: gsap.core.Tween | null = null;

  ngAfterViewInit() {
    gsap.registerPlugin(ScrollTrigger);
    this.ctx = gsap.context(() => this.initAnim(), this.el.nativeElement);
  }

  private initAnim() {
    gsap.from('.client-logo', {
      opacity: 0, y: 20, duration: 0.6, ease: 'power3.out', stagger: 0.05,
      scrollTrigger: { trigger: '.clients-track-wrap', start: 'top 85%', toggleActions: 'play none none none' }
    });
    const track = this.el.nativeElement.querySelector('.clients-track') as HTMLElement;
    if (!track) return;
    const totalWidth = track.scrollWidth / 2;
    this.marqueeTween = gsap.to(track, {
      x: -totalWidth, duration: 40, repeat: -1, ease: 'none', paused: true
    });
    setTimeout(() => { if (this.marqueeTween) this.marqueeTween.play(0); }, 800);
    track.addEventListener('mouseenter', () => this.marqueeTween?.pause());
    track.addEventListener('mouseleave', () => this.marqueeTween?.resume());
  }

  ngOnDestroy() {
    this.ctx?.revert();
    if (this.marqueeTween) this.marqueeTween.kill();
  }
}
