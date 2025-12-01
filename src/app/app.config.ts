import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import { encryptionInterceptor } from '../app/interceptors/encryption-interceptor';
import Aura from '@primeuix/themes/aura';
import { provideToastr } from 'ngx-toastr';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { LoadingInterceptor } from '../app/interceptors/loading.interceptor';
import { tokenInterceptor } from './interceptors/token-interceptor';
import { provideNebular } from './@theme/theme.imports';
import { NbMenuModule } from '@nebular/theme';
import { GsapConfigLoaderService } from './services/gsap-config-loader.service';

export function loadGsapConfig(configLoader: GsapConfigLoaderService) {
  return () => configLoader.load();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync('animations'),
    importProvidersFrom(BrowserAnimationsModule,NbMenuModule.forRoot() ),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
     provideHttpClient(
      withInterceptors([
        encryptionInterceptor,
        tokenInterceptor
      ]),
      withInterceptorsFromDi()
    ),
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    providePrimeNG({
            theme: {
                preset: Aura,
                options: {
                    prefix: 'p',
                    darkModeSelector: 'system',
                    cssLayer: false
                }
            }
    }), 
    provideToastr({
        timeOut: 15000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
        closeButton: true,
        progressBar: true, 
        tapToDismiss: true,
        toastClass: 'ngx-toastr toast-animate',
    }),
    provideNebular()
  ]
};

