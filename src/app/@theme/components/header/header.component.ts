import { Component, inject, signal, ViewChild, AfterViewInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { gsap } from 'gsap';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { MenuItem } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SearchInputComponent } from '../search-input/search-input.component';
import { LoginService } from '../../../authentication/login/login.service';
import { MUser } from '../../../models/MUser';

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
    SelectModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
 @Output() toggleSidebar = new EventEmitter<void>();
 private loginService = inject(LoginService);

  user: MUser | null = null;
  showProfileDropdown = false;

  ngOnInit(): void {
    debugger;
    this.user = this.loginService.getUserInfo(); 
  }

  toggleProfileDropdown() {
    this.showProfileDropdown = !this.showProfileDropdown;

    const dropdownEl = document.querySelector('.profile-dropdown') as HTMLElement;
    if (!dropdownEl) return;

    // GSAP animation
    if (this.showProfileDropdown) {
      gsap.fromTo(
        dropdownEl,
        { opacity: 0, y: -10, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: 'power3.out', pointerEvents: 'auto' }
      );
    } else {
      gsap.to(dropdownEl, { opacity: 0, y: -10, scale: 0.95, duration: 0.2, ease: 'power3.in', pointerEvents: 'none' });
    }
  }

  logout() {
    this.loginService.logout(); // Implement logout logic
  }
}