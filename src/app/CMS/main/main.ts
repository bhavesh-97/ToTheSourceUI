// src/app/CMS/main/main.component.ts
import { Component, ViewChild, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { gsap } from 'gsap';
import { HeaderComponent } from '../../@theme/components/header/header.component';
import { SidebarComponent } from '../../@theme/components/sidebar/sidebar';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
  ],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class MainComponent implements AfterViewInit, OnDestroy {
  @ViewChild(SidebarComponent) sidebar!: SidebarComponent;

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = true;
  breadcrumb = ['Home', 'Account', 'Settings'];

  ngAfterViewInit() {
    this.simulateLoading();
    this.setupGSAP();
  }

  ngOnDestroy() {
    this.tl?.kill();
  }

  private tl: any;

  // Fixed: toggleSidebar method
  toggleSidebar() {
    this.sidebar.toggle();
  }

  private simulateLoading() {
    setTimeout(() => {
      this.isLoading = false;
      this.animateContent();
    }, 800);
  }

  private setupGSAP() {
    gsap.from('.sticky-header', {
      y: -20,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
      delay: 0.2,
    });
  }

  private animateContent() {
    this.tl = gsap.from('.page-content > *', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
    });
  }
}