import { Component, ElementRef, AfterViewInit, OnDestroy, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { gsap } from 'gsap';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="not-found">
      <div class="bg-grid"></div>
      <div class="bg-gradient"></div>

      @for (shape of shapes; track shape.type + shape.x + shape.y) {
        <div class="shape shape-{{ shape.type }}"
             [ngStyle]="{
               width: shape.size + 'px',
               height: shape.size + 'px',
               top: shape.y + '%',
               left: shape.x + '%',
               background: shape.color,
               filter: 'blur(' + shape.blur + 'px)',
               opacity: shape.opacity
             }">
        </div>
      }

      @for (p of particles; track p.id) {
        <div class="particle"
             [ngStyle]="{
               width: p.size + 'px',
               height: p.size + 'px',
               left: p.x + '%',
               top: p.y + '%',
               opacity: p.opacity
             }">
        </div>
      }

      <div class="content">
        <div class="digit-group" #digitGroup>
          <span class="digit" #digit1>4</span>
          <div class="digit-zero-wrapper">
            <span class="digit zero-digit" #digit0>0</span>
            <div class="zero-ring" #zeroRing></div>
          </div>
          <span class="digit" #digit2>4</span>
        </div>

        <h2 class="page-not-found-text" #pageNotFound>PAGE NOT FOUND</h2>

        <p class="description" #description>
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div class="actions" #actions>
          <a routerLink="/home" class="btn btn-primary">Return Home</a>
          <a routerLink="/contact" class="btn btn-secondary">Contact Support</a>
        </div>

        <p class="redirect-text" #redirectText>
          Redirecting to home in <span class="countdown-num">{{ countdown() }}</span> second{{ countdown() !== 1 ? 's' : '' }}...
        </p>
      </div>
    </section>
  `,
  styles: [`
    .not-found {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      background: #0a0a14;
    }
    .bg-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
      background-size: 60px 60px;
      z-index: 0;
    }
    .bg-gradient {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse at 20% 50%, rgba(233,69,96,0.06) 0%, transparent 60%),
        radial-gradient(ellipse at 80% 50%, rgba(15,52,96,0.08) 0%, transparent 60%),
        radial-gradient(ellipse at 50% 20%, rgba(83,52,131,0.05) 0%, transparent 50%);
      z-index: 0;
    }

    .shape {
      position: absolute;
      translate: -50% -50%;
      z-index: 0;
      pointer-events: none;
      will-change: transform;
    }
    .shape-circle {
      border-radius: 50%;
    }
    .shape-square {
      border-radius: 20%;
    }
    .shape-triangle {
      clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
      border-radius: 0;
    }

    .particle {
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,0.6);
      translate: -50% -50%;
      pointer-events: none;
      z-index: 0;
    }

    .content {
      position: relative;
      z-index: 1;
      text-align: center;
      padding: 2rem;
      max-width: 700px;
    }

    .digit-group {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.05em;
      margin-bottom: 1.5rem;
    }
    .digit {
      font-size: clamp(6rem, 25vw, 14rem);
      font-weight: 900;
      line-height: 1;
      color: rgba(255,255,255,0.95);
      text-shadow: 0 0 40px rgba(255,255,255,0.05);
      user-select: none;
    }
    .zero-digit {
      color: #e94560;
      text-shadow:
        0 0 20px rgba(233,69,96,0.3),
        0 0 60px rgba(233,69,96,0.15);
    }
    .digit-zero-wrapper {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .zero-ring {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 1.3em;
      height: 1.3em;
      border: 2px solid rgba(233,69,96,0.3);
      border-radius: 50%;
      translate: -50% -50%;
      pointer-events: none;
    }

    .page-not-found-text {
      font-size: clamp(0.875rem, 2vw, 1.25rem);
      font-weight: 300;
      letter-spacing: 0.5em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.6);
      margin-bottom: 1rem;
    }

    .description {
      font-size: clamp(0.8rem, 1.5vw, 1rem);
      color: rgba(255,255,255,0.45);
      line-height: 1.6;
      margin-bottom: 2.5rem;
      max-width: 440px;
      margin-left: auto;
      margin-right: auto;
    }

    .actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    .btn {
      padding: 0.875rem 2rem;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      transition: transform 0.3s, box-shadow 0.3s, background 0.3s;
      cursor: pointer;
    }
    .btn-primary {
      background: linear-gradient(135deg, #e94560, #c23152);
      color: white;
      box-shadow: 0 4px 20px rgba(233,69,96,0.3);
    }
    .btn-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 30px rgba(233,69,96,0.45);
    }
    .btn-secondary {
      background: transparent;
      border: 1.5px solid rgba(255,255,255,0.2);
      color: rgba(255,255,255,0.8);
    }
    .btn-secondary:hover {
      border-color: rgba(255,255,255,0.5);
      color: white;
      transform: translateY(-3px);
      box-shadow: 0 8px 30px rgba(0,0,0,0.3);
    }

    .redirect-text {
      font-size: 0.8rem;
      color: rgba(255,255,255,0.25);
      margin-top: 2.5rem;
      letter-spacing: 0.05em;
    }
    .countdown-num {
      color: rgba(255,255,255,0.5);
      font-weight: 600;
    }

    .digit-group.glitching {
      animation: glitch 0.25s ease-in-out;
    }

    @keyframes glitch {
      0%, 100% {
        transform: translate(0) skewX(0deg);
        text-shadow: none;
      }
      10% {
        transform: translate(-3px, 1px) skewX(-1deg);
        text-shadow: 3px 0 rgba(233,69,96,0.5), -3px 0 rgba(83,52,131,0.5);
      }
      20% {
        transform: translate(3px, -1px) skewX(1deg);
        text-shadow: -3px 0 rgba(233,69,96,0.4), 2px 0 rgba(83,52,131,0.4);
      }
      30% {
        transform: translate(-2px, 2px) skewX(-0.5deg);
        text-shadow: 2px 0 rgba(233,69,96,0.5), -2px 0 rgba(83,52,131,0.5);
      }
      40% {
        transform: translate(2px, -2px) skewX(0.5deg);
        text-shadow: -2px 0 rgba(233,69,96,0.4), 1px 0 rgba(83,52,131,0.4);
      }
      50% {
        transform: translate(0) skewX(0deg);
        text-shadow: none;
      }
    }

    @media (max-width: 768px) {
      .digit {
        font-size: clamp(4rem, 20vw, 8rem);
      }
      .page-not-found-text {
        letter-spacing: 0.3em;
      }
      .btn {
        padding: 0.75rem 1.5rem;
        font-size: 0.85rem;
      }
      .actions {
        flex-direction: column;
        align-items: center;
      }
    }
    @media (max-width: 480px) {
      .digit {
        font-size: clamp(3rem, 18vw, 5rem);
      }
      .page-not-found-text {
        letter-spacing: 0.2em;
        font-size: 0.75rem;
      }
      .description {
        font-size: 0.8rem;
      }
    }
  `]
})
export class NotFoundComponent implements AfterViewInit, OnDestroy {
  private elementRef = inject(ElementRef);
  private router = inject(Router);

  countdown = signal(15);

  shapes = [
    { type: 'circle', size: 320, x: -8, y: -8, color: 'linear-gradient(135deg, rgba(233,69,96,0.12), rgba(233,69,96,0.04))', blur: 70, opacity: 1 },
    { type: 'square', size: 260, x: 88, y: 82, color: 'linear-gradient(135deg, rgba(15,52,96,0.15), rgba(15,52,96,0.05))', blur: 55, opacity: 1 },
    { type: 'triangle', size: 230, x: 82, y: 8, color: 'linear-gradient(135deg, rgba(83,52,131,0.12), rgba(83,52,131,0.04))', blur: 50, opacity: 1 },
    { type: 'circle', size: 200, x: 5, y: 85, color: 'linear-gradient(135deg, rgba(233,69,96,0.08), rgba(233,69,96,0.02))', blur: 40, opacity: 1 },
    { type: 'square', size: 170, x: 50, y: -6, color: 'linear-gradient(135deg, rgba(255,107,107,0.1), rgba(255,107,107,0.03))', blur: 45, opacity: 1 },
    { type: 'circle', size: 140, x: 95, y: 45, color: 'linear-gradient(135deg, rgba(83,52,131,0.1), rgba(83,52,131,0.03))', blur: 35, opacity: 1 },
  ];

  particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 2,
    opacity: Math.random() * 0.35 + 0.1
  }));

  private tl: gsap.core.Timeline | null = null;
  private ringTween: gsap.core.Tween | null = null;
  private floatTweens: gsap.core.Tween[] = [];
  private glitchTimeout: any = null;
  private countdownInterval: any = null;

  ngAfterViewInit() {
    setTimeout(() => {
      const el = this.elementRef.nativeElement;
      this.animateEntrance(el);
      this.animateFloating(el);
      this.startGlitchEffect(el);
      this.startCountdown();
    }, 100);
  }

  ngOnDestroy() {
    this.tl?.kill();
    this.ringTween?.kill();
    this.floatTweens.forEach(t => t.kill());
    this.floatTweens = [];
    if (this.glitchTimeout) clearTimeout(this.glitchTimeout);
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    gsap.killTweensOf(this.elementRef.nativeElement.querySelectorAll('*'));
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const x = (event.clientX / window.innerWidth - 0.5) * 15;
    const y = (event.clientY / window.innerHeight - 0.5) * 15;
    gsap.to(this.elementRef.nativeElement.querySelector('.digit-group'), {
      x, y,
      duration: 0.6,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  }

  private animateEntrance(el: HTMLElement) {
    this.tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    const shapes = el.querySelectorAll('.shape');

    this.tl
      .fromTo(shapes,
        { opacity: 0, scale: 0.3 },
        {
          opacity: 1,
          scale: 1,
          rotation: (i: number) => this.shapes[i] ? (i * 15) : 0,
          duration: 1.5,
          stagger: 0.08,
          ease: 'power2.out'
        }
      )
      .fromTo(el.querySelectorAll('.particle'),
        { opacity: 0 },
        { opacity: 1, duration: 1.2, stagger: 0.015 },
        0
      )
      .fromTo(el.querySelectorAll('.digit'),
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.15, ease: 'back.out(1.7)' },
        0.5
      )
      .fromTo(el.querySelector('.zero-ring'),
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6 },
        0.7
      )
      .fromTo(el.querySelector('.page-not-found-text'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        1.1
      )
      .fromTo(el.querySelector('.description'),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        1.3
      )
      .fromTo(el.querySelectorAll('.btn'),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.1 },
        1.5
      )
      .fromTo(el.querySelector('.redirect-text'),
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 },
        1.7
      );
  }

  private animateFloating(el: HTMLElement) {
    const shapes = el.querySelectorAll('.shape');
    shapes.forEach((shape, i) => {
      const tween = gsap.to(shape, {
        y: 15 + (i % 3) * 8,
        x: (i % 2 === 0 ? 10 : -10) + i * 2,
        rotation: 5 - i * 3,
        duration: 5 + i * 0.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.25
      });
      this.floatTweens.push(tween);
    });

    this.ringTween = gsap.to(el.querySelector('.zero-ring'), {
      scale: 1.8,
      opacity: 0,
      duration: 2.2,
      repeat: -1,
      ease: 'power2.out',
      delay: 1.5
    });

    const particles = el.querySelectorAll('.particle');
    particles.forEach((p, i) => {
      gsap.to(p, {
        y: gsap.utils.random(-50, -30),
        x: gsap.utils.random(-25, 25),
        opacity: 0,
        duration: gsap.utils.random(7, 14),
        repeat: -1,
        ease: 'none',
        delay: i * 0.08
      });
    });
  }

  private startGlitchEffect(el: HTMLElement) {
    const digitGroup = el.querySelector('.digit-group') as HTMLElement;

    const scheduleGlitch = () => {
      digitGroup.classList.add('glitching');
      setTimeout(() => {
        digitGroup.classList.remove('glitching');
      }, 280);
      this.glitchTimeout = setTimeout(scheduleGlitch, gsap.utils.random(3500, 6500));
    };

    this.glitchTimeout = setTimeout(scheduleGlitch, gsap.utils.random(2000, 4000));
  }

  private startCountdown() {
    this.countdownInterval = setInterval(() => {
      this.countdown.update(v => {
        if (v <= 1) {
          clearInterval(this.countdownInterval);
          this.router.navigate(['/home']);
          return 0;
        }
        return v - 1;
      });
    }, 1000);
  }
}
