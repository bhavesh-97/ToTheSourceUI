import { Component, ElementRef, inject, AfterViewInit, OnDestroy, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageDataService, PageContent } from '../../services/page-data.service';
import { WebGsapService } from '../../services/web-gsap.service';
import { AnimatedBgComponent } from '../../components/animated-bg/animated-bg.component';

interface JobListing {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  level: string;
  remote: boolean;
  description: string;
  postedDate: string;
}

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

interface Value {
  icon: string;
  title: string;
  description: string;
}

interface Milestone {
  year: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-career',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AnimatedBgComponent],
  templateUrl: './career.component.html',
  styleUrls: ['./career.component.scss']
})
export class CareerComponent implements AfterViewInit, OnDestroy {
  private pageDataService = inject(PageDataService);
  private webGsapService = inject(WebGsapService);
  private el = inject(ElementRef);

  activeFilter = signal<string>('All');
  selectedJob: JobListing | null = null;
  showApplicationForm = false;

  filters = ['All', 'Engineering', 'Design', 'Marketing', 'Sales', 'Support'];

  stats = [
    { value: 50, suffix: '+', label: 'Team Members', icon: 'fas fa-users' },
    { value: 6, suffix: '', label: 'Global Offices', icon: 'fas fa-globe' },
    { value: 200, suffix: '+', label: 'Projects Delivered', icon: 'fas fa-rocket' },
    { value: 15, suffix: '+', label: 'Years of Excellence', icon: 'fas fa-award' }
  ];

  jobs: JobListing[] = [
    { id: 1, title: 'Senior Frontend Developer', department: 'Engineering', location: 'Noida, India', type: 'Full-Time', level: 'Senior-Level', remote: true, description: 'Build and maintain cutting-edge web applications using Angular, GSAP, and Three.js. Collaborate with designers to create immersive user experiences.', postedDate: '2 days ago' },
    { id: 2, title: 'UX/UI Designer', department: 'Design', location: 'Dehradun, India', type: 'Full-Time', level: 'Mid-Level', remote: false, description: 'Design intuitive interfaces and delightful user experiences. Work closely with developers to bring designs to life with pixel-perfect precision.', postedDate: '1 week ago' },
    { id: 3, title: 'Full Stack Developer', department: 'Engineering', location: 'Singapore', type: 'Full-Time', level: 'Mid-Level', remote: true, description: 'Develop scalable backend services and integrate with modern frontend frameworks. Experience with Node.js, Python, or Go required.', postedDate: '3 days ago' },
    { id: 4, title: 'Marketing Lead', department: 'Marketing', location: 'Noida, India', type: 'Full-Time', level: 'Manager', remote: false, description: 'Drive our brand strategy and digital marketing initiatives. Lead a team of creative marketers to achieve growth targets.', postedDate: '5 days ago' },
    { id: 5, title: 'DevOps Engineer', department: 'Engineering', location: 'Remote', type: 'Contract', level: 'Senior-Level', remote: true, description: 'Manage cloud infrastructure, CI/CD pipelines, and ensure 99.9% uptime. Experience with AWS, Docker, and Kubernetes essential.', postedDate: '1 week ago' },
    { id: 6, title: 'Technical Support Specialist', department: 'Support', location: 'Noida, India', type: 'Full-Time', level: 'Entry-Level', remote: false, description: 'Provide world-class technical support to our enterprise clients. Troubleshoot issues and document solutions.', postedDate: '2 weeks ago' },
    { id: 7, title: 'Product Designer', department: 'Design', location: 'Dubai, UAE', type: 'Full-Time', level: 'Senior-Level', remote: true, description: 'Lead product design initiatives from concept to launch. Create design systems and maintain consistency across products.', postedDate: '4 days ago' },
    { id: 8, title: 'Sales Executive', department: 'Sales', location: 'New Jersey, USA', type: 'Full-Time', level: 'Mid-Level', remote: false, description: 'Drive enterprise sales in the北美 market. Build relationships and close deals with Fortune 500 companies.', postedDate: '1 week ago' }
  ];

  benefits: Benefit[] = [
    { icon: 'fas fa-laptop-house', title: 'Remote-First Culture', description: 'Work from anywhere in the world. Our remote-first approach gives you the flexibility to do your best work.' },
    { icon: 'fas fa-heartbeat', title: 'Health & Wellness', description: 'Comprehensive medical, dental, and vision coverage. Plus gym memberships and mental health support.' },
    { icon: 'fas fa-chart-line', title: 'Growth & Learning', description: 'Annual learning budget, conference tickets, certifications, and internal mentorship programs.' },
    { icon: 'fas fa-plane', title: 'Flexible Time Off', description: 'Unlimited PTO, flexible working hours, and sabbatical options for long-term team members.' },
    { icon: 'fas fa-hand-holding-usd', title: 'Equity & Bonuses', description: 'Competitive salary, stock options, performance bonuses, and profit-sharing for all full-time employees.' },
    { icon: 'fas fa-home', title: 'Workspace Setup', description: 'Get the latest MacBook Pro, ergonomic accessories, and a home office budget of $2,000.' }
  ];

  values: Value[] = [
    { icon: 'fas fa-lightbulb', title: 'Innovation First', description: 'We challenge conventions and embrace creative solutions. Every idea is heard, every voice matters.' },
    { icon: 'fas fa-handshake', title: 'Ownership Mindset', description: 'Take ownership of your work. We trust our team to make decisions and drive impact independently.' },
    { icon: 'fas fa-users', title: 'Collaborative Spirit', description: 'Great things happen when diverse minds come together. We foster an inclusive, supportive environment.' },
    { icon: 'fas fa-balance-scale', title: 'Work-Life Harmony', description: 'We believe in sustainable productivity. Balance is not a perk, it is a foundation of our culture.' }
  ];

  milestones: Milestone[] = [
    { year: '2010', title: 'The Beginning', description: 'Founded in Noida with a vision to transform digital experiences through innovative technology.' },
    { year: '2013', title: 'First Office Expansion', description: 'Opened our second office in Dehradun and grew the team to 25 passionate professionals.' },
    { year: '2016', title: 'Global Reach', description: 'Expanded to Singapore and Dubai, serving clients across APAC and Middle East markets.' },
    { year: '2019', title: '100 Team Members', description: 'Crossed the 100-employee milestone and opened our New Jersey office for North American operations.' },
    { year: '2022', title: 'Industry Recognition', description: 'Named top digital transformation partner by multiple industry publications and client satisfaction awards.' },
    { year: '2025', title: 'Continued Growth', description: '200+ team members across 6 global offices, delivering excellence for Fortune 500 companies worldwide.' }
  ];

  get filteredJobs(): JobListing[] {
    const filter = this.activeFilter();
    if (filter === 'All') return this.jobs;
    return this.jobs.filter(j => j.department === filter);
  }

  ngAfterViewInit() {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      this.initHeroAnimation();
      this.initCounters();
      this.initRevealAnimations();
      this.initJobCards();
      this.initTimelineAnimation();
    }, this.el.nativeElement);

    this.webGsapService.applyAnimations('career', this.el.nativeElement);

    this.cleanup = () => ctx.revert();
  }

  private cleanup: () => void = () => {};

  ngOnDestroy() {
    this.cleanup();
    ScrollTrigger.getAll().forEach(t => t.kill());
    gsap.killTweensOf('*');
  }

  private initHeroAnimation() {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.from('.career-hero .section-tag', { opacity: 0, y: 30, duration: 0.8 })
      .from('.career-hero h1', { opacity: 0, y: 40, duration: 1 }, '-=0.4')
      .from('.career-hero p', { opacity: 0, y: 30, duration: 0.8 }, '-=0.6')
      .from('.career-hero .hero-cta', { opacity: 0, y: 20, duration: 0.6 }, '-=0.3');
  }

  private initCounters() {
    const counterEls = this.el.nativeElement.querySelectorAll('.stat-number');
    counterEls.forEach((el: HTMLElement) => {
      const target = parseInt(el.getAttribute('data-target') || '0', 10);
      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        onEnter: () => {
          gsap.fromTo(el,
            { innerText: '0' },
            {
              innerText: target,
              duration: 2,
              ease: 'power2.out',
              snap: { innerText: 1 },
              onUpdate: function () {
                el.innerText = Math.round(parseFloat(el.innerText)).toString() + (el.getAttribute('data-suffix') || '');
              }
            }
          );
        }
      });
    });
  }

  private initRevealAnimations() {
    gsap.utils.toArray<HTMLElement>('.reveal').forEach(el => {
      gsap.from(el, {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });

    gsap.utils.toArray<HTMLElement>('.reveal-left').forEach(el => {
      gsap.from(el, {
        opacity: 0,
        x: -60,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });

    gsap.utils.toArray<HTMLElement>('.reveal-right').forEach(el => {
      gsap.from(el, {
        opacity: 0,
        x: 60,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });
  }

  private initJobCards() {
    gsap.from('.job-card', {
      opacity: 0,
      y: 40,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.jobs-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  }

  private initTimelineAnimation() {
    gsap.utils.toArray<HTMLElement>('.milestone-card').forEach((el, i) => {
      gsap.from(el, {
        opacity: 0,
        x: i % 2 === 0 ? -50 : 50,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });

    gsap.from('.timeline-line-progress', {
      scaleY: 0,
      duration: 1.5,
      ease: 'power2.inOut',
      transformOrigin: 'top center',
      scrollTrigger: {
        trigger: '.timeline',
        start: 'top 70%',
        end: 'bottom 20%',
        scrub: 1
      }
    });
  }

  setFilter(filter: string) {
    this.activeFilter.set(filter);
    setTimeout(() => this.initJobCards(), 100);
  }

  openJobDetail(job: JobListing) {
    this.selectedJob = job;
    document.body.style.overflow = 'hidden';
  }

  closeJobDetail() {
    this.selectedJob = null;
    document.body.style.overflow = '';
  }

  applyToJob() {
    this.showApplicationForm = true;
  }

  closeApplication() {
    this.showApplicationForm = false;
  }
}
