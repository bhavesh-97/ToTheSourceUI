import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GsapConfigLoaderService {

  private config: any = null;

  constructor(private http: HttpClient) {}

  async load(): Promise<void> {
    const data = await firstValueFrom(this.http.get('/assets/gsap/gsap-config.json'));
    console.log('GSAP Config Loaded:', data);
    this.config = data;
  }

  getConfig() {
    return this.config;
  }
}
