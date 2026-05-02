import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { JsonResponseModel } from '../../models/JsonResponseModel';

export interface PageContent {
  id: string;
  pageKey: string;
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroMediaUrl?: string;
  status: string;
  sections: PageSection[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PageSection {
  id: string;
  sectionKey: string;
  title?: string;
  content: string;
  contentHtml?: string;
  order: number;
  mediaUrl?: string;
  linkUrl?: string;
  linkText?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PageDataService {
  private http = inject(HttpClient);
  private baseUrl = environment.WebUrl;

  getPageContent(pageKey: string): Observable<PageContent | null> {
    return this.http.get<JsonResponseModel>(`${this.baseUrl}/PageContent/${pageKey}`).pipe(
      map(response => {
        if (response && response.result) {
          return this.mapPageContent(response.result);
        }
        return this.getDefaultContent(pageKey);
      }),
      catchError(() => of(this.getDefaultContent(pageKey)))
    );
  }

  private mapPageContent(data: any): PageContent {
    const sections = (data.sections || []).map((s: any) => ({
      id: s.id,
      sectionKey: s.sectionKey,
      title: s.title,
      content: s.content,
      contentHtml: s.contentHtml,
      order: s.sort_order || s.order,
      mediaUrl: s.media_url || s.mediaUrl,
      linkUrl: s.link_url || s.linkUrl,
      linkText: s.link_text || s.linkText
    }));

    return {
      id: data.id,
      pageKey: data.page_key,
      title: data.title,
      metaTitle: data.meta_title,
      metaDescription: data.meta_description,
      heroTitle: data.hero_title,
      heroSubtitle: data.hero_subtitle,
      heroMediaUrl: data.hero_media_url,
      status: data.status,
      sections
    };
  }

  private getDefaultContent(pageKey: string): PageContent {
    const defaults: Record<string, PageContent> = {
      home: { id: '1', pageKey: 'home', title: 'Home', heroTitle: 'To The Source', heroSubtitle: 'We build exceptional digital experiences', status: 'Active', sections: [] },
      about: { id: '2', pageKey: 'about', title: 'About Us', heroTitle: 'About Us', heroSubtitle: 'Learn more about our journey', status: 'Active', sections: [] },
      services: { id: '3', pageKey: 'services', title: 'Services', heroTitle: 'Our Services', heroSubtitle: 'Comprehensive solutions', status: 'Active', sections: [] },
      contact: { id: '4', pageKey: 'contact', title: 'Contact', heroTitle: 'Contact Us', heroSubtitle: 'Get in touch', status: 'Active', sections: [] },
      blog: { id: '5', pageKey: 'blog', title: 'Blog', heroTitle: 'Blog', heroSubtitle: 'Latest insights', status: 'Active', sections: [] },
      portfolio: { id: '6', pageKey: 'portfolio', title: 'Portfolio', heroTitle: 'Our Work', heroSubtitle: 'Showcase', status: 'Active', sections: [] },
      faq: { id: '7', pageKey: 'faq', title: 'FAQ', heroTitle: 'FAQ', heroSubtitle: 'Common questions', status: 'Active', sections: [] },
      stats: { id: '8', pageKey: 'stats', title: 'Statistics', heroTitle: 'Our Statistics', heroSubtitle: 'Numbers that define us', status: 'Active', sections: [] }
    };
    return defaults[pageKey] || defaults['home'];
  }

  getPageSections(pageKey: string): Observable<PageSection[]> {
    return this.getPageContent(pageKey).pipe(
      map(page => page?.sections || [])
    );
  }

  getAboutContent(): Observable<PageContent | null> {
    return this.getPageContent('about');
  }

  getServicesContent(): Observable<PageContent | null> {
    return this.getPageContent('services');
  }

  getContactContent(): Observable<PageContent | null> {
    return this.getPageContent('contact');
  }
}