// src/app/@theme/components/sidebar/sidebar.component.ts
import {
  Component,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  inject,
  signal,
  computed,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { gsap } from 'gsap';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TooltipModule } from 'primeng/tooltip';
import { filter } from 'rxjs/operators';

interface MenuItemExt extends MenuItem {
  route?: string;
  keywords?: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MenuModule,
    InputTextModule,
    FormsModule,
    AvatarModule,
    ButtonModule,
    ToggleButtonModule,
    TooltipModule,
  ],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class SidebarComponent implements AfterViewInit, OnDestroy {
  private router = inject(Router);

  @ViewChild('sidebarMenu') sidebarMenu: any;

  // --- STATE ---
  isOpen = signal(window.innerWidth >= 992);
  isPinned = signal(this.loadState('pinned', true));
  isCollapsed = signal(this.loadState('collapsed', false));
  isDark = signal(this.loadState('dark', false));
  searchQuery = signal('');
  darkModeValue = false; // for ngModel

  // --- USER ---
  user = signal({
    name: 'Cody Fisher',
    avatar: './assets/images/avatars/cody.jpg',
  });

  // --- COMPUTED ---
  sidebarWidth = computed(() => (this.isCollapsed() ? '80px' : '280px'));
  filteredItems = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.menuItems;
    return this.menuItems.filter(
      (item) =>
        item.label?.toLowerCase().includes(q) ||
        item.keywords?.some((k) => k.toLowerCase().includes(q))
    );
  });

  menuItems: MenuItemExt[] = [
    { label: 'Dashboard', icon: 'pi pi-home', route: '/dashboard', keywords: ['home', 'overview'] },
    { label: 'Projects', icon: 'pi pi-folder', route: '/projects', keywords: ['work', 'tasks'] },
    { label: 'Tasks', icon: 'pi pi-check-square', route: '/tasks', keywords: ['todo', 'list'] },
    { label: 'Messages', icon: 'pi pi-envelope', route: '/messages', keywords: ['chat', 'inbox'] },
    { label: 'Analytics', icon: 'pi pi-chart-line', route: '/analytics', keywords: ['stats', 'report'] },
    { label: 'Settings', icon: 'pi pi-cog', route: '/settings', keywords: ['config', 'preferences'] },
  ];

  activeRoute = signal('');

  private tl!: gsap.core.Timeline;

  constructor() {
    effect(() => this.saveState('pinned', this.isPinned()));
    effect(() => this.saveState('collapsed', this.isCollapsed()));
    effect(() => this.saveState('dark', this.isDark()));
  }

  ngAfterViewInit() {
    this.darkModeValue = this.isDark();
    this.setupAnimation();
    this.updateBodyClass();
    this.trackActiveRoute();
    this.setupKeyboardShortcuts();
    this.applyDarkMode();

    window.addEventListener('resize', () => this.onResize());
  }

  ngOnDestroy() {
    this.tl?.kill();
    window.removeEventListener('resize', () => this.onResize());
    window.removeEventListener('keydown', this.handleKeydown);
  }

  // --- PERSISTENCE ---
  private loadState<T>(key: string, defaultValue: T): T {
    const item = localStorage.getItem(`sidebar_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  }

  private saveState(key: string, value: any) {
    localStorage.setItem(`sidebar_${key}`, JSON.stringify(value));
  }

  // --- UI TOGGLES ---
  toggle() {
    if (this.isMobile()) {
      this.isOpen.update((v) => !v);
      this.tl.reversed(!this.isOpen());
    }
    this.updateBodyClass();
  }

  togglePin() {
    this.isPinned.update((v) => !v);
    if (this.isPinned() && !this.isOpen()) this.isOpen.set(true);
    this.updateBodyClass();
  }

  toggleCollapse() {
    this.isCollapsed.update((v) => !v);
    this.animateCollapse();
  }

  toggleDarkMode() {
    this.isDark.update((v) => !v);
    this.darkModeValue = this.isDark();
    this.applyDarkMode();
  }

  clearSearch() {
    this.searchQuery.set('');
  }

  // --- UTILS ---
  isMobile(): boolean {
    return window.innerWidth < 992;
  }

  private onResize() {
    const shouldOpen = window.innerWidth >= 992 && this.isPinned();
    if (this.isOpen() !== shouldOpen) {
      this.isOpen.set(shouldOpen);
      this.updateBodyClass();
    }
  }

  private updateBodyClass() {
    const open = this.isOpen() && (this.isPinned() || !this.isMobile());
    document.body.classList.toggle('sidebar-open', open);
    document.body.classList.toggle('sidebar-pinned', this.isPinned());
    document.body.classList.toggle('sidebar-collapsed', this.isCollapsed());
    document.body.classList.toggle('dark', this.isDark());
  }

  private trackActiveRoute() {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.activeRoute.set(e.urlAfterRedirects.split('?')[0]);
      });
  }

  private applyDarkMode() {
    document.documentElement.classList.toggle('dark', this.isDark());
  }

  // --- KEYBOARD ---
  private handleKeydown = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'k') {
        e.preventDefault();
        const input = document.querySelector('.sidebar-search input') as HTMLInputElement;
        input?.focus();
      }
      if (e.key === 'b') {
        e.preventDefault();
        this.toggle();
      }
    }
  };

  private setupKeyboardShortcuts() {
    window.addEventListener('keydown', this.handleKeydown);
  }

  // --- ANIMATIONS ---
  private setupAnimation() {
    const sidebar = document.querySelector('.app-sidebar') as HTMLElement;
    const overlay = document.querySelector('.sidebar-overlay') as HTMLElement;

    this.tl = gsap.timeline({ paused: true });

    this.tl
      .set(sidebar, { x: -300 })
      .set(overlay, { opacity: 0, display: 'none' })
      .to(sidebar, { x: 0, duration: 0.4, ease: 'back.out(1.4)' }, 0)
      .to(overlay, { opacity: 1, display: 'block', duration: 0.3 }, 0);

    if (this.isOpen()) {
      gsap.set(sidebar, { x: 0 });
    }
  }

  private animateCollapse() {
    gsap.to('.app-sidebar', {
      width: this.isCollapsed() ? 80 : 280,
      duration: 0.4,
      ease: 'power2.inOut',
    });

    gsap.to('.sidebar-label', {
      opacity: this.isCollapsed() ? 0 : 1,
      x: this.isCollapsed() ? -10 : 0,
      duration: 0.3,
      stagger: 0.02,
      ease: 'power2.out',
    });
  }
}