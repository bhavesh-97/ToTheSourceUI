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
  
  // Get the token
  const token = authService.getToken();
  
  console.log('Token Interceptor - Processing request to:', req.url);
  console.log('Token Interceptor - Token exists:', !!token);
  
  // Clone request and add token if it exists
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Token Interceptor - Authorization header added');
  } else {
    console.log('Token Interceptor - No token found');
  }
  
  // Handle the request and catch 401 errors
  return next(authReq).pipe(
    catchError((error: any) => {
      console.log('Token Interceptor - Error occurred:', error);
      
      if (error instanceof HttpErrorResponse) {
        switch (error.status) {
          case 401: // Unauthorized
            console.log('Token Interceptor - 401 Unauthorized detected');
            notificationService.showMessage(
              'Your session has expired. Please log in again.',
              'Session Expired',
              PopupMessageType.Error
            );
            authService.logout();
            router.navigate(['/login']);
            break;
            
          case 403: // Forbidden
            console.log('Token Interceptor - 403 Forbidden detected');
            notificationService.showMessage(
              'You do not have permission to access this resource.',
              'Access Denied',
              PopupMessageType.Error
            );
            break;
            
          case 0: // Network error or CORS issue
            console.log('Token Interceptor - Network error detected');
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