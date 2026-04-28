import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GsapConfigLoaderService } from '../../../services/gsap-config-loader.service';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-gsap-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="demo-container">
      <div class="demo-header">
        <h1>GSAP Auto Animation Demo</h1>
        <p>Add CSS classes below to elements - animations apply automatically!</p>
        <!-- <button (click)="runAnimations()" class="run-btn">▶ Run Animations Manually</button> -->
      </div>

      <!-- Fade Animations -->
      <section class="demo-section fade-up">
        <h2 class="fade-up">Fade Up Animation</h2>
        <p class="fade-up">This paragraph fades up automatically on load.</p>
        <div class="fade-up card-demo">
          <h3>Card with Fade Up</h3>
          <p>Add class <code>.fade-up</code> to any element</p>
        </div>
      </section>

      <section class="demo-section fade-in">
        <h2 class="fade-in">Fade In Animation</h2>
        <p class="fade-in">Simple fade in effect.</p>
      </section>

      <!-- Slide Animations -->
      <section class="demo-section">
        <h2>Slide Animations</h2>
        <div class="slide-in-left card-demo">
          <h3>Slide In Left</h3>
          <p>Class: <code>.slide-in-left</code></p>
        </div>
        <div class="slide-in-right card-demo">
          <h3>Slide In Right</h3>
          <p>Class: <code>.slide-in-right</code></p>
        </div>
      </section>

      <!-- Scale Animation -->
      <section class="demo-section">
        <h2>Scale Animations</h2>
        <div class="scale-in card-demo">
          <h3>Scale In</h3>
          <p>Class: <code>.scale-in</code></p>
        </div>
      </section>

      <!-- Blur Animation -->
      <section class="demo-section">
        <h2>Blur Animation</h2>
        <div class="blur-in card-demo">
          <h3>Blur In</h3>
          <p>Class: <code>.blur-in</code></p>
        </div>
      </section>

      <!-- Rotate/Flip -->
      <section class="demo-section">
        <h2>Rotate & Flip</h2>
        <div class="rotate-in card-demo">
          <h3>Rotate In</h3>
          <p>Class: <code>.rotate-in</code></p>
        </div>
        <div class="flip-in card-demo">
          <h3>Flip In</h3>
          <p>Class: <code>.flip-in</code></p>
        </div>
      </section>

      <!-- Bounce/Wobble -->
      <section class="demo-section">
        <h2>Bounce & Wobble</h2>
        <div class="bounce-in card-demo">
          <h3>Bounce In</h3>
          <p>Class: <code>.bounce-in</code></p>
        </div>
        <div class="wobble-in card-demo">
          <h3>Wobble</h3>
          <p>Class: <code>.wobble-in</code></p>
        </div>
      </section>

      <!-- Stagger Demo -->
      <section class="demo-section stagger-section">
        <h2>Stagger Animations (Multiple Items)</h2>
        <div class="stagger-list">
          <div class="stagger-item card-demo">Item 1</div>
          <div class="stagger-item card-demo">Item 2</div>
          <div class="stagger-item card-demo">Item 3</div>
          <div class="stagger-item card-demo">Item 4</div>
          <div class="stagger-item card-demo">Item 5</div>
        </div>
      </section>

      <!-- Stagger Cards -->
      <section class="demo-section">
        <h2>Card Stagger</h2>
        <div class="stagger-cards">
          <div class="stagger-card card-demo"><h3>Card 1</h3><p>Stagger effect</p></div>
          <div class="stagger-card card-demo"><h3>Card 2</h3><p>With delay</p></div>
          <div class="stagger-card card-demo"><h3>Card 3</h3><p>Animation</p></div>
        </div>
      </section>

      <!-- Reference -->
      <section class="demo-section reference">
        <h2>Available CSS Classes</h2>
        <table>
          <thead><tr><th>Class</th><th>Animation</th></tr></thead>
          <tbody>
            <tr><td><code>.fade-up</code></td><td>Fade + move up</td></tr>
            <tr><td><code>.fade-in</code></td><td>Simple fade</td></tr>
            <tr><td><code>.slide-in-left</code></td><td>Slide from left</td></tr>
            <tr><td><code>.slide-in-right</code></td><td>Slide from right</td></tr>
            <tr><td><code>.scale-in</code></td><td>Scale up</td></tr>
            <tr><td><code>.blur-in</code></td><td>Blur reveal</td></tr>
            <tr><td><code>.rotate-in</code></td><td>Rotate in</td></tr>
            <tr><td><code>.flip-in</code></td><td>3D flip</td></tr>
            <tr><td><code>.bounce-in</code></td><td>Bounce effect</td></tr>
            <tr><td><code>.wobble-in</code></td><td>Wobble effect</td></tr>
            <tr><td><code>.stagger-card</code></td><td>Card stagger</td></tr>
            <tr><td><code>.stagger-list</code></td><td>List stagger</td></tr>
          </tbody>
        </table>
      </section>
    </div>
  `,
  styles: [`
    .demo-container { padding: 40px; max-width: 1200px; margin: 0 auto; }
    .demo-header { text-align: center; margin-bottom: 40px; }
    .demo-header h1 { font-size: 2.5rem; margin-bottom: 10px; }
    .run-btn { padding: 12px 30px; background: #1976d2; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem; margin-bottom: 20px; }
    .run-btn:hover { background: #1565c0; }
    .demo-section { margin-bottom: 50px; padding: 20px; }
    .demo-section h2 { margin-bottom: 20px; color: #333; border-bottom: 2px solid #1976d2; padding-bottom: 10px; }
    .card-demo { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin: 10px 0; }
    .card-demo h3 { margin-top: 0; color: #1976d2; }
    .card-demo code { background: #f5f5f5; padding: 2px 8px; border-radius: 4px; color: #d32f2f; }
    .stagger-list { display: flex; flex-wrap: wrap; gap: 10px; }
    .stagger-item { padding: 15px 25px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .stagger-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
    table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; }
    th, td { padding: 15px; text-align: left; border-bottom: 1px solid #eee; }
    th { background: #1976d2; color: white; }
  `]
})
export class GsapDemoComponent implements OnInit, AfterViewInit {
  // private configLoader = inject(GsapConfigLoaderService);
  
  async ngOnInit() {
    // gsap.registerPlugin(ScrollTrigger);
    // await this.configLoader.load();
  }
  
  ngAfterViewInit() {
    // setTimeout(() => this.runAnimations(), 500);
  }
  
  // runAnimations() {
  //   const config: any = this.configLoader.getConfig();
  //   if (!config?.rules) {
  //     console.warn('No GSAP config loaded');
  //     return;
  //   }
    
  //   const rules = config.rules.filter((r: any) => r.status === 'published');
    
  //   rules.forEach((rule: any) => {
  //     const elements = document.querySelectorAll(rule.selector);
  //     if (!elements.length) return;
      
  //     gsap.fromTo(elements, 
  //       rule.from || { opacity: 0, y: 30 },
  //       {
  //         ...rule.to || { opacity: 1, y: 0 },
  //         duration: rule.duration || config.global?.defaults?.duration || 1,
  //         ease: rule.ease || config.global?.defaults?.ease || 'power2.out',
  //         stagger: rule.stagger || config.global?.defaults?.stagger || 0,
  //         scrollTrigger: rule.scrollEnabled ? { trigger: rule.trigger || rule.selector, start: 'top 85%' } : undefined
  //       }
  //     );
  //   });
    
  //   ScrollTrigger.refresh();
  //   console.log('GSAP animations applied:', rules.length);
  // }
}