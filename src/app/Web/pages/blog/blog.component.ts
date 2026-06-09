import { Component, inject, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageDataService, PageContent } from '../../services/page-data.service';
import { WebGsapService } from '../../services/web-gsap.service';
import { AnimatedBgComponent } from '../../components/animated-bg/animated-bg.component';

interface ArticleItem { id: string; title: string; excerpt: string; author: string; date: string; category: string; }

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterModule, AnimatedBgComponent],
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
      <div class="section-header fade-up">
        <span class="section-tag">{{ articlesTag }}</span>
        <h2 class="section-title">{{ articlesTitle }}</h2>
        <p class="section-desc">{{ articlesDesc }}</p>
      </div>
      <div class="filter-bar fade-up">
        <button class="filter-btn active">All</button>
        @for (cat of categories; track cat) {
          <button class="filter-btn">{{ cat }}</button>
        }
      </div>
      <div class="blog-grid">
        @for (post of posts; track post.id) {
          <article class="blog-card fade-up">
            <div class="blog-thumb"><i class="fas fa-file-lines"></i></div>
            <div class="blog-body">
              <span class="blog-cat">{{ post.category }}</span>
              <h3>{{ post.title }}</h3>
              <p>{{ post.excerpt }}</p>
              <div class="blog-meta">
                <span><i class="fas fa-user"></i> {{ post.author }}</span>
                <span><i class="fas fa-calendar"></i> {{ post.date }}</span>
              </div>
            </div>
          </article>
        }
      </div>
    </section>

    <section class="section">
      <div class="newsletter-wrap fade-up">
        <div class="newsletter-content">
          <h2>{{ newsletterTitle }}</h2>
          <p>{{ newsletterDesc }}</p>
          <form class="newsletter-form">
            <input type="email" placeholder="your@email.com">
            <button type="submit" class="btn btn-primary">{{ newsletterBtn }} <i class="fas fa-arrow-right"></i></button>
          </form>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .section { padding: 6rem 2rem; }
    .section-alt { background: #0c0c18; }
    .section-header { text-align: center; margin-bottom: 3rem; }
    .section-tag {
      display: inline-flex; align-items: center; gap: 0.4rem;
      font-size: 0.7rem; font-weight: 700; letter-spacing: 0.15em;
      text-transform: uppercase; color: #00c896;
      padding: 0.35rem 1rem;
      border: 1px solid rgba(0,200,150,0.1);
      border-radius: 100px; margin-bottom: 1rem;
      background: rgba(0,200,150,0.02);
    }
    .section-title {
      font-size: clamp(1.8rem, 4vw, 2.8rem);
      font-weight: 700; color: #fff; margin-bottom: 0.75rem; line-height: 1.15;
    }
    .section-desc {
      font-size: clamp(0.85rem, 1.2vw, 1rem);
      color: rgba(255,255,255,0.4);
      max-width: 520px; margin: 0 auto; line-height: 1.7;
    }
    .btn {
      display: inline-flex; align-items: center; gap: 0.5rem;
      padding: 0.85rem 2rem; border-radius: 50px;
      text-decoration: none; font-weight: 600;
      font-size: 0.88rem; cursor: pointer; font-family: inherit;
      transition: transform 0.3s, box-shadow 0.3s; border: none;
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

    .filter-bar {
      display: flex; gap: 0.75rem; justify-content: center;
      margin-bottom: 3rem; flex-wrap: wrap;
    }
    .filter-btn {
      padding: 0.6rem 1.4rem; background: transparent;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 50px; color: rgba(255,255,255,0.5);
      font-size: 0.8rem; font-weight: 500; cursor: pointer; font-family: inherit;
      transition: all 0.3s;
    }
    .filter-btn.active, .filter-btn:hover {
      background: rgba(0,200,150,0.08);
      border-color: rgba(0,200,150,0.15);
      color: #00c896;
    }

    .blog-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem; max-width: 1200px; margin: 0 auto;
    }
    .blog-card {
      background: rgba(255,255,255,0.012);
      border: 1px solid rgba(255,255,255,0.04);
      border-radius: 18px; overflow: hidden;
      transition: border-color 0.3s, transform 0.3s;
    }
    .blog-card:hover { border-color: rgba(0,200,150,0.1); transform: translateY(-4px); }
    .blog-thumb {
      aspect-ratio: 16/9;
      background: linear-gradient(135deg, #12121e, #16162a);
      display: flex; align-items: center; justify-content: center;
    }
    .blog-thumb i { font-size: 2rem; color: rgba(255,255,255,0.03); }
    .blog-body { padding: 1.5rem; }
    .blog-cat {
      font-size: 0.7rem; font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.1em; color: #00c896;
    }
    .blog-body h3 {
      font-size: 1.05rem; font-weight: 600; color: #fff;
      margin: 0.5rem 0 0.5rem; line-height: 1.3;
    }
    .blog-body p { font-size: 0.82rem; color: rgba(255,255,255,0.4); line-height: 1.6; margin-bottom: 1rem; }
    .blog-meta {
      display: flex; gap: 1.5rem;
      font-size: 0.75rem; color: rgba(255,255,255,0.25);
    }
    .blog-meta i { font-size: 0.65rem; margin-right: 0.3rem; }

    .newsletter-wrap {
      max-width: 600px; margin: 0 auto;
      background: rgba(255,255,255,0.012);
      border: 1px solid rgba(255,255,255,0.04);
      border-radius: 18px; padding: 3rem;
      text-align: center;
    }
    .newsletter-content h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.75rem; }
    .newsletter-content p { color: rgba(255,255,255,0.4); margin-bottom: 1.5rem; font-size: 0.9rem; }
    .newsletter-form { display: flex; gap: 0.75rem; max-width: 450px; margin: 0 auto; }
    .newsletter-form input {
      flex: 1; padding: 0.85rem 1.2rem;
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 50px;
      color: #fff; font-family: inherit; font-size: 0.85rem;
      outline: none;
    }
    .newsletter-form input::placeholder { color: rgba(255,255,255,0.15); }

    @media (max-width: 768px) {
      .section { padding: 5rem 1.5rem; }
      .newsletter-form { flex-direction: column; }
      .newsletter-wrap { padding: 2rem 1.5rem; }
    }
  `]
})
export class BlogComponent implements OnInit, AfterViewInit, OnDestroy {
  private pageDataService = inject(PageDataService);
  private webGsapService = inject(WebGsapService);

  tag = 'Insights';
  title = 'Blog';
  subtitle = 'Fresh perspectives from our experts on technology and business.';

  articlesTag = 'Latest';
  articlesTitle = 'Articles & Insights';
  articlesDesc = 'Stay updated with the latest industry trends and best practices.';

  categories = ['Technology', 'Design', 'AI', 'Cloud'];
  posts: ArticleItem[] = [
    { id: '1', title: 'The Future of AI in Enterprise Software', excerpt: 'How artificial intelligence is reshaping enterprise applications and what it means for your business.', author: 'Arjun Mehta', date: 'Jun 2, 2026', category: 'AI' },
    { id: '2', title: 'Designing for Scalable Systems', excerpt: 'Best practices for building web applications that grow with your user base without breaking.', author: 'Priya Sharma', date: 'May 28, 2026', category: 'Technology' },
    { id: '3', title: 'Cloud Migration Strategy Guide', excerpt: 'A practical framework for moving your infrastructure to the cloud with minimal disruption.', author: 'Vikram Singh', date: 'May 20, 2026', category: 'Cloud' },
    { id: '4', title: 'UX Principles for Enterprise Apps', excerpt: 'Why user experience matters more than ever in enterprise software and how to get it right.', author: 'Neha Patel', date: 'May 12, 2026', category: 'Design' },
    { id: '5', title: 'Building Resilient Data Pipelines', excerpt: 'Architecture patterns for reliable real-time data processing at scale.', author: 'Arjun Mehta', date: 'May 5, 2026', category: 'Technology' },
    { id: '6', title: 'The Rise of GenAI in Product Engineering', excerpt: 'How generative AI is transforming the way we build and ship software products.', author: 'Priya Sharma', date: 'Apr 28, 2026', category: 'AI' },
  ];

  newsletterTitle = 'Subscribe to Our Newsletter';
  newsletterDesc = 'Get the latest insights delivered straight to your inbox.';
  newsletterBtn = 'Subscribe';

  ngOnInit() {
    this.pageDataService.getPageContent('blog').subscribe(data => {
      if (data) console.log('Blog data:', data);
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
      this.webGsapService.applyAnimations('webblog', document.querySelector('.page-hero') as HTMLElement);
    }, 100);
  }

  ngOnDestroy() {
    ScrollTrigger.getAll().forEach(t => t.kill());
    gsap.killTweensOf('*');
  }
}
