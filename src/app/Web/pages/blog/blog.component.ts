import { Component, inject, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageDataService, PageContent } from '../../services/page-data.service';
import { WebGsapService } from '../../services/web-gsap.service';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="blog-hero">
      <div class="container">
        <h1>Blog</h1>
        <p>Latest insights and updates from our team</p>
      </div>
    </section>

    <section class="blog-content">
      <div class="container">
        <div class="blog-filters">
          <button class="filter-btn active">All</button>
          <button class="filter-btn">Technology</button>
          <button class="filter-btn">Design</button>
          <button class="filter-btn">Business</button>
        </div>

        <div class="blog-grid">
          @for (post of posts; track post.id) {
            <article class="blog-card">
              <div class="blog-image"></div>
              <div class="blog-body">
                <span class="blog-category">{{ post.category }}</span>
                <h3>{{ post.title }}</h3>
                <p>{{ post.excerpt }}</p>
                <div class="blog-meta">
                  <span>{{ post.author }}</span>
                  <span>{{ post.date }}</span>
                </div>
              </div>
            </article>
          }
        </div>
      </div>
    </section>

    <section class="newsletter-section">
      <div class="container">
        <h2>Subscribe to Our Newsletter</h2>
        <p>Get the latest updates delivered to your inbox.</p>
        <form class="newsletter-form">
          <input type="email" placeholder="Enter your email" />
          <button type="submit">Subscribe</button>
        </form>
      </div>
    </section>
  `,
  styles: [`
    .blog-hero { padding: 8rem 2rem 4rem; text-align: center; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); }
    .blog-hero h1 { font-size: clamp(2.5rem, 6vw, 4rem); margin-bottom: 1rem; }
    .blog-hero p { font-size: 1.25rem; color: rgba(255,255,255,0.7); }
    .blog-content { padding: 6rem 2rem; background: #0f0f1a; }
    .container { max-width: 1200px; margin: 0 auto; }
    .blog-filters { display: flex; gap: 1rem; justify-content: center; margin-bottom: 3rem; flex-wrap: wrap; }
    .filter-btn { padding: 0.75rem 1.5rem; background: transparent; border: 1px solid rgba(255,255,255,0.3); border-radius: 50px; color: white; cursor: pointer; transition: all 0.3s; }
    .filter-btn.active, .filter-btn:hover { background: #e94560; border-color: #e94560; }
    .blog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem; }
    .blog-card { background: rgba(255,255,255,0.05); border-radius: 16px; overflow: hidden; transition: transform 0.3s; }
    .blog-card:hover { transform: translateY(-5px); }
    .blog-image { aspect-ratio: 16/9; background: linear-gradient(135deg, #333 0%, #555 100%); }
    .blog-body { padding: 1.5rem; }
    .blog-category { color: #e94560; font-size: 0.875rem; font-weight: 600; text-transform: uppercase; }
    .blog-card h3 { margin: 0.5rem 0 1rem; font-size: 1.25rem; }
    .blog-card p { color: rgba(255,255,255,0.7); line-height: 1.6; margin-bottom: 1rem; }
    .blog-meta { display: flex; justify-content: space-between; font-size: 0.875rem; color: rgba(255,255,255,0.5); }
    .newsletter-section { padding: 6rem 2rem; text-align: center; background: linear-gradient(135deg, #e94560 0%, #0f3460 100%); }
    .newsletter-section h2 { font-size: 2rem; margin-bottom: 1rem; }
    .newsletter-section p { margin-bottom: 2rem; }
    .newsletter-form { display: flex; gap: 1rem; justify-content: center; max-width: 500px; margin: 0 auto; }
    .newsletter-form input { flex: 1; padding: 1rem 1.5rem; background: rgba(255,255,255,0.1); border: none; border-radius: 8px; color: white; }
    .newsletter-form button { padding: 1rem 2rem; background: white; color: #e94560; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
    @media (max-width: 768px) { .newsletter-form { flex-direction: column; } }
  `]
})
export class BlogComponent implements OnInit, AfterViewInit, OnDestroy {
  private pageDataService = inject(PageDataService);
  private webGsapService = inject(WebGsapService);

  posts: BlogPost[] = [
    { id: '1', title: 'The Future of Web Development', excerpt: 'Exploring the latest trends and technologies shaping the web.', content: '', image: '', author: 'John Doe', date: 'Jan 15, 2026', category: 'Technology' },
    { id: '2', title: 'Designing for User Experience', excerpt: 'Best practices for creating intuitive user interfaces.', content: '', image: '', author: 'Jane Smith', date: 'Jan 10, 2026', category: 'Design' },
    { id: '3', title: 'Growing Your Digital Presence', excerpt: 'Strategies for expanding your online business reach.', content: '', image: '', author: 'Mike Johnson', date: 'Jan 5, 2026', category: 'Business' },
    { id: '4', title: 'AI in Modern Applications', excerpt: 'How artificial intelligence is transforming app development.', content: '', image: '', author: 'Sarah Williams', date: 'Dec 28, 2025', category: 'Technology' },
    { id: '5', title: 'Mobile-First Design Principles', excerpt: 'Why mobile-first approach matters in 2026.', content: '', image: '', author: 'John Doe', date: 'Dec 20, 2025', category: 'Design' },
    { id: '6', title: 'Building Scalable Systems', excerpt: 'Architecture patterns for growing applications.', content: '', image: '', author: 'Jane Smith', date: 'Dec 15, 2025', category: 'Technology' }
  ];

  ngOnInit() {
    this.pageDataService.getPageContent('blog').subscribe(data => {
      if (data) console.log('Blog data:', data);
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.webGsapService.applyAnimations('webblog', document.querySelector('.blog-hero') as HTMLElement), 100);
  }

  ngOnDestroy() {
    this.webGsapService.killAll();
  }
}