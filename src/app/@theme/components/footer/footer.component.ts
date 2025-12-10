import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <footer class="footer-container">
      <div class="footer-inner">

        <div class="footer-brand">
          <!-- <img src="assets/images/product/To the Source Icon.png" alt="logo" class="footer-logo" /> -->
          <!-- <span class="footer-title">To The Source</span> -->
        </div>

        <div class="footer-center">
          <span class="tagline">
            © 2025 To The Source — Empowering Creative Experiences
          </span>
        </div>

        <div class="footer-socials">
          <a href="#" aria-label="Github"><i class="ion ion-social-github"></i></a>
          <a href="#" aria-label="Facebook"><i class="ion ion-social-facebook"></i></a>
          <a href="#" aria-label="Twitter"><i class="ion ion-social-twitter"></i></a>
          <a href="#" aria-label="LinkedIn"><i class="ion ion-social-linkedin"></i></a>
        </div>

      </div>
    </footer>
  `,
})
export class FooterComponent {}
