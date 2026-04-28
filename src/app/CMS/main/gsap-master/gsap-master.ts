import { Component, ViewChild, ElementRef, AfterViewInit, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { TabsModule } from 'primeng/tabs';
import { MessageService } from 'primeng/api';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { GsapMasterService } from './gsap-master.service';
import { GsapCallback, GsapConfig, GsapMedia, GsapRule, GsapSequenceStep, PageConfig, MediaType } from '../../../@core/animations/animationtypes';

@Component({
  selector: 'app-gsap-master',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule, TableModule, ButtonModule, CheckboxModule, DialogModule,
    InputTextModule, SelectModule, TextareaModule, TooltipModule, ToastModule, TabsModule
  ],
  templateUrl: './gsap-master.html',
  styleUrl: './gsap-master.css',
  providers: [MessageService]
})
export class GsapMaster implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('previewContainer', { static: false }) previewContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('codePreview') codePreview!: ElementRef<HTMLTextAreaElement>;
  
  private gsapConfigService = inject(GsapMasterService);
  private messageService = inject(MessageService);
  private changeSubject = new Subject<void>();
  private destroy$ = new Subject<void>();
  
  pages: PageConfig[] = [];
  selectedPage: PageConfig | null = null;
  newPageTitle = '';
  projectCode = '';
  config: GsapConfig | null = null;
  configJson = '';
  activeTab = 0;
  showEditDialog = false;
  showAddPageDialog = false;
  showCodeDialog = false;
  editMode: 'rule' | 'callback' | null = null;
  editingIndex: number | null = null;
  editingRule: GsapRule = {} as GsapRule;
  editingRuleFromJson = '';
  editingRuleToJson = '';
  editingRuleStylesJson = '{}';
  editingCallback: GsapCallback = { name: '', script: '' };
  
  animationTypes = [
    { label: 'Fade Up', value: 'fadeUp' },
    { label: 'Fade In', value: 'fadeIn' },
    { label: 'Slide Left', value: 'slideInLeft' },
    { label: 'Slide Right', value: 'slideInRight' },
    { label: 'Scale In', value: 'scaleIn' },
    { label: 'Blur In', value: 'blurIn' },
    { label: 'Rotate In', value: 'rotateIn' },
    { label: 'Flip In', value: 'flipIn' },
    { label: 'Bounce In', value: 'bounceIn' },
    { label: 'Wobble', value: 'wobbleIn' },
    { label: 'Batch', value: 'batchReveal' },
    { label: 'Timeline', value: 'timeline' }
  ];
  
  easeOptions = [
    { label: 'power1.out', value: 'power1.out' },
    { label: 'power2.out', value: 'power2.out' },
    { label: 'power3.out', value: 'power3.out' },
    { label: 'power4.out', value: 'power4.out' },
    { label: 'back.out(1.7)', value: 'back.out(1.7)' },
    { label: 'elastic.out(1, 3)', value: 'elastic.out(1, 3)' },
    { label: 'bounce.out', value: 'bounce.out' },
    { label: 'circ.out', value: 'circ.out' },
    { label: 'expo.out', value: 'expo.out' },
    { label: 'sine.out', value: 'sine.out' },
    { label: 'none', value: 'none' }
  ];
  
  statusOptions = [
    { label: 'Published', value: 'published' },
    { label: 'Draft', value: 'draft' },
    { label: 'Archived', value: 'archived' }
  ];

  constructor() {
    gsap.registerPlugin(ScrollTrigger);
    this.changeSubject.pipe(debounceTime(500), takeUntil(this.destroy$)).subscribe(() => {
      if (this.selectedPage) {
        this.config = this.selectedPage.gsapConfig || null;
        if (this.config) this.applyConfig();
      }
    });
  }

  ngOnInit() {
    this.projectCode = 'default';
    this.loadPages();
  }

  ngAfterViewInit() {
    if (this.selectedPage && this.config) {
      this.resetPreview();
      this.applyConfig();
    }
    setTimeout(() => this.applyConfig(), 1000);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private deepClone<T>(obj: T): T {
    if (obj === null || obj === undefined) return obj as T;
    return JSON.parse(JSON.stringify(obj, (_, v) => v === undefined ? null : v)) as T;
  }

  getSelectorWarning(selector: string | undefined): string | null {
    if (!selector || typeof selector !== 'string') return null;
    if (selector.includes('*')) return 'Avoid universal selector (*)';
    if (selector.split(' ').length > 3) return 'Deep selectors may impact performance';
    return null;
  }

  loadPages() {
    const pageKeys = ['landing', 'home', 'about', 'contact'];
    const configs = pageKeys.map(key => ({
      id: key,
      title: key.charAt(0).toUpperCase() + key.slice(1) + ' Page',
      description: `${key} page animations`,
      gsapConfig: this.gsapConfigService.getDefaultConfig()
    }));
    this.pages = configs;
    this.selectPage(this.pages[0]);
  }

  addPage() {
    if (!this.newPageTitle.trim()) return;
    const newPage: PageConfig = {
      id: 'page-' + Date.now(),
      title: this.newPageTitle.trim(),
      description: `Custom ${this.newPageTitle} page`,
      gsapConfig: this.gsapConfigService.getDefaultConfig()
    };
    this.pages.push(newPage);
    this.newPageTitle = '';
    this.showAddPageDialog = false;
    this.selectPage(newPage);
  }

selectPage(page: PageConfig) {
    this.selectedPage = page;
    this.config = page.gsapConfig || null;
    this.configJson = this.config ? JSON.stringify(this.config, null, 2) : '';
    if (this.previewContainer) {
      this.resetPreview();
      this.applyConfig();
    }
  }

  deletePage(index: number) {
    if (confirm(`Delete "${this.pages[index].title}"?`)) {
      this.pages.splice(index, 1);
      if (this.selectedPage?.id === this.pages[index]?.id) {
        this.selectedPage = this.pages[0] || null;
        this.config = this.selectedPage ? this.selectedPage.gsapConfig || null : null;
      }
    }
  }

  loadConfig() {
    if (!this.selectedPage) return;
    this.gsapConfigService.getConfigs(this.projectCode + '-' + this.selectedPage.id).subscribe({
      next: (data: GsapConfig) => {
        if (this.selectedPage) {
          this.selectedPage.gsapConfig = data;
        }
        this.config = data;
        this.configJson = JSON.stringify(data, null, 2);
        this.applyConfig();
        this.messageService.add({ severity: 'success', summary: 'Loaded', detail: 'Config loaded successfully' });
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load config' })
    });
  }

  onJsonChange(event: any) {
    try {
      const parsed = JSON.parse(event.target.value);
      this.config = this.deepClone(parsed);
      if (this.selectedPage) {
        this.selectedPage.gsapConfig = this.config || undefined;
      }
      this.changeSubject.next();
} catch (e) {
      this.messageService.add({ severity: 'warn', summary: 'Invalid', detail: 'JSON syntax error' });
    }
  }

  onFormChange() {
    this.syncFormsToJson();
    this.changeSubject.next();
  }

  private syncJsonToForms() {
    if (!this.config) return;
    this.configJson = JSON.stringify(this.deepClone(this.config), null, 2);
  }

  private syncFormsToJson() {
    if (!this.config) return;
    this.configJson = JSON.stringify(this.deepClone(this.config), null, 2);
  }

  applyConfig() {
    if (!this.config) return;
    this.resetPreview();
    
    gsap.killTweensOf('*');
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    const safeConfig = this.deepClone(this.config);
    const global = safeConfig.global;
    gsap.defaults({ duration: global.defaults?.duration || 1, ease: global.defaults?.ease || 'power2.out' });

    safeConfig.rules.forEach(rule => {
      if (rule.status !== 'published') return;
      
      const elements = this.previewContainer?.nativeElement?.querySelectorAll(rule.selector);
      if (!elements?.length) return;

      if (rule.styles) gsap.set(elements, this.deepClone(rule.styles));

      const from = this.deepClone(rule.from || {});
      const to = this.deepClone(rule.to || {});
      const stagger = rule.stagger?.each || 0;
      const scrollTrigger = (rule.scrollTrigger as any)?.enabled ? {
        trigger: (rule.scrollTrigger as any)?.trigger || rule.selector,
        start: (rule.scrollTrigger as any)?.start || 'top 85%',
        end: (rule.scrollTrigger as any)?.end || 'bottom top',
        scrub: (rule.scrollTrigger as any)?.scrub || false
      } : undefined;

      if (rule.type === 'tween') {
        gsap.fromTo(elements, from, { ...to, stagger, scrollTrigger });
      } else if (rule.type === 'timeline') {
        const tl = gsap.timeline({ scrollTrigger });
        if (rule.sequence) {
          rule.sequence.sort((a, b) => a.order - b.order).forEach(step => {
            const stepEls = this.previewContainer?.nativeElement?.querySelectorAll(step.selector);
            if (stepEls?.length) {
              tl.fromTo(stepEls, step.from || {}, step.to || {}, '<0.1');
            }
          });
        }
      }
    });

    ScrollTrigger.refresh();
    this.messageService.add({ severity: 'info', summary: 'Applied', detail: 'Animations applied to preview' });
  }

  saveConfig() {
    if (!this.selectedPage || !this.config) return;
    this.gsapConfigService.saveConfig(this.projectCode + '-' + this.selectedPage.id, this.config).subscribe({
      next: () => {
        if (this.selectedPage) {
          this.selectedPage.gsapConfig = this.config || undefined;
        }
        this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Config saved successfully' });
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save config' })
    });
  }

  addRule() {
    if (!this.config) return;
    const newRule: GsapRule = {
      id: 'rule-' + Date.now(),
      label: 'New Animation',
      type: 'tween',
      selector: '.new-element',
      from: { opacity: 0, y: 60 },
      to: { opacity: 1, y: 0 },
      stagger: { each: 0.1 },
      scrollTrigger: { enabled: false },
      version: 1,
      status: 'published',
      media: { type: 'none', url: '', id: '', selector: '' },
      styles: {}
    };
    this.config.rules.push(newRule);
    this.syncFormsToJson();
    this.messageService.add({ severity: 'info', summary: 'Added', detail: 'New rule added' });
  }

  editRule(index: number, id: any) {
    if (!this.config || index < 0 || index >= this.config.rules.length) return;
    
    this.editMode = 'rule';
    const ruleIndex = this.config.rules.findIndex(r => r.id === id);
    const rule = this.config.rules[ruleIndex];
    
    this.editingRule = this.deepClone(rule);
    this.editingIndex = ruleIndex;
    this.editingRuleFromJson = JSON.stringify(this.editingRule.from || {}, null, 2);
    this.editingRuleToJson = JSON.stringify(this.editingRule.to || {}, null, 2);
    this.editingRuleStylesJson = JSON.stringify(this.editingRule.styles || {}, null, 2);
    
    if (!this.editingRule.media) {
      this.editingRule.media = { type: 'none', url: '', id: rule.id, selector: rule.selector };
    }
    
    this.showEditDialog = true;
  }

  deleteRule(index: number) {
    if (!this.config || index < 0 || index >= this.config.rules.length) return;
    this.config.rules.splice(index, 1);
    this.syncFormsToJson();
    this.messageService.add({ severity: 'warn', summary: 'Deleted', detail: 'Rule removed' });
  }

  addCallback() {
    if (!this.config) return;
    const newCb: GsapCallback = { name: 'onComplete', script: 'console.log("Animation complete")' };
    this.config.callbacks.push(newCb);
    this.syncFormsToJson();
  }

  editCallback(index: number) {
    this.editMode = 'callback';
    this.editingIndex = index;
    this.editingCallback = this.config!.callbacks[index] ? { ...this.config!.callbacks[index] } : { name: '', script: '' };
    this.showEditDialog = true;
  }

  deleteCallback(index: number) {
    if (this.config) {
      this.config.callbacks.splice(index, 1);
      this.syncFormsToJson();
    }
  }

  addNestedStep() {
    if (!this.editingRule.sequence) this.editingRule.sequence = [];
    this.editingRule.sequence.push({
      selector: '',
      order: this.editingRule.sequence.length + 1,
      from: {},
      to: {},
      styles: {}
    });
  }

  saveEdit() {
    if (this.editMode === 'rule' && this.editingIndex !== null && this.config) {
      try {
        this.editingRule.from = JSON.parse(this.editingRuleFromJson || '{}');
        this.editingRule.to = JSON.parse(this.editingRuleToJson || '{}');
        this.editingRule.styles = JSON.parse(this.editingRuleStylesJson || '{}');
      } catch (e) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid JSON in fields' });
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

  getMediaType(): string {
    return this.editingRule?.media?.type || 'none';
  }

  setMediaType(type: MediaType) {
    if (!this.editingRule.media) {
      this.editingRule.media = { type, url: '', id: '', selector: '' };
    } else {
      this.editingRule.media.type = type;
    }
  }

  pauseAnimation() {
    gsap.globalTimeline.pause();
  }

  playAnimation() {
    gsap.globalTimeline.play();
  }

  refreshAnimations() {
    this.applyConfig();
  }

  resetPreview() {
    if (!this.config || !this.previewContainer?.nativeElement) return;
    
    gsap.killTweensOf('*');
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    const selectorMap = new Map<string, Record<string, string>>();
    const collectSelectors = (rules: GsapRule[]) => {
      rules.forEach(rule => {
        if (rule.selector && !selectorMap.has(rule.selector)) {
          selectorMap.set(rule.selector, rule.styles || {});
        }
        rule.sequence?.forEach(step => {
          if (step.selector && !selectorMap.has(step.selector)) {
            selectorMap.set(step.selector, step.styles || {});
          }
        });
      });
    };
    collectSelectors(this.config.rules);

    let html = '';
    selectorMap.forEach((styles, selector) => {
      const styleStr = Object.entries(styles).map(([k, v]) => `${k}: ${v}`).join('; ');
      const cleanSelector = selector.replace(/^[.#]/, '');
      html += `<div class="${cleanSelector}" style="padding: 20px; margin: 10px; ${styleStr}; border: 1px solid #ccc; background: #f5f5f5; border-radius: 8px;">
        Preview: ${selector} - Add content here to see animation
      </div>`;
    });

    if (html === '') {
      html = '<div style="padding: 20px; text-align: center; color: #999;">Add rules to see preview elements</div>';
    }

    this.previewContainer.nativeElement.innerHTML = `<div style="height: 100%; overflow-y: auto; padding: 10px;">${html}</div>`;
  }

  exportJson() {
    if (this.codePreview?.nativeElement) {
      this.codePreview.nativeElement.select();
      document.execCommand('copy');
      this.messageService.add({ severity: 'success', summary: 'Copied', detail: 'JSON copied to clipboard' });
    }
  }
 getStatusSeverity(status: string): TagSeverity {
    switch (status) {
      case 'published':
        return 'success';

      case 'draft':
        return 'warn';

      case 'archived':
        return 'secondary';

      default:
        return 'info';
    }
  }
  importJson() {
    try {
      const parsed = JSON.parse(this.configJson);
      this.config = this.deepClone(parsed);
      if (this.selectedPage) {
        this.selectedPage.gsapConfig = this.config || undefined;
      }
      this.applyConfig();
      this.messageService.add({ severity: 'success', summary: 'Imported', detail: 'JSON imported successfully' });
    } catch (e) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid JSON format' });
    }
  }
}
type TagSeverity =
  | 'success'
  | 'secondary'
  | 'info'
  | 'warn'
  | 'danger'
  | 'contrast';