// src/app/@core/services/gsap-master.service.ts
import { inject, Injectable, NgZone } from '@angular/core';
import { gsap } from 'gsap';
import { delay, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GsapConfig } from '../../../@core/animations/animationtypes';
@Injectable({ providedIn: 'root' })
export class GsapMasterService {
  private zone = inject(NgZone);
  private previewElements: HTMLElement[] = [];
  private currentTimeline?: gsap.core.Timeline;
  private apiUrl = '/api/gsap'; 
  public readonly MOCK_CONFIG: GsapConfig = {
  global: {
    defaults: { duration: 1, ease: 'power2.out' },
    registerPlugins: ['ScrollTrigger'],
    autoInit: true,
    meta: { version: '1.0', description: 'GSAP master configuration' },
    version: 1,
    status: 'published'
  },
  rules: [
    {
      id: 'fadeUp',
      label: 'Fade Up',
      type: 'tween',
      selector: '.fade-up',
      from: { opacity: 0, y: 40 },
      to: { opacity: 1, y: 0 },
      stagger: { each: 0.1 },
      scrollTrigger: { enabled: true, start: 'top 85%' },
      version: 1,
      status: 'published',
      media: { type: 'none', url: '', id: '', selector: '' }, 
      styles: { background: 'blue', color: 'white' }
    },
    {
      id: 'masterTimeline',
      label: 'Master Timeline',
      type: 'timeline',
      selector: '.timeline-section',
      defaults: { duration: 1, ease: 'power1.out' },
      scrollTrigger: { enabled: true, trigger: '.timeline-section', start: 'top 80%', scrub: true },
      version: 1,
      status: 'published',
      media: { type: 'none', url: '', id: '', selector: '' }, 
      styles: {},
      sequence: [
        {
          selector: '.tl-item-1',
          from: { opacity: 0, y: 40 },
          to: { opacity: 1, y: 0 },
          order: 1,
          styles: { background: 'green' },
          media: { type: 'none', url: '', id: '', selector: '' }   
        },
        {
          selector: '.tl-item-2',
          from: { opacity: 0, y: 40 },
          to: { opacity: 1, y: 0 },
          order: 2,
          styles: { background: 'red' },
          media: { type: 'none', url: '', id: '', selector: '' }   
        }
      ]
    }
  ],
  callbacks: [
    { name: 'onFadeUpComplete', script: "console.log('Fade up finished');" }
  ]
  };
  private http = inject(HttpClient);

  // Run GSAP from string code (e.g., from CKEditor)
  runCode(code: string, container: HTMLElement) {
    this.killCurrent();
    this.createPreviewElements(container);

    // Safely eval code in zone (GSAP is DOM-safe)
    try {
      this.zone.runOutsideAngular(() => {
        const func = new Function('gsap', 'elements', code);
        func(gsap, this.previewElements);
      });
    } catch (error) {
      console.error('GSAP Code Error:', error);
    }
  }

  // Load preset from dropdown
  // loadPreset(presetId: string, container: HTMLElement) {
  //   this.configService.getById(presetId).subscribe(config => {
  //     if (config) {
  //       const code = this.generateGsapCodeFromConfig(config);
  //       this.runCode(code, container);
  //     }
  //   });
  // }

  // Generate GSAP code from your AnimationConfig (for presets)
  // public generateGsapCodeFromConfig(config: AnimationConfig): string {
  //   return `
  //     gsap.timeline({ repeat: ${config.loop ? -1 : 0}, yoyo: true })
  //       .to(elements, {
  //         duration: ${config.duration || 2},
  //         rotation: 360,
  //         scale: 1.5,
  //         stagger: 0.1,
  //         ease: "power2.inOut"
  //       });
  //   `;
  // }

  // Create sample DOM elements for preview
  private createPreviewElements(container: HTMLElement) {
    container.innerHTML = `
      <div class="gsap-box" style="position: absolute; width: 50px; height: 50px; background: #ff6b6b; border-radius: 8px;"></div>
      <div class="gsap-box" style="position: absolute; left: 60px; width: 50px; height: 50px; background: #4ecdc4; border-radius: 8px;"></div>
      <div class="gsap-box" style="position: absolute; left: 120px; width: 50px; height: 50px; background: #45b7d1; border-radius: 8px;"></div>
    `;
    this.previewElements = Array.from(container.querySelectorAll('.gsap-box'));
  }

getConfigs(projectCode: string): Observable<GsapConfig> {
    // Simulate a delay like a real API (optional)
    return of(this.MOCK_CONFIG).pipe(delay(500));
  }
getDefaultConfig(): GsapConfig {
    return JSON.parse(JSON.stringify(this.MOCK_CONFIG));
  }
  getConfig(pageId: string): GsapConfig {
    const config = structuredClone(this.MOCK_CONFIG); // deep clone

    // Page-specific overrides
    switch (pageId) {
      case 'landing':
        config.rules.push({
          id: 'heroFade',
          label: 'Hero Fade In',
          type: 'tween',
          selector: '.hero-title',
          from: { opacity: 0, y: 50 },
          to: { opacity: 1, y: 0 },
          version: 1,
          status: 'published',
          media: { type: 'none', url: '', id: '', selector: ''}
        });
        break;

      case 'home':
        config.rules.push({
          id: 'contentStagger',
          label: 'Content Stagger',
          type: 'tween',
          selector: '.home-content',
          from: { opacity: 0, scale: 0.9 },
          to: { opacity: 1, scale: 1 },
          stagger: { each: 0.2 },
          version: 1,
          status: 'published',
          media: { type: 'none', url: '', id: '', selector: '' }
        });
        break;

      // Add more pages here easily
      // case 'about': ...
    }

    return config;
  }

  // Mock save (just logs for now)
  saveConfig(projectCode: string, config: GsapConfig): Observable<any> {
    console.log('Mock save for project:', projectCode, config);
    return of({ success: true });
  }
  killCurrent() {
    this.currentTimeline?.kill();
    this.previewElements.forEach(el => el.remove());
    this.previewElements = [];
  }
  
}