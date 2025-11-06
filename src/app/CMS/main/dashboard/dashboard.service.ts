import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { JsonResponseModel } from '../../../models/JsonResponseModel';
import { ENCRYPTION_CONTEXT } from '../../../interceptors/encryption-interceptor';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private baseUrl = environment.CMSUrl;

    // --- Metrics ---
  GetDashboardMetrics(encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(
      `${this.baseUrl}/Dashboard/metrics`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  // --- Line Chart Data ---
  GetLineChartData(encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(
      `${this.baseUrl}/Dashboard/line-data`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  // --- Pie Chart Data ---
  GetPieChartData(encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(
      `${this.baseUrl}/Dashboard/pie-data`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }
  }

