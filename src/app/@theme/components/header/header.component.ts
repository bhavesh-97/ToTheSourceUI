import { Component, inject, signal, ViewChild, AfterViewInit, OnDestroy, Output, EventEmitter, HostListener, OnInit } from '@angular/core';
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
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SelectModule } from 'primeng/select';
import { SearchInputComponent } from '../search-input/search-input.component';
import { LoginService } from '../../../authentication/login/login.service';
import { MUser } from '../../../models/MUser';
import { ImageModule } from 'primeng/image';
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
    ImageModule,
    InputTextModule,
    ToggleButtonModule,
    SelectModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Output() toggleSidebar = new EventEmitter<void>();
  private loginService = inject(LoginService);
  isDarkMode = document.body.classList.contains('dark');
  user: MUser | null = null;
  showProfileDropdown = false;

  ngOnInit(): void {
    this.user = this.loginService.getUserInfo();
  const saved = localStorage.getItem("darkMode") === "1";
  this.isDarkMode = saved;

  if (saved) {
    document.body.classList.add("p-dark");
  }
  }
  toggleProfileDropdown() {
    this.showProfileDropdown = !this.showProfileDropdown;
    setTimeout(() => {
      const dropdown = document.getElementById("profileMenu");
      if (!dropdown) return;

      if (this.showProfileDropdown) {
        gsap.fromTo(dropdown, 
          { opacity: 0, y: -10, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: "power3.out" }
        );
        gsap.from(dropdown.querySelectorAll(".menu-item"), {
          opacity: 0,
          x: -8,
          duration: 0.18,
          stagger: 0.04,
          ease: "power1.out"
        });
      }
    }, 10);
  }

  @HostListener('document:click', ['$event'])
  closeOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest(".profile-wrapper") && this.showProfileDropdown) {
      this.showProfileDropdown = false;
    }
  }

  onMenuAction(action: string) {
    switch (action) {
      case 'publicProfile': this.openPublicProfile(); break;
      case 'myProfile': this.openMyProfile(); break;
      case 'myAccount': this.openMyAccount(); break;
      case 'changeLanguage': this.changeLanguage(); break;
      case 'toggleDarkMode': this.toggleDarkMode(); break;
      case 'logout': this.logout(); break;
    }
  }

toggleDarkMode() {
  const html = document.documentElement; 
  html.classList.toggle('my-app-dark');
  const enabled = html.classList.contains('my-app-dark');
  localStorage.setItem('darkMode', enabled ? '1' : '0');
}

  getIconClass(icon: string) {
    if (!icon) return '';
    return icon.startsWith('pi ') || icon.startsWith('fa ') || icon.startsWith('bi ') ? icon : icon;
  }

  logout() { this.loginService.logout(); }
  openPublicProfile() {}
  openMyProfile() {}
  openMyAccount() {}
  changeLanguage() {}
}