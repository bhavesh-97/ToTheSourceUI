// src/app/auth/auth.store.ts
import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { MUser} from '../models/MUser';
import { MUserMenuIDAM } from '../models/usermenuidem';
import { MLogout } from '../models/logout';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private user = signal<MUser | null>(null);
  private menuList = signal<any[]>([]);
  currentUser = this.user.asReadonly();
  isAuthenticated = computed(() => !!this.user());
  userMenu = this.menuList.asReadonly();

  constructor() {
    const stored = localStorage.getItem('currentUser');
    if (stored) this.user.set(JSON.parse(stored));
  }
  public get currentUserValue(): MUser {
    return this.user() ?? {} as MUser;
  }

  login(credentials: MUser) {
    return this.http.post<any>(`${environment.CMSUrl}/api/Home/Login`, credentials).pipe(
      tap(response => {
        const processedUser = this.processMenu(response);
        this.user.set(processedUser);
        localStorage.setItem('currentUser', JSON.stringify(processedUser));
      })
    );
  }

  private processMenu(user: any): MUser {
    const nbMenus: MUserMenuIDAM[] = JSON.parse(user.pnsMenu);

    // Clean & transform menu
    const cleanMenu = nbMenus.map(x => this.transformMenu(x));
    const flatMenu: any[] = [];
    nbMenus.forEach(x => this.flattenMenu(x, flatMenu));

    user.userMenu = cleanMenu;
    user.menuList = flatMenu;
    this.menuList.set(flatMenu);

    return user;
  }

  private transformMenu(menu: MUserMenuIDAM): any {
    const { menuID, parentMenuID, isParentMenu, roleName, roleID, ...rest } = menu;
    const transformed: any = {
      ...rest,
      icon: { icon: menu.icon, pack: 'myicon' }
    };

    if (menu.children?.length) {
      transformed.children = menu.children.map(child => {
        const { menuID, parentMenuID, isParentMenu, roleName, roleID, children, ...c } = child;
        return { ...c, icon: { icon: child.icon, pack: 'myicon' } };
      });
      delete transformed.link;
    }

    return transformed;
  }

  private flattenMenu(menu: MUserMenuIDAM, list: any[]) {
    if (menu.children?.length) {
      menu.children.forEach(child => this.flattenMenu(child, list));
    } else {
      list.push({
        link: menu.link,
        title: menu.title,
        permission: menu.permissions
      });
    }
  }

  logout() {
    const user = this.user();
    if (!user) return;

    const fcmToken = localStorage.getItem('fcmUserToken');
    if (fcmToken) {
      this.http.post(`${environment.CMSUrl}/api/Home/Logout`, {
        UserID: user.UserID,
        chk: 2,
        macaddress: '',
        token: fcmToken
      }).subscribe();
    }

    const logoutData: MLogout = {
      access_Token: user.token,
      refresh_Token: user.refreshToken,
      userid: user.UserID,
      clientIp: localStorage.getItem('clientIp') || ''
    };

    this.http.post(`${environment.CMSUrl}/LoginKC/Logout`, logoutData).subscribe();

    // Cleanup
    localStorage.removeItem('currentUser');
    localStorage.removeItem('fcmUserToken');
    localStorage.setItem('isReload', 'false');
    this.user.set(null);
    this.menuList.set([]);

    setTimeout(() => {
      window.location.href = '';
    }, 600);
  }
}