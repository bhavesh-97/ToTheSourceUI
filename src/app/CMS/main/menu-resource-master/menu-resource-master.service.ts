import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ENCRYPTION_CONTEXT } from '../../../interceptors/encryption-interceptor';
import { JsonResponseModel } from '../../../models/JsonResponseModel';
import { Encryption } from '../../../services/encryption';
import { MMenuResourceMaster } from './MenuResourceMaster';

@Injectable({
  providedIn: 'root'
})
export class MenuResourceMasterService {
    private http = inject(HttpClient);
    private baseUrl = environment.CMSUrl;
    
    GetAllMenuResourceDetails(encryptPayload = false): Observable<JsonResponseModel> {
        return this.http.get<JsonResponseModel>(`${this.baseUrl}/MenuResourceMaster/GetAllMenuResourceDetails`,
                                                      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
            );
      }
            
    GetMenuResourceDetails(encryptPayload = false): Observable<JsonResponseModel> {
        return this.http.get<JsonResponseModel>(`${this.baseUrl}/MenuResourceMaster/GetMenuResourceDetails`,
                                                      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
            );
      }
      
    SaveMenuResource(Model: MMenuResourceMaster, encryptPayload = false): Observable<JsonResponseModel> {
        return this.http.post<JsonResponseModel>(`${this.baseUrl}/MenuResourceMaster/SaveMenuResourceDetails`,Model,                    
                                                          { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
        );
      }
    DeleteMenuResource(Model: MMenuResourceMaster, encryptPayload = false): Observable<JsonResponseModel> {
        return this.http.post<JsonResponseModel>(`${this.baseUrl}/MenuResourceMaster/DeleteMenuResourceDetails`,Model,                    
                                                          { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
        );
      }
}
