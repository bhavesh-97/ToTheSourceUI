import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Encryption } from '../../../services/encryption';
import { JsonResponseModel } from '../../../models/JsonResponseModel';
import { Observable } from 'rxjs';
import { ENCRYPTION_CONTEXT } from '../../../interceptors/encryption-interceptor';
import { MCareer } from './MCareer';

@Injectable({ providedIn: 'root' })
export class CareerMasterService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private encryption = inject(Encryption);
  private baseUrl = environment.CMSUrl;

  GetAll(encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(`${this.baseUrl}/CareerMaster/GetAllCareerDetails`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  GetById(id: number, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(`${this.baseUrl}/CareerMaster/GetCareerDetails?id=${id}`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  Save(model: MCareer, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.post<JsonResponseModel>(`${this.baseUrl}/CareerMaster/SaveCareerDetails`, model,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  Delete(model: MCareer, encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.post<JsonResponseModel>(`${this.baseUrl}/CareerMaster/DeleteCareerDetails`, model,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }
}
