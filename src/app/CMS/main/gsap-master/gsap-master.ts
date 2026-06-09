import { Component, ViewChild, ElementRef, AfterViewInit, inject, OnInit, OnDestroy, QueryList, ViewChildren, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
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
import { PageConfig, GsapConfig, GsapRule, GsapTimelineStep, Severity, MGsapPage, SaveGsapCallback, SaveGsapConfigRequest, SaveGsapGlobalDefaults, SaveGsapPlugin, SaveGsapRule, GsapAssetConfig, GsapScrollTrigger } from './gsap-interface';
import { LookupService } from '../../../services/lookup.service';
import { FormUtils } from '../../../shared/utilities/form-utils';
import { FormFieldConfig } from '../../../Interfaces/FormFieldConfig';


@Component({
  selector: 'app-gsap-master',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, RouterModule, TableModule, ButtonModule, CheckboxModule, DialogModule,
    InputTextModule, SelectModule, MultiSelectModule, TextareaModule, TooltipModule, ToastModule, TabsModule, TagModule,
    ConfirmDialogModule, IconField,
    InputIcon
  ],
  templateUrl: './gsap-master.html',
  styleUrl: './gsap-master.css',
  providers: [MessageService, ConfirmationService]
})
export class GsapMaster implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('previewContainer', { static: false }) previewContainer!: ElementRef<HTMLDivElement>;
  @ViewChildren('inputField') inputElements!: QueryList<ElementRef>;
  private renderer = inject(Renderer2);
  private gsapConfigService = inject(GsapMasterService);
  private lookupService = inject(LookupService);
  private NotificationService = inject(NotificationService);
  private fb = inject(FormBuilder);
  private FormUtils = inject(FormUtils);
  private confirmationService = inject(ConfirmationService);
  private changeSubject = new Subject<void>();
  private destroy$ = new Subject<void>();
  pages: PageConfig[] = [];
  selectedPage: any | null = null;
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
  editingCallback: SaveGsapCallback = new SaveGsapCallback();

  animationTypes: { label: string; value: string }[] = [];
  easeOptions: { label: string; value: string }[] = [];
  statusOptions: { label: string; value: string }[] = [];
  pluginOptions: { label: string; value: string }[] = [];
  loading: boolean = false;
  saving: boolean = false;

  showImportDialog = false;
  importJsonText = '';
  importJsonError = '';
  importValidated = false;
  importParsedConfig: any = null;

  pageForm!: FormGroup;
  newpageForm!: FormGroup;
  ruleForm!: FormGroup;
  callbackForm!: FormGroup;
  timelineStepForms: FormGroup[] = [];
  timelineStepData: { label: string; selector: string; duration: number; ease: string; delay: number }[] = [];
  defaultMap: Record<string, string> = { '0': 'Published', 'published': 'Published', '1': 'Draft','draft': 'Draft', '2': 'Archived','archived': 'Archived' };
  private pageFormFields: FormFieldConfig[] = [
    { name: 'duration', isMandatory: true, min: 0, validationMessage: 'Duration is required and must be >= 0', events: [] },
    { name: 'ease', isMandatory: true, validationMessage: 'Please select an ease option', events: [] },
    { name: 'stagger', isMandatory: false, min: 0, validationMessage: 'Stagger must be >= 0', events: [] },
    { name: 'registerPlugins', isMandatory: false, validationMessage: '', events: [] },
    { name: 'autoInit', isMandatory: false, validationMessage: '', events: [] },
  ];

  private newpageFormFields: FormFieldConfig[] = [
    { name: 'PageId', isMandatory: false, validationMessage: 'Name is required', events: [] },
    { name: 'PageTitle', isMandatory: true, validationMessage: 'Page title is required', events: [] },
  ];
    private ruleFormFields: FormFieldConfig[] = [
    { name: 'label', isMandatory: true, validationMessage: 'Label is required', events: [] },
    { name: 'type', isMandatory: true, validationMessage: 'Type is required', events: [] },
    { name: 'status', isMandatory: true, validationMessage: 'Status is required', events: [] },
    { name: 'selector', isMandatory: true, validationMessage: 'Selector is required', events: [] },
    { name: 'duration', isMandatory: false, min: 0, validationMessage: 'Duration must be >= 0', events: [] },
    { name: 'ease', isMandatory: false, validationMessage: '', events: [] },
    { name: 'stagger', isMandatory: false, min: 0, validationMessage: 'Stagger must be >= 0', events: [] },
    { name: 'delay', isMandatory: false, min: 0, validationMessage: 'Delay must be >= 0', events: [] },
    { name: 'repeat', isMandatory: false, min: 0, validationMessage: 'Repeat must be >= 0', events: [] },
    { name: 'yoyo', isMandatory: false, validationMessage: '', events: [] },
    { name: 'repeatDelay', isMandatory: false, min: 0, validationMessage: 'Repeat delay must be >= 0', events: [] },
    { name: 'scrollEnabled', isMandatory: false, validationMessage: '', events: [] },
    { name: 'scrollTrigger_start', isMandatory: false, validationMessage: '', events: [] },
    { name: 'scrollTrigger_end', isMandatory: false, validationMessage: '', events: [] },
    { name: 'scrollTrigger_scrub', isMandatory: false, validationMessage: '', events: [] },
    { name: 'scrollTrigger_toggleActions', isMandatory: false, validationMessage: '', events: [] },
    { name: 'scrollTrigger_markers', isMandatory: false, validationMessage: '', events: [] },
    { name: 'scrollTrigger_pin', isMandatory: false, validationMessage: '', events: [] },
    { name: 'editingRuleStylesJson', isMandatory: false, validationMessage: 'Invalid JSON format', events: [] },
    { name: 'editingRuleFromJson', isMandatory: false, validationMessage: 'Invalid JSON format', events: [] },
    { name: 'editingRuleToJson', isMandatory: false, validationMessage: 'Invalid JSON format', events: [] },
    { name: 'mediaUrl', isMandatory: false, validationMessage: 'Invalid URL', events: [] },
    { name: 'mediaType', isMandatory: false, validationMessage: '', events: [] },
  ];

  private callbackFormFields: FormFieldConfig[] = [
    { name: 'name', isMandatory: true, validationMessage: 'Name is required', events: [] },
    { name: 'script', isMandatory: true, validationMessage: 'Script is required', events: [] },
  ];

  private timelineStepFormFields: FormFieldConfig[] = [
    { name: 'label', isMandatory: false, validationMessage: '', events: [] },
    { name: 'selector', isMandatory: false, validationMessage: '', events: [] },
    { name: 'duration', isMandatory: false, min: 0, validationMessage: 'Must be >= 0', events: [] },
    { name: 'ease', isMandatory: false, validationMessage: '', events: [] },
    { name: 'delay', isMandatory: false, min: 0, validationMessage: 'Must be >= 0', events: [] },
  ];

  ngOnInit() {
    this.loading = true;
    this.loadLookupData();
    this.loadPages();
    this.initForms();
    this.loading = false;
    this.changeSubject.pipe(debounceTime(300), takeUntil(this.destroy$)).subscribe(() => {
      this.onConfigChange();
    });
  }

  onConfigChange() {
    if (this.previewContainer?.nativeElement && this.config?.rules) {
      if (this.config.global) {
        this.config.global.defaults = {
          ...this.config.global.defaults,
          duration: this.pageForm.get('duration')?.value ?? 1,
          ease: this.pageForm.get('ease')?.value ?? 'power2.out',
          stagger: this.pageForm.get('stagger')?.value ?? 0.1
        };
        this.config.global.registerPlugins = this.pageForm.get('registerPlugins')?.value || [];
      }
      this.gsapConfigService.autoRefreshPreview(this.config, this.previewContainer.nativeElement);
    }
  }

  ngAfterViewInit(): void {
    if (this.inputElements?.length) {
      this.FormUtils.registerFormFieldEventListeners(this.pageFormFields, this.inputElements.toArray(), this.renderer, this.pageForm);
      this.FormUtils.registerFormFieldEventListeners(this.newpageFormFields, this.inputElements.toArray(), this.renderer, this.pageForm);
      this.FormUtils.registerFormFieldEventListeners(this.ruleFormFields, this.inputElements.toArray(), this.renderer, this.ruleForm);
      this.FormUtils.registerFormFieldEventListeners(this.callbackFormFields, this.inputElements.toArray(), this.renderer, this.callbackForm);
    }
  }

  private initForms(): void {
    this.pageForm = this.FormUtils.createFormGroup(this.pageFormFields, this.fb);
    this.newpageForm = this.FormUtils.createFormGroup(this.newpageFormFields, this.fb);
    this.ruleForm = this.FormUtils.createFormGroup(this.ruleFormFields, this.fb);
    this.callbackForm = this.FormUtils.createFormGroup(this.callbackFormFields, this.fb);
    this.timelineStepForms = [];
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  parseCssInput(input: string): Record<string, string> {
    if (!input) return {};
    const trimmed = input.trim();

    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (typeof parsed === 'object' && parsed !== null) return parsed as Record<string, string>;
      } catch (e) {}
    }

    const cssRules: Record<string, string> = {};
    const classMatch = trimmed.match(/\.([a-zA-Z_-][a-zA-Z0-9_-]*)\s*\{([^}]*)\}/);
    if (classMatch && classMatch[2]) {
      const declarations = classMatch[2].split(';').filter(d => d.trim());
      declarations.forEach(decl => {
        const [prop, val] = decl.split(':').map(s => s.trim());
        if (prop && val) {
          const camelProp = this.kebabToCamel(prop);
          cssRules[camelProp] = val;
        }
      });
      return cssRules;
    }

    const styleProps = trimmed.split(';').filter(s => s.trim());
    styleProps.forEach(style => {
      const [prop, val] = style.split(':').map(s => s.trim());
      if (prop && val) {
        const camelProp = this.kebabToCamel(prop);
        cssRules[camelProp] = val;
      }
    });

    return cssRules;
  }

  private kebabToCamel(str: string): string {
    return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
  }

  formatStylesForDisplay(styles: any): string {
    if (!styles) return '';
    if (typeof styles === 'string') return styles;
    return JSON.stringify(styles, null, 2);
  }
  private getOptionsFromResponse(res: any): { label: string; value: string }[] {
    const data = res?.result || res;
    if (Array.isArray(data)) {
      const options = data
        .map((item: any) => ({
          label: String(item.Desc || item.desc || item.Label || item.label || item.Val || item.val || ''),
          value: String(item.Val || item.val)
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
                firstValueFrom(this.lookupService.GetByCode('RULE_TYPE')),
                firstValueFrom(this.lookupService.GetByCode('easeOption')),
                firstValueFrom(this.lookupService.GetByCode('GSAP_STATUS')),
                firstValueFrom(this.lookupService.GetByCode('GSAP_PLUGIN'))
      ]);
      this.animationTypes = this.getOptionsFromResponse(animationTypesRes?.result);
      this.easeOptions = this.getOptionsFromResponse(easeOptionsRes?.result);
      this.statusOptions = this.getOptionsFromResponse(statusOptionsRes?.result);
      this.pluginOptions = this.getOptionsFromResponse(pluginOptionsRes?.result);
      console.log(this.pluginOptions);
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
    this.selectedPage = page;
    const pageId = page.PageId || page.pageId;
    if (!pageId) {
      this.config = this.getDefaultGsapConfig();
      this.pageForm.reset();
      return;
    }
    try {
      const [defaultsRes, pluginsRes, rulesRes, callbacksRes] = await Promise.all([
        firstValueFrom( this.gsapConfigService.GetGlobalDefaultsByPageId(pageId)),
        firstValueFrom( this.gsapConfigService.GetPluginsByPageId(pageId)),
        firstValueFrom(this.gsapConfigService.GetRulesByPageId(pageId)),
        firstValueFrom( this.gsapConfigService.GetCallbacksByPageId(pageId))
      ]);
      
      const defaults = defaultsRes?.result;
      const plugins = pluginsRes?.result;
      const rules = rulesRes?.result;
      const callbacks = callbacksRes?.result;
      
      // const pluginids = this.pluginOptions.filter((p: any) => this.config.global.registerPlugins?.includes(plugins.plugid)).map((p: any) => p.value);
      // const pluginids = plugins.map((p: any) => p.plugid);
      const pluginids = plugins.map((p: any) => String(p.plugid));
      this.config = {
        global: {
          pageId: pageId,
          defaults: {
            defaultsId: defaults?.defaultsID || defaults?.defaultsId || defaults?.DefaultsID,
            pageId: pageId,
            duration: defaults?.duration || defaults?.Duration || 1,
            ease: this.getDropdownValue(defaults?.ease || defaults?.Ease, this.easeOptions) || 'power2.out',
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
        plugins: plugins.map((p: any) => ({
          pluginId: p.pluginID || p.pluginId || 0,
          pageId: p.pageId || pageId,
          plugid: p.plugid || 0,
          pluginName: p.pluginName || p.PluginName || '',
          enabled: p.enabled ?? true
        })),
        pages: {},
        rules: rules.map((r: any) => ({
          ruleId: r?.ruleId || r?.RuleID || r?.ruleID,
          pageId: r?.pageId || r?.PageID || pageId,
          ruleKey: r?.ruleKey || r?.RuleKey,
          label: r?.label || r?.Label,
          selector: r?.selector || r?.Selector,
          type: this.getDropdownValue(r?.type || r?.RuleType, this.animationTypes),
          duration: r?.duration || r?.Duration,
          ease: r?.ease || r?.Ease || 'power2.out',
          stagger: r?.stagger || r?.Stagger,
          delay: r?.delay || r?.Delay,
          repeat: r?.repeat || r?.RepeatN,
          yoyo: r?.yoyo || r?.Yoyo || false,
          from: this.parseCssInput(r?.from || r?.From),
          to: this.parseCssInput(r?.to || r?.To),
          styles: this.parseCssInput(r?.styles || r?.Styles),
          paused: r?.paused || r?.Paused || false,
          scrollEnabled: r?.scrollEnabled || r?.ScrollEnabled || false,
          status: this.getDropdownValue(r?.status || r?.Status, this.statusOptions),
          sortOrder: r?.sortOrder || r?.SortOrder || 0
        })),
        callbacks: callbacks.map((c: any) => ({
          callbackId: c?.callbackId || c?.CallbackID || c?.callbackID,
          ruleId: c?.ruleId || c?.RuleID || c?.ruleID,
          eventName: c?.eventName || c?.EventName || '',
          handlerName: c?.handlerName || c?.HandlerName || '',
          handlerCode: c?.handlerCode || c?.HandlerCode || '',
          name: c?.handlerName || c?.HandlerName || '',
          script: c?.handlerCode || c?.HandlerCode || ''
        }))
      };

      const easeValue = this.getDropdownValue(this.config.global?.defaults?.ease, this.easeOptions);
      this.pageForm.patchValue({
        duration: this.config.global?.defaults?.duration,
        ease: easeValue,
        stagger: this.config.global?.defaults?.stagger,
        registerPlugins: this.config.global?.registerPlugins,
        autoInit: this.config.global?.autoInit ?? true
      });
    } catch (err) {
      console.error('Failed to load page data:', err);
      this.config = this.getDefaultGsapConfig();
    }
  }

  deletePage(index: number) {
    debugger;
    const page = this.pages[index];
    if (!page) return;
    this.confirmationService.confirm({
      key: 'deletePageDialog',
      message: `Are you sure you want to delete <b>${page.title || page.pageKey}</b>? This action cannot be undone.`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        const rawId = page.PageId || (page as any).pageId;
        const pageId = rawId ? parseInt(String(rawId), 10) : null;
        if (!pageId || isNaN(pageId)) {
          this.NotificationService.showMessage('Invalid page ID', 'Error', PopupMessageType.Error);
          return;
        }
        try {
          const response = await firstValueFrom(this.gsapConfigService.DeletePage(pageId));
          if (response?.isError) {
            this.NotificationService.showMessage(response.strMessage || 'Failed to delete page', 'Error', PopupMessageType.Error);
            return;
          }
          
          await this.loadPages();
          
          this.NotificationService.showMessage(response.strMessage || 'Page deleted successfully', 'Success', PopupMessageType.Success);
        } catch (err: any) {
          console.error('Failed to delete page:', err);
          this.NotificationService.showMessage(err?.error?.strMessage || 'Failed to delete page', 'Error', PopupMessageType.Error);
        }
      }
    });
  }

  openAddPageDialog() {
    this.newpageForm.patchValue({ PageId: 0, PageTitle: '' });
    this.showAddPageDialog = true;
  }

  async addPage() {
    debugger;
    const formValidation = this.FormUtils.validateFormFields(this.newpageFormFields,this.newpageForm, this.inputElements.toArray(), this.renderer);

    if (formValidation.isError) {
      this.NotificationService.showMessage(formValidation.strMessage, formValidation.title, formValidation.type);
      this.showAddPageDialog = false;
      return;
    }
    const pageTitle = this.newpageForm.get('PageTitle')?.value || '';
    if (pageTitle.trim()) {
      const pageKey = pageTitle.toLowerCase().replace(/\s+/g, '-');
        const pageData: MGsapPage = {
          pageId: 0,
          label: pageTitle,
          pageKey: pageKey,
          mCommonEntitiesMaster:{
                    isActive: true
            }
        };

      try {
        const response = await firstValueFrom(this.gsapConfigService.SavePage(pageData));
        if (response?.isError) {
          this.NotificationService.showMessage(response.strMessage || 'Failed to save page', 'Error', PopupMessageType.Error);
          return;
        }
        const pageId = response.result?.pageId || response.result?.PageId;
        const newPage: PageConfig = {
          PageId: pageId,
          title: pageTitle,
          label: pageTitle,
          pageKey: pageKey
        };
        debugger;
        await this.loadPages();
        this.pages.push(newPage);
        this.selectedPage = this.config;
        this.selectedPage.rules.pageId = newPage?.PageId;
        this.selectedPage.rules.label = newPage?.label;
        // this.selectPage(newPage);
        this.newpageForm.patchValue({ PageId: pageId, PageTitle: pageTitle });
        this.showAddPageDialog = false;
      } catch (err: any) {
        console.error('Failed to save page:', err);
        this.NotificationService.showMessage(err?.error?.strMessage || 'Failed to save page', 'Error', PopupMessageType.Error);
        this.showAddPageDialog = false;
      }
    }
  }

  async saveConfig() {
    if (!this.selectedPage) {
      this.NotificationService.showMessage('No page selected', 'Error', PopupMessageType.Error);
      return;
    }

    // if (this.pageForm.invalid) {
    //   this.markFormGroupTouched(this.pageForm);
    //   this.NotificationService.showMessage('Please fill all required fields', 'Validation Error', PopupMessageType.ValidationError);
    //   return;
    // }

    const outcome = this.FormUtils.validateFormFields(this.pageFormFields, this.pageForm, this.inputElements.toArray(), this.renderer);
    if (outcome.isError) {
      this.NotificationService.showMessage(outcome.strMessage, outcome.title, outcome.type);
      return;
    }

    const pageKey = this.selectedPage.pageKey;
    const pageId = this.selectedPage.PageId || this.selectedPage.pageId;
    if (!pageId) {
      this.NotificationService.showMessage('Page ID is required', 'Error', PopupMessageType.Error);
      return;
    }

    const validation = this.validateAll();
    if (!validation.isValid) {
      this.NotificationService.showMessage(validation.message, 'Validation Error', PopupMessageType.ValidationError);
      return;
    }
    const pluginNames = this.pageForm.get('registerPlugins')?.value?.filter((p: any) => p);
    const pageIdNum = parseInt(String(pageId), 10);
    const configPlugins = (this.config.plugins || []) as any[];
    
    const saveModel = {
      pageId: pageIdNum,
      pageKey: pageKey,
      label: this.selectedPage.title || pageKey,
      globalDefaults: {
        defaultsID: this.config.global?.defaults?.defaultsId || 0,
        pageId: pageIdNum,
        duration: this.pageForm.get('duration')?.value,
        ease: this.pageForm.get('ease')?.value,
        stagger: this.pageForm.get('stagger')?.value,
        delay: this.config.global?.defaults?.delay || 0,
        repeat: this.config.global?.defaults?.repeat || 0,
        yoyo: this.config.global?.defaults?.yoyo || false
      },
      
      plugins: pluginNames.map((name: string, idx: number) => ({
        pluginID: configPlugins[idx]?.pluginId || 0,
        pageId: pageIdNum,
        plugid: parseInt(name, 10),
        pluginName: configPlugins[idx]?.pluginName || name,
        enabled: true
      })),
      rules: (this.config.rules || []).map((r: any) => ({
        ruleId: r?.ruleId || 0,
        pageId: pageIdNum,
        ruleKey: r?.ruleKey || r?.label?.toLowerCase().replace(/\s+/g, '-'),
        label: r?.label,
        selector: r?.selector,
        type: r?.type,
        duration: r?.duration ?? 0,
        ease: r?.ease || 'power2.out',
        stagger: r?.stagger ?? 0,
        delay: r?.delay ?? 0,
        repeat: r?.repeat ?? 0,
        yoyo: r?.yoyo ?? false,
        paused: r?.paused ?? false,
        scrollEnabled: r?.scrollEnabled ?? false,
        status: r?.status,
        sortOrder: r?.sortOrder ?? 0,
        from: r?.from ? (typeof r?.from === 'object' ? JSON.stringify(r?.from) : String(r?.from)) : '{}',
        to: r?.to ? (typeof r?.to === 'object' ? JSON.stringify(r?.to) : String(r?.to)) : '{}',
        styles: r?.styles ? (typeof r?.styles === 'object' ? JSON.stringify(r?.styles) : String(r?.styles)) : '{}'
      })),
      callbacks: (this.config.callbacks || []).map((c: any) => ({
        callbackId: c?.callbackId || 0,
        ruleId: c?.ruleId || 0,
        eventName: c?.eventName || c?.handlerName,
        handlerName: c?.handlerName,
        handlerCode: c?.handlerCode
      }))
    };
    console.log('Save model:', saveModel);
    this.saving = true;
    try {
      const response = await firstValueFrom(this.gsapConfigService.SaveGsapConfig(saveModel));
      this.saving = false;
      if (response?.isError) {
        this.NotificationService.showMessage(response.strMessage || 'Failed to save', 'Error', PopupMessageType.Error);
      } else {
        this.selectedPage.gsapConfig = this.config;
        this.NotificationService.showMessage(response.strMessage || 'Configuration saved successfully', 'Success', PopupMessageType.Success);
      }
    } catch (err: any) {
      this.saving = false;
      console.error('Failed to save:', err);
      this.NotificationService.showMessage(err?.error?.strMessage || 'Failed to save configuration', 'Error', PopupMessageType.Error);
    }
  }

  private validateRules(): { isValid: boolean; message: string } {
    const validTypes = ['fromTo', 'to', 'from', 'set', 'timeline', 'keyframes'];
    const validEasePatterns = [
      'power1', 'power2', 'power3', 'power4',
      'back', 'elastic', 'bounce', 'circ', 'expo',
      'sine', 'quad', 'cubic', 'quart', 'quint',
      'rough', 'slow', 'steps', 'bezier'
    ];

    if (this.config.rules) {
      for (let i = 0; i < this.config.rules.length; i++) {
        const rule = this.config.rules[i];
        const ruleLabel = rule.label || `Rule #${i + 1}`;

        if (!rule.label || rule.label.trim() === '') {
          return { isValid: false, message: `${ruleLabel}: Label is required` };
        }

        if (!rule.selector || rule.selector.trim() === '') {
          return { isValid: false, message: `${ruleLabel}: Selector is required` };
        }

        const selectorValidation = this.validateSelector(rule.selector);
        if (!selectorValidation.isValid) {
          return { isValid: false, message: `${ruleLabel}: Invalid selector - ${selectorValidation.message}` };
        }

        if (!rule.type || rule.type.trim() == '0' || !this.animationTypes.some(item => item.value === rule.type)) 
        {
          return { isValid: false, message: `${ruleLabel}: Please select a valid type`};
        }

        if (rule.from && typeof rule.from === 'string') {
          const fromValidation = this.validateGsapJson(rule.from, 'From');
          if (!fromValidation.isValid) {
            return { isValid: false, message: `${ruleLabel}: ${fromValidation.message}` };
          }
        }

        if (rule.to && typeof rule.to === 'string') {
          const toValidation = this.validateGsapJson(rule.to, 'To');
          if (!toValidation.isValid) {
            return { isValid: false, message: `${ruleLabel}: ${toValidation.message}` };
          }
        }

        if (rule.styles && typeof rule.styles === 'string') {
          const stylesValidation = this.validateGsapJson(rule.styles, 'Styles');
          if (!stylesValidation.isValid) {
            return { isValid: false, message: `${ruleLabel}: ${stylesValidation.message}` };
          }
        }

        if (rule.duration !== undefined && (rule.duration < 0 || isNaN(rule.duration))) {
          return { isValid: false, message: `${ruleLabel}: Duration must be a positive number` };
        }

        if (rule.stagger !== undefined) {
          const staggerVal = typeof rule.stagger === 'number' ? rule.stagger : (rule.stagger as any)?.each || 0;
          if (staggerVal < 0 || isNaN(staggerVal)) {
            return { isValid: false, message: `${ruleLabel}: Stagger must be a positive number` };
          }
        }

        if (rule.delay !== undefined && (rule.delay < 0 || isNaN(rule.delay))) {
          return { isValid: false, message: `${ruleLabel}: Delay must be a positive number` };
        }
      }
    }
    return { isValid: true, message: '' };
  }

  private validateSelector(selector: string): { isValid: boolean; message: string } {
    if (!selector || selector.trim() === '') {
      return { isValid: false, message: 'Selector cannot be empty' };
    }

    const trimmed = selector.trim();

    const selectors = trimmed.split(',').map(s => s.trim()).filter(s => s);

    for (const singleSelector of selectors) {
      const validation = this.validateSingleSelector(singleSelector);
      if (!validation.isValid) {
        return validation;
      }
    }

    return { isValid: true, message: '' };
  }

  private validateSingleSelector(sel: string): { isValid: boolean; message: string } {
    if (!sel || sel.trim() === '') {
      return { isValid: false, message: 'Empty selector part' };
    }

    const trimmed = sel.trim();

    if (trimmed.startsWith('.')) {
      const classPart = trimmed.substring(1).split(/[\s>+~]/)[0];
      if (!classPart || !/^[a-zA-Z_-][a-zA-Z0-9_-]*$/.test(classPart)) {
        return { isValid: false, message: `Invalid class selector: .${classPart}` };
      }
    } else if (trimmed.startsWith('#')) {
      const idPart = trimmed.substring(1).split(/[\s>+~]/)[0];
      if (!idPart || !/^[a-zA-Z_-][a-zA-Z0-9_-]*$/.test(idPart)) {
        return { isValid: false, message: `Invalid ID selector: #${idPart}` };
      }
    } else if (trimmed.startsWith('[')) {
      if (!trimmed.includes(']')) {
        return { isValid: false, message: 'Incomplete attribute selector' };
      }
    } else if (trimmed.startsWith('*')) {
      return { isValid: true, message: '' };
    } else if (trimmed.startsWith(':')) {
      return { isValid: true, message: '' };
    } else {
      const validSelectorPattern = /^([a-zA-Z][a-zA-Z0-9_-]*)([\s>+~:.,#.\[\]]*)?/;
      if (!validSelectorPattern.test(trimmed)) {
        return { isValid: false, message: `Invalid selector format: ${trimmed}` };
      }
    }

    return { isValid: true, message: '' };
  }

  private validateGsapJson(input: string, fieldName: string): { isValid: boolean; message: string } {
    if (!input || input.trim() === '') {
      return { isValid: true, message: '' };
    }

    const trimmed = input.trim();

    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (typeof parsed !== 'object' || parsed === null) {
          return { isValid: false, message: `${fieldName}: Must be a valid JSON object` };
        }

        const validGsapProps = [
          'opacity', 'x', 'y', 'xPercent', 'yPercent', 'z', 'zIndex',
          'rotation', 'rotationX', 'rotationY', 'rotationZ',
          'scale', 'scaleX', 'scaleY', 'scaleZ',
          'skewX', 'skewY',
          'backgroundColor', 'background', 'color', 'borderColor', 'borderWidth', 'borderRadius',
          'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight',
          'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
          'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
          'top', 'left', 'right', 'bottom',
          'transform', 'transformOrigin', 'transformStyle', 'perspective',
          'filter', 'blur', 'brightness', 'contrast', 'grayscale', 'hueRotate', 'saturate',
          'clipPath', 'clip-path',
          'opacity', 'visibility', 'display',
          'overflow', 'overflowX', 'overflowY',
          'scrollTop', 'scrollLeft',
          'autoAlpha', 'svgOrigin'
        ];

        const keys = Object.keys(parsed);
        const invalidKeys = keys.filter(key => !validGsapProps.includes(key.toLowerCase()));

        if (invalidKeys.length > 0 && keys.length > 0) {
          console.warn(`${fieldName}: Unknown properties: ${invalidKeys.join(', ')}`);
        }

        return { isValid: true, message: '' };
      } catch (e) {
        return { isValid: false, message: `${fieldName}: Invalid JSON format` };
      }
    }

    const cssMatch = trimmed.match(/\.([a-zA-Z_-][a-zA-Z0-9_-]*)\s*\{([^}]*)\}/);
    if (cssMatch) {
      return { isValid: true, message: '' };
    }

    const propPairs = trimmed.split(';').filter(s => s.trim());
    for (const pair of propPairs) {
      if (!pair.includes(':')) {
        return { isValid: false, message: `${fieldName}: Invalid CSS format - missing colon` };
      }
    }

    return { isValid: true, message: '' };
  }

  private validateCallbacks(): { isValid: boolean; message: string } {
    const validEventNames = [
      'onStart', 'onUpdate', 'onComplete', 'onRepeat',
      'onReverseComplete', 'onReverse', 'onInterrupt'
    ];

    if (this.config.callbacks) {
      for (let i = 0; i < this.config.callbacks.length; i++) {
        const callback = this.config.callbacks[i];
        const callbackLabel = callback.name || `Callback #${i + 1}`;

        if (!callback.name || callback.name.trim() === '') {
          return { isValid: false, message: `${callbackLabel}: Name is required` };
        }

        if (!callback.script || callback.script.trim() === '') {
          return { isValid: false, message: `${callbackLabel}: Script is required` };
        }

        const eventName = callback.name.trim();
        const isValidEvent = validEventNames.some(e => e.toLowerCase() === eventName.toLowerCase());

        if (!isValidEvent) {
          console.warn(`${callbackLabel}: Unknown event "${eventName}". Valid events: ${validEventNames.join(', ')}`);
          this.NotificationService.showMessage(`${callbackLabel}: Unknown event "${eventName}". Valid events: ${validEventNames.join(', ')}`, 'Error', PopupMessageType.Error);
        }

        const scriptValidation = this.validateScript(callback.script);
        if (!scriptValidation.isValid) {
          return { isValid: false, message: `${callbackLabel}: ${scriptValidation.message}` };
        }
      }
    }
    return { isValid: true, message: '' };
  }

  private validateScript(script: string): { isValid: boolean; message: string } {
    if (!script || script.trim() === '') {
      return { isValid: true, message: '' };
    }

    const dangerousPatterns = [
      /eval\s*\(/,
      /Function\s*\(/,
      /setTimeout\s*\(\s*['"]/,
      /setInterval\s*\(\s*['"]/,
      /document\.cookie/,
      /localStorage\.setItem/,
      /sessionStorage\.setItem/,
      /fetch\s*\(\s*['"]/,
      /XMLHttpRequest/,
      /window\.location\s*=/,
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(script)) {
        return { isValid: false, message: 'Script contains potentially dangerous code' };
      }
    }

    const openBraces = (script.match(/{/g) || []).length;
    const closeBraces = (script.match(/}/g) || []).length;
    if (openBraces !== closeBraces) {
      return { isValid: false, message: 'Script has mismatched braces' };
    }

    const openParens = (script.match(/\(/g) || []).length;
    const closeParens = (script.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      return { isValid: false, message: 'Script has mismatched parentheses' };
    }

    return { isValid: true, message: '' };
  }

  private validateAll(): { isValid: boolean; message: string } {
    const globalValidation = this.validateGlobalDefaults();
    if (!globalValidation.isValid) {
      return globalValidation;
    }

    const pluginsValidation = this.validatePlugins();
    if (!pluginsValidation.isValid) {
      return pluginsValidation;
    }

    const rulesValidation = this.validateRules();
    if (!rulesValidation.isValid) {
      return rulesValidation;
    }

    const callbacksValidation = this.validateCallbacks();
    if (!callbacksValidation.isValid) {
      return callbacksValidation;
    }

    return { isValid: true, message: '' };
  }

  private validateGlobalDefaults(): { isValid: boolean; message: string } {
    const duration = this.pageForm.get('duration')?.value;
    const stagger = this.pageForm.get('stagger')?.value;
    const ease = this.pageForm.get('ease')?.value;

    if (duration === undefined || duration === null || duration === '') {
      return { isValid: false, message: 'Duration is required' };
    }
    if (duration < 0) {
      return { isValid: false, message: 'Duration must be greater than or equal to 0' };
    }

    if (stagger !== undefined && stagger !== null && stagger !== '' && stagger < 0) {
      return { isValid: false, message: 'Stagger must be greater than or equal to 0' };
    }

    if (!ease || ease.trim() === '') {
      return { isValid: false, message: 'Ease is required' };
    }

    return { isValid: true, message: '' };
  }

  private validatePlugins(): { isValid: boolean; message: string } {
    const pluginNames = this.pageForm.get('registerPlugins')?.value?.filter((p: any) => p);
    
    if (!pluginNames || pluginNames.length === 0) {
      return { isValid: false, message: 'Please select at least one plugin' };
    }

    return { isValid: true, message: '' };
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onFormChange() {
    this.changeSubject.next();
     if (this.editingRule.type === 'timeline'&& !this.editingTimelineSteps) {
        this.editingTimelineSteps = [];
    }
  }

  addRule(selectedPage: MGsapPage) {
    debugger;
    if (!selectedPage || !selectedPage.pageId) {
      this.NotificationService.showMessage('Please select a page first', 'Error', PopupMessageType.Error);
      return;
    }
    this.editingRule = this.getDefaultGsapRule();
    this.editingRule.pageId = selectedPage.pageId;
    this.editingIndex = null;
    this.editingTimelineSteps = [];
    this.ruleForm.reset();
    this.editMode = 'rule';
    this.showEditDialog = true;
  }

  getStatusSeverity(status: string): Severity {
    switch (status?.toLowerCase()) {
      case 'published': return 'success';
      case 'draft': return 'warn';
      case 'archived': return 'secondary';
      default: return 'info';
    }
  }
 
     
    getStatusLabel(statusValue: string): string {
    if (!statusValue || statusValue === '0') {
      if (this.statusOptions && this.statusOptions.length > 0) {
        const option = this.statusOptions.find(o => o.value === statusValue || o.value === statusValue?.toLowerCase());
        return option?.label || statusValue;
      }
      return this.defaultMap[statusValue?.toLowerCase() || ''] || statusValue || '';
    }

    if (this.statusOptions && this.statusOptions.length > 0) {
      const option = this.statusOptions.find(o => o.value === statusValue || o.label?.toLowerCase() === statusValue?.toLowerCase());
      return option?.label || statusValue;
    }

    return statusValue;
  }

  getTypeLabel(typeValue: string): string {
    if (!typeValue) return '';

    if (this.animationTypes && this.animationTypes.length > 0) {
      const option = this.animationTypes.find(o => o.value === typeValue || o.label?.toLowerCase() === typeValue?.toLowerCase());
      return option?.label || typeValue;
    }

    return typeValue;
  }

  getEaseLabel(easeValue: string): string {
    if (!easeValue) return '';

    if (this.easeOptions && this.easeOptions.length > 0) {
      const option = this.easeOptions.find(o => o.value === easeValue || o.label?.toLowerCase() === easeValue?.toLowerCase());
      return option?.label || easeValue;
    }

    return easeValue;
  }

  getPluginLabels(pluginValues: string[]): string {
    if (!pluginValues || pluginValues.length === 0) return '';

    if (this.pluginOptions && this.pluginOptions.length > 0) {
      const labels = pluginValues.map(p => {
        const option = this.pluginOptions.find(o => o.value === p || o.label?.toLowerCase() === p?.toLowerCase());
        return option?.label || p;
      });
      return labels.join(', ');
    }

    return pluginValues.join(', ');
  }

  editRule(rule: GsapRule, index: number) {
    this.editingRule = { ...rule };
    this.editingIndex = index;
    this.editingRuleFromJson = this.formatStylesForDisplay(rule.from);
    this.editingRuleToJson = this.formatStylesForDisplay(rule.to);
    this.editingRuleStylesJson = this.formatStylesForDisplay(rule.styles);
    this.editingTimelineSteps = rule.timelineSteps ? [...rule.timelineSteps] : [];
    this.initTimelineStepForms();
    this.populateRuleForm();
    this.editMode = 'rule';
    this.showEditDialog = true;
  }

  private populateRuleForm(): void {
    const typeValue = this.getDropdownValue(this.editingRule.type, this.animationTypes);
    const statusValue = this.getDropdownValue(this.editingRule.status, this.statusOptions);

    const st = this.editingRule.scrollTrigger || {} as any;

    this.ruleForm.patchValue({
      label: this.editingRule.label || '',
      type: typeValue,
      status: statusValue,
      selector: this.editingRule.selector || '',
      duration: this.editingRule.duration ?? 1,
      ease: this.editingRule.ease || 'power2.out',
      stagger: this.editingRule.stagger ?? 0,
      delay: this.editingRule.delay ?? 0,
      repeat: this.editingRule.repeat ?? 0,
      yoyo: this.editingRule.yoyo ?? false,
      repeatDelay: this.editingRule.repeatDelay ?? 0,
      scrollEnabled: this.editingRule.scrollEnabled ?? !!st,
      scrollTrigger_start: st.start || 'top 85%',
      scrollTrigger_end: st.end || 'bottom 20%',
      scrollTrigger_scrub: st.scrub ?? false,
      scrollTrigger_toggleActions: st.toggleActions || 'play none none reverse',
      scrollTrigger_markers: st.markers ?? false,
      scrollTrigger_pin: st.pin ?? false,
      editingRuleStylesJson: this.editingRuleStylesJson,
      editingRuleFromJson: this.editingRuleFromJson,
      editingRuleToJson: this.editingRuleToJson,
      mediaUrl: this.editingRule.media?.url || '',
      mediaType: this.editingRule.media?.type || 'none'
    });
  }

  private getDropdownValue(actualValue: string | undefined, options: { label: string; value: string }[]): string {
    if (!actualValue) return '';

    const exactMatch = options.find(opt => opt.value === actualValue || opt.value?.toLowerCase() === actualValue?.toLowerCase());
    if (exactMatch) return exactMatch.value;

    const labelMatch = options.find(opt => opt.label?.toLowerCase() === actualValue?.toLowerCase());
    if (labelMatch) return labelMatch.value;

    const map: Record<string, string> = {
      '0': '0', 'published': '0', 'draft': '1', 'archived': '2',
      'fromto': 'fromTo', 'from': 'from', 'to': 'to', 'set': 'set',
      'timeline': 'timeline', 'tween': 'tween'
    };
    const mapped = map[actualValue.toLowerCase()];
    if (mapped && options.find(opt => opt.value === mapped)) {
      return mapped;
    }

    return actualValue;
  }

  private initTimelineStepForms(): void {
    this.timelineStepForms = [];
    if (this.editingTimelineSteps && this.editingTimelineSteps.length > 0) {
      this.editingTimelineSteps.forEach((step, i) => {
        const stepFields: FormFieldConfig[] = [
          { name: `timelineLabel${i}`, isMandatory: false, validationMessage: '', events: [] },
          { name: `timelineSelector${i}`, isMandatory: false, validationMessage: '', events: [] },
          { name: `timelineDuration${i}`, isMandatory: false, min: 0, validationMessage: 'Must be >= 0', events: [] },
          { name: `timelineEase${i}`, isMandatory: false, validationMessage: '', events: [] },
          { name: `timelineDelay${i}`, isMandatory: false, min: 0, validationMessage: 'Must be >= 0', events: [] },
        ];
        const stepForm = this.FormUtils.createFormGroup(stepFields, this.fb);
        stepForm.patchValue({
          [`timelineLabel${i}`]: step.label || '',
          [`timelineSelector${i}`]: step.selector || '',
          [`timelineDuration${i}`]: step.duration || 1,
          [`timelineEase${i}`]: step.ease || 'power2.out',
          [`timelineDelay${i}`]: step.delay || 0
        });
        this.timelineStepForms.push(stepForm);
      });
    }
  }

  deleteRule(index: number) {
    if (this.config.rules) {
      this.config.rules.splice(index, 1);
    }
  }

  addCallback(selectedPage: MGsapPage) {
    if (!selectedPage || !selectedPage.pageId) {
      this.NotificationService.showMessage('Please select a page first', 'Error', PopupMessageType.Error);
      return;
    }
    this.editingCallback = new SaveGsapCallback();
    this.editingIndex = null;
    this.callbackForm.reset();
    this.editMode = 'callback';
    this.showEditDialog = true;
  }

  editCallback(index: number) {
    const callback = this.config.callbacks?.[index];
    if (callback) {
      this.editingCallback = new SaveGsapCallback();
      this.editingCallback.callbackId = callback.callbackId || 0;
      this.editingCallback.ruleId = callback.ruleId || 0;
      this.editingCallback.eventName = callback.eventName || '';
      this.editingCallback.handlerName = callback.handlerName || '';
      this.editingCallback.handlerCode = callback.handlerCode || '';
      this.editingCallback.name = callback.name || callback.handlerName || '';
      this.editingCallback.script = callback.script || callback.handlerCode || '';
      this.editingIndex = index;
      this.callbackForm.patchValue({
        name: this.editingCallback.name,
        script: this.editingCallback.script
      });
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
      if (this.config.global) {
        this.config.global.defaults = {
          ...this.config.global.defaults,
          duration: this.pageForm.get('duration')?.value ?? 1,
          ease: this.pageForm.get('ease')?.value ?? 'power2.out',
          stagger: this.pageForm.get('stagger')?.value ?? 0.1
        };
        this.config.global.registerPlugins = this.pageForm.get('registerPlugins')?.value || [];
      }
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
    this.timelineStepData = [...(this.timelineStepData || []), {
      label: newStep.label || '',
      selector: newStep.selector || '',
      duration: newStep.duration || 1,
      ease: newStep.ease || 'power2.out',
      delay: newStep.delay || 0
    }];
    
    const idx = this.editingTimelineSteps.length - 1;
    const stepFields: FormFieldConfig[] = [
      { name: `timelineLabel${idx}`, isMandatory: false, validationMessage: '', events: [] },
      { name: `timelineSelector${idx}`, isMandatory: false, validationMessage: '', events: [] },
      { name: `timelineDuration${idx}`, isMandatory: false, min: 0, validationMessage: 'Must be >= 0', events: [] },
      { name: `timelineEase${idx}`, isMandatory: false, validationMessage: '', events: [] },
      { name: `timelineDelay${idx}`, isMandatory: false, min: 0, validationMessage: 'Must be >= 0', events: [] },
    ];
    const stepForm = this.FormUtils.createFormGroup(stepFields, this.fb);
    stepForm.patchValue({
      [`timelineLabel${idx}`]: newStep.label || '',
      [`timelineSelector${idx}`]: newStep.selector || '',
      [`timelineDuration${idx}`]: newStep.duration || 1,
      [`timelineEase${idx}`]: newStep.ease || 'power2.out',
      [`timelineDelay${idx}`]: newStep.delay || 0
    });
    this.timelineStepForms.push(stepForm);
    
    this.onFormChange();
  }

  removeNestedStep(index: number) {
    if (this.editingTimelineSteps) {
      this.editingTimelineSteps.splice(index, 1);
      this.editingTimelineSteps = [...this.editingTimelineSteps];
      this.timelineStepData.splice(index, 1);
      this.timelineStepData = [...this.timelineStepData];
      this.timelineStepForms.splice(index, 1);
      this.onFormChange();
    }
  }

  saveEdit() {
    if (this.editMode === 'rule') {
      const formValidation = this.FormUtils.validateFormFields(this.ruleFormFields, this.ruleForm, this.inputElements.toArray(), this.renderer);
      if (formValidation.isError) {
        this.NotificationService.showMessage(formValidation.strMessage, formValidation.title, formValidation.type);
        return;
      }

      const scrollEnabled = this.ruleForm.get('scrollEnabled')?.value ?? false;
      const scrollTriggerObj: GsapScrollTrigger | undefined = scrollEnabled ? {
        enabled: true,
        trigger: this.ruleForm.get('selector')?.value || '',
        start: this.ruleForm.get('scrollTrigger_start')?.value || 'top 85%',
        end: this.ruleForm.get('scrollTrigger_end')?.value || 'bottom 20%',
        scrub: typeof this.ruleForm.get('scrollTrigger_scrub')?.value === 'string'
          ? parseFloat(this.ruleForm.get('scrollTrigger_scrub')?.value) || false
          : this.ruleForm.get('scrollTrigger_scrub')?.value ?? false,
        toggleActions: this.ruleForm.get('scrollTrigger_toggleActions')?.value || 'play none none reverse',
        markers: this.ruleForm.get('scrollTrigger_markers')?.value ?? false,
        pin: this.ruleForm.get('scrollTrigger_pin')?.value ?? false,
      } : undefined;

      const ruleData: any = {
        label: this.ruleForm.get('label')?.value,
        type: this.ruleForm.get('type')?.value,
        status: this.ruleForm.get('status')?.value,
        selector: this.ruleForm.get('selector')?.value,
        duration: this.ruleForm.get('duration')?.value ?? 1,
        ease: this.ruleForm.get('ease')?.value || 'power2.out',
        stagger: this.ruleForm.get('stagger')?.value ?? 0,
        delay: this.ruleForm.get('delay')?.value ?? 0,
        repeat: this.ruleForm.get('repeat')?.value ?? 0,
        yoyo: this.ruleForm.get('yoyo')?.value ?? false,
        repeatDelay: this.ruleForm.get('repeatDelay')?.value ?? 0,
        scrollEnabled,
        scrollTrigger: scrollTriggerObj,
        from: this.parseCssInput(this.ruleForm.get('editingRuleFromJson')?.value),
        to: this.parseCssInput(this.ruleForm.get('editingRuleToJson')?.value),
        styles: this.parseCssInput(this.ruleForm.get('editingRuleStylesJson')?.value),
        timelineSteps: [] as any[],
        media: {
          type: this.ruleForm.get('mediaType')?.value,
          url: this.ruleForm.get('mediaUrl')?.value,
          id: '',
          selector: ''
        }
      };

      const gsapValidation = this.validateGsapObject(ruleData, 'Rule');
      if (!gsapValidation.isValid) {
        this.NotificationService.showMessage(gsapValidation.message, 'Validation Error', PopupMessageType.ValidationError);
        return;
      }

      if (this.timelineStepForms && this.timelineStepForms.length > 0) {
        ruleData.timelineSteps = this.editingTimelineSteps.map((step, i) => ({
          ...step,
          label: this.timelineStepForms[i]?.get(`timelineLabel${i}`)?.value || step.label || '',
          selector: this.timelineStepForms[i]?.get(`timelineSelector${i}`)?.value || step.selector || '',
          duration: this.timelineStepForms[i]?.get(`timelineDuration${i}`)?.value ?? step.duration ?? 1,
          ease: this.timelineStepForms[i]?.get(`timelineEase${i}`)?.value || step.ease || 'power2.out',
          delay: this.timelineStepForms[i]?.get(`timelineDelay${i}`)?.value ?? step.delay ?? 0
        }));
      }

      if (this.editingIndex !== null) {
        this.editingRule = {
          ...this.editingRule,
          ...ruleData
        };
        if (this.config.rules) {
          this.config.rules[this.editingIndex] = { ...this.editingRule };
        }
      } else {
        const newRule: GsapRule = {
          ruleId: 0,
          pageId: this.selectedPage?.PageId || this.selectedPage?.pageId || 0,
          ruleKey: '',
          ...ruleData,
          duration: 1,
          ease: 'power2.out',
          stagger: 0,
          delay: 0,
          repeat: 0,
          yoyo: false,
          scrollEnabled: false
        };
        this.config.rules = [...(this.config.rules || []), newRule];
      }
    } else if (this.editMode === 'callback') {
      const formValidation = this.FormUtils.validateFormFields(this.callbackFormFields, this.callbackForm, this.inputElements.toArray(), this.renderer);
      if (formValidation.isError) {
        this.NotificationService.showMessage(formValidation.strMessage, formValidation.title, formValidation.type);
        return;
      }

      const callbackData = {
        name: this.callbackForm.get('name')?.value || '',
        script: this.callbackForm.get('script')?.value || '',
        eventName: this.callbackForm.get('name')?.value || '',
        handlerName: this.callbackForm.get('name')?.value || '',
        handlerCode: this.callbackForm.get('script')?.value || ''
      };

      const callbackValidation = this.validateGsapCallback(callbackData);
      if (!callbackValidation.isValid) {
        this.NotificationService.showMessage(callbackValidation.message, 'Validation Error', PopupMessageType.ValidationError);
        return;
      }

      if (this.editingIndex !== null) {
        this.editingCallback = {
          ...this.editingCallback,
          ...callbackData
        };
        if (this.config.callbacks) {
          this.config.callbacks[this.editingIndex] = { ...this.editingCallback };
        }
      } else {
        const newCallback: SaveGsapCallback = {
          callbackId: 0,
          ruleId: 0,
          ...callbackData
        };
        this.config.callbacks = [...(this.config.callbacks || []), newCallback];
      }
    }

    this.showEditDialog = false;
    this.editMode = null;
    this.editingIndex = null;
    this.editingTimelineSteps = [];
    this.timelineStepForms = [];
    this.onConfigChange();
  }

  private validateGsapObject(rule: any, fieldName: string): { isValid: boolean; message: string } {
    if (!rule.label || rule.label.trim() === '') {
      return { isValid: false, message: `${fieldName}: Label is required` };
    }

    if (!rule.selector || rule.selector.trim() === '') {
      return { isValid: false, message: `${fieldName}: Selector is required` };
    }

    const selectorValidation = this.validateSelector(rule.selector);
    if (!selectorValidation.isValid) {
      return { isValid: false, message: `${fieldName}: ${selectorValidation.message}` };
    }

    if (rule.from) {
      const fromValidation = this.validateGsapJsonObject(rule.from);
      if (!fromValidation.isValid) {
        return { isValid: false, message: `${fieldName}: From - ${fromValidation.message}` };
      }
    }

    if (rule.to) {
      const toValidation = this.validateGsapJsonObject(rule.to);
      if (!toValidation.isValid) {
        return { isValid: false, message: `${fieldName}: To - ${toValidation.message}` };
      }
    }

    if (rule.styles) {
      const stylesValidation = this.validateGsapJsonObject(rule.styles);
      if (!stylesValidation.isValid) {
        return { isValid: false, message: `${fieldName}: Styles - ${stylesValidation.message}` };
      }
    }

    return { isValid: true, message: '' };
  }

  private validateGsapJsonObject(obj: any): { isValid: boolean; message: string } {
    if (!obj || typeof obj !== 'object') {
      return { isValid: true, message: '' };
    }

    const validProps = [
      'opacity', 'x', 'y', 'xPercent', 'yPercent', 'z', 'zIndex',
      'rotation', 'rotationX', 'rotationY', 'rotationZ',
      'scale', 'scaleX', 'scaleY', 'scaleZ',
      'skewX', 'skewY',
      'backgroundColor', 'background', 'color', 'borderColor', 'borderWidth', 'borderRadius',
      'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight',
      'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
      'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
      'top', 'left', 'right', 'bottom',
      'transform', 'transformOrigin', 'transformStyle', 'perspective', 'perspectiveOrigin',
      'backfaceVisibility', 'boxShadow', 'textShadow',
      'filter', 'blur', 'brightness', 'contrast', 'grayscale', 'hueRotate', 'invert', 'saturate', 'sepia',
      'backdropFilter', 'clipPath', 'clipRule',
      'display', 'visibility', 'overflow', 'overflowX', 'overflowY',
      'autoAlpha', 'force3D',
      'scrollTop', 'scrollLeft',
      'svgOrigin', 'attr',
      'className', 'textContent',
      'motionPath', 'path', 'align', 'alignOrigin', 'start', 'end', 'autoRotate', 'rotateX', 'rotateY',
      'morphSVG', 'shapeIndex', 'type',
      'drawSVG',
      'cssRule', 'selector',
      'physics2D', 'velocity', 'angle', 'gravity', 'friction',
      'physicsProps', 'acceleration', 'accelerationX', 'accelerationY',
      'scrambleText', 'chars', 'speed', 'revealDelay', 'tweenLength', 'newClass', 'oldClass',
      'inertia', 'resistance', 'min', 'max', 'bounce', 'overshoot',
    ];

    const keys = Object.keys(obj);
    for (const key of keys) {
      if (!validProps.includes(key.toLowerCase()) && !key.startsWith('border')) {
        console.warn(`Unknown GSAP property: ${key}`);
      }

      const value = obj[key];
      if (typeof value === 'string' && (value.includes('px') || value.includes('%') || value.includes('em') || value.includes('rem') || value.includes('deg') || value.includes('rad') || value.includes('vh') || value.includes('vw') || value.includes('svw') || value.includes('lvw'))) {
        continue;
      }
      if (typeof value === 'number') {
        continue;
      }
      if (typeof value === 'string' && !value.includes('rgb') && !value.includes('rgba') && !value.includes('#') && !value.startsWith('hsl') && !value.startsWith('var(') && !value.startsWith('url(')) {
        console.warn(`Property ${key} may have invalid value: ${value}`);
      }
    }

    return { isValid: true, message: '' };
  }

  private validateGsapCallback(callback: any): { isValid: boolean; message: string } {
    if (!callback.name || callback.name.trim() === '') {
      return { isValid: false, message: 'Callback: Name is required' };
    }

    if (!callback.script || callback.script.trim() === '') {
      return { isValid: false, message: 'Callback: Script is required' };
    }

    return this.validateScript(callback.script);
  }

  cancelEdit() {
    this.showEditDialog = false;
    this.editMode = null;
    this.editingTimelineSteps = [];
    this.editingRule = this.getDefaultGsapRule();
    this.editingIndex = null;
  }

  //#region JSON Import

  openImportDialog() {
    this.importJsonText = '';
    this.importJsonError = '';
    this.importValidated = false;
    this.importParsedConfig = null;
    this.showImportDialog = true;
  }

  onImportJsonInput(value: string) {
    this.importJsonText = value;
    this.importJsonError = '';
    this.importValidated = false;
    this.importParsedConfig = null;
  }

  validateImportJson(): boolean {
    this.importJsonError = '';
    this.importValidated = false;
    this.importParsedConfig = null;

    const raw = this.importJsonText?.trim();
    if (!raw) {
      this.importJsonError = 'Please paste JSON data';
      return false;
    }

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      this.importJsonError = 'Invalid JSON format';
      return false;
    }

    if (!parsed || typeof parsed !== 'object') {
      this.importJsonError = 'JSON must be an object';
      return false;
    }

    const xssError = this.checkXssInJson(parsed);
    if (xssError) {
      this.importJsonError = xssError;
      return false;
    }

    const sanitized = this.sanitizeImportData(parsed);
    if (!sanitized) {
      this.importJsonError = 'Import data is empty after sanitization';
      return false;
    }

    const gsapCheck = this.checkGsapCompatibility(sanitized);
    if (!gsapCheck.isValid) {
      this.importJsonError = gsapCheck.message;
      return false;
    }

    this.importParsedConfig = sanitized;
    this.importValidated = true;
    return true;
  }

  private checkXssInJson(obj: any, path = ''): string | null {
    if (!obj || typeof obj !== 'object') {
      if (typeof obj === 'string') {
        const dangerous = [
          /<script[\s>]/i,
          /javascript\s*:/i,
          /on\w+\s*=\s*['"]/i,
          /eval\s*\(/i,
          /Function\s*\(/i,
          /setTimeout\s*\(\s*['"`]/i,
          /setInterval\s*\(\s*['"`]/i,
          /document\s*\./i,
          /window\s*\./i,
          /localStorage/i,
          /sessionStorage/i,
          /new\s+Function/i,
          /\.innerHTML\s*=/i,
          /\.outerHTML\s*=/i,
          /document\.write/i,
          /fetch\s*\(/i,
          /XMLHttpRequest/i,
          /import\s*\(/i,
          /require\s*\(/i,
        ];
        for (const pattern of dangerous) {
          if (pattern.test(obj)) {
            return `XSS detected in field "${path || 'root'}": contains dangerous pattern`;
          }
        }
      }
      return null;
    }

    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        const err = this.checkXssInJson(obj[i], `${path}[${i}]`);
        if (err) return err;
      }
    } else {
      for (const key of Object.keys(obj)) {
        if (/^on\w+$/i.test(key)) {
          return `XSS detected: event handler attribute "${path ? path + '.' : ''}${key}" is not allowed`;
        }
        const err = this.checkXssInJson(obj[key], path ? `${path}.${key}` : key);
        if (err) return err;
      }
    }
    return null;
  }

  private sanitizeImportData(obj: any): any {
    if (!obj || typeof obj !== 'object') {
      if (typeof obj === 'string') {
        return obj
          .replace(/</g, '\\u003C')
          .replace(/>/g, '\\u003E');
      }
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeImportData(item)).filter(Boolean);
    }

    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (/^on\w+$/i.test(key)) continue;
      const cleaned = this.sanitizeImportData(value);
      if (cleaned !== undefined && cleaned !== null) {
        const cleanKey = key.replace(/[^a-zA-Z0-9_\-$]/g, '_');
        sanitized[cleanKey] = cleaned;
      }
    }
    return sanitized;
  }

  private checkGsapCompatibility(obj: any): { isValid: boolean; message: string } {
    const knownTopLevelKeys = [
      'global', 'plugins', 'pages', 'rules', 'callbacks', 'configName',
      'pageId', 'pageKey', 'label', 'name', 'version', 'status',
      'globalDefaults', 'description', 'gsap', 'id', 'type', 'category',
      'html', 'css', 'previewUrl', 'createdAt', 'updatedAt',
    ];

    const knownGlobalKeys = ['pageId', 'defaults', 'registerPlugins', 'autoInit', 'observeDom', 'meta', 'version', 'status'];
    const knownDefaultKeys = ['defaultsId', 'pageId', 'duration', 'ease', 'stagger', 'delay', 'repeat', 'yoyo'];
    const knownRuleKeys = [
      'ruleId', 'pageId', 'ruleKey', 'label', 'selector', 'from', 'to', 'styles',
      'duration', 'ease', 'stagger', 'delay', 'repeat', 'yoyo', 'yoyoEase', 'repeatDelay',
      'paused', 'scrollEnabled', 'scrollTrigger', 'status', 'type', 'sortOrder',
      'version', 'timelineSteps', 'media', 'overwrite', 'immediateRender', 'lazy',
      'keyframes', 'callbacks',
    ];
    const knownGsapProps = [
      'opacity', 'x', 'y', 'xPercent', 'yPercent', 'z', 'zIndex', 'rotation', 'rotationX',
      'rotationY', 'rotationZ', 'scale', 'scaleX', 'scaleY', 'scaleZ', 'skewX', 'skewY',
      'autoAlpha', 'force3D', 'transformOrigin', 'perspective', 'perspectiveOrigin',
      'backfaceVisibility', 'transformStyle',
      'backgroundColor', 'color', 'borderColor', 'borderWidth', 'borderRadius',
      'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight',
      'padding', 'margin', 'top', 'left', 'right', 'bottom',
      'filter', 'blur', 'brightness', 'contrast', 'grayscale', 'hueRotate', 'invert', 'saturate', 'sepia',
      'backdropFilter', 'clipPath', 'boxShadow', 'textShadow',
      'display', 'visibility', 'overflow', 'overflowX', 'overflowY',
      'scrollTop', 'scrollLeft', 'className', 'textContent',
      'svgOrigin', 'attr', 'cssRule',
      'motionPath', 'path', 'align', 'autoRotate',
      'morphSVG', 'drawSVG',
      'scrambleText', 'physics2D', 'inertia',
    ];

    const checkKeys = (data: any, knownKeys: string[], context: string): string | null => {
      if (!data || typeof data !== 'object') return null;
      for (const key of Object.keys(data)) {
        const lower = key.toLowerCase();
        if (!knownKeys.includes(key) && !knownKeys.includes(lower) && !key.startsWith('_')) {
          if (context === 'gsap-props') {
            if (!knownGsapProps.includes(lower) && !lower.startsWith('border')) {
              console.warn(`Unknown GSAP property "${key}" in ${context}`);
            }
          } else {
            console.warn(`Unknown key "${key}" in ${context}`);
          }
        }
      }
      return null;
    };

    checkKeys(obj, knownTopLevelKeys, 'top-level');

    if (obj.global) {
      checkKeys(obj.global, knownGlobalKeys, 'global');
      if (obj.global.defaults) checkKeys(obj.global.defaults, knownDefaultKeys, 'defaults');
      if (obj.global.registerPlugins) {
        const plugins = obj.global.registerPlugins;
        if (Array.isArray(plugins)) {
          for (const p of plugins) {
            if (typeof p === 'string' && p.length > 100) {
              return { isValid: false, message: `Invalid plugin name: "${p.substring(0, 30)}..."` };
            }
          }
        }
      }
    }

    if (obj.globalDefaults) {
      checkKeys(obj.globalDefaults, knownDefaultKeys, 'globalDefaults');
    }

    const allRules = obj.rules || (obj.gsap?.rules) || [];
    if (allRules.length > 50) {
      return { isValid: false, message: `Too many rules (${allRules.length}). Max 50 allowed.` };
    }

    const validTypes = ['fromTo', 'to', 'from', 'set', 'timeline', 'keyframes', 'tween'];
    for (let i = 0; i < allRules.length; i++) {
      const r = allRules[i];
      if (!r.selector || typeof r.selector !== 'string') {
        return { isValid: false, message: `Rule #${i + 1}: selector is required and must be a string` };
      }
      if (r.type && !validTypes.includes(r.type.toLowerCase())) {
        return { isValid: false, message: `Rule #${i + 1}: unknown type "${r.type}". Valid: ${validTypes.join(', ')}` };
      }
      if (r.duration !== undefined && (typeof r.duration !== 'number' || r.duration < 0)) {
        return { isValid: false, message: `Rule #${i + 1}: duration must be a positive number` };
      }
      checkKeys(r, knownRuleKeys, `rule[${i}]`);
      if (r.from && typeof r.from === 'object') checkKeys(r.from, knownGsapProps, `rule[${i}].from (gsap-props)`);
      if (r.to && typeof r.to === 'object') checkKeys(r.to, knownGsapProps, `rule[${i}].to (gsap-props)`);
      if (r.styles && typeof r.styles === 'object') {
        for (const sk of Object.keys(r.styles)) {
          if (sk.includes('<') || sk.includes('>') || sk.includes('script')) {
            return { isValid: false, message: `Rule #${i + 1}: invalid style key "${sk}"` };
          }
        }
      }
    }

    return { isValid: true, message: '' };
  }

  private hasExistingData(): boolean {
    return !!(
      (this.config?.rules && this.config.rules.length > 0) ||
      (this.config?.callbacks && this.config.callbacks.length > 0) ||
      (this.config?.plugins && this.config.plugins.length > 0)
    );
  }

  private ensureImportedPageRef() {
    const ruleCount = this.config?.rules?.length || 0;
    if (!this.selectedPage) {
      this.selectedPage = {
        PageId: 0,
        title: 'Imported Config',
        label: 'Imported Config',
        pageKey: 'imported-config',
        description: `Imported ${ruleCount} rule(s)`
      };
    }
  }

  private afterImportApply() {
    this.ensureImportedPageRef();
    this.showImportDialog = false;
    if (this.hasExistingData()) {
      this.NotificationService.showMessage(
        'Config imported. Click "Save to DB" to persist changes.',
        'Import Successful', PopupMessageType.Success
      );
    }
  }

  applyImportReplace() {
    if (!this.importParsedConfig) return;

    const doReplace = () => {
      const normalized = this.gsapConfigService.importConfigFromAsset({
        config: this.importParsedConfig,
        label: 'Imported Config',
        fileName: 'import.json',
      });

      if (!normalized) return;

      const ruleCount = normalized.rules?.length || 0;
      const cbCount = normalized.callbacks?.length || 0;

      this.config = normalized;
      this.pageForm.patchValue({
        duration: this.config.global?.defaults?.duration ?? 1,
        ease: this.getDropdownValue(this.config.global?.defaults?.ease, this.easeOptions) || 'power2.out',
        stagger: this.config.global?.defaults?.stagger ?? 0,
        registerPlugins: this.config.global?.registerPlugins || [],
        autoInit: this.config.global?.autoInit ?? true
      });

      this.afterImportApply();
      this.NotificationService.showMessage(
        `Replaced config with ${ruleCount} rule(s), ${cbCount} callback(s). Save to DB to persist.`,
        'Import Applied', PopupMessageType.Success
      );
    };

    if (this.hasExistingData()) {
      this.confirmationService.confirm({
        key: 'importConfirmDialog',
        message: `This page already has <b>${this.config.rules?.length || 0} rule(s)</b> and <b>${this.config.callbacks?.length || 0} callback(s)</b>. Replacing will overwrite all existing data. Continue?`,
        header: 'Existing Data Warning',
        icon: 'pi pi-exclamation-triangle',
        accept: doReplace
      });
    } else {
      doReplace();
    }
  }

  applyImportMerge() {
    if (!this.importParsedConfig) return;

    const doMerge = () => {
      const normalized = this.gsapConfigService.importConfigFromAsset({
        config: this.importParsedConfig,
        label: 'Imported Config',
        fileName: 'import.json',
      });

      if (!normalized?.rules) return;

      const mergeCount = normalized.rules.length;
      const beforeCount = this.config.rules?.length || 0;

      this.config.rules = [...(this.config.rules || []), ...normalized.rules];

      if (normalized.callbacks) {
        this.config.callbacks = [...(this.config.callbacks || []), ...normalized.callbacks];
      }

      if (normalized.global?.registerPlugins) {
        const existing = this.config.global?.registerPlugins || [];
        const merged = [...new Set([...existing, ...normalized.global.registerPlugins])];
        this.config.global.registerPlugins = merged;
        this.pageForm.patchValue({ registerPlugins: merged });
      }

      this.afterImportApply();
      this.NotificationService.showMessage(
        `Merged ${mergeCount} rule(s) (was ${beforeCount}, now ${this.config.rules.length}). Save to DB to persist.`,
        'Merge Successful', PopupMessageType.Success
      );
    };

    if (this.hasExistingData()) {
      this.confirmationService.confirm({
        key: 'importConfirmDialog',
        message: `<b>${this.config.rules?.length || 0} rule(s)</b> already exist. Merge will append ${this.getImportRuleCount()} imported rule(s). Continue?`,
        header: 'Existing Data Warning',
        icon: 'pi pi-info-circle',
        accept: doMerge
      });
    } else {
      doMerge();
    }
  }

  private getImportRuleCount(): number {
    if (!this.importParsedConfig) return 0;
    const data = this.importParsedConfig;
    return data.rules?.length || data.gsap?.rules?.length || 0;
  }

  //#endregion JSON Import

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
      plugins: [{
        pluginId: 0,
        pageId: 0,
        pluginName: '',
        enabled: true
      }],
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

