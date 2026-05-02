import { Component, inject, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PageDataService } from '../../services/page-data.service';
import { WebGsapService } from '../../services/web-gsap.service';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <section class="contact-hero">
      <div class="container">
        <h1>Contact Us</h1>
        <p>Get in touch for a free consultation</p>
      </div>
    </section>

    <section class="contact-content">
      <div class="container">
        <div class="contact-grid">
          <div class="contact-info">
            <h2>Let's Connect</h2>
            <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
            <div class="info-item">
              <span class="icon">📧</span>
              <div>
                <h3>Email</h3>
                <p>hello&#64;tothesource.com</p>
              </div>
            </div>
            <div class="info-item">
              <span class="icon">📍</span>
              <div>
                <h3>Location</h3>
                <p>123 Business Street, City, State 12345</p>
              </div>
            </div>
            <div class="info-item">
              <span class="icon">📱</span>
              <div>
                <h3>Phone</h3>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
          </div>

          <div class="contact-form-wrapper">
            <form (ngSubmit)="onSubmit()">
              <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" name="name" [(ngModel)]="form.name" required placeholder="Your name" />
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" [(ngModel)]="form.email" required placeholder="your&#64;email.com" />
              </div>
              <div class="form-group">
                <label for="subject">Subject</label>
                <input type="text" id="subject" name="subject" [(ngModel)]="form.subject" required placeholder="What's this about?" />
              </div>
              <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" name="message" [(ngModel)]="form.message" required rows="5" placeholder="Your message..."></textarea>
              </div>
              <button type="submit" class="submit-btn">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .contact-hero { padding: 8rem 2rem 4rem; text-align: center; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); }
    .contact-hero h1 { font-size: clamp(2.5rem, 6vw, 4rem); margin-bottom: 1rem; }
    .contact-hero p { font-size: 1.25rem; color: rgba(255,255,255,0.7); }
    .contact-content { padding: 6rem 2rem; background: #0f0f1a; }
    .container { max-width: 1200px; margin: 0 auto; }
    .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; }
    .contact-info h2 { font-size: 2rem; margin-bottom: 1rem; }
    .contact-info > p { color: rgba(255,255,255,0.7); margin-bottom: 2rem; line-height: 1.8; }
    .info-item { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
    .info-item .icon { font-size: 1.5rem; }
    .info-item h3 { margin-bottom: 0.25rem; color: #e94560; }
    .info-item p { color: rgba(255,255,255,0.8); }
    .contact-form-wrapper { background: rgba(255,255,255,0.05); padding: 2rem; border-radius: 16px; }
    .form-group { margin-bottom: 1.5rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    .form-group input, .form-group textarea { width: 100%; padding: 1rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: white; font-size: 1rem; transition: border-color 0.3s; }
    .form-group input:focus, .form-group textarea:focus { outline: none; border-color: #e94560; }
    .form-group textarea { resize: vertical; }
    .submit-btn { width: 100%; padding: 1rem 2rem; background: #e94560; color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: transform 0.3s, box-shadow 0.3s; }
    .submit-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(233,69,96,0.3); }
    @media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr; } }
  `]
})
export class ContactComponent implements OnInit, AfterViewInit, OnDestroy {
  private pageDataService = inject(PageDataService);
  private webGsapService = inject(WebGsapService);

  form: ContactForm = { name: '', email: '', subject: '', message: '' };

  ngOnInit() {
    this.pageDataService.getContactContent().subscribe(data => {
      if (data) console.log('Contact data:', data);
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.webGsapService.applyAnimations('contact', document.querySelector('.contact-hero') as HTMLElement), 100);
  }

  ngOnDestroy() {
    this.webGsapService.killAll();
  }

  onSubmit() {
    console.log('Form submitted:', this.form);
  }
}