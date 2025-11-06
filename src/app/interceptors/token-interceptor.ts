// token.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { LoginService } from '../authentication/login/login.service';
import { NotificationService } from '../services/notification.service';
import { PopupMessageType } from '../models/PopupMessageType';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(LoginService);
  const notificationService = inject(NotificationService);
  const token = authService.getToken();
  // Add token if exists
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401) {
        notificationService.showMessage("Please login again", "Session Expired", PopupMessageType.SessionExpired);
        authService.logout();
        // return handle401Error(req, next);
      }
      return throwError(() => error);
    })
  );

  // Handle 401 + refresh token
  // function handle401Error(request: any, next: any) {
  //   const tokenModel = new TokenApiModel();
  //   tokenModel.accessToken = authService.getToken()!;
  //   // tokenModel.refreshToken = authService.getRefreshToken()!;

  //   return authService.renewToken(tokenModel).pipe(
  //     switchMap((data: TokenApiModel) => {
  //       authService.storeToken(data.accessToken);
  //       // authService.storeRefreshToken(data.refreshToken);

  //       // Retry original request with new token
  //       const cloned = request.clone({
  //         setHeaders: {
  //           Authorization: `Bearer ${data.accessToken}`
  //         }
  //       });

  //       return next(cloned);
  //     }),
  //     catchError(refreshError => {
  //       // Refresh failed → force logout
  //       notificationService.showMessage(PopupMessageType.SessionExpired, "Session Expired", "Please login again");
  //       authService.logout(); 
  //       return throwError(() => refreshError);
  //     })
  //   );
  // }
};