import { Component, inject, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageDataService, PageContent } from '../../services/page-data.service';
import { WebGsapService } from '../../services/web-gsap.service';
import { AnimatedBgComponent } from '../../components/animated-bg/animated-bg.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AnimatedBgComponent],
  template: `
    <section class="page-hero">
      <div class="page-hero-bg">
        <app-animated-bg variant="section" color1="#00c896" color2="#00a3d4" color3="#6366f1"></app-animated-bg>
        <div class="glow glow-1"></div>
        <div class="glow glow-2"></div>
      </div>
      <div class="page-hero-content">
        <span class="section-tag">{{ tag }}</span>
        <h1>{{ title }}</h1>
        <p>{{ subtitle }}</p>
      </div>
    </section>

    <section class="section section-alt">
      <div class="contact-layout">
        <div class="contact-info fade-up">
          <h2>{{ infoTitle }}</h2>
          <p>{{ infoDesc }}</p>
          <div class="contact-details">
            @for (d of details; track d.label) {
              <div class="contact-detail">
                <div class="contact-detail-icon"><i [class]="d.icon"></i></div>
                <div>
                  <strong>{{ d.label }}</strong>
                  <span>{{ d.value }}</span>
                </div>
              </div>
            }
          </div>
        </div>
        <div class="contact-form-wrap fade-up">
          <form (ngSubmit)="onSubmit()" class="contact-form">
            <div class="form-row">
              <input type="text" [(ngModel)]="form.name" name="name" placeholder="Full Name" required>
              <input type="email" [(ngModel)]="form.email" name="email" placeholder="Email Address" required>
            </div>
            <input type="text" [(ngModel)]="form.subject" name="subject" placeholder="Subject">
            <textarea [(ngModel)]="form.message" name="message" rows="5" placeholder="Tell us about your project..."></textarea>
            <button type="submit" class="btn btn-primary">Send Message <i class="fas fa-paper-plane"></i></button>
          </form>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .section { padding: 6rem 2rem; }
    .section-alt { background: #0c0c18; }
    .section-tag {
      display: inline-flex; align-items: center; gap: 0.4rem;
      font-size: 0.7rem; font-weight: 700; letter-spacing: 0.15em;
      text-transform: uppercase; color: #00c896;
      padding: 0.35rem 1rem;
      border: 1px solid rgba(0,200,150,0.1);
      border-radius: 100px; margin-bottom: 1rem;
      background: rgba(0,200,150,0.02);
    }
    .btn {
      display: inline-flex; align-items: center; gap: 0.5rem;
      padding: 0.85rem 2rem; border-radius: 50px;
      text-decoration: none; font-weight: 600;
      font-size: 0.88rem; cursor: pointer; font-family: inherit;
      transition: transform 0.3s, box-shadow 0.3s;
      border: none;
    }
    .btn-primary {
      background: linear-gradient(135deg, #00c896, #00a3d4);
      color: #fff; box-shadow: 0 4px 25px rgba(0,200,150,0.2);
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 35px rgba(0,200,150,0.35); }
    .btn i { font-size: 0.75rem; }
    .fade-up { opacity: 0; transform: translateY(40px); }

    .page-hero {
      padding: 10rem 2rem 5rem; text-align: center;
      position: relative; overflow: hidden; background: #08080f;
    }
    .page-hero-bg { position: absolute; inset: 0; z-index: 0; }
    .page-hero .glow {
      position: absolute; border-radius: 50%; pointer-events: none; filter: blur(80px);
    }
    .page-hero .glow-1 { width: 500px; height: 500px; background: rgba(0,200,150,0.05); top: -20%; right: -10%; }
    .page-hero .glow-2 { width: 400px; height: 400px; background: rgba(0,163,212,0.03); bottom: -20%; left: -10%; }
    .page-hero-content { position: relative; z-index: 1; max-width: 700px; margin: 0 auto; }
    .page-hero h1 { font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 800; letter-spacing: -0.03em; margin-bottom: 1rem; }
    .page-hero p { font-size: 1.1rem; color: rgba(255,255,255,0.4); }

    .contact-layout {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 4rem; max-width: 1100px; margin: 0 auto; align-items: start;
    }
    .contact-info h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; }
    .contact-info > p { color: rgba(255,255,255,0.45); line-height: 1.7; margin-bottom: 2rem; font-size: 0.92rem; }
    .contact-details { display: flex; flex-direction: column; gap: 1.25rem; }
    .contact-detail { display: flex; gap: 1rem; align-items: flex-start; }
    .contact-detail-icon {
      width: 42px; height: 42px; border-radius: 12px;
      background: linear-gradient(135deg, rgba(0,200,150,0.06), rgba(0,163,212,0.03));
      border: 1px solid rgba(0,200,150,0.05);
      display: flex; align-items: center; justify-content: center;
      color: #00c896; font-size: 0.85rem; flex-shrink: 0;
    }
    .contact-detail strong { display: block; font-size: 0.85rem; font-weight: 600; color: #fff; margin-bottom: 0.15rem; }
    .contact-detail span { font-size: 0.82rem; color: rgba(255,255,255,0.4); }

    .contact-form-wrap {
      background: rgba(255,255,255,0.012);
      border: 1px solid rgba(255,255,255,0.04);
      border-radius: 18px; padding: 2.5rem;
    }
    .contact-form { display: flex; flex-direction: column; gap: 1rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .contact-form input,
    .contact-form textarea {
      width: 100%; padding: 0.85rem 1.2rem;
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 12px;
      color: #fff; font-family: inherit; font-size: 0.85rem;
      outline: none; transition: border-color 0.3s;
    }
    .contact-form input:focus,
    .contact-form textarea:focus { border-color: rgba(0,200,150,0.2); }
    .contact-form input::placeholder,
    .contact-form textarea::placeholder { color: rgba(255,255,255,0.15); }
    .contact-form textarea { resize: vertical; min-height: 120px; }

    @media (max-width: 768px) {
      .section { padding: 5rem 1.5rem; }
      .contact-layout { grid-template-columns: 1fr; gap: 2rem; }
      .form-row { grid-template-columns: 1fr; }
    }
  `]
})
export class ContactComponent implements OnInit, AfterViewInit, OnDestroy {
  private pageDataService = inject(PageDataService);
  private webGsapService = inject(WebGsapService);

  tag = 'Get in Touch';
  title = 'Contact Us';
  subtitle = "Have a project in mind? We'd love to hear from you.";

  infoTitle = "Let's Create Together";
  infoDesc = 'Whether you need a full digital transformation or want to scale your product, our team is ready to help.';
  details = [
    { label: 'Email', value: 'hello@tothesource.com', icon: 'fas fa-envelope' },
    { label: 'Phone', value: '+91-120-456-7890', icon: 'fas fa-phone' },
    { label: 'Locations', value: 'Noida, Dehradun, Singapore, Dubai, New Jersey, Sydney', icon: 'fas fa-map-marker-alt' },
  ];

  form = { name: '', email: '', subject: '', message: '' };

  ngOnInit() {
    this.pageDataService.getContactContent().subscribe(data => {
      if (data) {
        const info = data.sections.find(s => s.sectionkey === 'info');
        if (info) this.infoDesc = info.content || this.infoDesc;
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      gsap.registerPlugin(ScrollTrigger);
      gsap.from('.page-hero-content', { opacity: 0, y: 40, duration: 1, ease: 'power4.out' });
      document.querySelectorAll('.fade-up').forEach(el => {
        gsap.from(el, {
          opacity: 0, y: 50, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
        });
      });
      this.webGsapService.applyAnimations('contact', document.querySelector('.page-hero') as HTMLElement);
    }, 100);
  }

  ngOnDestroy() {
    ScrollTrigger.getAll().forEach(t => t.kill());
    gsap.killTweensOf('*');
  }

  onSubmit() {
    console.log('Contact form:', this.form);
  }
}
