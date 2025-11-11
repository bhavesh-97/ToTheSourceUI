// src/app/layouts/three-columns.layout.component.ts
import { Component, inject, signal, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { gsap } from 'gsap';

// PrimeNG
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelModule } from 'primeng/panel';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-three-columns-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    DrawerModule,
    ButtonModule,
    ToolbarModule,
    PanelModule,
    AvatarModule,
    MenuModule,
  ],
  templateUrl: './three-columns.layout.html',
  styleUrls: ['./three-columns.layout.scss'],
})
export class ThreeColumnsLayoutComponent implements AfterViewInit {
  @ViewChild('sidebar') sidebar!: ElementRef;
  @ViewChild('backdrop') backdrop!: ElementRef;

  sidebarVisible = signal(false);

  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/dashboard' },
    { label: 'Analytics', icon: 'pi pi-chart-line', routerLink: '/analytics' },
    { label: 'Users', icon: 'pi pi-users', routerLink: '/users' },
    { label: 'Settings', icon: 'pi pi-cog', routerLink: '/settings' },
  ];

  activities = [
    { user: 'Rahul Sharma', action: 'Updated fleet report', time: '2 min ago' },
    { user: 'Priya Patel', action: 'Created new driver profile', time: '5 min ago' },
    { user: 'Amit Kumar', action: 'Exported GPS data', time: '10 min ago' },
    { user: 'Neha Singh', action: 'Approved leave request', time: '15 min ago' },
    { user: 'Vikram Rao', action: 'Resolved ticket #TRK-892', time: '20 min ago' },
  ];

ngAfterViewInit() {
  if (this.sidebar?.nativeElement) {
    gsap.set(this.sidebar.nativeElement, { x: -300 });
  }
  if (this.backdrop?.nativeElement) {
    gsap.set(this.backdrop.nativeElement, { opacity: 0, display: 'none' });
  }
}

  toggleSidebar() {
    this.sidebarVisible() ? this.hideSidebar() : this.showSidebar();
  }

  showSidebar() {
    this.sidebarVisible.set(true);
    gsap.to(this.sidebar.nativeElement, { x: 0, duration: 0.5, ease: 'power4.out' });
    gsap.to(this.backdrop.nativeElement, { opacity: 1, display: 'block', duration: 0.4 });
  }

  hideSidebar() {
    gsap.to(this.sidebar.nativeElement, {
      x: -320,
      duration: 0.4,
      ease: 'power3.in',
      onComplete: () => this.sidebarVisible.set(false),
    });
    gsap.to(this.backdrop.nativeElement, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => void (this.backdrop.nativeElement.style.display = 'none')
    });
  }
}