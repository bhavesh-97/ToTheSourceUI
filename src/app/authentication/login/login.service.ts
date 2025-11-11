import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MUser } from '../../models/MUser.js';
import { Observable } from 'rxjs/internal/Observable';
import { JsonResponseModel } from '../../models/JsonResponseModel';
import { ENCRYPTION_CONTEXT } from '../../interceptors/encryption-interceptor';
import { routes } from '../../app.routes';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private baseUrl = environment.CMSUrl;

//     GetUserLogin(loginModel: MUser,encryptPayload = false): Observable<JsonResponseModel> {
//       debugger
// //         const params = new HttpParams().set('jsonString', JSON.stringify(loginModel));
//            const params = new HttpParams({ fromObject: loginModel as any });
//         return this.http.get<JsonResponseModel>(`${this.baseUrl}/Login/Login`, { params, context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) });
//     }
      GetUserLogin(loginModel: MUser, encryptPayload = false): Observable<JsonResponseModel> {
        return this.http.post<JsonResponseModel>(`${this.baseUrl}/Login/Login`,loginModel,                    
                                                      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
            );
      }
      logout(): void {
        localStorage.clear();
        this.router.navigate(['login']);
      }
      storeToken(token: string): void {
        localStorage.setItem('token', token);
      }

      getToken(): string | null {
        return localStorage.getItem('token');
      }
      isLoggedIn(): boolean {
        return this.getToken() !== null;
      }
}
