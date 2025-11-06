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
  GetSummary(encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(
      `${this.baseUrl}/Dashboard/summary`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  // RECENT POSTS
  GetRecentPosts(encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(
      `${this.baseUrl}/Dashboard/recent-posts`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  // TRAFFIC DATA
  GetTrafficData(encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(
      `${this.baseUrl}/Dashboard/traffic`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  // NOTIFICATIONS
  GetNotifications(encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(
      `${this.baseUrl}/Dashboard/notifications`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }

  // ACTIVITY FEED
  GetActivities(encryptPayload = false): Observable<JsonResponseModel> {
    return this.http.get<JsonResponseModel>(
      `${this.baseUrl}/Dashboard/activities`,
      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
    );
  }
  }

