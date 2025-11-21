// src/app/@theme/components/header/header.component.ts
import { Component, inject, signal, ViewChild, AfterViewInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { gsap } from 'gsap';

// PrimeNG
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { MenuItem } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MenuModule,
    ButtonModule,
    AvatarModule,
    BadgeModule,
    TooltipModule,
    InputTextModule,
    SelectModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  private router = inject(Router);
  @Output() sidebarToggle = new EventEmitter<void>();
  @Output() hamburgerClick = new EventEmitter<void>();
  @ViewChild('teamMenu') teamMenu: any;
  @ViewChild('userMenu') userMenu: any;
  @ViewChild('notificationMenu') notificationMenu: any;

  searchQuery = signal('');
  notificationCount = signal(5);
  selectedTeam = signal({ name: 'MetronicTeam', value: 'metronic' });
  teams = signal([
    { name: 'MetronicTeam', value: 'metronic' },
    { name: 'Keenthemes', value: 'keen' },
    { name: 'Personal', value: 'personal' },
  ]);

  user = signal({ name: 'Admin', avatar: '../../../../assets/images/bhavesh.jpg' });

  teamMenuItems: MenuItem[] = [
    { label: 'MetronicTeam', command: () => this.selectTeam('metronic') },
    { label: 'Keenthemes', command: () => this.selectTeam('keen') },
    { label: 'Personal', command: () => this.selectTeam('personal') },
    { separator: true },
    { label: 'Create New Team', icon: 'pi pi-plus' },
  ];

  userMenuItems: MenuItem[] = [
    { label: 'Profile', icon: 'pi pi-user', command: () => this.router.navigate(['/profile']) },
    { label: 'Settings', icon: 'pi pi-cog', command: () => this.router.navigate(['/settings']) },
    { separator: true },
    { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.logout() },
  ];

  notifications = signal([
    { title: 'New user registered', time: '2 mins ago', icon: 'pi pi-user-plus' },
    { title: 'Server load high', time: '10 mins ago', icon: 'pi pi-exclamation-triangle' },
    { title: 'Backup completed', time: '1 hour ago', icon: 'pi pi-check-circle' },
  ]);

  private bellTl: any;

ngAfterViewInit() {
  setTimeout(() => this.startBellAnimation(), 50);
}
  ngOnDestroy() {
    this.bellTl?.kill();
  }

  selectTeam(value: string) {
    const team = this.teams().find(t => t.value === value);
    if (team) this.selectedTeam.set(team);
  }

  logout() {
    // this.authService.logout();
    this.router.navigate(['/login']);
  }

private startBellAnimation() {
  const container = document.querySelector('.blink-bell-container') as HTMLElement | null;

  if (!container) {
    console.warn('Blink bell container not found.');
    return;
  }

  const mainBell = container.querySelector('.bell-main') as HTMLElement | null;
  const ringBell = container.querySelector('.bell-ring') as HTMLElement | null;

  if (!mainBell || !ringBell) {
    console.warn('Bell elements not found.');
    return;
  }

  // Kill previous timeline
  this.bellTl?.kill();

  this.bellTl = gsap.timeline({
    repeat: -1,
    repeatDelay: 3,
    defaults: { ease: 'none' }
  });

  this.bellTl
    .to(mainBell, { rotation: 18, duration: 0.12 })
    .to(mainBell, { rotation: -14, duration: 0.12 })
    .to(mainBell, { rotation: 10, duration: 0.1 })
    .to(mainBell, { rotation: -6, duration: 0.1 })
    .to(mainBell, { rotation: 4, duration: 0.08 })
    .to(mainBell, { rotation: 0, duration: 0.08 }, "+=0.1")
    .fromTo(
      ringBell,
      {
        scale: 0.8,
        opacity: 0.8,
        rotation: -20,
        color: '#5d78ff'
      },
      {
        scale: 1.8,
        opacity: 0,
        rotation: 20,
        duration: 0.7,
        ease: 'power2.out'
      },
      "-=0.8"
    );
}

}