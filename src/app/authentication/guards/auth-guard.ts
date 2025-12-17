// auth-guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../login/login.service';
import { NotificationService } from '../../services/notification.service';
import { PopupMessageType } from '../../models/PopupMessageType';

export const authGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const notificationService = inject(NotificationService);
  const router = inject(Router);
  if (!loginService.isLoggedIn()) {
    notificationService.showMessage(
      'You need to log in to access this page.',
      'Authentication Required',
      PopupMessageType.Warning
    );
    router.navigate(['/login']);
    return false;
  }
  
  // Get token and check expiration
  const token = loginService.getToken();
  if (!token) {
    loginService.logout();
    router.navigate(['/login']);
    return false;
  }
  
  try {
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = tokenPayload.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    
    
    if (expirationTime < currentTime) {
      notificationService.showMessage(
        'Your session has expired. Please log in again.',
        'Session Expired',
        PopupMessageType.Error
      );
      loginService.logout();
      router.navigate(['/login']);
      return false;
    }
    
    const fiveMinutes = 5 * 60 * 1000;
    if (expirationTime - currentTime < fiveMinutes) {
      // You could trigger token refresh here
    }
    
    return true;
    
  } catch (error) {
    notificationService.showMessage(
      'Authentication error. Please log in again.',
      'Authentication Error',
      PopupMessageType.Error
    );
    loginService.logout();
    router.navigate(['/login']);
    return false;
  }
};