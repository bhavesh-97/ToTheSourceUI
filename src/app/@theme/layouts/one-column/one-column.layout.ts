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
import { HeaderComponent } from '../../components/header/header.component';


@Component({
  selector: 'app-one-column-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    DrawerModule,
    ButtonModule,
    ToolbarModule,
    AvatarModule,
    MenuModule,
    HeaderComponent, 
  ],
  templateUrl: './one-column.layout.html',
  styleUrls: ['./one-column.layout.scss'],
})
export class OneColumnLayoutComponent implements AfterViewInit {
  @ViewChild('sidebar') sidebar!: ElementRef;
  @ViewChild('backdrop') backdrop!: ElementRef;

  sidebarVisible = signal(false);
  sidebarCompacted = signal(true); // compacted = narrow mode

  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/' },
    { label: 'Fleet', icon: 'pi pi-truck', routerLink: '/fleet' },
    { label: 'Reports', icon: 'pi pi-chart-bar', routerLink: '/reports' },
    { label: 'Alerts', icon: 'pi pi-bell', routerLink: '/alerts' },
    { label: 'Settings', icon: 'pi pi-cog', routerLink: '/settings' },
  ];

  ngAfterViewInit() {
    // Initial state: compacted sidebar (narrow)
    gsap.set(this.sidebar.nativeElement, { width: 70 });
    gsap.set(this.backdrop.nativeElement, { opacity: 0, display: 'none' });
  }

  toggleSidebar() {
    if (this.sidebarVisible()) {
      this.hideSidebar();
    } else if (this.sidebarCompacted()) {
      this.expandSidebar();
    } else {
      this.compactSidebar();
    }
  }

  expandSidebar() {
    this.sidebarCompacted.set(false);
    gsap.to(this.sidebar.nativeElement, {
      width: 280,
      duration: 0.4,
      ease: 'power3.out',
    });
  }

  compactSidebar() {
    this.sidebarCompacted.set(true);
    gsap.to(this.sidebar.nativeElement, {
      width: 70,
      duration: 0.4,
      ease: 'power3.in',
    });
  }

  showSidebar() {
    this.sidebarVisible.set(true);
    this.sidebarCompacted.set(false);
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
      onComplete: () => void (this.backdrop.nativeElement.style.display = 'none'),
    });
  }
}