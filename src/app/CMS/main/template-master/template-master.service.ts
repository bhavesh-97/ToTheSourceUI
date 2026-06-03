import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ENCRYPTION_CONTEXT } from '../../../interceptors/encryption-interceptor';
import { JsonResponseModel } from '../../../models/JsonResponseModel';
import { Encryption } from '../../../services/encryption';
import { MRoleMaster } from '../rolemaster/MRoleMaster';
import { Template } from './Template';
import { CurrentUser } from '../../../services/CurrentUser';

@Injectable({
  providedIn: 'root'
})
export class TemplateMasterService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private encryption = inject(Encryption);
    private baseUrl = environment.CMSUrl;
    
    GetAllTemplateDetails(encryptPayload = false): Observable<JsonResponseModel> {
        return this.http.get<JsonResponseModel>(`${this.baseUrl}/TemplateMaster/GetAllTemplateDetails`,
                                                      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
            );
      } 
    GetTemplateDetails(encryptPayload = false): Observable<JsonResponseModel> {
        return this.http.get<JsonResponseModel>(`${this.baseUrl}/TemplateMaster/GetTemplateDetails`,
                                                      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
            );
      }
    GetTemplateById(templateId: number, encryptPayload = false): Observable<JsonResponseModel> {
        return this.http.get<JsonResponseModel>(`${this.baseUrl}/TemplateMaster/GetTemplateById/${templateId}`,
                                                      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
            );
      }
     SaveTemplate(roleModel: Template, encryptPayload = false): Observable<JsonResponseModel> {
      const userId = CurrentUser.userId;
      roleModel.mCommonEntitiesMaster!.createdBy = userId;
      roleModel.mCommonEntitiesMaster!.updatedBy = userId;
        return this.http.post<JsonResponseModel>(`${this.baseUrl}/TemplateMaster/SaveTemplateDetails`,roleModel,                    
                                                          { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
        );
      }
      DeleteTemplate(templateId: number, encryptPayload = false): Observable<JsonResponseModel> {
            const userId = CurrentUser.userId;
    
            return this.http.post<JsonResponseModel>(
                `${this.baseUrl}/TemplateMaster/DeleteTemplate?TemplateID=${templateId}&DeletedBy=${userId}`,
                null,
                {
                    context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload)
                }
            );
        }
      GetTemplateTypes(encryptPayload = false): Observable<JsonResponseModel> {
           return this.http.get<JsonResponseModel>(`${this.baseUrl}/TemplateTypeMaster/GetTemplateTypes`,
                                                       { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) });
       }
      GetTemplateByTemplateType(templateTypeCode: string, encryptPayload = false): Observable<JsonResponseModel> {
        return this.http.get<JsonResponseModel>(
            `${this.baseUrl}/TemplateMaster/GetTemplateByTemplateType/${templateTypeCode}`,
            { 
                context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload)
            }
        );
    }
}
