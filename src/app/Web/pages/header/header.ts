import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  HostListener,
  ElementRef,
  ViewChild,
  PLATFORM_ID,
  Inject,
  signal,
  computed,
  inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { BadgeModule } from 'primeng/badge';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PopoverModule } from 'primeng/popover';
import { HeaderMenuService } from '../../services/header-menu.service';

export interface MegaMenuColumn {
  heading?: string;
  items: MegaMenuItem[];
}

export interface MegaMenuItem {
  label: string;
  icon?: string;
  route?: string;
  children?: MegaMenuItem[];
}

export interface NavItem {
  label: string;
  route?: string;
  megaMenu?: {
    description: string;
    columns: MegaMenuColumn[];
  };
}

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
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('headerEl') headerEl!: ElementRef<HTMLElement>;
  @ViewChild('navEl') navEl!: ElementRef<HTMLElement>;

  isScrolled = signal(false);
  isMobileMenuOpen = signal(false);
  activeMenu = signal<string | null>(null);
  mobileExpandedMenu = signal<string | null>(null);
  isBrowser: boolean;

  private scrollTl?: gsap.core.Timeline;
  private megaMenuTl?: gsap.core.Timeline;
  private mobileMenuTl?: gsap.core.Timeline;
  private activeMenuTimeout?: ReturnType<typeof setTimeout>;
  private headerMenuService = inject(HeaderMenuService);

  navItems: NavItem[] = [
    {
      label: 'About Us',
      route: '/about-us',
    },
    {
      label: 'Industries',
      route: '/industries',
      megaMenu: {
        description:
          'Explore the diverse industries we support with tailored solutions designed to meet unique business challenges.',
        columns: [
          {
            heading: 'Sector',
            items: [
              { label: 'Agriculture', icon: 'pi pi-leaf', route: '/industries/agriculture' },
              { label: 'Traffic & Highway', icon: 'pi pi-car', route: '/industries/traffic' },
              { label: 'Public Transport', icon: 'pi pi-map', route: '/industries/transport' },
              { label: 'Urban Solutions', icon: 'pi pi-building', route: '/industries/urban' },
            ],
          },
          {
            heading: 'More',
            items: [
              { label: 'Logistics', icon: 'pi pi-box', route: '/industries/logistics' },
              { label: 'Resources', icon: 'pi pi-database', route: '/industries/resources' },
              { label: 'Utilities', icon: 'pi pi-bolt', route: '/industries/utilities' },
            ],
          },
        ],
      },
    },
    {
      label: 'Technology',
      route: '/technology',
      megaMenu: {
        description:
          'Empowering innovation with smart tech solutions that drive digital transformation and keep businesses ahead.',
        columns: [
          {
            heading: 'Core Tech',
            items: [
              { label: 'Advance Analytics', icon: 'pi pi-chart-line', route: '/technology/analytics' },
              { label: 'AI / ML', icon: 'pi pi-microchip-ai', route: '/technology/ai-ml' },
              { label: 'Automatic Payments', icon: 'pi pi-credit-card', route: '/technology/payments' },
              { label: 'Blockchain', icon: 'pi pi-lock', route: '/technology/blockchain' },
              { label: 'Cloud Technology', icon: 'pi pi-cloud', route: '/technology/cloud' },
            ],
          },
          {
            heading: 'Engineering',
            items: [
              { label: 'Edge Computing', icon: 'pi pi-server', route: '/technology/edge' },
              { label: 'Geospatial Engineering', icon: 'pi pi-map-marker', route: '/technology/geo' },
              { label: 'IoT & M2M', icon: 'pi pi-wifi', route: '/technology/iot' },
              { label: 'User Experience', icon: 'pi pi-palette', route: '/technology/ux' },
            ],
          },
        ],
      },
    },
    {
      label: 'Products',
      megaMenu: {
        description:
          'Built to solve real-world problems with precision and purpose — innovation, usability, and scalability at the core.',
        columns: [
          {
            heading: 'Mobility',
            items: [
              { label: 'Locomate – AVLS', icon: 'pi pi-truck', route: '/locomate-avls' },
              { label: 'Locomate – DMS', icon: 'pi pi-display', route: '/locomate-dms' },
              { label: 'Locomate – PIS', icon: 'pi pi-info-circle', route: '/locomate-pis' },
              { label: 'SyncNex', icon: 'pi pi-arrows-h', route: '/syncnex' },
              { label: 'RapidGo', icon: 'pi pi-send', route: '/rapidgo' },
            ],
          },
          {
            heading: 'Smart City',
            items: [
              { label: 'Outline', icon: 'pi pi-pencil', route: '/outline' },
              { label: 'Spectator', icon: 'pi pi-eye', route: '/spectator' },
              { label: 'IION', icon: 'pi pi-sitemap', route: '/iion' },
              { label: 'Ecokeeper', icon: 'pi pi-sun', route: '/ecokeeper' },
            ],
          },
        ],
      },
    },
    {
      label: 'Insights',
      route: '/insights',
    },
    {
      label: 'Careers',
      route: '/careers',
    },
  ];

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private el: ElementRef
  ) {
     this.headerMenuService.getHeaderMenu().subscribe(items => {
      debugger;
        this.navItems = items;
      });
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.initHeaderAnimation();
    this.initScrollBehavior();
  }

   private initHeaderAnimation(): void {
     const header = this.headerEl?.nativeElement;
     if (!header) return;

     // Entrance animation with more refined timing
     gsap.fromTo(
       header,
       { y: -60, opacity: 0 },
       { y: 0, opacity: 1, duration: 0.8, ease: 'power4.out', delay: 0.2 }
     );

     // Stagger nav items with more refined animation
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

     // Logo with scale and fade
     const logo = header.querySelector('.logo-wrapper');
     if (logo) {
       gsap.fromTo(
         logo,
         { scale: 0.9, opacity: 0 },
         { scale: 1, opacity: 1, duration: 0.7, ease: 'elastic.out(1, 0.3)', delay: 0.2 }
       );
     }

     // CTA button with more subtle animation
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
        // Add subtle height adjustment based on scroll position
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
        
        // Check background brightness for theme adjustment
        if (this.isBrowser) {
          this.checkBackgroundTheme();
        }
      }
    });
  }
  
  private checkBackgroundTheme(): void {
    const header = this.headerEl?.nativeElement as HTMLElement;
    if (!header) return;
    
    // Create a temporary element to sample the background color
    const sampler = document.createElement('div');
    sampler.style.position = 'fixed';
    sampler.style.top = '0';
    sampler.style.left = '0';
    sampler.style.width = '1px';
    sampler.style.height = '1px';
    sampler.style.pointerEvents = 'none';
    sampler.style.zIndex = '9999';
    document.body.appendChild(sampler);
    
    // Get computed styles to determine if we're over a light or dark background
    const headerComputed = window.getComputedStyle(header);
    const backgroundColor = headerComputed.backgroundColor;
    
    // Remove sampler
    document.body.removeChild(sampler);
    
    // Parse RGB color and calculate brightness
    const rgbMatch = backgroundColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);
      
      // Calculate luminance using relative luminance formula
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      
      // Update theme based on luminance
      this.updateThemeBasedOnLuminance(luminance);
    }
  }
  
   private updateThemeBasedOnLuminance(luminance: number): void {
    const header = this.headerEl?.nativeElement;
    if (!header) return;
    
    // If background is light (luminance > 0.5), use dark theme
    // If background is dark (luminance <= 0.5), use light theme
    const isLightBackground = luminance > 0.5;
    
    // Remove any existing theme attributes
    header.removeAttribute('data-theme');
    
    // Set theme based on background luminance
    if (isLightBackground) {
      // Light background - use dark theme for header
      header.setAttribute('data-theme', 'dark');
    } else {
      // Dark background - use light theme for header
      header.setAttribute('data-theme', 'light');
    }
    
    // Update logo visibility based on theme
    const logoDefault = header.querySelector('.logo-default') as HTMLElement;
    const logoWhite = header.querySelector('.logo-white') as HTMLElement;
    
    if (logoDefault && logoWhite) {
      if (isLightBackground) {
        // Light background - show dark logo
        logoDefault.style.display = 'block';
        logoWhite.style.display = 'none';
      } else {
        // Dark background - show white logo
        logoDefault.style.display = 'none';
        logoWhite.style.display = 'block';
      }
    }
    
    // Update CTA button based on background
    const ctaButton = header.querySelector('.header-cta') as HTMLElement;
    if (ctaButton) {
      if (isLightBackground) {
        // Light background - use accent color for CTA
        ctaButton.style.backgroundColor = '#00c896';
        ctaButton.style.borderColor = '#00c896';
        ctaButton.style.color = '#0a0c14';
      } else {
        // Dark background - use transparent with white border
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
          // Force scrolled theme when scrolling
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
          // Restore theme based on background when not scrolled
          header.classList.remove('scrolled');
          // Note: Theme will be restored by scroll update function
        }
      });
    }
  }

  openMenu(label: string): void {
    if (this.activeMenuTimeout) clearTimeout(this.activeMenuTimeout);

    const previous = this.activeMenu();
    this.activeMenu.set(label);

    if (previous !== label) {
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
    // Use requestAnimationFrame to ensure DOM is updated
    requestAnimationFrame(() => {
      const panel = document.querySelector(`.mega-menu-panel[data-menu="${label}"]`);
      if (!panel) return;

      gsap.fromTo(
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

      // Stagger inner items
      const items = panel.querySelectorAll('.mega-menu-item');
      gsap.fromTo(
        items,
        { x: -8, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.25, stagger: 0.04, ease: 'power2.out', delay: 0.05 }
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
      this.mobileExpandedMenu.set(null); // collapse all sub-menus on close
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

   ngOnDestroy(): void {
     ScrollTrigger.getAll().forEach((t) => t.kill());
     if (this.activeMenuTimeout) clearTimeout(this.activeMenuTimeout);
   }
}