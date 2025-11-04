import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PopupMessageType } from '../models/PopupMessageType';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

    private toastr = inject(ToastrService);
  
    showMessage(message: string, title: string, type: PopupMessageType) {

    const statusMap: { [key in PopupMessageType]: 'success' | 'error' | 'info' | 'warning' } = {
       // Error & Failure States
       [PopupMessageType.Error]: 'error',
       [PopupMessageType.Critical]: 'error',
       [PopupMessageType.ValidationError]: 'error',
       [PopupMessageType.ServerError]: 'error',
       [PopupMessageType.NetworkError]: 'error',
       [PopupMessageType.Unauthorized]: 'error',
       [PopupMessageType.Forbidden]: 'error',
       [PopupMessageType.NotFound]: 'error',
       [PopupMessageType.Timeout]: 'error',
       [PopupMessageType.Conflict]: 'error',
       [PopupMessageType.Failed]: 'error',

       // Success & Completion States
       [PopupMessageType.Success]: 'success',
       [PopupMessageType.Created]: 'success',
       [PopupMessageType.Updated]: 'success',
       [PopupMessageType.Deleted]: 'success',
       [PopupMessageType.Saved]: 'success',
       [PopupMessageType.Completed]: 'success',
       [PopupMessageType.Uploaded]: 'success',
       [PopupMessageType.Downloaded]: 'success',
       [PopupMessageType.Submitted]: 'success',
       [PopupMessageType.Approved]: 'success',

        // 🟡 Warnings & Alerts
       [PopupMessageType.Warning]: 'warning',
       [PopupMessageType.Expired]: 'warning',
       [PopupMessageType.Pending]: 'warning',
       [PopupMessageType.Overdue]: 'warning',
       [PopupMessageType.LimitReached]: 'warning',
       [PopupMessageType.Incomplete]: 'warning',
       [PopupMessageType.Deprecated]: 'warning',
       [PopupMessageType.Attention]: 'warning',
       [PopupMessageType.Caution]: 'warning',

       // 🔵 Informational & Neutral States
       [PopupMessageType.Info]: 'info',
       [PopupMessageType.Processing]: 'info',
       [PopupMessageType.Loading]: 'info',
       [PopupMessageType.NoData]: 'info',
       [PopupMessageType.Empty]: 'info',
       [PopupMessageType.Refresh]: 'info',
       [PopupMessageType.Reminder]: 'info',
       [PopupMessageType.Notice]: 'info',
       [PopupMessageType.Hint]: 'info',
       [PopupMessageType.System]: 'info',
    
       // ⚪ User Interaction States
       [PopupMessageType.Confirmation]: 'info',
       [PopupMessageType.Question]: 'info',
       [PopupMessageType.Retry]: 'warning',
       [PopupMessageType.Reconnect]: 'warning',
       [PopupMessageType.Cancelled]: 'warning',
       [PopupMessageType.LoggedOut]: 'info',
       [PopupMessageType.LoggedIn]: 'success',
       [PopupMessageType.SessionExpired]: 'warning',

       // 🟣 Security & Access Control
       [PopupMessageType.Authentication]: 'error',
       [PopupMessageType.Authorization]: 'error',
       [PopupMessageType.SecurityAlert]: 'error',
       [PopupMessageType.PasswordChanged]: 'success',
       [PopupMessageType.AccessRevoked]: 'warning',

       // ⚙️ System & Maintenance
       [PopupMessageType.Maintenance]: 'warning',
       [PopupMessageType.UpdateAvailable]: 'info',
       [PopupMessageType.ServiceUnavailable]: 'error',
       [PopupMessageType.Configuration]: 'info',
       [PopupMessageType.Sync]: 'info',
       [PopupMessageType.Backup]: 'success',
       [PopupMessageType.Restore]: 'success',
    };

    const status =
          typeof type === 'string' && (type as PopupMessageType) in statusMap
          ? statusMap[type as PopupMessageType]
          : 'info';

    const config = status === 'error'
      ? { timeOut: 3000, extendedTimeOut: 0, closeButton: true, tapToDismiss: false, positionClass: 'toast-top-right', preventDuplicates: true }
      : { timeOut: 3000, closeButton: true, positionClass: 'toast-top-right', preventDuplicates: true };

    this.toastr.show(message, title, config, `toast-${status}`);
  }
}