import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DynamicPageService, DynamicPageConfig, DynamicPageSection } from '../../services/dynamic-page.service';
import { TemplatePlaceholder } from '../../../shared/template-placeholder/template-placeholder';
import { WebGsapService } from '../../services/web-gsap.service';
import { CodeSanitizer } from '../../../shared/utilities/code-sanitizer';

@Component({
  selector: 'app-dynamic-page',
  standalone: true,
  imports: [CommonModule, TemplatePlaceholder],
  template: `
    @if (isLoading()) {
      <!-- Skeleton Loading -->
      <div class="skeleton-page">
        <div class="skeleton-hero">
          <div class="skeleton-container">
            <div class="skeleton-badge skeleton-pulse"></div>
            <div class="skeleton-title skeleton-pulse"></div>
            <div class="skeleton-subtitle skeleton-pulse"></div>
            <div class="skeleton-buttons">
              <div class="skeleton-btn skeleton-pulse"></div>
              <div class="skeleton-btn skeleton-pulse"></div>
            </div>
          </div>
        </div>
        @for (i of [1, 2, 3]; track i) {
          <div class="skeleton-section">
            <div class="skeleton-container">
              <div class="skeleton-section-header skeleton-pulse"></div>
              <div class="skeleton-section-subheader skeleton-pulse"></div>
              <div class="skeleton-grid">
                @for (j of [1, 2, 3]; track j) {
                  <div class="skeleton-card">
                    <div class="skeleton-card-icon skeleton-pulse"></div>
                    <div class="skeleton-card-title skeleton-pulse"></div>
                    <div class="skeleton-card-text skeleton-pulse"></div>
                    <div class="skeleton-card-text skeleton-pulse short"></div>
                  </div>
                }
              </div>
            </div>
          </div>
        }
      </div>
    } @else if (pageConfig()) {
      <!-- Dynamic Page Content -->
      <div class="dynamic-page"
           [class]="'page-' + pageConfig()!.pageKey"
           [class.page-loaded]="isReady()">

        @if (sanitizedStyles()) {
          <style [innerHTML]="sanitizedStyles()"></style>
        }

        @for (section of enabledSections(); track section.sectionkey; let i = $index) {
          <section
            class="dynamic-section"
            [class]="getSectionClasses(section)"
            [class.section-visible]="sectionVisible()[i]"
            [attr.data-section-key]="section.sectionkey"
            [attr.data-section-type]="section.sectionWidth || 'full'"
            [style.padding-top]="section.paddingTop || null"
            [style.padding-bottom]="section.paddingBottom || null"
            [style.animation-delay]="(section.animationDelay || 0) + 'ms'">

            @if (section.sectionBackground === 'alternate') {
              <div class="section-bg-alt"></div>
            }

            <div [class]="getSectionContainerClass(section)">
              <app-template-placeholder
                [templateType]="section.templateCode || ''"
                [templateCode]="section.templateCode || ''"
                [fallbackContent]="section.fallbackHtml || ''"
                [gsapPageKey]="section.gsapPageKey || pageConfig()!.pageKey">
              </app-template-placeholder>
            </div>

            @if (section.customStyles) {
              <style [innerHTML]="getSafeSectionStyle(section)"></style>
            }
          </section>
        }

        @if (sanitizedScripts()) {
          <div [innerHTML]="sanitizedScripts()"></div>
        }
      </div>
    }
  `,
  styles: [`
    @import '../../../shared/styles/datatable.scss';

    :host { display: block; }

    /* ═══ SKELETON LOADING ═══ */
    .skeleton-page { background: #08080f; min-height: 100vh; }

    .skeleton-hero {
      min-height: 70vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .skeleton-container {
      max-width: 1100px;
      width: 100%;
      margin: 0 auto;
    }

    .skeleton-pulse {
      background: linear-gradient(
        90deg,
        rgba(255,255,255,0.03) 25%,
        rgba(255,255,255,0.06) 50%,
        rgba(255,255,255,0.03) 75%
      );
      background-size: 200% 100%;
      animation: shimmer 1.8s ease-in-out infinite;
      border-radius: 8px;
    }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    .skeleton-badge {
      width: 180px;
      height: 32px;
      margin: 0 auto 2rem;
      border-radius: 100px;
    }

    .skeleton-title {
      width: 60%;
      max-width: 500px;
      height: clamp(40px, 8vw, 72px);
      margin: 0 auto 1.5rem;
    }

    .skeleton-subtitle {
      width: 45%;
      max-width: 400px;
      height: 20px;
      margin: 0 auto 3rem;
    }

    .skeleton-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .skeleton-btn {
      width: 160px;
      height: 48px;
      border-radius: 50px;
    }

    .skeleton-section {
      padding: 6rem 2rem;
    }

    .skeleton-section-header {
      width: 35%;
      max-width: 300px;
      height: 36px;
      margin: 0 auto 1rem;
    }

    .skeleton-section-subheader {
      width: 50%;
      max-width: 400px;
      height: 16px;
      margin: 0 auto 3rem;
    }

    .skeleton-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }

    .skeleton-card {
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.04);
      border-radius: 16px;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .skeleton-card-icon {
      width: 56px;
      height: 56px;
      border-radius: 16px;
    }

    .skeleton-card-title {
      width: 60%;
      height: 20px;
    }

    .skeleton-card-text {
      width: 90%;
      height: 14px;
    }

    .skeleton-card-text.short {
      width: 60%;
    }

    @media (max-width: 768px) {
      .skeleton-grid { grid-template-columns: 1fr; max-width: 400px; margin: 0 auto; }
    }

    /* ═══ DYNAMIC PAGE ═══ */
    .dynamic-page {
      background: #08080f;
      opacity: 0;
      transition: opacity 0.4s ease;
    }
    .dynamic-page.page-loaded {
      opacity: 1;
    }

    .dynamic-section {
      position: relative;
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .dynamic-section.section-visible {
      opacity: 1;
      transform: translateY(0);
    }

    .section-bg-alt {
      position: absolute;
      inset: 0;
      background: rgba(255,255,255,0.015);
      pointer-events: none;
    }

    .section-container-full {
      width: 100%;
    }
    .section-container-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }
    .section-container-narrow {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    ::ng-deep .dynamic-section .loading-placeholder,
    ::ng-deep .dynamic-section .error-placeholder {
      display: none;
    }

    @media (max-width: 768px) {
      .section-container-container,
      .section-container-narrow {
        padding: 0 1rem;
      }
    }
  `]
})
export class DynamicPageComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private dynamicPageService = inject(DynamicPageService);
  private webGsapService = inject(WebGsapService);
  private sanitizer = inject(DomSanitizer);

  isLoading = signal(true);
  isReady = signal(false);
  pageConfig = signal<DynamicPageConfig | null>(null);
  enabledSections = signal<DynamicPageSection[]>([]);
  sectionVisible = signal<boolean[]>([]);

  sanitizedStyles = computed<SafeHtml | null>(() => {
    const config = this.pageConfig();
    if (!config?.customStyles) return null;
    return this.sanitizer.bypassSecurityTrustHtml(
      `<style>${config.customStyles}</style>`
    );
  });

  sanitizedScripts = computed<SafeHtml | null>(() => {
    const config = this.pageConfig();
    if (!config?.customScripts) return null;
    return this.sanitizer.bypassSecurityTrustHtml(config.customScripts);
  });

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    debugger;
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      debugger;
      const slug = params.get('slug') || params.get('pageKey') || params.get('page') || '';
      if (slug) {
        this.loadPage(slug);
      } else {
        this.showError('404', 'Page Not Found', 'No page specified in the URL.');
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.webGsapService.killAll();
  }

  getSectionClasses(section: DynamicPageSection): string {
    const classes = [section.customClass || ''];
    if (section.sectionBackground === 'alternate') classes.push('section-alt');
    return classes.join(' ');
  }

  getSectionContainerClass(section: DynamicPageSection): string {
    const width = section.sectionWidth || 'full';
    return `section-container-${width}`;
  }

  getSafeSectionStyle(section: DynamicPageSection): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      `<style>${section.customStyles}</style>`
    );
  }

  private loadPage(pageKey: string): void {
    this.isLoading.set(true);
    this.isReady.set(false);

    this.dynamicPageService.getPageConfig(pageKey).pipe(takeUntil(this.destroy$)).subscribe({
      next: (config) => {
        if (config) {
          this.pageConfig.set(config);
          const enabled = config.sections.filter(s => s.enabled);
          this.enabledSections.set(enabled);
          this.sectionVisible.set(new Array(enabled.length).fill(false));
          this.applyMetaTags(config);
          this.isLoading.set(false);

          requestAnimationFrame(() => {
            this.isReady.set(true);
            this.revealSections();
            setTimeout(() => this.applyGsapAnimations(), 200);
          });
        } else {
          this.showError('404', 'Page Not Found', `The page "${pageKey}" could not be loaded.`);
        }
      },
      error: (err) => {
        this.showError('500', 'Something Went Wrong', 'An unexpected error occurred. Please try again later.');
      }
    });
  }

  private showError(code: string, title: string, message: string): void {
    this.isLoading.set(false);
    this.router.navigate(['/not-found']);
  }

  private revealSections(): void {
    const visible = this.sectionVisible();
    visible.forEach((_, i) => {
      setTimeout(() => {
        const arr = [...this.sectionVisible()];
        arr[i] = true;
        this.sectionVisible.set(arr);
      }, 100 + i * 150);
    });
  }

  private applyMetaTags(config: DynamicPageConfig): void {
    this.titleService.setTitle(config.metaTitle || config.title);
    this.metaService.updateTag({ name: 'description', content: config.metaDescription || '' });

    if (config.metaKeywords) {
      this.metaService.updateTag({ name: 'keywords', content: config.metaKeywords });
    }

    if (config.canonicalUrl) {
      const existingLink = document.querySelector("link[rel='canonical']");
      if (existingLink) {
        existingLink.setAttribute('href', config.canonicalUrl);
      } else {
        const link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        link.setAttribute('href', config.canonicalUrl);
        document.head.appendChild(link);
      }
    }

    if (config.noIndex) {
      this.metaService.updateTag({ name: 'robots', content: 'noindex, nofollow' });
    } else {
      this.metaService.updateTag({ name: 'robots', content: 'index, follow' });
    }

    if (config.ogImage) {
      this.metaService.updateTag({ property: 'og:title', content: config.metaTitle || config.title });
      this.metaService.updateTag({ property: 'og:description', content: config.metaDescription || '' });
      this.metaService.updateTag({ property: 'og:image', content: config.ogImage });
      this.metaService.updateTag({ property: 'og:type', content: 'website' });
    }
  }

  private applyGsapAnimations(): void {
    const container = document.querySelector('.dynamic-page') as HTMLElement;
    if (container && this.pageConfig()) {
      const pageKey = this.pageConfig()!.pageKey;
      this.webGsapService.applyAnimations(pageKey, container);

      this.enabledSections().forEach(section => {
        if (section.gsapPageKey && section.gsapPageKey !== pageKey) {
          const sectionEl = container.querySelector(`[data-section-key="${section.sectionkey}"]`) as HTMLElement;
          if (sectionEl) {
            this.webGsapService.applyAnimations(section.gsapPageKey, sectionEl);
          }
        }
      });
    }
  }
}
