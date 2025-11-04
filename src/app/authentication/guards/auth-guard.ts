import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../login/login.service';
import { NotificationService } from '../../services/notification.service';
import { PopupMessageType } from '../../models/PopupMessageType';

export const authGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const notificationService = inject(NotificationService);
  const router = inject(Router);

  if (loginService.isLoggedIn()) {
    return true; 
  } else {
    notificationService.showMessage('You are not authorized to access this page. Please log in with valid credentials.', PopupMessageType.Unauthorized, PopupMessageType.Unauthorized);
    router.navigate(['login']);
    return false;
  }
};
