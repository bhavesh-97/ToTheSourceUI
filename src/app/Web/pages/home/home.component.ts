import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageDataService } from '../../services/page-data.service';
import {
  HeroSectionComponent, ServicesSectionComponent, StatsSectionComponent,
  ClientsSectionComponent, TestimonialsSectionComponent, CtaSectionComponent,
  HeroSectionData, ServicesSectionData, StatsSectionData,
  ClientsSectionData, TestimonialsSectionData, CtaSectionData
} from '../../components/sections';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroSectionComponent, ServicesSectionComponent, StatsSectionComponent,
    ClientsSectionComponent, TestimonialsSectionComponent, CtaSectionComponent
  ],
  template: `
    <app-hero-section [data]="heroData"></app-hero-section>
    <app-services-section [data]="servicesData"></app-services-section>
    <app-stats-section [data]="statsData"></app-stats-section>
    <app-clients-section [data]="clientsData"></app-clients-section>
    <app-testimonials-section [data]="testimonialsData"></app-testimonials-section>
    <app-cta-section [data]="ctaData"></app-cta-section>
  `,
  styles: [`:host { display: block; }`]
})
export class HomeComponent implements OnInit {
  private pageDataService = inject(PageDataService);

  heroData: HeroSectionData = {
    badge: 'Driving Innovation, Delivering Excellence',
    line1: 'We Build Digital',
    line2: 'Products That Scale',
    desc: 'We design and engineer digital platforms with Cloud, Data, and AI at the core — helping enterprises transform and grow.',
    stats: [
      { value: '200', suffix: '+', label: 'Projects Delivered' },
      { value: '50', suffix: '+', label: 'Global Clients' },
      { value: '12', suffix: '+', label: 'Years Experience' },
    ],
    primaryBtn: { text: 'Start Your Journey', link: '/contact' },
    secondaryBtn: { text: 'View Our Work', link: '/portfolio' }
  };

  servicesData: ServicesSectionData = {
    tag: 'What We Do',
    title: 'Our Services',
    desc: 'End-to-end capabilities to ideate, build, scale, and optimize digital products.',
    services: [
      { icon: 'fas fa-brain', title: 'Generative AI', description: 'Leverage GenAI to automate workflows, generate insights, and create intelligent products.', link: '/services', linkText: 'Learn More' },
      { icon: 'fas fa-cloud', title: 'Cloud & DevOps', description: 'Scalable cloud infrastructure and DevOps pipelines that accelerate delivery and reduce costs.', link: '/services', linkText: 'Learn More' },
      { icon: 'fas fa-database', title: 'Data Engineering', description: 'Build robust data platforms, real-time pipelines, and analytics solutions.', link: '/services', linkText: 'Learn More' },
      { icon: 'fas fa-code', title: 'Digital Engineering', description: 'Full-stack product engineering — from web and mobile to microservices and APIs.', link: '/services', linkText: 'Learn More' },
      { icon: 'fas fa-palette', title: 'Digital Experience', description: 'Human-centered design that creates intuitive, accessible, and delightful experiences.', link: '/services', linkText: 'Learn More' },
      { icon: 'fas fa-bullseye', title: 'Quality Engineering', description: 'AI-powered test automation and QA strategies that ensure bulletproof quality.', link: '/services', linkText: 'Learn More' },
    ]
  };

  statsData: StatsSectionData = {
    items: [
      { value: 200, suffix: '+', label: 'Projects Delivered' },
      { value: 50, suffix: '+', label: 'Global Clients' },
      { value: 12, suffix: '+', label: 'Years Experience' },
      { value: 98, suffix: '%', label: 'Client Satisfaction' },
    ]
  };

  clientsData: ClientsSectionData = {
    tag: 'Trusted By',
    title: 'Leading Brands Worldwide',
    logos: ['Tata Play', 'Tabcorp', 'Alibaba', 'Maruti Suzuki', 'Ooredoo', 'Majid Al Futtaim', 'Fortis', 'Sony', 'HDFC', 'Indigo']
  };

  testimonialsData: TestimonialsSectionData = {
    tag: 'Client Voices',
    title: 'What Our Partners Say',
    desc: 'Hear from the leaders we have worked with across the globe.',
    testimonials: [
      { quote: 'Competent, enabling & partnership driven. They brought deep technical expertise and a collaborative spirit to every phase.', author: 'Prithwish Mukherjee', role: 'Marketing Head, Tata Play Fiber', initials: 'PM' },
      { quote: 'Reliable, diligent and swift. Their team consistently delivered high-quality work ahead of schedule.', author: 'Takeshi Ashida', role: 'GM — Overseas Business, Anim Times', initials: 'TA' },
      { quote: 'Superb, enriching, agile partnership. They truly understand digital transformation from strategy to execution.', author: 'Ana-Maria Korner', role: 'Regional Head Brand & Digital, Hilti', initials: 'AK' },
    ]
  };

  ctaData: CtaSectionData = {
    title: 'Ready to Build Something Extraordinary?',
    desc: "Let's discuss how we can help you achieve your digital transformation goals.",
    btnText: 'Start a Conversation',
    btnLink: '/contact'
  };

  ngOnInit() {
    this.pageDataService.getPageContent('home').subscribe(data => {
      if (!data) return;
      const hero = data.sections.find(s => s.sectionKey === 'hero');
      if (hero) {
        this.heroData = {
          ...this.heroData,
          badge: hero.title || this.heroData.badge,
          desc: hero.content || this.heroData.desc,
        };
      }
      const services = data.sections.find(s => s.sectionKey === 'services');
      if (services) {
        this.servicesData = { ...this.servicesData, desc: services.content || this.servicesData.desc };
      }
    });
  }
}
