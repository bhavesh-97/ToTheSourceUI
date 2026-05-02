// src/app/@core/services/gsap-master.service.ts
import { inject, Injectable, NgZone } from '@angular/core';
import { gsap } from 'gsap';
import { delay, Observable, of, from, map } from 'rxjs';
import { HttpClient, HttpContext } from '@angular/common/http';
import { GsapConfigLoaderService } from '../../../services/gsap-config-loader.service';
import { environment } from '../../../../environments/environment';
import { GsapConfig, GsapPage, GsapRule } from './gsap-interface';
import { ENCRYPTION_CONTEXT } from '../../../interceptors/encryption-interceptor';
import { JsonResponseModel } from '../../../models/JsonResponseModel';
@Injectable({ providedIn: 'root' })
export class GsapMasterService {
  private zone = inject(NgZone);
  private loader = inject(GsapConfigLoaderService);
  private previewElements: HTMLElement[] = [];
  private currentTimeline?: gsap.core.Timeline;
  private http = inject(HttpClient);
  private baseUrl = environment.CMSUrl;

  async getConfigsFromApi(configName: string = 'default'): Promise<GsapConfig> {
    return this.loader.load(configName);
  }

  async getPagesFromApi(configName: string = 'default'): Promise<Record<string, GsapPage>> {
    return this.loader.getPagesFromApi(configName);
  }

  getConfigs(projectCode: string): Observable<GsapConfig> {
    return from(this.getConfigsFromApi(projectCode)).pipe(
      map(config => config as GsapConfig),
      delay(100)
    );
  }
  
  getConfigForPage(pageId: string): Observable<GsapConfig> {
    return from(this.getConfigForPageAsync(pageId)).pipe(delay(50));
  }

  async getConfigForPageAsync(pageId: string): Promise<GsapConfig> {
    const pages = await this.getPagesFromApi('default');
    if (pages[pageId]) {
      return {
        global: this.getDefaultGlobal(),
        pages: { [pageId]: pages[pageId] },
        rules: pages[pageId].rules || [],
        callbacks: pages[pageId].callbacks || []
      };
    }
    return this.getDefaultConfig();
  }
  
  //#region Default Configs
  
  getDefaultConfig(): GsapConfig {
    return this.loader.getDefaultConfig();
  }
  
  getConfig(pageId: string): GsapConfig {
    return this.getDefaultConfig();
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
  //#endregion Default Configs

  //#region Animation Controls
    
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
  private createPreviewElements(container: HTMLElement) {
    container.innerHTML = `
      <div class="gsap-box" style="position: absolute; width: 50px; height: 50px; background: #ff6b6b; border-radius: 8px;"></div>
      <div class="gsap-box" style="position: absolute; left: 60px; width: 50px; height: 50px; background: #4ecdc4; border-radius: 8px;"></div>
      <div class="gsap-box" style="position: absolute; left: 120px; width: 50px; height: 50px; background: #45b7d1; border-radius: 8px;"></div>
    `;
    this.previewElements = Array.from(container.querySelectorAll('.gsap-box'));
  }

  killCurrent() {
    this.currentTimeline?.kill();
    this.previewElements.forEach(el => el.remove());
    this.previewElements = [];
  }

  applyAnimations(config: GsapConfig, container: HTMLElement) {
    this.zone.runOutsideAngular(() => {
      this.createPreviewElements(container);
      
      if (config.rules) {
        config.rules.forEach((rule: GsapRule) => {
          if (rule.status !== 'published') return;
          
          const elements = container.querySelectorAll(rule.selector);
          if (!elements.length) return;

          const from = rule.from || { opacity: 0, y: 30 };
          const to = rule.to || { opacity: 1, y: 0 };

          if (rule.scrollEnabled) {
            gsap.fromTo(elements, from, {
              ...to,
              duration: rule.duration || 1,
              ease: rule.ease || 'power2.out',
              scrollTrigger: {
                trigger: container,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
              }
            });
          } else {
            gsap.fromTo(elements, from, {
              ...to,
              duration: rule.duration || 1,
              ease: rule.ease || 'power2.out'
            });
          }
        });
      }
    });
  }

  pauseAnimation() {
    gsap.globalTimeline.pause();
  }

  playAnimation() {
    gsap.globalTimeline.play();
  }
  //#endregion Animation Controls
  
  //#region GSAP API 
 GetAllConfigs(encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(
      `${this.baseUrl}/GsapConfig/GetAllConfig`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  GetConfigById(configId: string, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(
      `${this.baseUrl}/GsapConfig/${configId}`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  GetConfigByName(configName: string, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(
      `${this.baseUrl}/GsapConfig/name/${configName}`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  GetPages(configId: string, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(
      `${this.baseUrl}/GsapConfig/pages/${configId}`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  GetPage(pageId: string, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(
      `${this.baseUrl}/GsapConfig/page/${pageId}`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  GetRule(ruleId: string, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(
      `${this.baseUrl}/GsapConfig/rule/${ruleId}`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }
  GetPluginsByPageId(pageId: string, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(
      `${this.baseUrl}/GsapConfig/plugins/${pageId}`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  GetRulesByPageId(pageId: string, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(
      `${this.baseUrl}/GsapConfig/GetRulesbyPageId/${pageId}`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  GetCallbacksByPageId(pageId: string, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(
      `${this.baseUrl}/GsapConfig/callbacks/${pageId}`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  GetGlobalDefaultsByPageId(pageId: string, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(
      `${this.baseUrl}/GsapConfig/globaldefaults/${pageId}`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  SaveGlobalDefaults(globalDefaults: any, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.post<JsonResponseModel>(
      `${this.baseUrl}/GsapConfig/globaldefaults`,
      globalDefaults,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  SaveConfig(config: any, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.put<JsonResponseModel>(
      `${this.baseUrl}/GsapConfig`,
      config,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  SavePage(page: any, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.put<JsonResponseModel>(
      `${this.baseUrl}/GsapConfig/page`,
      page,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  SaveRule(rule: any, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.put<JsonResponseModel>(
      `${this.baseUrl}/GsapConfig/rule`,
      rule,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  DeleteRule(ruleId: string, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.delete<JsonResponseModel>(
      `${this.baseUrl}/GsapConfig/rule/${ruleId}`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  SavePlugins(pageId: string, pluginIds: string[], encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.post<JsonResponseModel>(
      `${this.baseUrl}/GsapConfig/plugins`,
      { pageId, pluginIds },
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  DeletePage(pageId: string, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.delete<JsonResponseModel>(
      `${this.baseUrl}/GsapConfig/page/${pageId}`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  SaveCallback(callback: any, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.post<JsonResponseModel>(
      `${this.baseUrl}/GsapConfig/callback`,
      callback,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

// Mock save
  saveConfig(projectCode: string, config: GsapConfig): Observable<any> {
    return of({ success: true });
  }

  SaveGsapConfig(config: any, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.post<JsonResponseModel>(
      `${this.baseUrl}/GsapConfig/SaveConfig`,
      config,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }
  //#endregion GSAP API 
   
}