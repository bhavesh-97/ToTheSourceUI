// src/app/@core/services/gsap-master.service.ts
import { inject, Injectable, NgZone } from '@angular/core';
import { gsap } from 'gsap';
import { delay, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GsapConfig, GsapRule } from '../../../@core/animations/animationtypes';
import { GsapConfigLoaderService } from '../../../services/gsap-config-loader.service';
import { GsapConfigApiService, MGsapConfigWithPages, MGsapPageWithRules, MGsapRule } from '../../../services/gsap-config-api.service';
@Injectable({ providedIn: 'root' })
export class GsapMasterService {
  private zone = inject(NgZone);
  private loader = inject(GsapConfigLoaderService);
  private apiService = inject(GsapConfigApiService);
  private previewElements: HTMLElement[] = [];
  private currentTimeline?: gsap.core.Timeline;
  private apiUrl = '/api/gsap'; 
  // public readonly MOCK_CONFIG: GsapConfig = {
  // global: {
  //   defaults: { duration: 1, ease: 'power2.out' },
  //   registerPlugins: ['ScrollTrigger'],
  //   autoInit: true,
  //   meta: { version: '1.0', description: 'GSAP master configuration' },
  //   version: 1,
  //   status: 'published'
  // },
  // rules: [
  //   {
  //     id: 'fadeUp',
  //     label: 'Fade Up',
  //     type: 'tween',
  //     selector: '.fade-up',
  //     from: { opacity: 0, y: 40 },
  //     to: { opacity: 1, y: 0 },
  //     stagger: { each: 0.1 },
  //     scrollTrigger: { enabled: true, start: 'top 85%' },
  //     version: 1,
  //     status: 'published',
  //     media: { type: 'none', url: '', id: '', selector: '' }, 
  //     styles: { background: 'blue', color: 'white' }
  //   },
  //   {
  //     id: 'masterTimeline',
  //     label: 'Master Timeline',
  //     type: 'timeline',
  //     selector: '.timeline-section',
  //     defaults: { duration: 1, ease: 'power1.out' },
  //     scrollTrigger: { enabled: true, trigger: '.timeline-section', start: 'top 80%', scrub: true },
  //     version: 1,
  //     status: 'published',
  //     media: { type: 'none', url: '', id: '', selector: '' }, 
  //     styles: {},
  //     sequence: [
  //       {
  //         selector: '.tl-item-1',
  //         from: { opacity: 0, y: 40 },
  //         to: { opacity: 1, y: 0 },
  //         order: 1,
  //         styles: { background: 'green' },
  //         media: { type: 'none', url: '', id: '', selector: '' }   
  //       },
  //       {
  //         selector: '.tl-item-2',
  //         from: { opacity: 0, y: 40 },
  //         to: { opacity: 1, y: 0 },
  //         order: 2,
  //         styles: { background: 'red' },
  //         media: { type: 'none', url: '', id: '', selector: '' }   
  //       }
  //     ]
  //   }
  // ],
  // callbacks: [
  //   { name: 'onFadeUpComplete', script: "console.log('Fade up finished');" }
  // ]
  // };
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
    const config = this.loader.getConfig();
    if (config) {
      return of(config as GsapConfig).pipe(delay(100));
    }
    return of(this.getPageConfigStructure('default')).pipe(delay(100));
  }
  
  getConfigForPage(pageId: string): Observable<GsapConfig> {
    const config = this.getConfig(pageId);
    return of(config).pipe(delay(50));
  }
  
  getDefaultConfig(): GsapConfig {
    return this.getConfig('default');
  }
  
  getConfig(pageId: string): GsapConfig {
    const fullConfig = this.loader.getConfig();
    
    if (!fullConfig) {
      return this.getPageConfigStructure(pageId);
    }
    
    const pages = fullConfig as any;
    
    if (pages.pages && pages.pages[pageId]) {
      return {
        global: pages.global || this.getDefaultGlobal(),
        rules: pages.pages[pageId].rules || [],
        callbacks: pages.pages[pageId].callbacks || []
      };
    }
    
    return this.getPageConfigStructure(pageId);
  }
  
  private getPageConfigStructure(pageId: string): GsapConfig {
    return this.getConfigFromJson(pageId);
  }
  
  private getConfigFromJson(pageId: string): GsapConfig {
    const config = this.loader.getConfig() as any;
    
    if (config?.pages?.[pageId]) {
      return {
        global: config.global || this.getDefaultGlobal(),
        rules: config.pages[pageId].rules || [],
        callbacks: config.pages[pageId].callbacks || []
      };
    }
    
    return {
      global: this.getDefaultGlobal(),
      rules: [
        {
          id: 'defaultFadeUp',
          label: 'Default Fade Up',
          selector: '.fade-up',
          from: { opacity: 0, y: 50 },
          to: { opacity: 1, y: 0 },
          type: 'tween' as const,
          stagger: { each: 0.1 },
          scrollTrigger: { enabled: true },
          version: 1,
          status: 'published' as const,
          media: { type: 'none' as const, url: '', id: '', selector: '' }
        }
      ],
      callbacks: []
    };
  }
  
private getDefaultGlobal(): any {
    return {
      defaults: { duration: 1, ease: 'power2.out' },
      registerPlugins: ['ScrollTrigger'],
      autoInit: true,
      meta: { version: '1.0', description: 'GSAP config' },
      version: 1,
      status: 'published'
    };
  }

  // API Methods using backend
  GetAllConfigs(encryptPayload = false): Observable<any> {
    return this.apiService.GetConfigByName('default', encryptPayload);
  }

  GetConfigById(configId: string, encryptPayload = false): Observable<any> {
    return this.apiService.GetConfigById(configId, encryptPayload);
  }

  GetPages(configId: string, encryptPayload = false): Observable<any> {
    return this.apiService.GetPagesWithRules(configId, encryptPayload);
  }

  GetPage(pageId: string, encryptPayload = false): Observable<any> {
    return this.apiService.GetPageWithRules(pageId, encryptPayload);
  }

  GetRule(ruleId: string, encryptPayload = false): Observable<any> {
    return this.apiService.GetRuleWithDetails(ruleId, encryptPayload);
  }

  SaveConfig(config: any, encryptPayload = false): Observable<any> {
    return this.apiService.UpdateConfig(config, encryptPayload);
  }

  SavePage(page: any, encryptPayload = false): Observable<any> {
    return this.apiService.UpdatePage(page, encryptPayload);
  }

  SaveRule(rule: any, encryptPayload = false): Observable<any> {
    return this.apiService.UpdateRule(rule, encryptPayload);
  }

  DeleteRule(ruleId: string, encryptPayload = false): Observable<any> {
    return this.apiService.DeleteRule(ruleId, encryptPayload);
  }

  DeletePage(pageId: string, encryptPayload = false): Observable<any> {
    return this.apiService.DeletePage(pageId, encryptPayload);
  }
 // Mock save (just logs for now)
  saveConfig(projectCode: string, config: GsapConfig): Observable<any> {
    // console.log('Mock save for project:', projectCode, config);
    return of({ success: true });
  }
  killCurrent() {
    this.currentTimeline?.kill();
    this.previewElements.forEach(el => el.remove());
    this.previewElements = [];
  }
  
}