import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { Template } from '../../CMS/main/template-master/Template';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TemplateMasterService } from '../../CMS/main/template-master/template-master.service';
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

  @Input() templateType!: string; // e.g., 'header', 'footer', 'home-layout'
  @Input() useCache = true; // Optional: cache template fetches
  @Input() fallbackContent = ''; // Optional: HTML fallback if template not found
  
  safeContent: SafeHtml = '';
  isLoading = true;
  error = '';
  ngOnInit(): void {
    this.loadTemplate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['templateType'] && !changes['templateType'].firstChange) {
      this.loadTemplate();
    }
  }

  private loadTemplate(): void {
    if (!this.templateType) {
      this.error = 'Template type not specified';
      this.isLoading = false;
      return;
    }

    // Check cache first
    if (this.useCache && TemplatePlaceholder.templateCache.has(this.templateType)) {
      this.safeContent = TemplatePlaceholder.templateCache.get(this.templateType)!;
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.error = '';
    
    this.templateService.GetTemplateByTemplateType(this.templateType)
      .subscribe({
        next: (response: any) => {
          debugger;
          let templateContent = '';
          if (response && response.result) {
            if (response.result.templateContent !== undefined) {
              templateContent = response.result.templateContent;
            } 
            else if (Array.isArray(response.result) && response.result.length > 0) {
              const template = response.result.find((t: Template) => t.mCommonEntitiesMaster?.isActive !== false);
              templateContent = template ? template.templateContent : '';
            }
          }
          
          if (templateContent) {
            this.safeContent = this.sanitizer.bypassSecurityTrustHtml(templateContent);
            if (this.useCache) {
              TemplatePlaceholder.templateCache.set(this.templateType, this.safeContent);
            }
          } else {
            // Use fallback content if provided
            if (this.fallbackContent) {
              this.safeContent = this.sanitizer.bypassSecurityTrustHtml(this.fallbackContent);
            } else {
              // this.error = `No active template found for type: ${this.templateType}`;
            }
          }
          this.isLoading = false;
        },
        error: (err) => {
          // Use fallback content on error if provided
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
  
  static clearCache(): void {
    TemplatePlaceholder.templateCache.clear();
  }
}
