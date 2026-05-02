import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { JsonResponseModel } from '../models/JsonResponseModel';
import { ENCRYPTION_CONTEXT } from '../interceptors/encryption-interceptor';

export interface LookupItem {
  lookupID: number;
  code: string;
  desc: string;
  val: number;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LookupService {
  private http = inject(HttpClient);
  private baseUrl = environment.CMSUrl;

  GetAll(encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(`${this.baseUrl}/LookupMaster`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  GetByCode(code: string, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(`${this.baseUrl}/LookupMaster/code/${code}`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  Create(lookup: Partial<LookupItem>, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.post<JsonResponseModel>(`${this.baseUrl}/LookupMaster`, lookup,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  Update(id: number, lookup: Partial<LookupItem>, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.put<JsonResponseModel>(`${this.baseUrl}/LookupMaster/${id}`, lookup,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  Delete(id: number, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.delete<JsonResponseModel>(`${this.baseUrl}/LookupMaster/${id}`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  GetStatuses(): Observable<JsonResponseModel> {
    return this.GetByCode('STATUS');
  }

  GetGsapStatuses(): Observable<JsonResponseModel> {
    return this.GetByCode('GSAP_STATUS');
  }

  GetRuleTypes(): Observable<JsonResponseModel> {
    return this.GetByCode('RULE_TYPE');
  }

  GetPropertyDirections(): Observable<JsonResponseModel> {
    return this.GetByCode('PROP_DIR');
  }

  GetValueTypes(): Observable<JsonResponseModel> {
    return this.GetByCode('VAL_TYPE');
  }

  GetCallbackEvents(): Observable<JsonResponseModel> {
    return this.GetByCode('CB_EVENT');
  }

  GetGsapPlugins(): Observable<JsonResponseModel> {
    return this.GetByCode('GSAP_PLUGIN');
  }
}