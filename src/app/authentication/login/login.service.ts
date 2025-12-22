import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MUser } from '../../models/MUser.js';
import { Observable } from 'rxjs/internal/Observable';
import { JsonResponseModel } from '../../models/JsonResponseModel';
import { ENCRYPTION_CONTEXT } from '../../interceptors/encryption-interceptor';
import { routes } from '../../app.routes';
import { Router } from '@angular/router';
import { Encryption } from '../../services/encryption';
import { MUserMenuIDAM } from '../../models/usermenuidem';
import { PopupMessageType } from '../../models/PopupMessageType';
import { delay, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private encryption = inject(Encryption);
    private baseUrl = environment.CMSUrl;
    private readonly TOKEN_KEY = 'auth_token';
    private readonly USER_INFO_KEY= 'user_info';
    private readonly USER_Menu_INFO_KEY= 'user_menu_info';

    protected demoLoginResponse: JsonResponseModel = {
        isError: false,
        strMessage: "Login successful",
        title: PopupMessageType.Success,
        type: PopupMessageType.Success,
        token: "demo-jwt-token-123456",
        result: {
          user: {
            UserID: 1,
            UserName: "admin",
            FullName: "Bhavesh Vaghela",
            Email: "admin@example.com",
            ProfileImage: "assets/images/bhavesh.jpg",
            Roles: ["Admin"],
            RoleName: "Admin",
            ProfileMenuList: [
                    { "icon": "pi pi-user", "label": "Public Profile", "action": "publicProfile" },
                    { "icon": "pi pi-id-card", "label": "My Profile", "action": "myProfile" },
                    { "icon": "pi pi-cog", "label": "My Account", "action": "myAccount" },
                    { "icon": "pi pi-globe", "label": "Language", "value": "English", "action": "changeLanguage" },
                    { "icon": "pi pi-moon", "label": "Dark Mode", "toggle": true, "action": "toggleDarkMode" },
                    { "icon": "pi pi-sign-out", "label": "Log out", "action": "logout" }
                ]
          },
          menu: [
            {
              roleID: "1",
              roleName: "Admin",
              menuID: 100,
              title: "Dashboard",
              isParentMenu: true,
              parentMenuID: 0,
              link: "/CMS/main/dashboard",
              icon: "pi pi-home",
              permissions: {
                  CanInsert: false,
                  CanUpdate: false,
                  CanDelete: false,
                  CanView: true
            },
          children: []
        },
        {
          roleID: "1",
          roleName: "Admin",
          menuID: 200,
          title: "Users",
          isParentMenu: true,
          parentMenuID: 0,
          link: null,
          icon: "pi pi-users",
          permissions: {
            CanInsert: false,
            CanUpdate: true,
            CanDelete: false,
            CanView: true
          },
          children: [
            {
              roleID: "1",
              roleName: "Admin",
              menuID: 201,
              title: "User List",
              isParentMenu: false,
              parentMenuID: 200,
              link: "/main/users/list",
              icon: "pi pi-list",
              permissions: {
                CanInsert: true,
                CanUpdate: true,
                CanDelete: true,
                CanView: true
              },
              children: []
            },
            {
              roleID: "1",
              roleName: "Admin",
              menuID: 202,
              title: "Roles",
              isParentMenu: false,
              parentMenuID: 200,
              link: "/main/users/roles",
              icon: "pi pi-id-card",
              permissions: {
                CanInsert: false,
                CanUpdate: true,
                CanDelete: false,
                CanView: true
              },
              children: []
            }
          ]
        },
        {
          roleID: "1",
          roleName: "Admin",
          menuID: 300,
          title: "CMS",
          isParentMenu: true,
          parentMenuID: 0,
          link: null,
          icon: "pi pi-file",
          permissions: {
            CanInsert: true,
            CanUpdate: true,
            CanDelete: true,
            CanView: true
          },
          children: [
            {
              menuID: 301,
              title: "GSAP Master",
              isParentMenu: false,
              parentMenuID: 300,
              link: "/CMS/main/gsap",
              icon: "pi pi-flag",
              permissions: {
                CanInsert: true,
                CanUpdate: true,
                CanDelete: false,
                CanView: true
              },
              children: []
            }, 
            {
              menuID: 302,
              title: "Template Master",
              isParentMenu: false,
              parentMenuID: 300,
              link: "/CMS/main/template",
              icon: "pi pi-file",
              permissions: {
                CanInsert: true,
                CanUpdate: true,
                CanDelete: false,
                CanView: true
              },
              children: []
            },
            {
              menuID: 301,
              title: "Blog",
              isParentMenu: false,
              parentMenuID: 300,
              link: "/main/cms/blog",
              icon: "pi pi-book",
              permissions: {
                CanInsert: true,
                CanUpdate: true,
                CanDelete: false,
                CanView: true
              },
              children: []
            },
            {
              menuID: 302,
              title: "Categories",
              isParentMenu: false,
              parentMenuID: 300,
              link: "/main/cms/categories",
              icon: "pi pi-tags",
              permissions: {
                CanInsert: true,
                CanUpdate: false,
                CanDelete: false,
                CanView: true
              },
              children: []
            },
            {
              menuID: 303,
              title: "Sliders",
              isParentMenu: false,
              parentMenuID: 300,
              link: "/main/cms/sliders",
              icon: "pi pi-images",
              permissions: {
                CanInsert: true,
                CanUpdate: true,
                CanDelete: true,
                CanView: true
              },
              children: []
            },
            {
              menuID: 304,
              title: "Media Library",
              isParentMenu: false,
              parentMenuID: 300,
              link: "/main/cms/media",
              icon: "pi pi-image",
              permissions: {
                CanInsert: true,
                CanUpdate: true,
                CanDelete: true,
                CanView: true
              },
              children: []
            }
          ]
        }
      ]
    }
  };

    //#region Login/Logout Service Methods
      GetUserLogin(loginModel: MUser, encryptPayload = false): Observable<JsonResponseModel> {
        return this.http.post<JsonResponseModel>(`${this.baseUrl}/Login/Login`,loginModel,                    
                                                      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
            );
        // demo Json
          // return of(this.demoLoginResponse).pipe(delay(500));
      }
      GetAdminDetails(encryptPayload = false): Observable<JsonResponseModel> {
        return this.http.get<JsonResponseModel>(`${this.baseUrl}/Login/GetUserDetails`,
                                                      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
            );
      } 
      GetAdminDetailsByRole(RoleID:number,encryptPayload = false): Observable<JsonResponseModel> {
        const params = new HttpParams()
                        .set('RoleID', RoleID);
        return this.http.get<JsonResponseModel>(`${this.baseUrl}/Login/GetAdminDetailsByRole`,
                                                      { params, context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
            );
      }   
      isLoggedIn(): boolean {
          return !!this.getToken();
      }
      logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_INFO_KEY);
        localStorage.removeItem(this.USER_Menu_INFO_KEY);
        localStorage.clear();
        this.router.navigate(['login']);
      }
    //#endregion

    //#region Session Management

      storeUserInfo(user: MUser) {
        const json = JSON.stringify(user);
        const encrypted = this.encryption.frontEncryptEncode(json);
        localStorage.setItem(this.USER_INFO_KEY, encrypted);
      }
      getUserInfo(): MUser | null {
        const encrypted = localStorage.getItem(this.USER_INFO_KEY);
        if (!encrypted) return null;
        return JSON.parse(this.encryption.frontDecryptDecode(encrypted));
      }
      storeMenuList(menu: MUserMenuIDAM[]) {
        const json = JSON.stringify(menu);
        const encrypted = this.encryption.frontEncryptEncode(json);
        localStorage.setItem(this.USER_Menu_INFO_KEY, encrypted);
      }
      getMenuList(): MUserMenuIDAM[] {
          const encrypted = localStorage.getItem(this.USER_Menu_INFO_KEY);
          if (!encrypted) return [];

          try {
            const decrypted = this.encryption.frontDecryptDecode(encrypted);
            const menu = JSON.parse(decrypted) as MUserMenuIDAM[];
            // return JSON.parse(decrypted) as MUserMenuIDAM[];
            // Return filtered menu (only CanView items)
            return this.filterMenu(menu);
          } catch {
              return [];
          }
      }
      filterMenu(items: MUserMenuIDAM[]): MUserMenuIDAM[] {
          return items
              .filter(m => m.permissions?.canView) 
                .map(m => ({
                  ...m,
                    children: m.children?.length
                  ? this.filterMenu(m.children)
                  : []
                }));
        }

      storePermissions(perm: any) {
          const encrypted = this.encryption.frontEncryptEncode(JSON.stringify(perm));
          localStorage.setItem("permissions", encrypted);
      }
      storeToken(token: string): void {
          const encrypted = this.encryption.frontEncryptEncode(token);
          localStorage.setItem(this.TOKEN_KEY, encrypted);
      }
      // storeToken(token: string): void {
      //   // localStorage.setItem('token', token);
      //     const encrypted = this.encryption.frontEncryptEncode(token);
      //     localStorage.setItem('token', encrypted);
      // }
     
      getToken(): string | null {
          const encrypted = localStorage.getItem(this.TOKEN_KEY);
          if (!encrypted) return '';

          const decrypted = this.encryption.frontDecryptDecode(encrypted);
          return decrypted;
        // return localStorage.getItem('token');
      }
      //#endregion
      
}

