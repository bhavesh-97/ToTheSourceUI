import { Component,OnInit,OnDestroy,inject,signal,computed,} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TemplatePlaceholder } from '../../../shared/template-placeholder/template-placeholder';
import { WebGsapService } from '../../services/web-gsap.service';
import { TemplateMasterService } from '../../../CMS/main/template-master/template-master.service';
import { DynamicPageConfig, DynamicPageSection, DynamicPageService } from './dynamic-page.service';
import { CMSRoutes } from '../../../CMS/CMS.routes';
import { WebRoutes } from '../../Web.routes';

@Component({
  selector: 'app-dynamic-page',
  standalone: true,
  imports: [CommonModule, TemplatePlaceholder],
  templateUrl: './dynamic-page.component.html',
  styleUrls: ['./dynamic-page.component.scss'],
})
export class DynamicPageComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private dynamicPageService = inject(DynamicPageService);
  private webGsapService = inject(WebGsapService);
  private sanitizer = inject(DomSanitizer);
  private templateMasterService = inject(TemplateMasterService);

  isLoading = signal(true);
  isReady = signal(false);
  pageConfig = signal<DynamicPageConfig | null>(null);
  enabledSections = signal<DynamicPageSection[]>([]);
  sectionVisible = signal<boolean[]>([]);

  private templateTypeMap = signal<Map<number, string>>(new Map());

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
  private knownRoutes: Set<string> | null = null;

  ngOnInit(): void {
    this.templateMasterService.GetTemplateTypes().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (!res.isError) {
          const types = typeof res.result === 'string' ? JSON.parse(res.result) : res.result;
          if (Array.isArray(types)) {
            const map = new Map<number, string>();
            types.forEach((t: any) => {
              map.set(t.templateTypeID, t.templateTypeName);
            });
            this.templateTypeMap.set(map);
          }
        }
      },
      error: () => {}
    });

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const slug = params.get('slug') || params.get('pageKey') || params.get('page') || '';
      if (slug) {
        if (this.isKnownRoute(slug)) {
          this.router.navigate([slug]);
        } else {
          this.loadPage(slug);
        }
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

  private buildKnownRoutes(): Set<string> {
    const knownRoutes = new Set<string>();

    const traverse = (routes: Routes, prefix: string) => {
      for (const route of routes) {
        if (route.path !== undefined && !route.path.includes(':') && route.path !== '**') {
          const routePath = prefix ? `${prefix}/${route.path}` : route.path;
          knownRoutes.add(routePath);
          if (route.children) {
            traverse(route.children, routePath);
          }
        }
      }
    };

    traverse(WebRoutes, '');
    traverse(CMSRoutes, 'CMS');

    return knownRoutes;
  }

  private isKnownRoute(path: string): boolean {
    if (!this.knownRoutes) {
      this.knownRoutes = this.buildKnownRoutes();
    }
    const segments = path.split('/').filter(s => s);
    const fullPath = segments.join('/');
    return this.knownRoutes.has(fullPath);
  }

  getTemplateTypeName(templateType: number | null | undefined): string {
    if (!templateType) return '';
    return this.templateTypeMap().get(templateType) || '';
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
