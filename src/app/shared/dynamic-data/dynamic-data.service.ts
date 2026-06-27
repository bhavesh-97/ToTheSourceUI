import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, map, catchError } from 'rxjs';
import { DynamicDataConfig } from './dynamic-data.model';
import { ApiDataConfigModel } from './api-data-config.model';

export function extractResult(response: any): any {
  let result = response?.result ?? response;
  if (typeof result === 'string') {
    const trimmed = result.trim();
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try { result = JSON.parse(trimmed); } catch {}
    }
  }
  return result;
}

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
          const result = extractResult(response);
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
        const result = extractResult(response);
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

  private sanitizeApiResponse(data: any): any {
    if (typeof data === 'string') {
      return data
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
    }
    if (data && typeof data === 'object') {
      const sanitized: any = Array.isArray(data) ? [] : {};
      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = this.sanitizeApiResponse(value);
      }
      return sanitized;
    }
    return data;
  }

  fetchFromApiConfig(config: ApiDataConfigModel | null | undefined): Observable<any> {
    if (!config || !config.apiUrl) {
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
      try {
        const parsed = JSON.parse(config.apiHeaders);
        for (const [key, value] of Object.entries(parsed)) {
          if (key && value) {
            headers = headers.set(key, value as string);
          }
        }
      } catch {}
    }

    let options: any = { headers, observe: 'body' as const };
    const method = (config.apiMethod || 'GET') as any;

    const processResponse = (response: any) => {
      const result = extractResult(response);
      const sanitized = this.sanitizeApiResponse(result);
      if (config.cacheSeconds > 0) {
        this.cache.set(cacheKey, { data: sanitized, timestamp: Date.now() });
      }
      return sanitized;
    };

    if (method === 'GET' || method === 'DELETE') {
      return this.http.request(method, config.apiUrl, options).pipe(
        map(processResponse),
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

    return this.http.request(method, config.apiUrl, { ...options, body }).pipe(
      map(processResponse),
      catchError(() => of(null))
    );
  }

  clearCache(): void {
    this.cache.clear();
  }
}
