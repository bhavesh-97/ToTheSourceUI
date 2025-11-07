import { inject, Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private activeRequests = 0; 
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private zone = inject(NgZone);
  readonly loading$ = this.loadingSubject.asObservable();

    show(): void {
    this.zone.runOutsideAngular(() => {
      Promise.resolve().then(() => this.loadingSubject.next(true));
    });
  }

  hide(): void {
    this.zone.runOutsideAngular(() => {
      Promise.resolve().then(() => this.loadingSubject.next(false));
    });
  }

   startRequest(): void {
    this.activeRequests++;
    if (this.activeRequests === 1) {
      this.zone.runOutsideAngular(() => {
        Promise.resolve().then(() => this.loadingSubject.next(true));
      });
    }
  }

  endRequest(): void {
    this.activeRequests--;
    if (this.activeRequests <= 0) {
      this.activeRequests = 0;
      this.zone.runOutsideAngular(() => {
        Promise.resolve().then(() => this.loadingSubject.next(false));
      });
    }
  }
}

