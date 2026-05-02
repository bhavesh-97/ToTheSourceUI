import { Component, inject, OnInit, AfterViewInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { WebGsapService } from '../../services/web-gsap.service';

interface Template {
  id: string;
  name: string;
  type: string;
  html: string;
  preview: string;
}

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="templates-hero">
      <div class="container">
        <h1>Website Templates</h1>
        <p>Ready-to-use website templates</p>
      </div>
    </section>

    <section class="templates-content">
      <div class="container">
        <div class="templates-filter">
          <button class="filter-btn active">All</button>
          <button class="filter-btn">Landing</button>
          <button class="filter-btn">Business</button>
          <button class="filter-btn">Portfolio</button>
        </div>

        <div class="templates-grid">
          @for (template of templates; track template.id) {
            <div class="template-card" (click)="previewTemplate(template)">
              <div class="template-preview">
                <div [innerHTML]="template.preview"></div>
              </div>
              <div class="template-info">
                <h3>{{ template.name }}</h3>
                <span>{{ template.type }}</span>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    @if (selectedTemplate) {
      <div class="template-modal" (click)="closePreview()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <button class="close-btn" (click)="closePreview()">&times;</button>
          <h2>{{ selectedTemplate.name }}</h2>
          <div class="template-frame" [innerHTML]="selectedTemplate.html"></div>
        </div>
      </div>
    }
  `,
  styles: [`
    .templates-hero { padding: 8rem 2rem 4rem; text-align: center; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); }
    .templates-hero h1 { font-size: clamp(2.5rem, 6vw, 4rem); margin-bottom: 1rem; }
    .templates-hero p { font-size: 1.25rem; color: rgba(255,255,255,0.7); }
    .templates-content { padding: 6rem 2rem; background: #0f0f1a; }
    .container { max-width: 1200px; margin: 0 auto; }
    .templates-filter { display: flex; gap: 1rem; justify-content: center; margin-bottom: 3rem; flex-wrap: wrap; }
    .filter-btn { padding: 0.75rem 1.5rem; background: transparent; border: 1px solid rgba(255,255,255,0.3); border-radius: 50px; color: white; cursor: pointer; transition: all 0.3s; }
    .filter-btn.active, .filter-btn:hover { background: #e94560; border-color: #e94560; }
    .templates-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem; }
    .template-card { background: rgba(255,255,255,0.05); border-radius: 16px; overflow: hidden; cursor: pointer; transition: transform 0.3s; }
    .template-card:hover { transform: translateY(-5px); }
    .template-preview { aspect-ratio: 16/10; background: #1a1a2e; display: flex; justify-content: center; align-items: center; }
    .template-preview .preview-box { width: 80%; height: 80%; background: linear-gradient(135deg, #333 0%, #444 100%); border-radius: 8px; }
    .template-info { padding: 1rem; }
    .template-info h3 { margin-bottom: 0.25rem; }
    .template-info span { color: #e94560; font-size: 0.875rem; }
    .template-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 1000; display: flex; justify-content: center; align-items: center; padding: 2rem; }
    .modal-content { background: #0f0f1a; border-radius: 16px; padding: 2rem; max-width: 90vw; max-height: 90vh; overflow: auto; position: relative; }
    .close-btn { position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: white; font-size: 2rem; cursor: pointer; }
    .template-frame { margin-top: 1rem; padding: 2rem; background: #1a1a2e; border-radius: 8px; min-height: 300px; }
  `]
})
export class TemplatesComponent implements OnInit, AfterViewInit, OnDestroy {
  private webGsapService = inject(WebGsapService);
  private sanitizer = inject(DomSanitizer);

  templates: Template[] = [
    { id: '1', name: 'Modern Hero', type: 'Landing', html: '<div class="hero"><h1>Hero Section</h1><p>Call to action</p></div>', preview: '<div class="preview-box"></div>' },
    { id: '2', name: 'Business Pro', type: 'Business', html: '<div class="business"><h2>About Us</h2><p>Company info</p></div>', preview: '<div class="preview-box"></div>' },
    { id: '3', name: 'Creative Portfolio', type: 'Portfolio', html: '<div class="portfolio"><h2>Work</h2><p>Projects</p></div>', preview: '<div class="preview-box"></div>' },
    { id: '4', name: 'E-Commerce', type: 'Business', html: '<div class="shop"><h2>Products</h2><p>Shop</p></div>', preview: '<div class="preview-box"></div>' },
    { id: '5', name: 'Blog Standard', type: 'Content', html: '<div class="blog"><h2>Latest Posts</h2><p>Articles</p></div>', preview: '<div class="preview-box"></div>' },
    { id: '6', name: 'Startup Landing', type: 'Landing', html: '<div class="startup"><h1>Startup</h1><p>Grow with us</p></div>', preview: '<div class="preview-box"></div>' }
  ];

  selectedTemplate: Template | null = null;

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => this.webGsapService.applyAnimations('template', document.querySelector('.templates-hero') as HTMLElement), 100);
  }

  ngOnDestroy() {
    this.webGsapService.killAll();
  }

  previewTemplate(template: Template) {
    this.selectedTemplate = template;
  }

  closePreview() {
    this.selectedTemplate = null;
  }
}