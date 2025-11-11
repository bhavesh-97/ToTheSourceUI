import { Component, inject, signal, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { gsap } from 'gsap';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

// Bootstrap CSS already in angular.json

@Component({
  selector: 'app-two-columns-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    DrawerModule,
    ButtonModule,
    ToolbarModule,
    AvatarModule,
    MenuModule,
  ],
  templateUrl: './two-columns-layout.html',
  styleUrls: ['./two-columns.layout.scss'],
})
export class TwoColumnsLayoutComponent implements AfterViewInit {
  @ViewChild('sidebar') sidebar!: ElementRef;
  @ViewChild('sidebarBackdrop') backdrop!: ElementRef;

  sidebarVisible = signal(false);

  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/dashboard' },
    { label: 'Users', icon: 'pi pi-users', routerLink: '/users' },
    { label: 'Reports', icon: 'pi pi-chart-bar', routerLink: '/reports' },
    { label: 'Settings', icon: 'pi pi-cog', routerLink: '/settings' },
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
    if (this.sidebarVisible()) {
      this.hideSidebar();
    } else {
      this.showSidebar();
    }
  }

  showSidebar() {
    this.sidebarVisible.set(true);
    gsap.to(this.sidebar.nativeElement, {
      x: 0,
      duration: 0.4,
      ease: 'power3.out',
    });
    gsap.to(this.backdrop.nativeElement, {
      opacity: 1,
      display: 'block',
      duration: 0.3,
    });
  }

  hideSidebar() {
    gsap.to(this.sidebar.nativeElement, {
      x: -300,
      duration: 0.4,
      ease: 'power3.in',
      onComplete: () => this.sidebarVisible.set(false),
    });
    gsap.to(this.backdrop.nativeElement, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        this.backdrop.nativeElement.style.display = 'none';
      },
    });
  }
}