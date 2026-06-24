import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { MCommonEntitiesMaster } from '../../../models/MCommonEntitiesMaster';
import { environment } from '../../../../environments/environment';
import { JsonResponseModel } from '../../../models/JsonResponseModel';
import { CodeSanitizer } from '../../../shared/utilities/code-sanitizer';

export interface DynamicPageConfig {
  pageKey: string;
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogImage?: string;
  favicon?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  status: string;
  layoutTemplate?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroMediaUrl?: string;
  sections: DynamicPageSection[];
  customStyles?: string;
  customScripts?: string;
}

export interface DynamicPageSection {
  sectionID: number;
  sectionkey: string;
  title?: string;
  order: number;
  enabled: boolean;
  templateTypeID?: number | null;
  templateCode?: string;
  content?: string;
  contentHtml?: string;
  styles?: any;
  mediaUrl?: string;
  linkUrl?: string;
  linkText?: string;
  customClass?: string;
  customStyles?: string;
  customData?: Record<string, any>;
  gsapPageKey?: string;
  fallbackHtml?: string;
  sectionWidth?: 'full' | 'container' | 'narrow';
  sectionBackground?: 'default' | 'alternate' | 'transparent';
  paddingTop?: string;
  paddingBottom?: string;
  animationDelay?: number;
}

export interface PageConfigListItem {
  contentID: number;
  pageKey: string;
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  heroTitle: string;
  heroSubtitle: string;
  sectionCount: number;
  mCommonEntitiesMaster?: MCommonEntitiesMaster;
}

@Injectable({ providedIn: 'root' })
export class DynamicPageService {
  private http = inject(HttpClient);
  private baseUrl = environment.WebUrl;
  private cmsUrl = environment.CMSUrl;
  private cache = new Map<string, DynamicPageConfig>();
  private cacheTimestamps = new Map<string, number>();
  private readonly CACHE_TTL = 5 * 60 * 1000;

  getPageConfig(pageKey: string): Observable<DynamicPageConfig | null> {
    if (this.isCacheValid(pageKey)) {
      return of(this.cache.get(pageKey)!);
    }

    return this.http.get<JsonResponseModel>(`${this.baseUrl}/Web/PageConfig/${pageKey}`).pipe(
      retry(1),
      map(response => {
        if (response && !response.isError && response.result) {
          const pageData = typeof response.result === 'string' ? JSON.parse(response.result) : response.result;
          const config = this.mapPageConfig(pageData);
          const sanitized = this.sanitizeConfig(config);
          this.cache.set(pageKey, sanitized);
          this.cacheTimestamps.set(pageKey, Date.now());
          return sanitized;
        }
        return null;
      }),
      catchError(() => of(null))
    );
  }

  getAllPageConfigs(): Observable<PageConfigListItem[]> {
    return this.http.get<JsonResponseModel>(`${this.cmsUrl}/PageConfig/GetAll`).pipe(
      map(response => {
        if (response && !response.isError && response.result) {
          const data = typeof response.result === 'string' ? JSON.parse(response.result) : response.result;
          return Array.isArray(data) ? data.map((p: any) => this.mapPageListItem(p)) : [];
        }
        return [];
      }),
      catchError(() => of([]))
    );
  }

  savePageConfig(config: DynamicPageConfig): Observable<JsonResponseModel> {
    return this.http.post<JsonResponseModel>(`${this.cmsUrl}/PageConfig/Save`, config);
  }

  deletePageConfig(pageKey: string): Observable<JsonResponseModel> {
    return this.http.post<JsonResponseModel>(`${this.cmsUrl}/PageConfig/Delete?pageKey=${pageKey}`, null);
  }

  clearCache(pageKey?: string): void {
    if (pageKey) {
      this.cache.delete(pageKey);
      this.cacheTimestamps.delete(pageKey);
    } else {
      this.cache.clear();
      this.cacheTimestamps.clear();
    }
  }

  private isCacheValid(pageKey: string): boolean {
    if (!this.cache.has(pageKey)) return false;
    const timestamp = this.cacheTimestamps.get(pageKey) || 0;
    return Date.now() - timestamp < this.CACHE_TTL;
  }

  private sanitizeConfig(config: DynamicPageConfig): DynamicPageConfig {
    const sanitized = { ...config };

    if (sanitized.customStyles) {
      const result = CodeSanitizer.validateCss(sanitized.customStyles);
      sanitized.customStyles = result.sanitized;
    }

    if (sanitized.customScripts) {
      const result = CodeSanitizer.validateJs(sanitized.customScripts);
      sanitized.customScripts = result.sanitized;
    }

    if (sanitized.sections) {
      sanitized.sections = sanitized.sections.map(section => {
        const s = { ...section };
        if (s.customStyles) {
          s.customStyles = CodeSanitizer.validateCss(s.customStyles).sanitized;
        }
        if (s.customClass) {
          s.customClass = CodeSanitizer.sanitizeClassName(s.customClass);
        }
        if (s.fallbackHtml) {
          s.fallbackHtml = CodeSanitizer.sanitizeForDisplay(s.fallbackHtml);
        }
        return s;
      });
    }

    return sanitized;
  }

private mapPageConfig(data: any): DynamicPageConfig {
  const sections: DynamicPageSection[] = (data.sections || []).map(
    (s: any, idx: number) => ({
      sectionID: s.sectionID ?? idx,
      sectionkey: s.sectionkey || '',
      title: s.title || '',
      order: s.sortOrder ?? s.order ?? idx,
      enabled: s.enabled !== false,
      templateTypeID: s.templateTypeID ?? null,
      templateCode: s.templateCode || '',
      content: s.content || '',
      contentHtml: s.contentHtml || '',
      styles: s.styles || null,
      mediaUrl: s.mediaUrl || '',
      linkUrl: s.linkUrl || '',
      linkText: s.linkText || '',
      customClass: s.customClass || '',
      customStyles: s.customStyles || '',
      customData: s.customData || null,
      gsapPageKey: s.gsapPageKey || data.pageKey || '',
      fallbackHtml: s.fallbackHtml || '',
      sectionWidth: s.sectionWidth || 'full',
      sectionBackground: s.sectionBackground || 'default',
      paddingTop: s.paddingTop || '',
      paddingBottom: s.paddingBottom || '',
      animationDelay: s.animationDelay || 0,
      
    })
  );

  sections.sort((a, b) => a.order - b.order);

  return {
    pageKey: data.pageKey || '',
    title: data.title || '',
    metaTitle: data.metaTitle || '',
    metaDescription: data.metaDescription || '',
    metaKeywords: data.metaKeywords || '',
    ogImage: data.ogImage || '',
    favicon: data.favicon || '',
    canonicalUrl: data.canonicalUrl || '',
    noIndex: data.noIndex || false,
    status: 'Active',
    layoutTemplate: data.layoutTemplate || '',
    heroTitle: data.heroTitle || '',
    heroSubtitle: data.heroSubtitle || '',
    heroMediaUrl: data.heroMediaUrl || '',
    sections,
    customStyles: data.customStyles || '',
    customScripts: data.customScripts || '',
  };
}
  private mapPageListItem(data: any): PageConfigListItem {
    const m = data.mCommonEntitiesMaster;
    const isActive = m ? m.isActive !== false : true;
    const isDeleted = m ? m.isDeleted === true : false;
    let status = 'Active';
    if (isDeleted) status = 'Deleted';
    else if (!isActive) status = 'Inactive';

    return {
  contentID: data.contentID || 0,
  pageKey: data.pageKey || '',
  title: data.title || '',
  metaTitle: data.metaTitle || undefined,
  metaDescription: data.metaDescription || undefined,
  sectionCount: data.sectionCount || 0,
  heroTitle: '',
  heroSubtitle: '',
  mCommonEntitiesMaster: {
    isActive: m?.isActive || false,
    isDeleted: m?.isDeleted || false,
    createdBy: m?.createdBy || 0,
    createdDate: data.mCommonEntitiesMaster?.createdAt || undefined,
    updatedBy: m?.updatedBy || 0,
    updatedDate: data.mCommonEntitiesMaster?.updatedAt || undefined,
  }
};
  }

  getFallbackConfig(pageKey: string): DynamicPageConfig {
    const fallbacks: Record<string, DynamicPageConfig> = {
      home: {
        pageKey: 'home', title: 'Home',
        metaTitle: 'To The Source - Digital Excellence',
        metaDescription: 'We craft exceptional digital experiences that drive real results.',
        status: 'Active',
        sections: [
          {
            sectionID: 1, order: 0, enabled: true, gsapPageKey: 'landing',
            sectionkey: ''
          },
          {
            sectionID: 2, order: 1, enabled: true, gsapPageKey: 'landing',
            sectionkey: ''
          },
          {
            sectionID: 3, order: 2, enabled: true, gsapPageKey: 'landing',
            sectionkey: ''
          },
          {
            sectionID: 4, order: 3, enabled: true, gsapPageKey: 'landing',
            sectionkey: ''
          },
        ],
      },
      about: {
        pageKey: 'about', title: 'About Us',
        metaTitle: 'About Us - To The Source', metaDescription: 'Learn more about our journey and mission.',
        status: 'Active',
        sections: [
          {
            sectionID: 1, order: 0, enabled: true,
            sectionkey: ''
          },
          {
            sectionID: 2, order: 1, enabled: true,
            sectionkey: ''
          },
        ],
      },
      services: {
        pageKey: 'services', title: 'Services',
        metaTitle: 'Our Services - To The Source', metaDescription: 'Comprehensive digital solutions.',
        status: 'Active',
        sections: [
          {
            sectionID: 1, order: 0, enabled: true,
            sectionkey: ''
          },
          {
            sectionID: 2, order: 1, enabled: true,
            sectionkey: ''
          },
        ],
      },
      contact: {
        pageKey: 'contact', title: 'Contact',
        metaTitle: 'Contact Us - To The Source', metaDescription: 'Get in touch with our team.',
        status: 'Active',
        sections: [
          {
            sectionID: 1, order: 0, enabled: true,
            sectionkey: ''
          },
          {
            sectionID: 2, order: 1, enabled: true,
            sectionkey: ''
          },
        ],
      },
    };

    return fallbacks[pageKey] || {
      pageKey,
      title: pageKey.charAt(0).toUpperCase() + pageKey.slice(1),
      status: 'Active',
      sections: [],
    };
  }
}
