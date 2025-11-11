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
  @ViewChild('drawer', { static: true }) drawerEl!: ElementRef<HTMLElement>;
  @ViewChild('backdrop', { static: true }) backdropEl!: ElementRef<HTMLElement>;

  /** Reactive state */
  sidebarVisible = signal(false);
  sidebarCompacted = signal(true);

  /** CSS-driven sizes */
  sidebarWidth = signal(280);          // expanded
  readonly compactWidth = 70;

  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/' },
    { label: 'Fleet', icon: 'pi pi-truck', routerLink: '/fleet' },
    { label: 'Reports', icon: 'pi pi-chart-bar', routerLink: '/reports' },
    { label: 'Alerts', icon: 'pi pi-bell', routerLink: '/alerts' },
    { label: 'Settings', icon: 'pi pi-cog', routerLink: '/settings' },
  ];

  /** ---------------------------------------------------- */
  ngAfterViewInit() {
    const sidebar = this.drawerEl.nativeElement;
    const backdrop = this.backdropEl.nativeElement;

    // Initial hidden state
    gsap.set(sidebar, { x: -this.sidebarWidth() });
    gsap.set(backdrop, { autoAlpha: 0 });
  }

  /** ---------------------------------------------------- */
  toggleSidebar() {
    if (!this.sidebarVisible()) {
      this.showSidebar();
    } else if (this.sidebarCompacted()) {
      this.expandSidebar();
    } else {
      this.compactSidebar();
    }
  }

  /** Show (slide-in) */
  showSidebar() {
    this.sidebarVisible.set(true);
    this.sidebarCompacted.set(false);
    this.sidebarWidth.set(280);

    gsap.to(this.drawerEl.nativeElement, {
      x: 0,
      duration: 0.45,
      ease: 'power3.out',
    });
    gsap.to(this.backdropEl.nativeElement, {
      autoAlpha: 1,
      duration: 0.3,
    });
  }

  /** Hide (slide-out) */
  hideSidebar() {
    gsap.to(this.drawerEl.nativeElement, {
      x: -this.sidebarWidth(),
      duration: 0.35,
      ease: 'power3.in',
      onComplete: () => this.sidebarVisible.set(false),
    });
    gsap.to(this.backdropEl.nativeElement, {
      autoAlpha: 0,
      duration: 0.25,
    });
  }

  /** Expand (wide) */
  expandSidebar() {
    this.sidebarCompacted.set(false);
    this.sidebarWidth.set(280);
    this.animateWidth(280);
  }

  /** Compact (narrow) */
  compactSidebar() {
    this.sidebarCompacted.set(true);
    this.sidebarWidth.set(this.compactWidth);
    this.animateWidth(this.compactWidth);
  }

  /** Internal width animation (GSAP) */
  private animateWidth(target: number) {
    gsap.to(this.drawerEl.nativeElement, {
      width: target,
      duration: 0.35,
      ease: 'power2.inOut',
    });
  }
}