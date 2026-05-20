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
  scrub?: boolean | number | string;
  pin?: boolean;
  markers?: boolean;
  toggleActions?: string;
  once?: boolean;
  endPos?: string;
  triggerSelector?: string;
  pinSelector?: string;
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

export type GsapPluginName = 'ScrollTrigger' | 'Draggable' | 'ScrollToPlugin' | 'TextPlugin' | 'CustomEase' | 'Flip' | string;

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
  from?: CssStyleValue;
  to?: CssStyleValue;
  duration?: number;
  ease?: string;
  delay?: number;
}

export type CssStyleValue = Record<string, any> | string;

export interface GsapRule {
  ruleId?: number;
  pageId?: number;
  ruleKey?: string;
  label?: string;
  selector: string;
  from?: CssStyleValue;
  to?: CssStyleValue;
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
  styles?: CssStyleValue;
  timelineSteps?: GsapTimelineStep[];
}

export interface GsapPage {
  label?: string;
  rules: GsapRule[];
  callbacks: GsapCallback[];
}

export interface GsapConfig {
  global: GsapGlobal;
  plugins: GsapPlugin[];
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

export class SaveGsapConfigRequest {
  pageId: string = '';
  pageKey: string = '';
  label: string = '';
  globalDefaults: SaveGsapGlobalDefaults = new SaveGsapGlobalDefaults();
  plugins: SaveGsapPlugin[] = [];
  rules: SaveGsapRule[] = [];
  callbacks: SaveGsapCallback[] = [];
}

export class SaveGsapGlobalDefaults {
  defaultsId: number = 0;
  pageId: string = '';
  duration: number = 1;
  ease: string = 'power2.out';
  stagger: number = 0.1;
  delay: number = 0;
  repeat: number = 0;
  yoyo: boolean = false;
}

export class SaveGsapPlugin {
  pluginId: number = 0;
  pageId: string = '';
  pluginName: string = '';
  enabled: boolean = true;
}

export class SaveGsapRule {
  ruleId: number = 0;
  pageId: string = '';
  ruleKey: string = '';
  label: string = '';
  selector: string = '';
  type: string = '';
  status: string = '';
  from: any = {};
  to: any = {};
  styles: any = {};
}

export class SaveGsapRuleProperty {
  propertyId: number = 0;
  ruleId: number = 0;
  direction: string = 'to';
  propName: string = '';
  propValue: string = '';
  valueType: string = 'number';
  sortOrder: number = 0;
}

export class SaveGsapCallback {
  callbackId: number = 0;
  ruleId: number = 0;
  eventName: string = '';
  handlerName: string = '';
  handlerCode: string = '';
  name: string = '';
  script: string = '';
}