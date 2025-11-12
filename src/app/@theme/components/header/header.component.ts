// src/app/@theme/components/header/header.component.ts
import { Component, inject, signal, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';        // CORRECT IMPORT
import { CommonModule } from '@angular/common';      // Only for pipes, ngIf, etc.
import { Router } from '@angular/router';

import { NbSidebarService, NbThemeService } from '@nebular/theme';
import { gsap } from 'gsap';
import { LayoutService } from '../../../@core/utils/layout.service';

// PrimeNG Modules
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MenuModule } from 'primeng/menu';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TooltipModule } from 'primeng/tooltip';
import { LoginService } from '../../../authentication/login/login.service';
import { SelectModule } from 'primeng/select';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,          
    AvatarModule,
    BadgeModule,
    ButtonModule,
    DialogModule,
    SelectModule, 
    MenuModule,
    AutoCompleteModule,
    TooltipModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private sidebarService = inject(NbSidebarService);
  private themeService = inject(NbThemeService);
  private layoutService = inject(LayoutService);
  private authService = inject(LoginService);
  private router = inject(Router);

  @ViewChild('userMenu') userMenu: any;
  @ViewChild('notificationMenu') notificationMenu: any;

  // TWO-WAY BINDING → Must be normal variables (NOT signals)
  searchQuery: string = '';
  selectedTheme: string = 'dark';

  // One-way data → Use signals
  notificationCount = signal(8);
  changePasswordVisible = signal(false);
  preferencesVisible = signal(false);
  filteredItems = signal<any[]>([]);
  searchData = signal<any[]>([]);
  user = signal<any>({ name: 'Admin', picture: './assets/images/avatar.png' });
  userMenuItems: MenuItem[] = [
    { label: 'Profile', icon: 'pi pi-user', command: () => this.openProfile() },
    { label: 'Settings', icon: 'pi pi-cog', command: () => this.openPreferences() },
    { separator: true },
    { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.logout() }
  ];
    notifications = [
    { title: 'Server restarted', icon: 'pi pi-info-circle', time: '2 mins ago' },
    { title: 'New message received', icon: 'pi pi-envelope', time: '10 mins ago' },
    { title: 'Backup completed', icon: 'pi pi-check', time: '1 hour ago' },
  ];
    themes = [
    { name: 'Light', value: 'light' },
    { name: 'Dark', value: 'dark' },
    { name: 'Corporate', value: 'corporate' },
  ];
  // Clock
  currentTime: string = '';

  private blinkTl: any;

  ngOnInit() {
    this.loadUser();
    this.startClock();
    this.buildSearchData();
    this.startBlinkAnimation();

    this.themeService.onThemeChange().subscribe(({ name }) => {
      this.selectedTheme = name;
    });
  }

  ngOnDestroy() {
    this.blinkTl?.kill();
  }

  private loadUser() {
    // const userData = this.authService.currentUserValue;
    // if (userData) {
    //   this.user.set({
    //     name: userData.userName || 'User',
    //     picture: userData.picture || './assets/images/avatar.png',
    //   });
    // }
  }

  private buildSearchData() {
    // const userData = this.authService.currentUserValue;
    const items: any[] = [];

    const traverse = (nodes: any[]) => {
      nodes.forEach(node => {
        if (node.children?.length > 0) {
          traverse(node.children);
        } else if (node.link) {
          items.push({ text: node.title, value: node.link });
        }
      });
    };

    // userData?.pnsMenu?.forEach((menu: any) => traverse([menu]));
    this.searchData.set(items);
  }

  toggleSidebar() {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();
  }

  filterSearch(event: any) {
    const query = event.query.toLowerCase();
    this.filteredItems.set(
      this.searchData().filter(item =>
        item.text.toLowerCase().includes(query)
      ).slice(0, 10)
    );
  }

  navigateTo(item: any) {
    this.router.navigate([item.value]);
    this.searchQuery = '';
  }

  changeTheme(theme: string) {
    this.themeService.changeTheme(theme);
  }
  openProfile() {
    this.router.navigate(['/profile']);
  }
  openPreferences() {
    this.themeService.changeTheme(this.selectedTheme);
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private startClock() {
    setInterval(() => {
      const now = new Date();
      this.currentTime = now.toLocaleString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
    }, 1000);
  }

  private startBlinkAnimation() {
    this.blinkTl = gsap.to('.blink-bell', {
      scale: 1.4,
      duration: 0.6,
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut',
    });
  }

  onDialogShow(pass: string) {
    gsap.fromTo('.p-dialog', 
      { scale: 0.8, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
    );
  }
}