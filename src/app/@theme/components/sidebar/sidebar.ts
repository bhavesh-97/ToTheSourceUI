import {
  Component,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  inject,
  signal,
  computed,
  effect,
  ElementRef,
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
  ],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class SidebarComponent {

  private _isMini = signal(false);
  private sidebarEl!: HTMLElement;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.sidebarEl = this.el.nativeElement.querySelector('.sidebar');
  }

  toggleMini() {
    const isMobile = window.innerWidth <= 900;
    const mainArea = document.querySelector('.main-area');

    if (isMobile) {
      const sidebar = document.querySelector('.sidebar');
      sidebar?.classList.toggle('open');
      mainArea?.classList.toggle('blurred');
      return;
    } else {
      mainArea?.classList.toggle('open');
    }

    this._isMini.update(v => !v);
    const target = this._isMini() ? 72 : 280;

    gsap.to('.main-area', {
      marginLeft: target,
      duration: 0.5,
      ease: 'power3.inOut'
    });
  }

  isMini(): boolean {
    return this._isMini();
  }

  menuItems = [
    {
      icon: 'pi pi-home',
      label: 'Dashboard',
      route: '/main/dashboard',
      children: []
    },
    {
      icon: 'pi pi-chart-line',
      label: 'Analytics',
      route: '/main/analytics',
      children: []
    },
    {
      icon: 'pi pi-users',
      label: 'Users',
      route: null,
      children: [
        {
          icon: 'pi pi-list',
          label: 'User List',
          route: '/main/users/list',
          children: []
        },
        {
          icon: 'pi pi-id-card',
          label: 'Roles',
          route: '/main/users/roles',
          children: []
        }
      ]
    },
    {
      icon: 'pi pi-cog',
      label: 'Settings',
      route: '/main/settings',
      children: []
    }
  ];

  opened: Record<string, boolean> = {};

  toggleChild(label: string) {
    this.opened[label] = !this.opened[label];
  }
}