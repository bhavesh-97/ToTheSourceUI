import { Component, ElementRef, inject, Input, SimpleChanges } from '@angular/core';
import { Template } from '../../CMS/main/template-master/Template';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TemplateMasterService } from '../../CMS/main/template-master/template-master.service';
import { WebGsapService } from '../../Web/services/web-gsap.service';
import { CommonModule } from '@angular/common';
import { DynamicDataResolver } from '../dynamic-data/dynamic-data-resolver';
import { fieldsToRecord } from '../dynamic-data/section-data-field.model';
import { DynamicDataConfig } from '../dynamic-data/dynamic-data.model';
import { DynamicDataService } from '../dynamic-data/dynamic-data.service';
import { switchMap, of } from 'rxjs';

@Component({
  selector: 'app-template-placeholder',
  imports: [CommonModule],
  templateUrl: './template-placeholder.html',
  styleUrl: './template-placeholder.css'
})
export class TemplatePlaceholder {
  
  private static templateCache: Map<string, SafeHtml> = new Map();
  private templateService = inject(TemplateMasterService);
  private dynamicDataService = inject(DynamicDataService);
  private sanitizer = inject(DomSanitizer);
  private webGsap = inject(WebGsapService);
  private el = inject(ElementRef);

  @Input() templateType!: string;
  @Input() templateCode?: string;
  @Input() useCache = true;
  @Input() fallbackContent?: string;
  @Input() gsapPageKey = '';
  @Input() sectionData: Record<string, any> | null = null;
  @Input() dynamicDataConfig?: DynamicDataConfig;
  
  safeContent: SafeHtml = '';
  isLoading = true;
  error = '';

  ngOnInit(): void {
    this.loadTemplate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['templateType'] || changes['templateCode']) && !changes['templateType']?.firstChange) {
      this.loadTemplate();
    }
    if (changes['sectionData'] && !changes['sectionData']?.firstChange) {
      this.resolveAndRender();
    }
  }

  private loadTemplate(): void {
    if (!this.templateType) {
      this.error = 'Template type not specified';
      this.isLoading = false;
      return;
    }

    const cacheKey = this.templateCode ? `${this.templateType}:${this.templateCode}` : this.templateType;

    this.isLoading = true;
    this.error = '';

    this.templateService.GetTemplateByTemplateType(this.templateType).pipe(
      switchMap((response: any) => {
        let templateContent = '';
        let templateConfig: DynamicDataConfig | undefined;

        if (response && response.result) {
          if (response.result.templateContent !== undefined) {
            templateContent = response.result.templateContent;
            templateConfig = response.result.dynamicDataConfig;
          } else if (Array.isArray(response.result) && response.result.length > 0) {
            let templates = response.result as Template[];
            if (this.templateCode) {
              templates = templates.filter(t => t.templateCode === this.templateCode);
            }
            const template = templates.find((t: Template) => t.mCommonEntitiesMaster?.isActive !== false);
            if (template) {
              templateContent = template.templateContent;
              templateConfig = template.dynamicDataConfig;
            }
          }
        }

        if (!templateContent) {
          return of({ rawHtml: this.fallbackContent || '', config: undefined });
        }

        // Convert SQL field format (FieldKey/FieldType/FieldValue) to SectionDataField (key/type/value)
        function toSectionField(f: any): any {
          return {
            key: f.key ?? f.FieldKey ?? f.fieldKey ?? '',
            type: f.type ?? f.FieldType ?? f.fieldType ?? 'text',
            value: f.value ?? f.FieldValue ?? f.fieldValue ?? '',
            label: f.label ?? f.FieldLabel ?? f.fieldLabel ?? '',
          };
        }

        // Extract manual fields and API config from template or response
        let manualFields: any[] | null = null;
        let apiConfig: any = null;
        const src = Array.isArray(response?.result) ? response.result.find((t: any) => t.mCommonEntitiesMaster?.isActive !== false) : response?.result;
        if (src) {
          const rawFields = src.manualDataFields ?? src.ManualDataFields ?? null;
          manualFields = rawFields ? rawFields.map(toSectionField) : null;
          apiConfig = src.apiDataConfig ?? src.ApiDataConfig ?? null;
        }

        // If new model data exists, use it directly
        if (apiConfig?.apiUrl || manualFields?.length) {
          if (apiConfig?.apiUrl) {
            return this.dynamicDataService.fetchFromApiConfig(apiConfig).pipe(
              switchMap((apiData) => {
                let mergedData: Record<string, any> = {};
                if (manualFields?.length) {
                  mergedData = fieldsToRecord(manualFields);
                }
                if (apiData && typeof apiData === 'object') {
                  mergedData = { ...mergedData, ...apiData };
                }
                return of({ rawHtml: templateContent, data: mergedData });
              })
            );
          }
          let mergedData: Record<string, any> = {};
          if (manualFields?.length) {
            mergedData = fieldsToRecord(manualFields);
          }
          return of({ rawHtml: templateContent, data: mergedData });
        }

        // Fall back to old DynamicDataConfig model
        const config = this.dynamicDataConfig || templateConfig;
        if (config) {
          if (config.sourceType === 'api' && config.apiUrl) {
            return this.dynamicDataService.fetchSectionData(config).pipe(
              switchMap((data) => {
                let mergedData: Record<string, any> = {};
                if (data && typeof data === 'object') {
                  mergedData = { ...mergedData, ...data };
                }
                return of({ rawHtml: templateContent, data: mergedData });
              })
            );
          }
          if (config.data?.length) {
            return of({ rawHtml: templateContent, data: fieldsToRecord(config.data) });
          }
        }

        return of({ rawHtml: templateContent, data: null });
      })
    ).subscribe({
      next: (res: { rawHtml: string; data?: Record<string, any> | null }) => {
        const rawHtml = res.rawHtml;
        const data = res.data;
        if (rawHtml) {
          let resolvedHtml = rawHtml;
          const mergeData = { ...this.sectionData, ...data };
          if (mergeData && Object.keys(mergeData).length > 0) {
            resolvedHtml = DynamicDataResolver.resolve(rawHtml, mergeData);
          }
          this.safeContent = this.sanitizer.bypassSecurityTrustHtml(resolvedHtml);
          if (this.useCache) {
            TemplatePlaceholder.templateCache.set(cacheKey, this.safeContent);
          }
          setTimeout(() => this.applyGsap(), 50);
        } else {
          this.safeContent = this.sanitizer.bypassSecurityTrustHtml(this.fallbackContent || '');
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.safeContent = this.sanitizer.bypassSecurityTrustHtml(this.fallbackContent || '');
        this.isLoading = false;
        console.error(`Template load error for ${this.templateType}:`, err);
      }
    });
  }

  private resolveAndRender(): void {
    const cacheKey = this.templateCode ? `${this.templateType}:${this.templateCode}` : this.templateType;
    if (this.sectionData && TemplatePlaceholder.templateCache.has(cacheKey)) {
      const rawHtml = this.sectionData;
      if (rawHtml && Object.keys(rawHtml).length > 0) {
        const cached = TemplatePlaceholder.templateCache.get(cacheKey)!;
      }
    }
  }

  private applyGsap(): void {
    if (!this.gsapPageKey) return;
    const container = this.el.nativeElement.querySelector('.template-content') as HTMLElement;
    if (container) {
      this.webGsap.applyAnimations(this.gsapPageKey, container);
    }
  }
  
  static clearCache(): void {
    TemplatePlaceholder.templateCache.clear();
  }
}
