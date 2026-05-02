import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PageDataService } from '../services/page-data.service';
import { FooterComponent, HeaderComponent } from "../../@theme/components";

@Component({
  selector: 'app-web-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <app-header />
    <main class="web-content">
      <router-outlet />
    </main>
    <app-footer />
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
    .web-content {
      min-height: calc(100vh - 140px);
    }
  `]
})
export class WebLayoutComponent implements OnInit {
  private pageDataService = inject(PageDataService);
  
  ngOnInit() {
    // this.gsapService.init();
  }
}