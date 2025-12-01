import { Component, ViewChild, ElementRef, AfterViewInit, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { forkJoin, Subject } from 'rxjs';
import { debounceTime, map, takeUntil } from 'rxjs/operators';
import { GsapMasterService } from './gsap-master.service';

export interface GsapSequenceStep {
  selector: string;
  from?: Record<string, any>;
  to?: Record<string, any>;
  order: number;
  timeline?: GsapRule; 
  styles?: Record<string, string>; 
  media?: GsapMedia; 
}
export interface GsapMedia {
  type: 'image' | 'video' | 'audio' | 'none';
  url: string;
}
type MediaType = 'image' | 'video' | 'audio' | 'none';
export interface GsapRule {
  id: string;
  label: string;
  type: 'tween' | 'timeline';
  selector: string;
  from?: Record<string, any>;
  to?: Record<string, any>;
  defaults?: Record<string, any>;
  stagger?: { each: number };
  scrollTrigger?: Record<string, any>;
  version: number;
  status: 'draft' | 'published' | 'archived'; 
  sequence?: GsapSequenceStep[];
  media: GsapMedia;
  styles?: Record<string, string>;
  description?: string;
  tags?: string[];
}
export interface GsapCallback {
  name: string;
  script: string;
}

export interface GsapGlobal {
  defaults: { duration: number; ease: string };
  registerPlugins: string[];
  autoInit: boolean;
  meta: { version: string; description: string };
  version: number;
  status: string;
}

export interface PageConfig {
  id: string;
  title: string;
  description?: string;
  gsapConfig?: GsapConfig; 
}

export interface GsapConfig {
  global: GsapGlobal;
  rules: GsapRule[];
  callbacks: GsapCallback[];
}

@Component({
  selector: 'app-gsap-master',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    TableModule, 
    ButtonModule, 
    CheckboxModule,
    DialogModule
  ],
  templateUrl: './gsap-master.html',
  styleUrl: './gsap-master.css'
})
export class GsapMaster implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('previewContainer', { static: false }) previewContainer!: ElementRef<HTMLDivElement>;
  private gsapConfigService = inject(GsapMasterService);
  pages: PageConfig[] = [];
  selectedPage: PageConfig | null = null;
  newPageTitle = '';
  projectCode = '';
  config: GsapConfig | null = null;
  configJson = '';
  activeTab: 'global' | 'rules' | 'callbacks' | 'json' = 'global';

  showEditDialog = false;
  showAddPageDialog = false;
  editMode: 'rule' | 'callback' | null = null;
  editingIndex: number | null = null;
  editingRule: GsapRule = {} as GsapRule;
  editingRuleFromJson = '';
  editingRuleToJson = '';
  editingRuleStylesJson = '{}';
  editingCallback: GsapCallback = { name: '', script: '' };

  private changeSubject = new Subject<void>();
  private destroy$ = new Subject<void>();

  constructor() {
    gsap.registerPlugin(ScrollTrigger);

    this.changeSubject.pipe(
      debounceTime(500),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      if (this.selectedPage?.gsapConfig) {
        this.config = this.selectedPage.gsapConfig;
        this.applyConfig();
      }
    });
  }

  ngOnInit() {
    this.projectCode = 'test-project';
    this.loadPages();
  }

  ngAfterViewInit() {
    if (this.selectedPage && this.config) {
      this.resetPreview(); 
      this.applyConfig();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


  private deepClone<T>(obj: T): T {
    if (obj === null || obj === undefined) return obj as T;
    return JSON.parse(JSON.stringify(obj, (key, value) => {
      if (value === undefined) return null; 
      return value;
    })) as T;
  }
  private validateSelectorBestPractice(selector: string | undefined): string | null {
    if (!selector || typeof selector !== 'string') {
      return null; 
    }
    if (selector.includes('*')) {
      return 'Avoid universal selector (*); use specific classes/IDs for performance.';
    }
    if (selector.split(' ').length > 3) {
      return 'Deep selectors (>3 levels) may impact performance; consider flatter structure.';
    }
    return null;
  }

 getSelectorWarning(selector: string | undefined): string | null {
    return this.validateSelectorBestPractice(selector);
  }

  loadPages() {
    const pageKeys = ['landing', 'home'];
    const loaders = pageKeys.map(key =>
    this.gsapConfigService.getConfigs(key).pipe(
        map(config => ({
          id: key,
          title: key === 'landing' ? 'Landing Page' : 'Home Page',
          description: key === 'landing' ? 'Hero animations' : 'Content fades',
          gsapConfig: config
        }))
      )
    );

    forkJoin(loaders).subscribe(pages => {
      this.pages = pages;
      this.selectPage(this.pages[0]);
    });
  }

  addPage() {
      if (!this.newPageTitle.trim()) return;
      const newPage: PageConfig = {
        id: 'page-' + Date.now(),
        title: this.newPageTitle.trim(),
        description: `New ${this.newPageTitle} page`,
        gsapConfig: this.gsapConfigService.getDefaultConfig()
        // gsapConfig: this.getMockConfig(this.newPageTitle.toLowerCase().replace(/\s+/g, '-'))
      };
      this.pages.push(newPage);
      this.newPageTitle = '';
      this.showAddPageDialog = false;
      this.selectPage(newPage);
    }
  getMediaIcon(type: string): string {
    switch (type) {
      case 'image': return 'pi-image';
      case 'video': return 'pi-video';
      case 'audio': return 'pi-volume-up';
      default: return 'pi-times';
    }
  }
  private getMediaElement(media: { type: string; url: string }): string {
    switch (media.type) {
      case 'image': return `<img src="${media.url}" alt="Preview Image" style="max-width: 100%; height: auto;">`;
      case 'video': return `<video src="${media.url}" controls style="max-width: 100%; height: auto;"></video>`;
      case 'audio': return `<audio src="${media.url}" controls></audio>`;
      default: return '';
    }
  }
  selectPage(page: PageConfig) {
    this.selectedPage = page;
    this.config = page.gsapConfig || null;
    this.configJson = this.config ? JSON.stringify(this.config, null, 2) : '';
    this.syncJsonToForms();
      if (this.previewContainer) {
      this.resetPreview();
      this.applyConfig();
    }
  }
  deletePage(index: number) {
    if (confirm(`Delete ${this.pages[index].title}?`)) {
      this.pages.splice(index, 1);
      if (this.selectedPage?.id === this.pages[index]?.id) {
        this.selectedPage = this.pages[0] || null;
        this.config = this.selectedPage?.gsapConfig || null;
      }
    }
  }

  loadConfig() {
    if (!this.selectedPage) return;
    this.gsapConfigService.getConfigs(this.projectCode + '-' + this.selectedPage.id).subscribe({
      next: (data: GsapConfig) => {
        this.selectedPage!.gsapConfig = data;
        this.config = data;
        this.configJson = JSON.stringify(data, null, 2);
        this.syncJsonToForms();
        this.applyConfig();
      },
      error: (err: any) => console.error('Failed to load config:', err)
    });
  }

  onFormChange() {
    this.syncFormsToJson();
    this.changeSubject.next();
  }

  onDialogChange() {
    this.changeSubject.next();
  }

  private syncJsonToForms() {
    if (!this.config) return;
    const safeConfig = this.deepClone(this.config);
    this.configJson = JSON.stringify(safeConfig, null, 2);
  }

  onJsonChange(event: any) {
    try {
      const parsed = JSON.parse(event.target.value);
      this.config = this.deepClone(parsed);
      if (this.selectedPage) {
        // this.selectedPage.gsapConfig = this.config;
        this.selectedPage!.gsapConfig = this.config ?? undefined;
      }
      this.syncFormsToJson();
      this.changeSubject.next();
    } catch (e) {
      console.warn('Invalid JSON:', e);
    }
  }

  private syncFormsToJson() {
    if (!this.config) return;
    const safeConfig = this.deepClone(this.config);
    this.configJson = JSON.stringify(safeConfig, null, 2);
  }

  private applyNestedTimeline(tl: gsap.core.Timeline, steps: GsapSequenceStep[], container: HTMLElement, parentSelector?: string) {
    steps
      .sort((a, b) => a.order - b.order)
      .forEach(step => {
        const fullSelector = parentSelector ? `${parentSelector} ${step.selector}` : step.selector;
        const elements = container.querySelectorAll(fullSelector);
        if (elements.length === 0) return;

        if (step.styles) {
          gsap.set(elements, this.deepClone(step.styles));
        }

        if (step['timeline']) {
          const nestedTl = gsap.timeline();
          tl.add(nestedTl, '<');
          this.applyNestedTimeline(nestedTl, step['timeline'].sequence || [], container, fullSelector);
        } else {
          const clonedFrom = this.deepClone(step.from || {});
          const clonedTo = this.deepClone(step.to || {});
          tl.fromTo(elements, clonedFrom, clonedTo, '<0.1');
        }
      });
  }

  applyConfig() {
    if (!this.config || !this.previewContainer) {
    console.warn('Apply not ready: config or container missing.');
    return;
  }

    gsap.killTweensOf('*');
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    const safeConfig = this.deepClone(this.config);
    this.syncFormsToJson();

    const global = safeConfig.global;
    gsap.defaults({ duration: global.defaults.duration, ease: global.defaults.ease });

    safeConfig.rules.forEach(rule => {
      if (rule.status !== 'published') return;
      const elements = this.previewContainer.nativeElement.querySelectorAll(rule.selector);
      if (elements.length === 0) return;

      const warning = this.validateSelectorBestPractice(rule.selector);
      if (warning) console.warn(`Selector best practice: ${warning}`);

      if (rule.styles) {
        gsap.set(elements, this.deepClone(rule.styles));
      }

      const clonedFrom = this.deepClone(rule.from || {});
      const clonedTo = this.deepClone(rule.to || {});
      const clonedStagger = this.deepClone(rule.stagger || {});
      const clonedScrollTrigger = this.deepClone(rule.scrollTrigger || {});
      const clonedDefaults = this.deepClone(rule.defaults || {});

      if (rule.type === 'tween') {
        gsap.fromTo(elements, clonedFrom, {
          ...this.deepClone(clonedTo),
          ...clonedStagger,
          ...clonedScrollTrigger,
          onComplete: () => this.executeCallback('onFadeUpComplete')
        });
      } else if (rule.type === 'timeline') {
        const tlVars = this.deepClone(clonedScrollTrigger);
        const tl = gsap.timeline({
          ...tlVars,
          defaults: clonedDefaults
        });
        if (rule.sequence) {
          this.applyNestedTimeline(tl, rule.sequence, this.previewContainer.nativeElement);
        }
      }
    });

    safeConfig.callbacks.forEach(cb => {
      if (cb.script) {
        try {
          eval(cb.script);
        } catch (e) {
          console.error('Callback error:', e);
        }
      }
    });

    ScrollTrigger.refresh();
  }

  saveConfig() {
    if (!this.selectedPage || !this.config) return;

    this.gsapConfigService.saveConfig(this.projectCode + '-' + this.selectedPage.id, this.config).subscribe({
      next: () => {
        // this.selectedPage!.gsapConfig = this.config;
        this.selectedPage!.gsapConfig = this.config ?? undefined;
        // console.log(`Config saved for ${this.selectedPage.title}`);
      },
      error: (err) => console.error('Save failed:', err)
    });
  }

  addRule() {
    const newRule: GsapRule = {
      id: 'rule-' + Date.now(),
      label: 'New Rule',
      type: 'tween',
      selector: '.new-element',
      from: { opacity: 0, y: 40 },
      to: { opacity: 1, y: 0 },
      version: 1,
      status: 'published',
      styles: {},
      media: { type: 'none', url: '' } 
    };
    if (this.config) {
      this.config.rules.push(newRule);
    }
    this.syncFormsToJson();
  }

  editRule(index: number, id : any) {
    if (!this.config || !this.config || index < 0 || index >= this.config.rules.length) {
      return;
    }
    this.editMode = 'rule';
    this.editingIndex = index;
    const ruleIndex =  this.config.rules.findIndex(r => r.id === id);
    const rule = this.config.rules[ruleIndex];
    this.editingRule = this.deepClone(rule);
    
    if (!this.editingRule.media) {
      this.editingRule.media = { type: 'none', url: '' };
    }

    this.editingRuleFromJson = JSON.stringify(this.editingRule.from || {}, null, 2);
    this.editingRuleToJson = JSON.stringify(this.editingRule.to || {}, null, 2);
    this.editingRuleStylesJson = JSON.stringify(this.editingRule.styles || {}, null, 2);
    this.editingRule.selector ??= '';
    this.editingRule.label ??= 'New Rule';
    this.editingRule.type ??= 'tween';

    this.showEditDialog = true;
  }

deleteRule(index: number) {
  if (!this.config || !this.config.rules || index < 0 || index >= this.config.rules.length) {
    console.warn('Cannot delete: Invalid config or index.');
    return;
  }
  this.config.rules.splice(index, 1);
  this.syncFormsToJson();
}

  addCallback() {
    const newCb: GsapCallback = { name: 'newCallback', script: 'console.log("New callback");' };
    if (this.config) {
      this.config.callbacks.push(newCb);
    }
    this.syncFormsToJson();
  }

  editCallback(index: number) {
    this.editMode = 'callback';
    this.editingIndex = index;
    this.editingCallback = { ...this.config!.callbacks[index] };
    this.showEditDialog = true;
  }

  deleteCallback(index: number) {
    if (this.config) {
      this.config.callbacks.splice(index, 1);
    }
    this.syncFormsToJson();
  }

  addNestedStep() {
    if (!this.editingRule.sequence) this.editingRule.sequence = [];
    this.editingRule.sequence.push({
      selector: '',
      order: this.editingRule.sequence.length + 1,
      from: {},
      to: {},
      styles: {},
      timeline: undefined
    });
  }

  saveEdit() {
    if (this.editMode === 'rule' && this.editingIndex !== null && this.config) {
      try {
        this.editingRule.media = {  
                type: this.editingRule.media?.type || 'none',
                url: this.editingRule.media?.url || ''
          };
        this.editingRule.from = JSON.parse(this.editingRuleFromJson || '{}');
        this.editingRule.to = JSON.parse(this.editingRuleToJson || '{}');
        this.editingRule.styles = JSON.parse(this.editingRuleStylesJson || '{}');
      } catch (e) {
        console.error('Invalid JSON in rule:', e);
        return;
      }
      
      this.config.rules[this.editingIndex] = this.deepClone(this.editingRule);
    } else if (this.editMode === 'callback' && this.editingIndex !== null && this.config) {
      this.config.callbacks[this.editingIndex] = this.editingCallback;
    }
    this.syncFormsToJson();
    this.cancelEdit();
  }

  cancelEdit() {
    this.showEditDialog = false;
    this.editMode = null;
    this.editingIndex = null;
  }

  private executeCallback(name: string) {
    const cb = this.config?.callbacks.find(c => c.name === name);
    if (cb?.script) {
      eval(cb.script);
    }
  }

  resetPreview() {
    debugger
    if (!this.config || !this.previewContainer) {
        console.warn('Preview not ready: config or container missing.');
        return;
      }
        gsap.killTweensOf('*');
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  
        const selectorMap = new Map<string, Record<string, string>>();
    
        const collectSelectors = (rules: GsapRule[]) => {
            rules.forEach(rule => {
                if (rule.selector && !selectorMap.has(rule.selector)) {
                selectorMap.set(rule.selector, rule.styles || {});
            }
            if (rule.sequence) {
              rule.sequence.forEach(step => {
                if (step.selector && !selectorMap.has(step.selector)) {
                  selectorMap.set(step.selector, step.styles || {});
                }
                if (step['timeline']) {
                  collectSelectors([step['timeline']]);
                }
              });
            }
          });
      };

        collectSelectors(this.config.rules);
    
        let html = '';
        
        selectorMap.forEach((styles, selector) => {
           const mediaHtml =
                      this.editingRule.media && this.editingRule.media.type !== 'none'
                      ? this.getMediaElement(this.editingRule.media)
                      : '';
            this.editingRule.media = {
                  type: (this.editingRule.media?.type as MediaType) || 'none',
                  url: this.editingRule.media?.url || ''
              };
            const styleStr = Object.entries(styles).map(([k, v]) => `${k}: ${v}`).join('; ');
            const cleanSelector = selector.replace(/^[.#]/, '');
                      html += `<div class="${cleanSelector}" style="${styleStr}; padding: 20px; margin: 10px; border: 1px solid #ccc; background: #f0f0f0; min-height: 50px;">
                      Preview for: ${selector} </div> ${mediaHtml}
                    `;
              });

            if (html === '') {
                html = '<div style="padding: 20px; text-align: center; color: #999;">No selectors in config. Add rules to see preview elements.</div>';
              }

            this.previewContainer.nativeElement.innerHTML = `
                <div style="height: 800px; overflow-y: auto; padding: 10px;">
                ${html}
                </div>
              `;
            ScrollTrigger.refresh();
        }
    getMediaType(): string {
          if (!this.editingRule || !this.editingRule.media) {
            return 'none'; // Default to avoid undefined
          }
          return this.editingRule.media.type || 'none';
        }
  setMediaType(type: MediaType) {
      const validTypes: MediaType[] = ['image', 'video', 'audio', 'none'];
      if (!validTypes.includes(type as MediaType)) {
          console.warn('Invalid media type:', type);
          return;
        }
        if (!this.editingRule.media) {
          this.editingRule.media = { type, url: '' };
        } else {
          this.editingRule.media.type = type;
      }
      this.onDialogChange();
  }
  pauseAnimation() {
    gsap.globalTimeline.pause();
  }
}