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
import { Subject, timer } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { GsapMasterService } from './gsap-master.service';

// Define types based on provided JSON structure
export interface GsapGlobal {
  defaults: { duration: number; ease: string };
  registerPlugins: string[];
  autoInit: boolean;
  meta: { version: string; description: string };
  version: number;
  status: string;
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
  sequence?: Array<{
    selector: string;
    from: Record<string, any>;
    to: Record<string, any>;
    order: number;
  }>;
}

export interface GsapCallback {
  name: string;
  script: string;
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
  editingCallback: GsapCallback = { name: '', script: '' };

  // Auto-apply with debounce
  private changeSubject = new Subject<void>();
  private destroy$ = new Subject<void>();

  constructor() {
    gsap.registerPlugin(ScrollTrigger);

    // Debounce changes: Apply config 500ms after last change
    this.changeSubject.pipe(
      debounceTime(500),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      if (this.config) {
        this.applyConfig();
      }
    });
  }
private deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)); // Or use structuredClone(obj) for modern browsers
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
    // Use deep clone to avoid circular refs from previous GSAP runs
    const safeConfig = this.deepClone(this.config);
    this.configJson = JSON.stringify(safeConfig, null, 2);
  }

  onJsonChange(event: any) {
    try {
      const parsed = JSON.parse(event.target.value);
      this.config = { ...this.config, ...parsed };
      this.syncFormsToJson(); // Update structured forms if needed
      this.changeSubject.next(); // Auto-apply
    } catch (e) {
      console.warn('Invalid JSON:', e);
    }
  }

  // Sync structured forms to JSON
  private syncFormsToJson() {
    if (!this.config) return;
    // Use deep clone to avoid circular refs from previous GSAP runs
    const safeConfig = this.deepClone(this.config);
    this.configJson = JSON.stringify(safeConfig, null, 2);
  }
applyConfig() {
  debugger;
  if (!this.config || !this.previewContainer) return;

  // Kill first to clear any lingering refs
  gsap.killTweensOf('*');
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());

  // Clone config for safety before any GSAP use
  const safeConfig = this.deepClone(this.config);
  this.syncFormsToJson(); // Now safe; uses cloned data

  const global = safeConfig.global;
  gsap.defaults({ duration: global.defaults.duration, ease: global.defaults.ease }); // New obj, no mutation risk

  safeConfig.rules.forEach(rule => {
    if (rule.status !== 'published') return;
    const elements = this.previewContainer.nativeElement.querySelectorAll(rule.selector);
    if (elements.length === 0) return;

    // Full clone of all vars
    const clonedFrom = this.deepClone(rule.from || {});
    const clonedTo = this.deepClone(rule.to || {});
    const clonedStagger = this.deepClone(rule.stagger || {});
    const clonedScrollTrigger = this.deepClone(rule.scrollTrigger || {});
    const clonedDefaults = this.deepClone(rule.defaults || {});

    if (rule.type === 'tween') {
      gsap.fromTo(elements, clonedFrom, {
        ...this.deepClone(clonedTo), // Spread + clone for final vars obj
        ...this.deepClone(clonedStagger),
        ...this.deepClone(clonedScrollTrigger),
        onComplete: () => this.executeCallback('onFadeUpComplete')
      });
    } else if (rule.type === 'timeline') {
      const tlVars = this.deepClone(clonedScrollTrigger);
      const tl = gsap.timeline({
        ...tlVars,
        defaults: this.deepClone(clonedDefaults)
      });
      if (rule.sequence) {
        rule.sequence
          .sort((a, b) => a.order - b.order)
          .forEach(step => {
            const stepElements = this.previewContainer.nativeElement.querySelectorAll(step.selector);
            if (stepElements.length > 0) {
              const clonedStepFrom = this.deepClone(step.from || {});
              const clonedStepTo = this.deepClone(step.to || {});
              tl.fromTo(stepElements, clonedStepFrom, clonedStepTo, '<0.1');
            }
          });
      }
    }
  });

  // Cloned callbacks for eval safety
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
      status: 'published'
    };
    this.config!.rules.push(newRule);
    this.syncFormsToJson();
  }

  editRule(index: number) {
    this.editMode = 'rule';
    this.editingIndex = index;
    this.editingRule = { ...this.config!.rules[index] };
    this.editingRuleFromJson = JSON.stringify(this.editingRule.from || {}, null, 2);
    this.editingRuleToJson = JSON.stringify(this.editingRule.to || {}, null, 2);
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

  saveEdit() {
    if (this.editMode === 'rule' && this.editingIndex !== null && this.config) {
      try {
        this.editingRule.from = JSON.parse(this.editingRuleFromJson || '{}');
        this.editingRule.to = JSON.parse(this.editingRuleToJson || '{}');
      } catch (e) {
        console.error('Invalid JSON in rule:', e);
        return;
      }
      this.config.rules[this.editingIndex] = this.editingRule;
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
    gsap.killTweensOf('*');
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    this.previewContainer.nativeElement.innerHTML = `
      <div class="fade-up p-4 m-2 bg-primary text-white">Fade Up Element</div>
      <div class="timeline-section p-4 m-2 bg-secondary text-white">
        <div class="tl-item-1">Timeline Item 1</div>
        <div class="tl-item-2">Timeline Item 2</div>
      </div>
    `;
    ScrollTrigger.refresh();
  }

  pauseAnimation() {
    gsap.globalTimeline.pause();
  }
}