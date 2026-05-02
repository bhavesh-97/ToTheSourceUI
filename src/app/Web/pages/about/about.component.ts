import { Component, inject, OnInit, AfterViewInit, ElementRef, ViewChild, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageDataService, PageContent } from '../../services/page-data.service';
import { WebGsapService } from '../../services/web-gsap.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="about-hero">
      <div class="container">
        <h1>About Us</h1>
        <p>Learn more about our journey and mission</p>
      </div>
    </section>

    <section class="about-story">
      <div class="container">
        <div class="story-content">
          <h2>Our Story</h2>
          <p>{{ storyContent }}</p>
        </div>
        <div class="story-image"></div>
      </div>
    </section>

    <section class="values-section">
      <div class="container">
        <h2>Our Values</h2>
        <div class="values-grid">
          @for (value of values; track value.title) {
            <div class="value-card">
              <h3>{{ value.title }}</h3>
              <p>{{ value.description }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <section class="team-section">
      <div class="container">
        <h2>Our Team</h2>
        <div class="team-grid">
          @for (member of team; track member.name) {
            <div class="team-card">
              <div class="member-image"></div>
              <h3>{{ member.name }}</h3>
              <p>{{ member.role }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .about-hero { padding: 8rem 2rem 4rem; text-align: center; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); }
    .about-hero h1 { font-size: clamp(2.5rem, 6vw, 4rem); margin-bottom: 1rem; }
    .about-hero p { font-size: 1.25rem; color: rgba(255,255,255,0.7); }
    .about-story { padding: 6rem 2rem; background: #0f0f1a; }
    .container { max-width: 1200px; margin: 0 auto; }
    .story-content { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
    .story-content h2 { margin-bottom: 1.5rem; }
    .story-content p { color: rgba(255,255,255,0.8); line-height: 1.8; }
    .story-image { aspect-ratio: 4/3; background: linear-gradient(135deg, #e94560 0%, #0f3460 100%); border-radius: 16px; }
    .values-section { padding: 6rem 2rem; background: #0a0a14; }
    .values-section h2 { text-align: center; margin-bottom: 3rem; font-size: 2.5rem; }
    .values-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; }
    .value-card { background: rgba(255,255,255,0.05); padding: 2rem; border-radius: 16px; }
    .value-card h3 { color: #e94560; margin-bottom: 1rem; }
    .value-card p { color: rgba(255,255,255,0.7); }
    .team-section { padding: 6rem 2rem; background: #0f0f1a; }
    .team-section h2 { text-align: center; margin-bottom: 3rem; font-size: 2.5rem; }
    .team-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; }
    .team-card { text-align: center; }
    .member-image { aspect-ratio: 1; background: linear-gradient(135deg, #333 0%, #555 100%); border-radius: 50%; margin-bottom: 1rem; }
    .team-card h3 { margin-bottom: 0.5rem; }
    .team-card p { color: #e94560; }
    @media (max-width: 768px) { .story-content { grid-template-columns: 1fr; } }
  `]
})
export class AboutComponent implements OnInit, AfterViewInit, OnDestroy {
  private pageDataService = inject(PageDataService);
  private webGsapService = inject(WebGsapService);

  storyContent = 'Founded with a vision to transform digital experiences, we have grown from a small team to a full-service agency.';
  values = [
    { title: 'Excellence', description: 'We strive for excellence in every project' },
    { title: 'Integrity', description: 'Honest, transparent relationships' },
    { title: 'Innovation', description: 'Constantly pushing boundaries' }
  ];
  team = [
    { name: 'John Doe', role: 'CEO & Founder' },
    { name: 'Jane Smith', role: 'Creative Director' },
    { name: 'Mike Johnson', role: 'Technical Lead' },
    { name: 'Sarah Williams', role: 'Project Manager' }
  ];

  ngOnInit() {
    this.pageDataService.getAboutContent().subscribe(data => {
      if (data) {
        const story = data.sections.find(s => s.sectionKey === 'story');
        if (story) this.storyContent = story.content;
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.webGsapService.applyAnimations('about', document.querySelector('.about-hero') as HTMLElement), 100);
  }

  ngOnDestroy() {
    this.webGsapService.killAll();
  }
}