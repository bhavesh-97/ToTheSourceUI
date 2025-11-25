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

    // Hover expand when mini
    // this.sidebarEl.addEventListener('mouseenter', () => {
    //   if (this._isMini()) {
    //     gsap.to(this.sidebarEl, { width: 280, duration: 0.4, ease: 'power3.out' });
    //   }
    // });

    // this.sidebarEl.addEventListener('mouseleave', () => {
    //   if (this._isMini()) {
    //     gsap.to(this.sidebarEl, { width: 72, duration: 0.4, ease: 'power3.out' });
    //   }
    // });
  }

  toggleMini() {
    this._isMini.update(v => !v);

    // GSAP animation for header + content move
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
}