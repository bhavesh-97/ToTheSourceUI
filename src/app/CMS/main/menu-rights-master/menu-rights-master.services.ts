import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ENCRYPTION_CONTEXT } from '../../../interceptors/encryption-interceptor';
import { JsonResponseModel } from '../../../models/JsonResponseModel';
import { SaveMenuRightsRequest } from './MMenuRightsMaster';

@Injectable({
  providedIn: 'root'
})
export class MenuRightsMasterService {
  
  private http = inject(HttpClient);
  private baseUrl = environment.CMSUrl;

  // Get menu rights by RoleID and AdminID
  GetMenuRights(roleId: number = 0, adminId: number = 0, encryptPayload = false): Observable<JsonResponseModel> {
    const params = {
      roleId: roleId.toString(),
      adminId: adminId.toString()
    };
    
    return this.http.get<JsonResponseModel>(
      `${this.baseUrl}/MenuRightsMaster/GetMenuRights`,
      {
        params: params,
        context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload)
      }
    );
  }

  // Get all menu mappings
  GetAllMenuMappings(encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(
      `${this.baseUrl}/MenuRightsMaster/GetAllMenuRightsDetails`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  // Save menu rights
  SaveMenuRights(model: SaveMenuRightsRequest, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.post<JsonResponseModel>(
      `${this.baseUrl}/MenuRightsMaster/SaveMenuRights`,
      model,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }
}