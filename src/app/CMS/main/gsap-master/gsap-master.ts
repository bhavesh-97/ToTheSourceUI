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
import { MultiSelectModule } from 'primeng/multiselect';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { GsapMasterService } from './gsap-master.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { TooltipModule } from 'primeng/tooltip';
import { environment } from '../../../../environments/environment';
import { PopupMessageType } from '../../../models/PopupMessageType';
import { NotificationService } from '../../../services/notification.service';
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { PageConfig, GsapConfig, GsapRule, GsapCallback, GsapMedia, GsapTimelineStep, Severity, MGsapPage } from './gsap-interface';
import { LookupService } from '../../../services/lookup.service';

@Component({
  selector: 'app-gsap-master',
  standalone: true,
imports: [
    CommonModule, FormsModule, RouterModule, TableModule, ButtonModule, CheckboxModule, DialogModule,
    InputTextModule, SelectModule, MultiSelectModule, TextareaModule, TooltipModule, ToastModule, TabsModule, TagModule,
    IconField,
    InputIcon
  ],
  templateUrl: './gsap-master.html',
  styleUrl: './gsap-master.css',
  providers: [MessageService]
})
export class GsapMaster implements OnInit, OnDestroy {
  @ViewChild('previewContainer', { static: false }) previewContainer!: ElementRef<HTMLDivElement>;
  private gsapConfigService = inject(GsapMasterService);
  private lookupService = inject(LookupService);
  private messageService = inject(MessageService);
  private NotificationService = inject(NotificationService);
  private http = inject(HttpClient);
  private changeSubject = new Subject<void>();
  private destroy$ = new Subject<void>();
  pages: PageConfig[] = [];
  selectedPage: any | null = null;
  newPageTitle = '';
  config: GsapConfig = this.getDefaultGsapConfig();
  configJson = '';
  activeTab = 0;
  showEditDialog = false;
  showAddPageDialog = false;
  editMode: 'rule' | 'callback' | null = null;
  editingIndex: number | null = null;
  editingRule: GsapRule = this.getDefaultGsapRule();
  editingRuleFromJson = '';
  editingRuleToJson = '';
  editingRuleStylesJson = '{}';
  editingTimelineSteps: GsapTimelineStep[] = [];
  editingCallback: GsapCallback = { eventName: '', handlerName: '' };

  animationTypes: { label: string; value: string }[] = [];
  easeOptions: { label: string; value: string }[] = [];
  statusOptions: { label: string; value: string }[] = [];
  pluginOptions: { label: string; value: string }[] = [];
  loading: boolean = false;

  ngOnInit() {
    this.loading = true;
    this.loadLookupData();
    this.loadPages();
    this.loading = false;
    this.changeSubject.pipe(debounceTime(300), takeUntil(this.destroy$)).subscribe(() => {
      this.onFormChange();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getOptionsFromResponse(res: any): { label: string; value: string }[] {
    const data = res?.result || res;
    if (Array.isArray(data)) {
      const options = data
        .map((item: any) => ({
          label: String(item.Desc || item.desc || item.Label || item.label || item.Val || item.val || ''),
          value: String(item.LookupID || item.lookupID || item.ID || item.id || item.Val || item.val || item.Value || item.value || '')
        }))
        .filter((opt: any) => opt.value && opt.value !== 'null' && opt.value !== 'undefined');
      // console.log('Lookup options:', options);
      return options;
    }
    return [];
  }

  private async loadLookupData() {
    try {
      const [animationTypesRes, easeOptionsRes, statusOptionsRes, pluginOptionsRes] = await Promise.all([
                firstValueFrom(this.lookupService.GetByCode('animationType')),
                firstValueFrom(this.lookupService.GetByCode('easeOption')),
                firstValueFrom(this.lookupService.GetByCode('GSAP_STATUS')),
                firstValueFrom(this.lookupService.GetByCode('GSAP_PLUGIN'))
      ]);
      this.animationTypes = this.getOptionsFromResponse(animationTypesRes?.result);
      this.easeOptions = this.getOptionsFromResponse(easeOptionsRes?.result);
      this.statusOptions = this.getOptionsFromResponse(statusOptionsRes?.result);
      this.pluginOptions = this.getOptionsFromResponse(pluginOptionsRes?.result);
      // console.log(this.animationTypes);
      // console.log(this.easeOptions);
      // console.log(this.statusOptions);
      // console.log(this.pluginOptions);
    } catch (err) {
      console.error('Failed to load lookup data:', err);
    }
  }

  async loadPages() {
    try {
      this.gsapConfigService.GetAllConfigs().subscribe({
            next: (res) => {
              if (!res.isError && res.result) {
                this.pages = Array.isArray(res.result) ? res.result : JSON.parse(res.result);
              } else {
                this.NotificationService.showMessage('No data found', 'Error', PopupMessageType.Error);
              }
            },
            error: (err) => {
              console.error('Failed to load pages:', err);
              this.NotificationService.showMessage('Failed to load pages', 'Error', PopupMessageType.Error);
              }
      });
    } catch (err) {
      console.error('Failed to load pages:', err);
    }
  }
  
async selectPage(page: any) {
    debugger;
    this.selectedPage = page;
    const pageId = page.PageId || page.pageId;
    if (!pageId) {
      this.config = this.getDefaultGsapConfig();
      return;
    }
    try {
      const [defaultsRes, pluginsRes, rulesRes, callbacksRes] = await Promise.all([
        firstValueFrom( this.gsapConfigService.GetGlobalDefaultsByPageId(pageId)),
        firstValueFrom( this.gsapConfigService.GetPluginsByPageId(pageId)),
        firstValueFrom(this.gsapConfigService.GetRulesByPageId(pageId)),
        firstValueFrom( this.gsapConfigService.GetCallbacksByPageId(pageId))
      ]);
      
      debugger;
      const defaults = defaultsRes?.result || {};
      const plugins = pluginsRes?.result || [];
      const rules = rulesRes?.result || [];
      const callbacks = callbacksRes?.result || [];
      
      // const pluginNames = this.pluginOptions.map((p: any) => p.pluginName || p.pluginname || p);
      const pluginids = this.pluginOptions.map((p: any) => p.value);
      this.config = {
        global: {
          pageId: pageId,
          defaults: {
            defaultsId: defaults?.defaultsID || defaults?.defaultsId || defaults?.DefaultsID,
            pageId: pageId,
            duration: defaults?.duration || defaults?.Duration || 1,
            ease: this.easeOptions.find((x: { label: any; value: any; }) => x.label === (defaults?.ease || defaults?.Ease) || x.value === (defaults?.ease || defaults?.Ease))?.value || '0',
            stagger: defaults?.stagger || defaults?.Stagger || 0.1,
            delay: defaults?.delay || defaults?.Delay || 0,
            repeat: defaults?.repeat || defaults?.RepeatN || 0,
            yoyo: defaults?.yoyo || defaults?.Yoyo || false
          },
          registerPlugins: pluginids,
          autoInit: true,
          observeDom: true,
          meta: { version: '1.0', description: '' }
        },
        pages: {},
        rules: rules.map((r: any) => ({
          ruleId: r?.ruleId || r?.RuleID || r?.ruleID,
          pageId: r?.pageId || r?.PageID || pageId,
          ruleKey: r?.ruleKey || r?.RuleKey || '',
          label: r?.label || r?.Label || '',
          selector: r?.selector || r?.Selector || '',
          type: r?.type || r?.RuleType || 'fromTo',
          duration: r?.duration || r?.Duration || 1,
          ease: this.animationTypes.find((x: { label: any; value: any; }) => x.label === (r?.ease || r?.Ease) || x.value === (r?.ease || r?.Ease))?.value || '0',
          stagger: r?.stagger || r?.Stagger || 0,
          delay: r?.delay || r?.Delay || 0,
          repeat: r?.repeat || r?.RepeatN || 0,
          yoyo: r?.yoyo || r?.Yoyo || false,
          paused: r?.paused || r?.Paused || false,
          scrollEnabled: r?.scrollEnabled || r?.ScrollEnabled || false,
          status: r?.status || r?.Status || '0',
          sortOrder: r?.sortOrder || r?.SortOrder || 0
        })),
        callbacks: callbacks.map((c: any) => ({
          callbackId: c?.callbackId || c?.CallbackID || c?.callbackID,
          ruleId: c?.ruleId || c?.RuleID || c?.ruleID,
          eventName: c?.eventName || c?.EventName || '',
          handlerName: c?.handlerName || c?.HandlerName || '',
          handlerCode: c?.handlerCode || c?.HandlerCode || ''
        }))
      };
    } catch (err) {
      console.error('Failed to load page data:', err);
      this.config = this.getDefaultGsapConfig();
    }
  }

  deletePage(index: number) {
    this.pages.splice(index, 1);
    if (this.selectedPage === this.pages[index]) {
      this.selectedPage = null;
    }
  }

  addPage() {
    if (this.newPageTitle.trim()) {
      const newPage: PageConfig = {
        PageId: `page-${Date.now()}`,
        title: this.newPageTitle,
        pageKey: this.newPageTitle.toLowerCase().replace(/\s+/g, '-')
      };
      this.pages.push(newPage);
      this.selectPage(newPage);
      this.newPageTitle = '';
      this.showAddPageDialog = false;
    }
  }

async saveConfig() {
    if (!this.selectedPage) return;
    debugger;
    const validation = this.validateConfig();
    if (!validation.isValid) {
      this.NotificationService.showMessage(validation.message, 'Validation Error', PopupMessageType.ValidationError);
      return;
    }

    const pageKey = this.selectedPage.pageKey;
    const pageId = this.selectedPage.PageId || this.selectedPage.pageId;
    if (!pageId) {
      this.NotificationService.showMessage('Page ID is required', 'Error', PopupMessageType.Error);
      return;
    }
const pluginNames = this.config.global?.registerPlugins?.filter((p: any) => p) || ['ScrollTrigger'];
    const plugins = pluginNames.map((name: string, index: number) => ({
      pluginId: 0,
      pageId: pageId,
      pluginName: name,
      enabled: true
    }));
    const saveModel = {
      pageId: pageId,
      pageKey: pageKey,
      label: this.selectedPage.title || pageKey,
      globalDefaults: {
        defaultsId: this.config.global?.defaults?.defaultsId || 0,
        pageId: pageId,
        duration: this.config.global?.defaults?.duration || 1,
        ease: this.config.global?.defaults?.ease || 'power2.out',
        stagger: this.config.global?.defaults?.stagger || 0.1,
        delay: this.config.global?.defaults?.delay || 0,
        repeat: this.config.global?.defaults?.repeat || 0,
        yoyo: this.config.global?.defaults?.yoyo || false
      },
      plugins: plugins,
      rules: (this.config.rules || []).map((r: any) => ({
        ruleId: r?.ruleId || 0,
        pageId: pageId,
        ruleKey: r?.ruleKey || r?.label?.toLowerCase().replace(/\s+/g, '-') || '',
        label: r?.label || '',
        selector: r?.selector || '',
        type: r?.type || 'fromTo',
        duration: r?.duration || 1,
        ease: r?.ease || 'power2.out',
        stagger: r?.stagger || 0,
        delay: r?.delay || 0,
        repeat: r?.repeat || 0,
        yoyo: r?.yoyo || false,
        paused: r?.paused || false,
        scrollEnabled: r?.scrollEnabled || false,
        status: r?.status || 'Published',
        sortOrder: r?.sortOrder || 0
      })),
      callbacks: (this.config.callbacks || []).map((c: any) => ({
        callbackId: c?.callbackId || 0,
        ruleId: c?.ruleId || 0,
        eventName: c?.eventName || '',
        handlerName: c?.handlerName || '',
        handlerCode: c?.handlerCode || ''
      }))
    };
    try {
      const response = await firstValueFrom(this.gsapConfigService.SaveGsapConfig(saveModel));
      if (response?.isError) {
        this.NotificationService.showMessage(response.strMessage || 'Failed to save', 'Error', PopupMessageType.Error);
      } else {
        this.selectedPage.gsapConfig = this.config;
        this.NotificationService.showMessage(response.strMessage || 'Configuration saved successfully', 'Success', PopupMessageType.Success);
      }
    } catch (err: any) {
      console.error('Failed to save:', err);
      this.NotificationService.showMessage(err?.error?.strMessage || 'Failed to save configuration', 'Error', PopupMessageType.Error);
    }
  }

  private validateConfig(): { isValid: boolean; message: string } {
    if (!this.selectedPage) {
      return { isValid: false, message: 'No page selected' };
    }

    const pageId = this.selectedPage.PageId || this.selectedPage.pageId;
    if (!pageId) {
      return { isValid: false, message: 'Page ID is required' };
    }

    if (!this.selectedPage.pageKey) {
      return { isValid: false, message: 'Page Key is required' };
    }

    if (!this.selectedPage.title && !this.selectedPage.label) {
      return { isValid: false, message: 'Page Label is required' };
    }

    if (this.config.global?.defaults) {
      const defaults = this.config.global.defaults;
      if (defaults.duration !== undefined && defaults.duration < 0) {
        return { isValid: false, message: 'Duration must be greater than or equal to 0' };
      }
      if (defaults.stagger !== undefined && defaults.stagger < 0) {
        return { isValid: false, message: 'Stagger must be greater than or equal to 0' };
      }
      if (defaults.delay !== undefined && defaults.delay < 0) {
        return { isValid: false, message: 'Delay must be greater than or equal to 0' };
      }
    }

    if (this.config.rules) {
      for (let i = 0; i < this.config.rules.length; i++) {
        const rule = this.config.rules[i];
        if (!rule.selector || rule.selector.trim() === '') {
          return { isValid: false, message: `Rule #${i + 1}: Selector is required` };
        }
        if (rule.duration !== undefined && rule.duration < 0) {
          return { isValid: false, message: `Rule "${rule.label || i + 1}": Duration must be >= 0` };
        }
      }
    }

    // if (this.config.callbacks) {
    //   for (let i = 0; i < this.config.callbacks.length; i++) {
    //     const callback = this.config.callbacks[i];
    //     if (!callback.eventName || callback.eventName.trim() === '') {
    //       return { isValid: false, message: `Callback #${i + 1}: Event Name is required` };
    //     }
    //   }
    // }

    return { isValid: true, message: '' };
  }

  onFormChange() {
    this.changeSubject.next();
     if (this.editingRule.type === 'timeline'&& !this.editingTimelineSteps) {
        this.editingTimelineSteps = [];
    }
  }

  addRule(selectedPage: MGsapPage) {
    const pageId = selectedPage?.pageId;
    if (!pageId) {
      this.NotificationService.showMessage('Page ID is required', 'Error', PopupMessageType.Error);
      return;
    }
    const newRule: GsapRule = {
      ruleId: 0,
      selector: '',
      label: 'New Rule',
      status: 'published',
      type: 'tween',
      duration: 1,
      ease: 'power2.out',
      scrollEnabled: false,
      pageId: pageId
    };
    this.config.rules = [...(this.config.rules || []), newRule];
  }

  getStatusSeverity(status: string): Severity {
    switch (status?.toLowerCase()) {
      case 'published': return 'success';
      case 'draft': return 'warn';
      case 'archived': return 'secondary';
      default: return 'info';
    }
  }

  editRule(rule: GsapRule, index: number) {
    debugger;
    this.editingRule = { ...rule };
    this.editingIndex = index;
    this.editingRuleFromJson = JSON.stringify(rule.from || {}, null, 2);
    this.editingRuleToJson = JSON.stringify(rule.to || {}, null, 2);
    this.editingRuleStylesJson = JSON.stringify(rule.styles || {}, null, 2);
    this.editingTimelineSteps = rule.timelineSteps ? [...rule.timelineSteps] : [];
    this.editMode = 'rule';
    this.showEditDialog = true;
  }

  deleteRule(index: number) {
    if (this.config.rules) {
      this.config.rules.splice(index, 1);
    }
  }

  addCallback(selectedPage: MGsapPage) {
    const newCallback: GsapCallback = {
      eventName: '',
      handlerName: '',
      handlerCode: ''
    };
    this.config.callbacks = [...(this.config.callbacks || []), newCallback];
  }

  editCallback(index: number) {
    const callback = this.config.callbacks?.[index];
    if (callback) {
      this.editingCallback = { ...callback };
      this.editingIndex = index;
      this.editMode = 'callback';
      this.showEditDialog = true;
    }
  }

  deleteCallback(index: number) {
    if (this.config.callbacks) {
      this.config.callbacks.splice(index, 1);
    }
  }

  onJsonChange(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    try {
      this.config = JSON.parse(target.value);
    } catch (e) {
      console.error('Invalid JSON:', e);
    }
  }

  applyConfig() {
    if (this.previewContainer?.nativeElement) {
      this.gsapConfigService.applyAnimations(this.config, this.previewContainer.nativeElement);
    }
  }

  resetPreview() {
    this.gsapConfigService.killCurrent();
  }

  pauseAnimation() {
    this.gsapConfigService.pauseAnimation();
  }

  playAnimation() {
    this.gsapConfigService.playAnimation();
  }

  getSelectorWarning(selector: string): string | null {
    if (!selector) return 'Selector is required';
    if (selector.startsWith('.') && selector.split('.').length < 2) return 'Add class name after dot';
    if (selector.startsWith('#') && !selector.includes(' ')) return null;
    return null;
  }

  addNestedStep() {
    const stepNumber = (this.editingTimelineSteps?.length || 0) + 1;
    const newStep: GsapTimelineStep = {
      stepId: stepNumber,
      order: stepNumber,
      label: `Step ${stepNumber}`,
      selector: '',
      from: {},
      to: {},
      duration: 1,
      ease: 'power2.out',
      delay: 0
    };
    this.editingTimelineSteps = [...(this.editingTimelineSteps || []), newStep];
    this.onFormChange();
  }

  removeNestedStep(index: number) {
    if (this.editingTimelineSteps) {
      this.editingTimelineSteps.splice(index, 1);
      this.editingTimelineSteps = [...this.editingTimelineSteps];
      this.onFormChange();
    }
  }

  saveEdit() {
    if (this.editMode === 'rule' && this.editingIndex !== null) {
      try {
        this.editingRule.from = JSON.parse(this.editingRuleFromJson);
        this.editingRule.to = JSON.parse(this.editingRuleToJson);
        this.editingRule.styles = JSON.parse(this.editingRuleStylesJson);
        this.editingRule.timelineSteps = this.editingTimelineSteps?.length > 0 ? this.editingTimelineSteps : undefined;
      } catch (e) {
        console.error('Invalid JSON in from/to fields');
        return;
      }
      
      if (this.config.rules) {
        this.config.rules[this.editingIndex] = { ...this.editingRule };
      }
    } else if (this.editMode === 'callback' && this.editingIndex !== null) {
      if (this.config.callbacks) {
        this.config.callbacks[this.editingIndex] = { ...this.editingCallback };
      }
    }
    
    this.showEditDialog = false;
    this.editMode = null;
    this.editingIndex = null;
    this.editingTimelineSteps = [];
  }

  cancelEdit() {
    this.showEditDialog = false;
    this.editMode = null;
    this.editingTimelineSteps = [];
    this.editingRule = this.getDefaultGsapRule();
    this.editingIndex = null;
  }
  
  private getDefaultGsapConfig(): GsapConfig {
    return {
      global: {
        pageId: '',
        defaults: {
          duration: 1, ease: 'power2.out',
          pageId: 0
        },
        registerPlugins: ['ScrollTrigger'],
        autoInit: true,
        observeDom: true,
        meta: { version: '1.0', description: '' }
      },
      pages: {},
      rules: [],
      callbacks: []
    };
  }

  private getDefaultGsapRule(): GsapRule {
    return {
              ruleId: 0,
              selector: '',
              status: 'published',
              type: 'tween',
              scrollEnabled: false,
              pageId: 0,
              timelineSteps: [],
              media: { type: 'none', url: '', id: '', selector: '' }
          };
  }

}

