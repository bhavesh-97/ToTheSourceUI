import { Component, inject, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageDataService } from '../../services/page-data.service';
import { WebGsapService } from '../../services/web-gsap.service';

interface FAQItem {
  question: string;
  answer: string;
  open: boolean;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="faq-hero">
      <div class="container">
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions</p>
      </div>
    </section>

    <section class="faq-content">
      <div class="container">
        <div class="faq-list">
          @for (item of faqs; track item.question; let i = $index) {
            <div class="faq-item" [class.open]="item.open" (click)="toggleFAQ(i)">
              <div class="faq-question">
                <span>{{ item.question }}</span>
                <span class="faq-icon">{{ item.open ? '−' : '+' }}</span>
              </div>
              @if (item.open) {
                <div class="faq-answer">
                  <p>{{ item.answer }}</p>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </section>

    <section class="faq-contact">
      <div class="container">
        <h2>Still Have Questions?</h2>
        <p>Contact us for more information.</p>
        <a routerLink="/Web/contact" class="cta-button">Get in Touch</a>
      </div>
    </section>
  `,
  styles: [`
    .faq-hero { padding: 8rem 2rem 4rem; text-align: center; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); }
    .faq-hero h1 { font-size: clamp(2.5rem, 6vw, 4rem); margin-bottom: 1rem; }
    .faq-hero p { font-size: 1.25rem; color: rgba(255,255,255,0.7); }
    .faq-content { padding: 6rem 2rem; background: #0f0f1a; }
    .container { max-width: 800px; margin: 0 auto; }
    .faq-list { display: flex; flex-direction: column; gap: 1rem; }
    .faq-item { background: rgba(255,255,255,0.05); border-radius: 12px; overflow: hidden; cursor: pointer; transition: all 0.3s; }
    .faq-item:hover { background: rgba(255,255,255,0.08); }
    .faq-item.open { background: rgba(233,69,96,0.1); border: 1px solid rgba(233,69,96,0.3); }
    .faq-question { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; }
    .faq-question span:first-child { font-size: 1.1rem; font-weight: 500; }
    .faq-icon { font-size: 1.5rem; color: #e94560; }
    .faq-answer { padding: 0 1.5rem 1.5rem; }
    .faq-answer p { color: rgba(255,255,255,0.8); line-height: 1.7; }
    .faq-contact { padding: 6rem 2rem; text-align: center; background: linear-gradient(135deg, #e94560 0%, #0f3460 100%); }
    .faq-contact h2 { font-size: 2rem; margin-bottom: 1rem; }
    .faq-contact p { margin-bottom: 2rem; }
    .cta-button { display: inline-block; padding: 1rem 2rem; background: white; color: #e94560; text-decoration: none; border-radius: 50px; font-weight: 600; transition: transform 0.3s; }
    .cta-button:hover { transform: translateY(-3px); }
  `]
})
export class FaqComponent implements OnInit, AfterViewInit, OnDestroy {
  private pageDataService = inject(PageDataService);
  private webGsapService = inject(WebGsapService);

  faqs: FAQItem[] = [
    { question: 'What services do you offer?', answer: 'We offer a comprehensive range of digital services including web development, mobile app development, UI/UX design, and digital marketing. Our team specializes in creating custom solutions tailored to your business needs.', open: false },
    { question: 'How long does it take to build a website?', answer: 'The timeline varies based on project complexity. A simple website typically takes 4-6 weeks, while complex web applications can take 3-6 months. We provide detailed timelines during our initial consultation.', open: false },
    { question: 'Do you offer ongoing support?', answer: 'Yes! We offer various maintenance and support packages to keep your digital products running smoothly. This includes updates, security patches, and feature enhancements.', open: false },
    { question: 'What is your pricing structure?', answer: 'Our pricing depends on project scope and requirements. We offer both fixed-price and hourly engagement models. Contact us for a customized quote based on your specific needs.', open: false },
    { question: 'Can you work with our existing team?', answer: 'Absolutely! We often collaborate with in-house teams, providing additional expertise and resources. We can integrate seamlessly with your current workflows and tools.', open: false },
    { question: 'How do you handle project communication?', answer: 'We maintain regular communication through weekly updates, dedicated project managers, and transparent tracking tools. You will always know the status of your project.', open: false },
    { question: 'Do you sign NDAs for projects?', answer: 'Yes, we absolutely sign non-disclosure agreements to protect your proprietary information and business secrets. Your confidentiality is our priority.', open: false },
    { question: 'What technologies do you use?', answer: 'We work with modern technologies including React, Angular, Node.js, Python, and cloud platforms like AWS and Azure. We choose the best tech stack for your specific requirements.', open: false }
  ];

  ngOnInit() {
    this.pageDataService.getPageContent('faq').subscribe(data => {
      if (data) console.log('FAQ data:', data);
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.webGsapService.applyAnimations('webfaq', document.querySelector('.faq-hero') as HTMLElement), 100);
  }

  ngOnDestroy() {
    this.webGsapService.killAll();
  }

  toggleFAQ(index: number) {
    this.faqs = this.faqs.map((faq, i) => ({
      ...faq,
      open: i === index ? !faq.open : false
    }));
  }
}