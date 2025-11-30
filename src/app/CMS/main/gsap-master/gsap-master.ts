// src/app/pages/gsap-config-page.component.ts
import { Component, ViewChild, ElementRef, AfterViewInit, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { GsapMasterService } from './gsap-master.service';

// Enhanced interfaces
export interface GsapSequenceStep {
  selector: string;
  from?: Record<string, any>;
  to?: Record<string, any>;
  order: number;
  timeline?: GsapRule; // Nested timeline support (recursive)
  styles?: Record<string, string>; // Inline styles for preview
}

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
  status: string;
  sequence?: GsapSequenceStep[];
  styles?: Record<string, string>; // Global styles for rule elements
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
  @ViewChild('previewContainer') previewContainer!: ElementRef<HTMLDivElement>;

  private gsapConfigService = inject(GsapMasterService);

  projectCode = '';
  config: GsapConfig | null = null;
  configJson = '';
  activeTab: 'global' | 'rules' | 'callbacks' | 'json' = 'global';

  // Edit dialog state
  showEditDialog = false;
  editMode: 'rule' | 'callback' | null = null;
  editingIndex: number | null = null;
  editingRule: GsapRule = {} as GsapRule;
  editingRuleFromJson = '';
  editingRuleToJson = '';
  editingRuleStylesJson = '{}';
  editingCallback: GsapCallback = { name: '', script: '' };

  // Auto-apply with debounce
  private changeSubject = new Subject<void>();
  private destroy$ = new Subject<void>();

private deepClone<T>(obj: T): T {
  try {
    return structuredClone(obj); 
  } catch (e) {
    return JSON.parse(JSON.stringify(obj)); 
  }
}

  // Selector best practices validator
  private validateSelectorBestPractice(selector: string): string | null {
    if (selector.includes('*')) return 'Avoid universal selector (*); use specific classes/IDs for performance.';
    if (selector.split(' ').length > 3) return 'Deep selectors (>3 levels) may impact performance; consider flatter structure.';
    return null;
  }

  getSelectorWarning(selector: string): string | null {
    return this.validateSelectorBestPractice(selector);
  }

  constructor() {
    gsap.registerPlugin(ScrollTrigger);

    // Debounce changes: Apply config 500ms after last change
    this.changeSubject.pipe(
      debounceTime(800),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      if (this.config) {
        this.applyConfig();
      }
    });
  }

  ngOnInit() {
    this.projectCode = 'test-project'; // Default for testing
    this.loadConfig(); // Auto-load mock data
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadConfig() {
    if (!this.projectCode) return;

    this.gsapConfigService.getConfig(this.projectCode).subscribe({
      next: (data: GsapConfig) => {
        this.config = data;
        this.configJson = JSON.stringify(data, null, 2);
        this.syncJsonToForms(); // Initial sync
        console.log('Mock config loaded:', data); // For debugging
        this.applyConfig(); // Apply on load
      },
      error: (err) => console.error('Failed to load config:', err)
    });
  }

  // Trigger change detection for auto-preview
  onFormChange() {
    this.syncFormsToJson();
    this.changeSubject.next();
  }

  onDialogChange() {
    this.changeSubject.next();
  }

  // Sync form changes back to JSON (call on save or apply)
  private syncJsonToForms() {
    if (!this.config) return;
    const safeConfig = this.deepClone(this.config);
    this.configJson = JSON.stringify(safeConfig, null, 2);
  }

  onJsonChange(event: any) {
    try {
      const parsed = JSON.parse(event.target.value);
      this.config = this.deepClone(parsed); // Clone to avoid future mutations
      this.syncFormsToJson(); // Update structured forms if needed
      this.changeSubject.next(); // Auto-apply
    } catch (e) {
      console.warn('Invalid JSON:', e);
    }
  }

  // Sync structured forms to JSON
private syncFormsToJson() {
  if (!this.config) return;
  // Avoid deep clone for JSON tab if not needed; use replacer to skip circular
  const safeConfig = JSON.parse(JSON.stringify(this.config, (key, value) => {
    if (value && typeof value === 'object' && '_gsap' in value) return undefined; // Skip GSAP internals
    return value;
  }));
  this.configJson = JSON.stringify(safeConfig, null, 2);
}
  // Handle nested timelines recursively
  private applyNestedTimeline(tl: gsap.core.Timeline, steps: GsapSequenceStep[], container: HTMLElement, parentSelector?: string) {
  steps
    .sort((a, b) => a.order - b.order)
    .forEach(step => {
      const fullSelector = parentSelector ? `${parentSelector} ${step.selector}` : step.selector;
      const elements = container.querySelectorAll(fullSelector);
      if (elements.length === 0) return;

      // Apply styles first (best practice: style before animate)
      if (step.styles) {
        gsap.set(elements, this.deepClone(step.styles));
      }

      if (step['timeline']) {
        // Handle nested timeline: Create new timeline and add to parent
        const nestedTl = gsap.timeline({ /* inherit options if needed, e.g., tl.vars */ });
        tl.add(nestedTl, '<'); // Add at current position; adjust as needed (e.g., 0 for start)
        this.applyNestedTimeline(nestedTl, step['timeline'].sequence || [], container, fullSelector);
      } else {
        // Standard step
        const clonedFrom = this.deepClone(step.from || {});
        const clonedTo = this.deepClone(step.to || {});
        tl.fromTo(elements, clonedFrom, clonedTo, '<0.1');
      }
    });
}

applyConfig() {
  if (!this.config || !this.previewContainer) return;

  const container = this.previewContainer.nativeElement;

  // Single kill batch for perf
  gsap.killTweensOf(container.querySelectorAll('*'));
  ScrollTrigger.getAll().forEach(trigger => trigger.kill(false, true)); // Fast kill: no refresh

  const safeConfig = { ...this.config }; // Shallow clone top-level

  const global = safeConfig.global;
  gsap.defaults({ duration: global.defaults.duration, ease: global.defaults.ease });

  let refreshNeeded = false; // Batch refresh

  safeConfig.rules.forEach(rule => {
    if (rule.status !== 'published') return;
    const elements = container.querySelectorAll(rule.selector);
    if (elements.length === 0) return;

    // Selector warning (non-blocking)
    const warning = this.validateSelectorBestPractice(rule.selector);
    if (warning) console.warn(`Selector best practice: ${warning}`);

    // Styles (shallow)
    if (rule.styles) {
      gsap.set(elements, { ...rule.styles });
    }

    if (rule.type === 'tween') {
      const from = rule.from ? { ...rule.from } : {};
      const to = rule.to ? { ...rule.to } : {};
      const stagger = rule.stagger ? { ...rule.stagger } : {};
      const st = rule.scrollTrigger ? { ...rule.scrollTrigger } : {};
      gsap.fromTo(elements, from, { ...to, ...stagger, ...st, onComplete: () => this.executeCallback('onFadeUpComplete') });
      refreshNeeded = true;
    } else if (rule.type === 'timeline') {
      const st = rule.scrollTrigger ? { ...rule.scrollTrigger } : {};
      const defaults = rule.defaults ? { ...rule.defaults } : {};
      const tl = gsap.timeline({ ...st, defaults });
      if (rule.sequence) {
        this.applyNestedTimeline(tl, rule.sequence, container);
      }
      refreshNeeded = true;
    }
  });

  // Batch callbacks
  safeConfig.callbacks?.forEach(cb => {
    if (cb.script) {
      try {
        eval(cb.script);
      } catch (e) {
        console.error('Callback error:', e);
      }
    }
  });

  if (refreshNeeded) {
    requestAnimationFrame(() => ScrollTrigger.refresh()); // Async for perf
  }

  this.syncFormsToJson(); // Move to end, use shallow if possible
}
  saveConfig() {
    this.syncFormsToJson();
    if (!this.config) return;

    this.gsapConfigService.saveConfig(this.projectCode, this.config).subscribe({
      next: () => console.log('Config saved to DB'),
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
      styles: {}
    };
    this.config!.rules.push(newRule);
    this.syncFormsToJson();
  }

  editRule(index: number) {
    this.editMode = 'rule';
    this.editingIndex = index;
    this.editingRule = this.deepClone(this.config!.rules[index]);
    this.editingRuleFromJson = JSON.stringify(this.editingRule.from || {}, null, 2);
    this.editingRuleToJson = JSON.stringify(this.editingRule.to || {}, null, 2);
    this.editingRuleStylesJson = JSON.stringify(this.editingRule.styles || {}, null, 2);
    this.showEditDialog = true;
  }

  deleteRule(index: number) {
    this.config!.rules.splice(index, 1);
    this.syncFormsToJson();
  }

  addCallback() {
    const newCb: GsapCallback = { name: 'newCallback', script: 'console.log("New callback");' };
    this.config!.callbacks.push(newCb);
    this.syncFormsToJson();
  }

  editCallback(index: number) {
    this.editMode = 'callback';
    this.editingIndex = index;
    this.editingCallback = { ...this.config!.callbacks[index] };
    this.showEditDialog = true;
  }

  deleteCallback(index: number) {
    this.config!.callbacks.splice(index, 1);
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
      timeline: undefined // Optional nested timeline
    });
  }

  saveEdit() {
    if (this.editMode === 'rule' && this.editingIndex !== null && this.config) {
      try {
        this.editingRule.from = JSON.parse(this.editingRuleFromJson || '{}');
        this.editingRule.to = JSON.parse(this.editingRuleToJson || '{}');
        this.editingRule.styles = JSON.parse(this.editingRuleStylesJson || '{}');
      } catch (e) {
        console.error('Invalid JSON in rule:', e);
        return;
      }
      this.config.rules[this.editingIndex] = this.deepClone(this.editingRule); // Clone to avoid mutation
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
// Optimized resetPreview: Limit elements, cache selectors
resetPreview() {
  if (!this.config) return;

  const container = this.previewContainer.nativeElement;

  gsap.killTweensOf(container.querySelectorAll('*'));
  ScrollTrigger.getAll().forEach(trigger => trigger.kill(false, true));

  // Cache selectors (limit to 20 for perf)
  const selectorSet = new Set<string>();
  const maxElements = 20;

  const collectSelectors = (rules: GsapRule[], count: number = 0): number => {
    if (count >= maxElements) return count;
    rules.forEach(rule => {
      if (count >= maxElements) return;
      if (rule.selector && !selectorSet.has(rule.selector)) {
        selectorSet.add(rule.selector);
        count++;
      }
      if (rule.sequence && count < maxElements) {
        rule.sequence.forEach(step => {
          if (count >= maxElements) return;
          if (step.selector && !selectorSet.has(step.selector)) {
            selectorSet.add(step.selector);
            count++;
          }
          if (step['timeline'] && count < maxElements) {
            count = collectSelectors([step['timeline']], count);
          }
        });
      }
    });
    return count;
  };

  collectSelectors(this.config.rules);

  // Generate minimal HTML
  let html = Array.from(selectorSet).slice(0, maxElements).map(selector => {
    const styles = this.config?.rules.find(r => r.selector === selector)?.styles || {};
    const styleStr = Object.entries(styles).map(([k, v]) => `${k}: ${v}`).join('; ');
    const cleanSelector = selector.replace(/^[.#]/, '');
    return `<div class="${cleanSelector}" style="${styleStr}; padding: 20px; margin: 10px; border: 1px solid #ccc; background: #f0f0f0; min-height: 50px;">
      Preview: ${selector}
    </div>`;
  }).join('');

  if (html === '') {
    html = '<div style="padding: 20px; text-align: center; color: #999;">No selectors. Add rules.</div>';
  }

  container.innerHTML = `<div style="height: 600px; overflow-y: auto; padding: 10px;">${html}</div>`; // Reduced height

  requestAnimationFrame(() => ScrollTrigger.refresh());
}
  pauseAnimation() {
    gsap.globalTimeline.pause();
  }
}