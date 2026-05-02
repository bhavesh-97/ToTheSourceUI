export interface GsapGlobalDefaults {
  defaultsId?: number;
  pageId: number;
  duration: number;
  ease: string;
  stagger?: number;
  delay?: number;
  repeat?: number;
  yoyo?: boolean;
}

export interface GsapGlobalMeta {
  version: string;
  description: string;
}

export interface GsapGlobal {
  pageId: string;
  defaults: GsapGlobalDefaults;
  registerPlugins: string[] ;
  autoInit: boolean;
  observeDom: boolean;
  meta: GsapGlobalMeta;
  version?: number;
  status?: string;
}

export interface GsapFromTo {
  opacity?: number;
  x?: number;
  y?: number;
  scale?: number;
  rotation?: number;
  rotationY?: number;
  filter?: string;
  clipPath?: string;
  transformOrigin?: string;
  perspective?: number;
  [key: string]: any;
}

export interface GsapScrollTrigger {
  enabled: boolean;
  trigger?: string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean;
  markers?: boolean;
  toggleActions?: string;
  once?: boolean;
}

export interface GsapRuleProperty {
  id: string;
  direction: 'from' | 'to' | 'set';
  propName: string;
  propValue: string;
  valueType: 'number' | 'string' | 'boolean' | 'unit';
}

export interface GsapCallback {
  callbackId?: number;
  ruleId?: number;
  eventName?: string;
  handlerName?: string;
  handlerCode?: string;
  name?: string;
  script?: string;
}

export interface GsapMedia {
  type: 'none' | 'image' | 'video' | 'audio';
  url: string;
  id: string;
  selector: string;
}

export interface GsapPlugin {
  pluginId?: number;
  pageId: number;
  pluginName: string;
  enabled: boolean;
}

export interface GsapTimelineStep {
  stepId?: number;
  order: number;
  label?: string;
  selector?: string;
  from?: Record<string, any>;
  to?: Record<string, any>;
  duration?: number;
  ease?: string;
  delay?: number;
}

export interface GsapRule {
  ruleId?: number;
  pageId?: number;
  ruleKey?: string;
  label?: string;
  selector: string;
  from?: Record<string, any>;
  to?: Record<string, any>;
  duration?: number;
  ease?: string;
  stagger?: number | { each: number };
  delay?: number;
  repeat?: number;
  yoyo?: boolean;
  paused?: boolean;
  scrollEnabled?: boolean;
  status?: string;
  type?: string;
  sortOrder?: number;
  scrollTrigger?: GsapScrollTrigger;
  callbacks?: GsapCallback[];
  media?: GsapMedia;
  version?: number;
  styles?: Record<string, string>;
  timelineSteps?: GsapTimelineStep[];
}

export interface GsapPage {
  label?: string;
  rules: GsapRule[];
  callbacks: GsapCallback[];
}

export interface GsapConfig {
  global: GsapGlobal;
  pages?: Record<string, GsapPage>;
  rules?: GsapRule[];
  callbacks?: GsapCallback[];
}

export interface MGsapConfig {
  id?: string;
  name: string;
  version: string;
  status: string;
  description: string;
  autoInit: boolean;
  observeDom: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MGsapPage {
  pageId: number;
  configId: string;
  pageKey: string;
  label: string;
  status: string;
  sortOrder: number;
  plugins?: string[];  // Selected GSAP plugins
  createdAt?: string;
  updatedAt?: string;
}

export interface MGsapRule {
  id: string;
  pageId: string;
  ruleKey: string;
  label: string;
  selector: string;
  type: string;
  duration: number;
  ease: string;
  stagger?: number;
  delay: number;
  repeat: number;
  yoyo: boolean;
  paused: boolean;
  scrollEnabled: boolean;
  status: string;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface MGsapConfigWithPages {
  config: MGsapConfig;
  defaults: any;
  plugins: any[];
  pages: MGsapPageWithRules[];
}

export interface MGsapPageWithRules {
  page: MGsapPage;
  rules: MGsapRule[];
  timelines?: any[];
}

export interface MGsapRuleWithDetails {
  rule: MGsapRule;
  fromProperties: any[];
  toProperties: any[];
  setProperties: any[];
  scrollTrigger: any;
  callbacks: any[];
}

export interface PageConfig {
  PageId: string;
  title: string;
  pageKey: string;
  description?: string;
  gsapConfig?: GsapConfig; 
}

export type MediaType = 'image' | 'video' | 'audio' | 'none';

export type Severity =  'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast';
