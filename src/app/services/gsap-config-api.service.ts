import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Encryption } from './encryption';
import { JsonResponseModel } from '../models/JsonResponseModel';
import { Observable } from 'rxjs';
import { ENCRYPTION_CONTEXT } from '../interceptors/encryption-interceptor';

export interface GsapGlobalDefaults {
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
  defaults: GsapGlobalDefaults;
  registerPlugins: string[];
  autoInit: boolean;
  observeDom: boolean;
  meta: GsapGlobalMeta;
  version: number;
  status: string;
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
  eventName: string;
  handlerName: string;
  handlerCode?: string;
}

export interface GsapRule {
  id: string;
  label?: string;
  selector: string;
  from?: GsapFromTo;
  to?: GsapFromTo;
  duration?: number;
  ease?: string;
  stagger?: number;
  delay?: number;
  repeat?: number;
  yoyo?: boolean;
  paused?: boolean;
  scrollEnabled: boolean;
  status: string;
  type: string;
  scrollTrigger?: GsapScrollTrigger;
  callbacks?: GsapCallback[];
  media?: any;
}

export interface GsapPage {
  label?: string;
  rules: GsapRule[];
  callbacks: any[];
}

export interface GsapConfig {
  global: GsapGlobal;
  pages: Record<string, GsapPage>;
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
  id: string;
  configId: string;
  pageKey: string;
  label: string;
  status: string;
  sortOrder: number;
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

@Injectable({
  providedIn: 'root'
})
export class GsapConfigApiService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private encryption = inject(Encryption);
  private baseUrl = environment.CMSUrl;

  GetConfigById(configId: string, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(`${this.baseUrl}/GsapConfig/${configId}`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  GetConfigByName(name: string, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(`${this.baseUrl}/GsapConfig/name/${name}`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  GetPagesWithRules(configId: string, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(`${this.baseUrl}/GsapConfig/pages/${configId}`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  GetPageWithRules(pageId: string, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(`${this.baseUrl}/GsapConfig/page/${pageId}`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  GetRuleWithDetails(ruleId: string, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(`${this.baseUrl}/GsapConfig/rule/${ruleId}`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  CreateConfig(config: MGsapConfig, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.post<JsonResponseModel>(`${this.baseUrl}/GsapConfig`, config,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  UpdateConfig(config: MGsapConfig, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.put<JsonResponseModel>(`${this.baseUrl}/GsapConfig`, config,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  CreatePage(page: MGsapPage, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.post<JsonResponseModel>(`${this.baseUrl}/GsapConfig/page`, page,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  UpdatePage(page: MGsapPage, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.put<JsonResponseModel>(`${this.baseUrl}/GsapConfig/page`, page,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  DeletePage(pageId: string, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.delete<JsonResponseModel>(`${this.baseUrl}/GsapConfig/page/${pageId}`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  CreateRule(rule: MGsapRule, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.post<JsonResponseModel>(`${this.baseUrl}/GsapConfig/rule`, rule,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  UpdateRule(rule: MGsapRule, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.put<JsonResponseModel>(`${this.baseUrl}/GsapConfig/rule`, rule,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  DeleteRule(ruleId: string, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.delete<JsonResponseModel>(`${this.baseUrl}/GsapConfig/rule/${ruleId}`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }
}