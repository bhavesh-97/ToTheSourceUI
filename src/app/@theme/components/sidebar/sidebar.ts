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
import { LoginService } from '../../../authentication/login/login.service';
import { MUserMenuIDAM } from '../../../models/usermenuidem';

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
  private loginService = inject(LoginService);
  private el = inject(ElementRef);
  menuItems: MUserMenuIDAM[] = [];
  opened: Record<string, boolean> = {};

  ngOnInit(): void {
      this.menuItems = this.loginService.getMenuList(); 
  }
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
    if (this._isMini()) {
        this.opened = {};
      }
    const sidebarWidth = this._isMini() ? 72 : 280;
    gsap.to(this.sidebarEl, {
      width: sidebarWidth,
      duration: 0.4,
      ease: 'power3.inOut'
    });

    gsap.to(mainArea, {
      marginLeft: sidebarWidth,
      duration: 0.4,
      ease: 'power3.inOut'
    });
     Object.keys(this.opened).forEach(label => {
      const menuEl = this.sidebarEl.querySelector(`.child-menu[data-label="${label}"]`);
      if (menuEl) {
        gsap.to(menuEl, { autoAlpha: this.opened[label] ? 1 : 0, duration: 0.3 });
      }
    });
  }

  isMini(): boolean {
    return this._isMini();
  }

  // toggleChild(label: string) {
  //   this.opened[label] = !this.opened[label];
  // }
  toggleChild(label: string, hasChildren: boolean) {
  if (this._isMini() && hasChildren) {
    this.toggleMini(); 
  }
  this.opened[label] = !this.opened[label];
  const menuEl = this.sidebarEl.querySelector(`.child-menu[data-label="${label}"]`) as HTMLElement;
  if (menuEl) {
      gsap.to(menuEl, {
        height: this.opened[label] ? 'auto' : 0,
        opacity: this.opened[label] ? 1 : 0,
        duration: 0.3,
        ease: 'power3.inOut'
      });
   }
}
}