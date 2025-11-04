export enum PopupMessageType {
  // 🔴 Error & Failure States
  Error = 'Error',
  Critical = 'Critical',
  ValidationError = 'ValidationError',
  ServerError = 'ServerError',
  NetworkError = 'NetworkError',
  Unauthorized = 'Unauthorized',
  Forbidden = 'Forbidden',
  NotFound = 'NotFound',
  Timeout = 'Timeout',
  Conflict = 'Conflict',
  Failed = 'Failed',

  // 🟢 Success & Completion States
  Success = 'Success',
  Created = 'Created',
  Updated = 'Updated',
  Deleted = 'Deleted',
  Saved = 'Saved',
  Completed = 'Completed',
  Uploaded = 'Uploaded',
  Downloaded = 'Downloaded',
  Submitted = 'Submitted',
  Approved = 'Approved',

  // 🟡 Warnings & Alerts
  Warning = 'Warning',
  Expired = 'Expired',
  Pending = 'Pending',
  Overdue = 'Overdue',
  LimitReached = 'LimitReached',
  Incomplete = 'Incomplete',
  Deprecated = 'Deprecated',
  Attention = 'Attention',
  Caution = 'Caution',

  // 🔵 Informational & Neutral States
  Info = 'Info',
  Processing = 'Processing',
  Loading = 'Loading',
  NoData = 'NoData',
  Empty = 'Empty',
  Refresh = 'Refresh',
  Reminder = 'Reminder',
  Notice = 'Notice',
  Hint = 'Hint',
  System = 'System',

  // ⚪ User Interaction States
  Confirmation = 'Confirmation',
  Question = 'Question',
  Retry = 'Retry',
  Reconnect = 'Reconnect',
  Cancelled = 'Cancelled',
  LoggedOut = 'LoggedOut',
  LoggedIn = 'LoggedIn',
  SessionExpired = 'SessionExpired',

  // 🟣 Security & Access Control
  Authentication = 'Authentication',
  Authorization = 'Authorization',
  SecurityAlert = 'SecurityAlert',
  PasswordChanged = 'PasswordChanged',
  AccessRevoked = 'AccessRevoked',

  // ⚙️ System & Maintenance
  Maintenance = 'Maintenance',
  UpdateAvailable = 'UpdateAvailable',
  ServiceUnavailable = 'ServiceUnavailable',
  Configuration = 'Configuration',
  Sync = 'Sync',
  Backup = 'Backup',
  Restore = 'Restore',
}
