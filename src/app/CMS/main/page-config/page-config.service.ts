import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ENCRYPTION_CONTEXT } from '../../../interceptors/encryption-interceptor';
import { JsonResponseModel } from '../../../models/JsonResponseModel';
import { DynamicPageConfig } from '../../../Web/services/dynamic-page.service';
import { CurrentUser } from '../../../services/CurrentUser';
import { TemplateListItem } from './PageConfig';

@Injectable({ providedIn: 'root' })
export class PageConfigService {
  private http = inject(HttpClient);
  private baseUrl = environment.CMSUrl;

  GetAllPageConfigs(encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(
      `${this.baseUrl}/PageConfig/GetAll`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  GetPageConfigByKey(pageKey: string, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(
      `${this.baseUrl}/PageConfig/GetByKey/${pageKey}`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  SavePageConfig(config: DynamicPageConfig, encryptPayload = false): Observable<JsonResponseModel> {
    const userId = CurrentUser.userId;
    const payload = {
      ...config,
      createdBy: userId,
      updatedBy: userId
    };
    return this.http.post<JsonResponseModel>(
      `${this.baseUrl}/PageConfig/Save`,
      payload,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  DeletePageConfig(pageKey: string, encryptPayload = false): Observable<JsonResponseModel> {
    const userId = CurrentUser.userId;
    return this.http.post<JsonResponseModel>(
      `${this.baseUrl}/PageConfig/Delete?pageKey=${pageKey}&deletedBy=${userId}`,
      null,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  GetTemplateTypes(encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(
      `${this.baseUrl}/TemplateTypeMaster/GetTemplateTypes`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  GetTemplatesByType(templateTypeCode: string, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(
      `${this.baseUrl}/TemplateMaster/GetTemplateByTemplateType/${templateTypeCode}`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  GetAllTemplates(encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(
      `${this.baseUrl}/TemplateMaster/GetAllTemplateDetails`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  DuplicatePageConfig(sourcePageKey: string, newPageKey: string, encryptPayload = false): Observable<JsonResponseModel> {
    const userId = CurrentUser.userId;
    return this.http.post<JsonResponseModel>(
      `${this.baseUrl}/PageConfig/Duplicate?sourceKey=${sourcePageKey}&newKey=${newPageKey}&userId=${userId}`,
      null,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }
}
