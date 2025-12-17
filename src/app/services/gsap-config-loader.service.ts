// src/app/services/gsap-config-loader.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GsapConfigLoaderService {
  private config: any = null;
  private loaded = false;

  constructor(private http: HttpClient) {}

  async load(): Promise<void> {
    if (this.loaded) return;

    try {
      const data = await firstValueFrom(
        this.http.get('/assets/gsap/gsap-config.json')
      );
      this.config = data;
      this.loaded = true;
      // console.log('GSAP Config Loaded Successfully', data);
    } catch (err) {
      console.error('Failed to load GSAP config:', err);
    }
  }

  getConfig() {
    return this.config;
  }

  isLoaded() {
    return this.loaded;
  }
}