import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Encryption } from '../../../services/encryption';
import { JsonResponseModel } from '../../../models/JsonResponseModel';
import { Observable } from 'rxjs';
import { ENCRYPTION_CONTEXT } from '../../../interceptors/encryption-interceptor';
import { RoleMaster } from './MRoleMaster';
@Injectable({
  providedIn: 'root'
})
export class RolemasterService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private encryption = inject(Encryption);
    private baseUrl = environment.CMSUrl;
    
    GetAllRoleDetails(encryptPayload = false): Observable<JsonResponseModel> {
        return this.http.post<JsonResponseModel>(`${this.baseUrl}/RoleMaster/GetAllRoleDetails`,
                                                      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
            );
      }
}
