import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { GsapConfigLoaderService } from '../../services/gsap-config-loader.service';
import { Observable, of } from 'rxjs';

export function gsapAnimationResolver(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<any> {
  const loader = inject(GsapConfigLoaderService);
  const page = getPageFromRoute(route);
  const fullUrl = state.url;
  
  console.log('[GSAP Resolver] Full URL:', fullUrl, '| Route segments:', route.url.map(s => s.path));
  
  if (!page) {
    console.log('[GSAP Resolver] No page found in route, skipping');
    return of(null);
  }

  console.log('[GSAP Resolver] Loading config for page:', page);
  loader.load(page).then(config => {
    console.log('[GSAP Resolver] Config loaded for:', page, '| Pages:', Object.keys(config?.pages || {}));
  }).catch(err => {
    console.error('[GSAP Resolver] Failed to load config for:', page, err);
  });
  
  return of(null);
}

function getPageFromRoute(route: ActivatedRouteSnapshot): string {
  if (route.firstChild) {
    const childSegments = route.firstChild.url.map(s => s.path).filter(s => s);
    if (childSegments.length) {
      return childSegments[childSegments.length - 1];
    }
  }
  const segments = route.url.map(s => s.path).filter(s => s);
  if (segments.length) {
    return segments[segments.length - 1];
  }
  return '';
}