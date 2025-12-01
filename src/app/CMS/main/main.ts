// src/app/CMS/main/main.component.ts
import { Component, ViewChild, AfterViewInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { gsap } from 'gsap';
import { HeaderComponent } from '../../@theme/components/header/header.component';
import { SidebarComponent } from '../../@theme/components/sidebar/sidebar';
import { FooterComponent } from '../../@theme/components';
import { GsapService } from '../../services/gsap.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class MainComponent{
  constructor(private gsapService: GsapService) {}
  
  ngAfterViewInit() {
    (this.gsapService as any).run?.();
  }
 isDark = signal(false);
  toggleDark() {
    this.isDark.update(v => !v);
  }
}