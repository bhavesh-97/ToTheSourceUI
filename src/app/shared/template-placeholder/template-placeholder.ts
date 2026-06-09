import { Component, ElementRef, inject, Input, SimpleChanges } from '@angular/core';
import { Template } from '../../CMS/main/template-master/Template';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TemplateMasterService } from '../../CMS/main/template-master/template-master.service';
import { WebGsapService } from '../../Web/services/web-gsap.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-template-placeholder',
  imports: [CommonModule],
  templateUrl: './template-placeholder.html',
  styleUrl: './template-placeholder.css'
})
export class TemplatePlaceholder {
  
  private static templateCache: Map<string, SafeHtml> = new Map();
  private templateService =  inject(TemplateMasterService);
  private sanitizer =  inject(DomSanitizer);
  private webGsap = inject(WebGsapService);
  private el = inject(ElementRef);

  @Input() templateType!: string;
  @Input() templateCode?: string;
  @Input() useCache = true;
  @Input() fallbackContent = '';
  @Input() gsapPageKey = '';
  
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
  }

  private loadTemplate(): void {
    if (!this.templateType) {
      this.error = 'Template type not specified';
      this.isLoading = false;
      return;
    }

    const cacheKey = this.templateCode ? `${this.templateType}:${this.templateCode}` : this.templateType;

    // Check cache first
    if (this.useCache && TemplatePlaceholder.templateCache.has(cacheKey)) {
      this.safeContent = TemplatePlaceholder.templateCache.get(cacheKey)!;
      this.isLoading = false;
      setTimeout(() => this.applyGsap(), 50);
      return;
    }

    this.isLoading = true;
    this.error = '';
    
    this.templateService.GetTemplateByTemplateType(this.templateType)
      .subscribe({
        next: (response: any) => {
          let templateContent = '';
          if (response && response.result) {
            if (response.result.templateContent !== undefined) {
              templateContent = response.result.templateContent;
            } 
            else if (Array.isArray(response.result) && response.result.length > 0) {
              let templates = response.result as Template[];
              if (this.templateCode) {
                templates = templates.filter(t => t.templateCode === this.templateCode);
              }
              const template = templates.find((t: Template) => t.mCommonEntitiesMaster?.isActive !== false);
              templateContent = template ? template.templateContent : '';
            }
          }
          
          if (templateContent) {
            this.safeContent = this.sanitizer.bypassSecurityTrustHtml(templateContent);
            if (this.useCache) {
              TemplatePlaceholder.templateCache.set(cacheKey, this.safeContent);
            }
            setTimeout(() => this.applyGsap(), 50);
          } else {
            if (this.fallbackContent) {
              this.safeContent = this.sanitizer.bypassSecurityTrustHtml(this.fallbackContent);
            }
          }
          this.isLoading = false;
        },
        error: (err) => {
          if (this.fallbackContent) {
            this.safeContent = this.sanitizer.bypassSecurityTrustHtml(this.fallbackContent);
            this.isLoading = false;
          } else {
            this.error = `Failed to load ${this.templateType} template`;
            this.isLoading = false;
          }
          console.error(`Template load error for ${this.templateType}:`, err);
        }
      });
  }

  private applyGsap(): void {
    // console.log('[GSAP Template] applyGsap called, gsapPageKey:', this.gsapPageKey);
    if (!this.gsapPageKey) {
      // console.log('[GSAP Template] No gsapPageKey set, skipping');
      return;
    }
    const container = this.el.nativeElement.querySelector('.template-content') as HTMLElement;
    // console.log('[GSAP Template] Container found:', !!container);
    if (container) {
      this.webGsap.applyAnimations(this.gsapPageKey, container);
    }
  }
  
  static clearCache(): void {
    TemplatePlaceholder.templateCache.clear();
  }
}
