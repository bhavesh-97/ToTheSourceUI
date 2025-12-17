// token.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { LoginService } from '../authentication/login/login.service';
import { NotificationService } from '../services/notification.service';
import { PopupMessageType } from '../models/PopupMessageType';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(LoginService);
  const notificationService = inject(NotificationService);
  const router = inject(Router);
  
  const token = authService.getToken();
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  } else {
  }
  
  return next(authReq).pipe(
    catchError((error: any) => {
      if (error instanceof HttpErrorResponse) {
        switch (error.status) {
          case 401: // Unauthorized
            notificationService.showMessage(
              'Your session has expired. Please log in again.',
              'Session Expired',
              PopupMessageType.Error
            );
            authService.logout();
            router.navigate(['/login']);
            break;
            
          case 403: // Forbidden
            notificationService.showMessage(
              'You do not have permission to access this resource.',
              'Access Denied',
              PopupMessageType.Error
            );
            break;
            
          case 0: // Network error or CORS issue
            notificationService.showMessage(
              'Unable to connect to the server. Please check your internet connection.',
              'Connection Error',
              PopupMessageType.Error
            );
            break;
        }
      }
      
      return throwError(() => error);
    })
  );
};