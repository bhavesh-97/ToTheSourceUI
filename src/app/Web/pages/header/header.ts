import {Component,OnInit,OnDestroy,AfterViewInit,ElementRef,ViewChild,PLATFORM_ID,Inject,signal,inject,} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { BadgeModule } from 'primeng/badge';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PopoverModule } from 'primeng/popover';
import { HeaderMenuService } from '../../services/header-menu.service';
import { NavItem } from './MenuModel';

@Component({
  selector: 'web-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    RippleModule,
    BadgeModule,
    PopoverModule ,
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  @ViewChild('headerEl') headerEl!: ElementRef<HTMLElement>;
  @ViewChild('navEl') navEl!: ElementRef<HTMLElement>;

  isScrolled = signal(false);
  isMobileMenuOpen = signal(false);
  activeMenu = signal<string | null>(null);
  mobileExpandedMenu = signal<string | null>(null);
  isBrowser: boolean;
  expandedSubMenus: { [key: string]: boolean } = {};
  
  private activePanelElement: Element | null = null;
  private megaMenuTl?: gsap.core.Timeline;
  private activeMenuTimeout?: ReturnType<typeof setTimeout>;
  private headerMenuService = inject(HeaderMenuService);
  navItems: NavItem[] = [];

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private el: ElementRef
  ) {
     this.headerMenuService.getHeaderMenu().subscribe(items => {
        this.navItems = items;
      });
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
      this.initHeaderAnimation();
      this.initScrollBehavior();
  }

   private initHeaderAnimation(): void {
     const header = this.headerEl?.nativeElement;
     if (!header) return;
      gsap.fromTo(
        header,
        { y: -60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power4.out', delay: 0.2 }
      );

      const navLinks = header.querySelectorAll('.nav-item');
      gsap.fromTo(
        navLinks,
        { y: -15, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.05,
          ease: 'power3.out',
          delay: 0.3,
       }
     );
     const logo = header.querySelector('.logo-wrapper');
     if (logo) {
       gsap.fromTo(
         logo,
         { scale: 0.9, opacity: 0 },
         { scale: 1, opacity: 1, duration: 0.7, ease: 'elastic.out(1, 0.3)', delay: 0.2 }
       );
     }
    const cta = header.querySelector('.header-cta');
     if (cta) {
       gsap.fromTo(
         cta,
         { scale: 0.9, opacity: 0 },
         { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.2)', delay: 0.6 }
       );
     }
   }

  private initScrollBehavior(): void {
    ScrollTrigger.create({
      start: 'top -80px',
      end: 'bottom top',
      onEnter: () => {
        this.isScrolled.set(true);
        this.animateScrolledState(true);
      },
      onLeaveBack: () => {
        this.isScrolled.set(false);
        this.animateScrolledState(false);
      },
      onUpdate: (self) => {
        const progress = self.progress;
        const header = this.headerEl?.nativeElement;
        if (header) {
          gsap.to(header, {
            height: progress > 0 ? '64px' : '72px',
            duration: 0.3,
            ease: 'power2.out',
            overwrite: true
          });
        }
        if (this.isBrowser) {
          this.checkBackgroundTheme();
        }
      }
    });
  }
  
  private checkBackgroundTheme(): void {
    const header = this.headerEl?.nativeElement as HTMLElement;
    if (!header) return;
    
    const sampler = document.createElement('div');
    sampler.style.position = 'fixed';
    sampler.style.top = '0';
    sampler.style.left = '0';
    sampler.style.width = '1px';
    sampler.style.height = '1px';
    sampler.style.pointerEvents = 'none';
    sampler.style.zIndex = '9999';
    document.body.appendChild(sampler);
    
    const headerComputed = window.getComputedStyle(header);
    const backgroundColor = headerComputed.backgroundColor;
    
    document.body.removeChild(sampler);
    
    const rgbMatch = backgroundColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);
      
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      this.updateThemeBasedOnLuminance(luminance);
    }
  }
  
   private updateThemeBasedOnLuminance(luminance: number): void {
      const header = this.headerEl?.nativeElement;
      if (!header) return;
    
      const isLightBackground = luminance > 0.5;
      header.removeAttribute('data-theme');
      if (isLightBackground) {
        header.setAttribute('data-theme', 'dark');
      } else {
        header.setAttribute('data-theme', 'light');
      }
      const logoDefault = header.querySelector('.logo-default') as HTMLElement;
      const logoWhite = header.querySelector('.logo-white') as HTMLElement;
    
      if (logoDefault && logoWhite) {
        if (isLightBackground) {
          logoDefault.style.display = 'block';
          logoWhite.style.display = 'none';
        } else {
          logoDefault.style.display = 'none';
          logoWhite.style.display = 'block';
        }
      }
      const ctaButton = header.querySelector('.header-cta') as HTMLElement;
      if (ctaButton) {
        if (isLightBackground) {
          ctaButton.style.backgroundColor = '#00c896';
          ctaButton.style.borderColor = '#00c896';
          ctaButton.style.color = '#0a0c14';
        } else {
          ctaButton.style.backgroundColor = 'transparent';
          ctaButton.style.borderColor = 'rgba(255, 255, 255, 0.4)';
          ctaButton.style.color = '#ffffff';
        }
      }
    }

   private animateScrolledState(scrolled: boolean): void {
    const header = this.headerEl?.nativeElement;
    if (!header) return;

    if (scrolled) {
      gsap.to(header, {
        backgroundColor: 'rgba(10, 12, 20, 0.96)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
        paddingTop: '12px',
        paddingBottom: '12px',
        duration: 0.4,
        ease: 'power2.out',
        onComplete: () => {
          header.setAttribute('data-theme', 'dark');
          header.classList.add('scrolled');
        }
      });
    } else {
      gsap.to(header, {
        backgroundColor: 'transparent',
        backdropFilter: 'blur(0px)',
        boxShadow: 'none',
        paddingTop: '20px',
        paddingBottom: '20px',
        duration: 0.4,
        ease: 'power2.out',
        onComplete: () => {
          header.classList.remove('scrolled');
        }
      });
    }
  }

  openMenu(label: string): void {
    if (this.activeMenuTimeout) clearTimeout(this.activeMenuTimeout);
  
    const previous = this.activeMenu();
    this.activeMenu.set(label);
  
    if (previous !== label) {
      if (this.megaMenuTl) {
        this.megaMenuTl.kill();
      }
      this.animateMegaMenuIn(label);
    }
  }
  closeMenu(): void {
    this.activeMenuTimeout = setTimeout(() => {
      const label = this.activeMenu();
      if (label) {
        this.animateMegaMenuOut(label);
      }
      this.activeMenu.set(null);
    }, 150);
  }

  keepMenuOpen(): void {
    if (this.activeMenuTimeout) clearTimeout(this.activeMenuTimeout);
  }

  private animateMegaMenuIn(label: string): void {
    requestAnimationFrame(() => {
      const panel = document.querySelector(`.mega-menu-panel[data-menu="${label}"]`);
      if (!panel) return;
  
      this.activePanelElement = panel;
      this.megaMenuTl = gsap.timeline();
  
      this.megaMenuTl.fromTo(
        panel,
        { y: -10, opacity: 0, scaleY: 0.95 },
        {
          y: 0,
          opacity: 1,
          scaleY: 1,
          duration: 0.3,
          ease: 'power2.out',
          transformOrigin: 'top center',
        }
      );
  
      const items = panel.querySelectorAll('.mega-menu-item');
      this.megaMenuTl.fromTo(
        items,
        { x: -8, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.25, stagger: 0.04, ease: 'power2.out' },
        '-=0.15' 
      );
    });
  }

  private animateMegaMenuOut(label: string): void {
    const panel = document.querySelector(`.mega-menu-panel[data-menu="${label}"]`);
    if (!panel) return;

    gsap.to(panel, {
      y: -8,
      opacity: 0,
      scaleY: 0.96,
      duration: 0.2,
      ease: 'power2.in',
      transformOrigin: 'top center',
    });
  }
  toggleMobileMenu(): void {
    const isOpen = !this.isMobileMenuOpen();
    this.isMobileMenuOpen.set(isOpen);

    if (!isOpen) {
      this.mobileExpandedMenu.set(null); 
    }

    const overlay = document.querySelector('.mobile-menu-overlay');
    if (!overlay) return;

    if (isOpen) {
      gsap.fromTo(
        overlay,
        { x: '100%', opacity: 0 },
        { x: '0%', opacity: 1, duration: 0.4, ease: 'power3.out' }
      );
      const items = overlay.querySelectorAll('.mobile-nav-item');
      gsap.fromTo(
        items,
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.35, stagger: 0.07, ease: 'power2.out', delay: 0.15 }
      );
    } else {
      gsap.to(overlay, { x: '100%', opacity: 0, duration: 0.3, ease: 'power3.in' });
    }
  }

    toggleMobileExpand(label: string): void {
      this.mobileExpandedMenu.set(
        this.mobileExpandedMenu() === label ? null : label
      );
    }
    hasActiveMegaMenu(label: string): boolean {
      return this.activeMenu() === label;
    }
  
    getMegaMenu(item: NavItem) {
      return item.megaMenu;
    }
  
    isSingleColumnOverflow(items: unknown[]): boolean {
      return items.length > 5;
    }
    handleMenuItemClick(event: Event, item: any): void {
    const route = item.route;
    const isDummyRoute = !route || route === '#' || route.trim() === '';
    if (isDummyRoute) {
      event.preventDefault();
      return;
    }
    const normalizedRoute = route.startsWith('/') ? route : '/' + route;
    event.preventDefault();
    window.location.href = normalizedRoute;
  }
   ngOnDestroy(): void {
     ScrollTrigger.getAll().forEach((t) => t.kill());
     if (this.activeMenuTimeout) clearTimeout(this.activeMenuTimeout);
   }
}