import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { LoaderService } from '../app/services/loader.service';
import { AsyncPipe } from '@angular/common';
import { AnalyticsService, SeoService } from './@core/utils';
import { NbSidebarService } from '@nebular/theme';
import { filter } from 'rxjs';
import { GsapService } from './services/gsap.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,ButtonModule,AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  protected readonly title = signal('ToTheSourceUI');
  public LoaderService = inject(LoaderService);
  loading$ = this.LoaderService.loading$;
  private cdr = inject(ChangeDetectorRef);
  private sidebarService = inject(NbSidebarService);
  private router = inject(Router);
  private analytics = inject(AnalyticsService);
  private seoService = inject(SeoService);
  // private gsapService = inject(GsapService);
  constructor(private gsap: GsapService) {}
  ngOnInit(): void {
    // Call setFavicon on initialization
    this.setFavicon('../assets/images/product/Tothesourceicon.png','64x64');
    this.analytics.trackPageViews();
    this.seoService.trackCanonicalChanges();

    this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))  
        .subscribe((event: NavigationEnd) => {
          this.sidebarService.toggle(true, 'menu-sidebar');
      });
  }
  
  ngAfterViewInit() {
    this.cdr.detectChanges();
    // console.log('AppComponent: ngAfterViewInit fired → GSAP will start now');
    (this.gsap as any).run?.();
  }
 setFavicon(iconUrl: string, size: string = '32x32') {
  let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");

  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.getElementsByTagName('head')[0].appendChild(link);
  }

  link.type = 'image/svg';
  link.href = iconUrl;
  link.sizes = size; // e.g., '16x16', '32x32', '64x64'
}
}
