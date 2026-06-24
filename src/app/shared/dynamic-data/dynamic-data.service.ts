import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, map, catchError } from 'rxjs';
import { DynamicDataConfig } from './dynamic-data.model';

@Injectable({ providedIn: 'root' })
export class DynamicDataService {
  private http = inject(HttpClient);
  private cache = new Map<string, { data: any; timestamp: number }>();

  fetchSectionData(config: DynamicDataConfig): Observable<any> {
    if (!config || config.sourceType !== 'api' || !config.apiUrl) {
      return of(null);
    }

    const cacheKey = `${config.apiUrl}:${config.apiMethod}`;
    if (config.cacheSeconds > 0 && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      const age = (Date.now() - cached.timestamp) / 1000;
      if (age < config.cacheSeconds) {
        return of(cached.data);
      }
    }

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (config.apiHeaders) {
      for (const [key, value] of Object.entries(config.apiHeaders)) {
        if (key && value) {
          headers = headers.set(key, value);
        }
      }
    }

    let options: any = { headers, observe: 'body' as const };

    if (config.apiMethod === 'GET' || config.apiMethod === 'DELETE') {
      return this.http.request(config.apiMethod, config.apiUrl, options).pipe(
        map((response: any) => {
          const result = response?.result ?? response;
          if (config.cacheSeconds > 0) {
            this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
          }
          return result;
        }),
        catchError(() => of(null))
      );
    }

    let body: any = null;
    if (config.apiBody) {
      try {
        body = JSON.parse(config.apiBody);
      } catch {
        body = config.apiBody;
      }
    }

    return this.http.request(config.apiMethod, config.apiUrl, { ...options, body }).pipe(
      map((response: any) => {
        const result = response?.result ?? response;
        if (config.cacheSeconds > 0) {
          this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
        }
        return result;
      }),
      catchError(() => of(null))
    );
  }

  testApiCall(config: DynamicDataConfig): Observable<{ success: boolean; data: any; error: string; duration: number }> {
    const start = Date.now();
    return this.fetchSectionData({ ...config, cacheSeconds: 0 }).pipe(
      map((data) => ({
        success: true,
        data,
        error: '',
        duration: Date.now() - start,
      })),
      catchError((err) => of({
        success: false,
        data: null,
        error: err.message || 'Request failed',
        duration: Date.now() - start,
      }))
    );
  }

  clearCache(): void {
    this.cache.clear();
  }
}
