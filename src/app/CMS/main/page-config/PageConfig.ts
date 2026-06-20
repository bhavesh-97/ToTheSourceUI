import { DynamicPageConfig, DynamicPageSection } from '../../../Web/services/dynamic-page.service';
import { MCommonEntitiesMaster } from '../../../models/MCommonEntitiesMaster';

export class PageConfig implements DynamicPageConfig {
  id: number = 0;
  pageKey: string = '';
  title: string = '';
  metaTitle: string = '';
  metaDescription: string = '';
  metaKeywords: string = '';
  ogImage: string = '';
  status: string = 'Active';
  layoutTemplate: string = '';
  sections: PageConfigSection[] = [];
  customStyles: string = '';
  customScripts: string = '';
  favicon: string = '';
  canonicalUrl: string = '';
  noIndex: boolean = false;
  heroTitle: string = '';
  heroSubtitle: string = '';
  heroMediaUrl: string = '';
  mCommonEntitiesMaster: MCommonEntitiesMaster = new MCommonEntitiesMaster();
}

export class PageConfigSection implements DynamicPageSection {
  sectionID: number = 0;
  sectionkey: string = '';
  title: string = '';
  templateTypeID: number | null = null;
  templateCode: string = '';
  order: number = 0;
  enabled: boolean = true;
  content: string = '';
  contentHtml: string = '';
  styles: any = {};
  mediaUrl: string = '';
  linkUrl: string = '';
  linkText: string = '';
  customClass: string = '';
  customStyles: string = '';
  customData: Record<string, any> = {};
  gsapPageKey: string = '';
  fallbackHtml: string = '';
  sectionWidth: 'full' | 'container' | 'narrow' = 'full';
  sectionBackground: 'default' | 'alternate' | 'transparent' = 'default';
  paddingTop: string = '';
  paddingBottom: string = '';
  animationDelay: number = 0;
}

export interface TemplateTypeOption {
  templateTypeID: number;
  templateTypeName: string;
  templateTypeCode: string;
}

export interface TemplateListItem {
  templateID: number;
  templateName: string;
  templateCode: string;
  templateContent: string;
  templateTypeName: string;
}

export interface SectionPreset {
  id: string;
  label: string;
  icon: string;
  description: string;
  defaults: Partial<PageConfigSection>;
}

export const SECTION_PRESETS: SectionPreset[] = [
  {
    id: 'hero-banner',
    label: 'Hero Banner',
    icon: 'pi pi-star-fill',
    description: 'Full-width hero section with title, subtitle, and CTA buttons',
    defaults: {
      sectionWidth: 'full',
      sectionBackground: 'default',
      customClass: 'hero-section',
    }
  },
  {
    id: 'content-text',
    label: 'Content / Text',
    icon: 'pi pi-align-left',
    description: 'Rich text content section with WYSIWYG editor',
    defaults: {
      sectionWidth: 'container',
      customClass: 'content-section',
    }
  },
  {
    id: 'services-grid',
    label: 'Services Grid',
    icon: 'pi pi-th-large',
    description: 'Grid layout for displaying service cards',
    defaults: {
      sectionWidth: 'container',
      sectionBackground: 'alternate',
      customClass: 'services-section',
    }
  },
  {
    id: 'stats-counter',
    label: 'Statistics / Counters',
    icon: 'pi pi-chart-bar',
    description: 'Animated number counters with labels',
    defaults: {
      sectionWidth: 'container',
      customClass: 'stats-section',
    }
  },
  {
    id: 'testimonials',
    label: 'Testimonials',
    icon: 'pi pi-comments',
    description: 'Customer testimonials carousel or grid',
    defaults: {
      sectionWidth: 'container',
      sectionBackground: 'alternate',
      customClass: 'testimonials-section',
    }
  },
  {
    id: 'gallery',
    label: 'Gallery / Portfolio',
    icon: 'pi pi-images',
    description: 'Image gallery or portfolio grid with lightbox',
    defaults: {
      sectionWidth: 'container',
      customClass: 'gallery-section',
    }
  },
  {
    id: 'cta-banner',
    label: 'Call to Action',
    icon: 'pi pi-arrow-right',
    description: 'Promotional banner with action button',
    defaults: {
      sectionWidth: 'full',
      customClass: 'cta-section',
    }
  },
  {
    id: 'team-grid',
    label: 'Team Members',
    icon: 'pi pi-users',
    description: 'Team member cards with photos and roles',
    defaults: {
      sectionWidth: 'container',
      sectionBackground: 'alternate',
      customClass: 'team-section',
    }
  },
  {
    id: 'faq-accordion',
    label: 'FAQ Accordion',
    icon: 'pi pi-question-circle',
    description: 'Expandable FAQ sections',
    defaults: {
      sectionWidth: 'container',
      customClass: 'faq-section',
    }
  },
  {
    id: 'contact-form',
    label: 'Contact Form',
    icon: 'pi pi-envelope',
    description: 'Contact form with fields and submit button',
    defaults: {
      sectionWidth: 'container',
      customClass: 'contact-section',
    }
  },
  {
    id: 'custom-html',
    label: 'Custom HTML',
    icon: 'pi pi-code',
    description: 'Fully custom HTML content with editor',
    defaults: {
      sectionWidth: 'full',
      customClass: 'custom-section',
    }
  },
];
