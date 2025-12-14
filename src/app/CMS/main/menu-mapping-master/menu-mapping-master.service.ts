import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ENCRYPTION_CONTEXT } from '../../../interceptors/encryption-interceptor';
import { JsonResponseModel } from '../../../models/JsonResponseModel';
import { MMenuMappingMaster } from './MenuMappingMaster';

@Injectable({
  providedIn: 'root'
})
export class MenuMappingMasterService {
  
    private http = inject(HttpClient);
    private baseUrl = environment.CMSUrl;
    
    GetAllMenuMappingDetails(encryptPayload = false): Observable<JsonResponseModel> {
        return this.http.get<JsonResponseModel>(`${this.baseUrl}/MenuMappingMaster/GetAllMenuMappingDetails`,
                                                      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
            );
      }
    SaveMenuMapping(Model: MMenuMappingMaster, encryptPayload = false): Observable<JsonResponseModel> {
        return this.http.post<JsonResponseModel>(`${this.baseUrl}/MenuMappingMaster/SaveMenuMappingDetails`,Model,                    
                                                          { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
        );
      }
    DeleteMenuMapping(Model: MMenuMappingMaster, encryptPayload = false): Observable<JsonResponseModel> {
        return this.http.post<JsonResponseModel>(`${this.baseUrl}/MenuMappingMaster/DeleteMenuMappingDetails`,Model,                    
                                                          { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
        );
      }
}
