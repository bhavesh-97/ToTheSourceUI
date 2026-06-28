import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, computed, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { ConfirmationService } from 'primeng/api';
import { NotificationService } from '../../../services/notification.service';
import { PopupMessageType } from '../../../models/PopupMessageType';
import { PageConfigService } from './page-config.service';
import { PageConfig, PageConfigSection, TemplateTypeOption, SECTION_PRESETS, SectionPreset, TemplateListItem } from './PageConfig';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { CodeSanitizer, ValidationResult } from '../../../shared/utilities/code-sanitizer';
import { MCommonEntitiesMaster } from '../../../models/MCommonEntitiesMaster';
import { GsapMasterService } from '../gsap-master/gsap-master.service';
import { MGsapPage } from '../gsap-master/gsap-interface';
import { DynamicPageService, PageConfigListItem } from '../../../Web/components/dynamic-page/dynamic-page.service';
import { GuideTabComponent } from './guide-tab/guide-tab.component';

@Component({
  selector: 'app-page-config',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ButtonModule, DialogModule, InputTextModule,
    TableModule, TagModule, TextareaModule, SelectModule, ToggleSwitchModule,
    ConfirmDialogModule, TooltipModule, Tabs, TabList, Tab, TabPanels, TabPanel,
    IconField, InputIcon, GuideTabComponent
  ],
  templateUrl: './page-config.component.html',
  styleUrls: ['./page-config.component.scss']
})
export class PageConfigComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('previewIframe') previewIframe!: ElementRef<HTMLIFrameElement>;

  private pageConfigService = inject(PageConfigService);
  private dynamicPageService = inject(DynamicPageService);
  private gsapMasterService = inject(GsapMasterService);
  private notification = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);

  saving = signal(false);
  editorOpen = signal(false);
  guideDialogVisible = false;
  isNew = signal(false);
  showPreview = signal(false);
  previewDevice = signal<'desktop' | 'tablet' | 'mobile'>('desktop');
  expandedSection = signal<number | null>(null);

  searchQuery = '';
  pageList = signal<PageConfigListItem[]>([]);
  filteredPages = signal<PageConfigListItem[]>([]);
  editingPage = signal<PageConfig>(new PageConfig());
  templateTypes = signal<TemplateTypeOption[]>([]);
  private templateCache = signal<Map<number, TemplateListItem[]>>(new Map());

  getTemplatesForSection(section: PageConfigSection): TemplateListItem[] {
    if (!section.templateTypeID) return [];
    return this.templateCache().get(Number(section.templateTypeID)) || [];
  }
  gsapPageKeys = signal<MGsapPage[]>([]);

  sectionErrors = signal<Record<number, Record<string, string[]>>>({});
  sectionWarnings = signal<Record<number, Record<string, string[]>>>({});
  validationErrors = signal<Record<string, string>>({});

  globalCssValidation = signal<ValidationResult>({ valid: true, errors: [], sanitized: '' });
  globalJsValidation = signal<ValidationResult>({ valid: true, errors: [], sanitized: '' });

  previewUrl = computed(() => {
    const key = this.editingPage().pageKey;
    if (!key) return '';
    const base = window.location.origin;
    return `${base}/${key}`;
  });

  // gsapKeyOptions = computed(() => {
  //   debugger;
  //   const allKeys = new Set<string>([
  //     ...this.gsapPageKeys() 
  //   ]);
  //   return Array.from(allKeys).filter(k => k).map(k => ({ pageid: k, pagekey: k }));
  // });

  sectionPresets = SECTION_PRESETS;

  statusOptions = [
    { label: 'Active', value: 'Active' },
    { label: 'Draft', value: 'Draft' },
    { label: 'Inactive', value: 'Inactive' },
  ];

  widthOptions = [
    { label: 'Full Width', value: 'full' },
    { label: 'Container (1200px)', value: 'container' },
    { label: 'Narrow (800px)', value: 'narrow' },
  ];

  bgOptions = [
    { label: 'Default', value: 'default' },
    { label: 'Alternate', value: 'alternate' },
    { label: 'Transparent', value: 'transparent' },
  ];

  ngOnInit(): void {
    this.loadPages();
    this.loadTemplateTypes();
    this.loadGsapPageKeys();
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {}

  filterPages(): void {
    const q = this.searchQuery.toLowerCase();
    if (!q) {
      this.filteredPages.set(this.pageList());
    } else {
      this.filteredPages.set(
        this.pageList().filter(p =>
          p.title.toLowerCase().includes(q) ||
          p.pageKey.toLowerCase().includes(q)
        )
      );
    }
  }

  loadPages(): void {
    this.pageConfigService.GetAllPageConfigs().subscribe({
      next: (res) => {
        if (!res.isError && res.result) {

          const data = typeof res.result === 'string' ? JSON.parse(res.result) : res.result;
          const rawList = Array.isArray(data) ? data : [];
          const list: PageConfigListItem[] = rawList.map((p: any) => ({
            contentID: p.ContentID || 0,
            pageKey: p.PageKey || '',
            title: p.Title || '',
            metaTitle: p.MetaTitle || '',
            heroTitle: p.HeroTitle || '',
            heroSubtitle: p.HeroSubtitle || '',
            metaDescription: p.MetaDescription || '',
            status: this.computeStatus(p.mCommonEntitiesMaster),
            sectionCount: p.SectionCount ?? 0,
            mCommonEntitiesMaster: p.mCommonEntitiesMaster ? { ...p.mCommonEntitiesMaster } : undefined
          }));
          this.pageList.set(list);
          this.filteredPages.set(list);
        }
      },
      error: () => {
        this.notification.showMessage('Failed to load pages', 'Error', PopupMessageType.Error);
      }
    });
  }

  private computeStatus(m: MCommonEntitiesMaster): string {
    if (m.isActive === false) return 'Inactive';
    return 'Active';
  }

  loadTemplateTypes(): void {
    this.pageConfigService.GetTemplateTypes().subscribe({
      next: (res) => {
        if (!res.isError && res.result) {
          const data = typeof res.result === 'string' ? JSON.parse(res.result) : res.result;
          this.templateTypes.set(Array.isArray(data) ? data : []);
        }
      },
      error: () => {}
    });
  }

  loadGsapPageKeys(): void {
    
    this.gsapMasterService.GetAllConfigs().subscribe({
      next: (res) => {
        if (!res.isError && res.result) {
          const data = typeof res.result === 'string' ? JSON.parse(res.result) : res.result;
          const pages = Array.isArray(data) ? data : [];
          const activeKeys = pages
            .filter((p: any) => p.mCommonEntitiesMaster?.isActive !== false);
          this.gsapPageKeys.set(activeKeys);

        }
      },
      error: () => {}
    });
  }

  loadTemplatesForType(typeId: number): void {
    const id = Number(typeId);
    if (!id) return;
    const cache = this.templateCache();
    if (cache.has(id)) return;
    const tt = this.templateTypes().find(t => Number(t.templateTypeID) === id);
    if (!tt) return;
    this.pageConfigService.GetTemplatesByType(tt.templateTypeName).subscribe({
      next: (res) => {
        if (!res.isError && res.result) {
          const data = typeof res.result === 'string' ? JSON.parse(res.result) : res.result;
          const templates = Array.isArray(data) ? data : (data?.result || []);
          const currentCache = this.templateCache();
          const updated = new Map(currentCache);
          updated.set(id, Array.isArray(templates) ? templates : []);
          this.templateCache.set(updated);
        }
      },
      error: () => {}
    });
  }

  openNew(): void {
    this.isNew.set(true);
    this.editingPage.set(new PageConfig());
    this.expandedSection.set(null);
    this.clearAllValidation();
    this.editorOpen.set(true);
  }

  openEdit(pageKey: string): void {
    if(!pageKey) {
      this.notification.showMessage('Invalid page key', 'Error', PopupMessageType.Error);
      return;
    }
    this.isNew.set(false);
    this.pageConfigService.GetPageConfigByKey(pageKey).subscribe({
      next: (res) => {
        debugger;
        if (!res.isError && res.result) {
          const data = typeof res.result === 'string' ? JSON.parse(res.result) : res.result;
          const config = new PageConfig();
          Object.assign(config, data);
          if (data.mCommonEntitiesMaster) {
            config.mCommonEntitiesMaster = { ...data.mCommonEntitiesMaster };
          }
          config.status = this.computeStatus(data.mCommonEntitiesMaster);
          config.sections = (data.sections || []).map((s: any) => {
            const sec = new PageConfigSection();
            Object.assign(sec, s);
            sec.templateTypeID = s.templateTypeID ? Number(s.templateTypeID) : null;
            sec.order = s.sortOrder ?? s.order ?? 0;
            (sec as any).sortOrder = s.sortOrder ?? s.order ?? 0;
            return sec;
          });
          debugger;
          config.sections.sort((a, b) => ((a as any).sortOrder ?? a.order) - ((b as any).sortOrder ?? b.order));
          this.editingPage.set(config);
          this.clearAllValidation();
          this.editorOpen.set(true);
          const typeIds = new Set(config.sections.map(s => s.templateTypeID).filter(Boolean));
          typeIds.forEach(id => this.loadTemplatesForType(id!));
        }
      },
      error: () => {
        this.notification.showMessage('Failed to load page config', 'Error', PopupMessageType.Error);
      }
    });
  }

  closeEditor(): void {
    this.editorOpen.set(false);
    this.showPreview.set(false);
  }

  private generateSectionKey(section: PageConfigSection): string {
    const parts: string[] = ['section'];
    if (section.sectionID) parts.push(`id${section.sectionID}`);
    if (section.templateTypeID) parts.push(`type${section.templateTypeID}`);
    if (section.templateCode) parts.push(section.templateCode);
    if (section.title) parts.push(section.title.replace(/\s+/g, '-').toLowerCase().replace(/[^a-z0-9-]/g, ''));
    const now = new Date();
    parts.push(now.toISOString().slice(0, 10).replace(/-/g, ''));
    parts.push(now.toTimeString().slice(0, 8).replace(/:/g, ''));
    return parts.join('-');
  }

  addPresetSection(preset: SectionPreset): void {
    debugger
    const page = this.editingPage();
    const idx = page.sections.length;
    const sec = new PageConfigSection();
    sec.title = preset.label;
    sec.order = idx;
    (sec as any).sortOrder = idx;
    Object.assign(sec, preset.defaults);
    sec.sectionkey = this.generateSectionKey(sec);
    this.editingPage.set({ ...page, sections: [...page.sections, sec] });
    this.expandedSection.set(idx);
  }

  addEmptySection(): void {
    const page = this.editingPage();
    const idx = page.sections.length;
    const sec = new PageConfigSection();
    sec.title = `Section ${idx + 1}`;
    sec.order = idx;
    (sec as any).sortOrder = idx;
    sec.sectionkey = this.generateSectionKey(sec);
    this.editingPage.set({ ...page, sections: [...page.sections, sec] });
    this.expandedSection.set(idx);
  }

  toggleSection(index: number): void {
    this.expandedSection.set(this.expandedSection() === index ? null : index);
  }

  removeSection(index: number): void {
    const page = this.editingPage();
    const updated = page.sections.filter((_, i) => i !== index).map((s, i) => {
      s.order = i;
      (s as any).sortOrder = i;
      return s;
    });
    this.editingPage.set({ ...page, sections: updated });
    if (this.expandedSection() === index) {
      this.expandedSection.set(null);
    }
  }

  moveSection(index: number, direction: -1 | 1): void {
    const page = this.editingPage();
    const target = index + direction;
    if (target < 0 || target >= page.sections.length) return;
    const updated = [...page.sections];
    [updated[index], updated[target]] = [updated[target], updated[index]];
    updated.forEach((s, i) => {
      s.order = i;
      (s as any).sortOrder = i;
    });
    this.editingPage.set({ ...page, sections: updated });
    if (this.expandedSection() === index) {
      this.expandedSection.set(target);
    } else if (this.expandedSection() === target) {
      this.expandedSection.set(index);
    }
  }

  onTemplateTypeChange(section: PageConfigSection): void {
    if (section.templateTypeID) {
      section.templateCode = '';
      this.loadTemplatesForType(section.templateTypeID);
    }
  }

  getTemplateTypeName(typeId: number | null): string {
    if (!typeId) return '';
    const tt = this.templateTypes().find(t => t.templateTypeID === typeId);
    return tt?.templateTypeName || '';
  }

  // ═══ VALIDATION ═══

  validateSectionClass(index: number): void {
    const page = this.editingPage();
    const section = page.sections[index];
    const errors: Record<number, Record<string, string[]>> = { ...this.sectionErrors() };

    if (section.customClass) {
      const sanitized = CodeSanitizer.sanitizeClassName(section.customClass);
      if (sanitized !== section.customClass) {
        if (!errors[index]) errors[index] = {};
        errors[index]['customClass'] = ['Invalid characters removed. Only letters, numbers, hyphens, underscores allowed.'];
        section.customClass = sanitized;
      } else {
        if (errors[index]) delete errors[index]['customClass'];
      }
    }
    this.sectionErrors.set(errors);
  }

  validateSectionCss(index: number): void {
    const page = this.editingPage();
    const section = page.sections[index];
    const errors: Record<number, Record<string, string[]>> = { ...this.sectionErrors() };
    const warnings: Record<number, Record<string, string[]>> = { ...this.sectionWarnings() };

    if (section.customStyles) {
      const result = CodeSanitizer.validateCss(section.customStyles);
      section.customStyles = result.sanitized;

      if (result.errors.length > 0) {
        if (!errors[index]) errors[index] = {};
        errors[index]['customStyles'] = result.errors;
      } else {
        if (errors[index]) delete errors[index]['customStyles'];
      }
    } else {
      if (errors[index]) delete errors[index]['customStyles'];
    }

    this.sectionErrors.set(errors);
    this.sectionWarnings.set(warnings);
  }

  validateGlobalCss(): void {
    const result = CodeSanitizer.validateCss(this.editingPage().customStyles || '');
    this.editingPage().customStyles = result.sanitized;
    this.globalCssValidation.set(result);
  }

  validateGlobalJs(): void {
    const result = CodeSanitizer.validateJs(this.editingPage().customScripts || '');
    this.editingPage().customScripts = result.sanitized;
    this.globalJsValidation.set(result);
  }

  private clearAllValidation(): void {
    this.sectionErrors.set({});
    this.sectionWarnings.set({});
    this.validationErrors.set({});
    this.globalCssValidation.set({ valid: true, errors: [], sanitized: '' });
    this.globalJsValidation.set({ valid: true, errors: [], sanitized: '' });
  }

  private validateBeforeSave(): boolean {
    const errors: Record<string, string> = {};

    if (!this.editingPage().pageKey?.trim()) {
      errors['pageKey'] = 'Page key is required';
    } else if (!/^[a-z0-9-]+$/.test(this.editingPage().pageKey)) {
      errors['pageKey'] = 'Only lowercase letters, numbers, and hyphens allowed';
    }

    if (!this.editingPage().title?.trim()) {
      errors['title'] = 'Page title is required';
    }

    this.validationErrors.set(errors);
    return Object.keys(errors).length === 0;
  }

  savePage(): void {
    if (!this.validateBeforeSave()) {
      this.notification.showMessage('Please fix validation errors', 'Validation Error', PopupMessageType.Warning);
      return;
    }
   debugger
    const page = this.editingPage();
    const payload = {
      ...page,
      sections: page.sections.map(s => ({
        ...s,
        sortOrder: (s as any).sortOrder ?? s.order
      }))
    };
    this.saving.set(true);
    this.pageConfigService.SavePageConfig(payload).subscribe({
      next: (res) => {
        if (!res.isError) {
          this.dynamicPageService.clearCache(page.pageKey);
          this.notification.showMessage(res.strMessage, res.title, res.type);
          this.editorOpen.set(false);
          this.loadPages();
        } else {
          this.notification.showMessage(res.strMessage, res.title, res.type);
        }
        this.saving.set(false);
      },
      error: () => {
        this.saving.set(false);
        this.notification.showMessage('Failed to save page config', 'Error', PopupMessageType.Error);
      }
    });
  }

  confirmDelete(page: any): void {
    this.confirmationService.confirm({
      key: 'pageConfigDialog',
      message: `Are you sure you want to delete "<b>${page.title}</b>"? This will remove the page from the website.`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.pageConfigService.DeletePageConfig(page.pageKey).subscribe({
          next: (res) => {
            if (!res.isError) {
              this.dynamicPageService.clearCache(page.pageKey);
              this.notification.showMessage(res.strMessage, res.title, res.type);
              this.loadPages();
            } else {
              this.notification.showMessage(res.strMessage, res.title, res.type);
            }
          },
          error: () => {
            this.notification.showMessage('Failed to delete page', 'Error', PopupMessageType.Error);
          }
        });
      }
    });
  }

  duplicatePage(pageKey: string): void {
    const newKey = prompt(`Enter a new page key for the duplicate of "${pageKey}":`);
    if (newKey && newKey.trim()) {
      this.pageConfigService.DuplicatePageConfig(pageKey, newKey.trim()).subscribe({
        next: (res) => {
          if (!res.isError) {
            this.notification.showMessage('Page duplicated successfully', 'Success', PopupMessageType.Success);
            this.loadPages();
          } else {
            this.notification.showMessage(res.strMessage, res.title, res.type);
          }
        },
        error: () => {
          this.notification.showMessage('Failed to duplicate page', 'Error', PopupMessageType.Error);
        }
      });
    }
  }

  previewPage(pageKey: string): void {
    window.open(`/${pageKey}`, '_blank');
  }
}
