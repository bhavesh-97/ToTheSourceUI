import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { JsonResponseModel } from '../../models/JsonResponseModel';
import { ENCRYPTION_CONTEXT } from '../../interceptors/encryption-interceptor';
import { MegaMenuItem } from '../pages/header/header';

export interface NavItem {
  label: string;
  route?: string;
  megaMenu?: {
    description: string;
    columns: {
      heading?: string;
      items: MegaMenuItem[];
    }[];
  };
}

interface RawMenuItem {
  mappingID: number;
  menuID: number;
  title: string;
  heading: string;
  description?: string | null;
  isParentMenu: boolean;
  parentMenuID: number;
  link?: string | null;
  icon?: string | null;
  children: RawMenuItem[];
}

@Injectable({ providedIn: 'root' })
export class HeaderMenuService {
  private http = inject(HttpClient);
  private baseUrl = environment.WebUrl;

  getHeaderMenu(encryptPayload = false): Observable<NavItem[]> {
    return this.http
      .get<JsonResponseModel>(`${this.baseUrl}/Home/WebMenu`,{ context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) })
      .pipe(
        map((res) => {
          debugger;
          if (!res.isError && res.result) {
            return this.mapToNavItems(res.result as RawMenuItem[]);
          }
          return [];
        })
      );
  }

  private mapToNavItems(items: RawMenuItem[]): NavItem[] {
    return (items || []).map((item) => {
      const children = item.children || [];
      const hasChildren = children.length > 0;
      const hasLink = !!item.link;

      return {
        label: item.title ?? '',
        route: hasLink ? item.link! : undefined,
        megaMenu: hasChildren
          ? {
              description: item.description || `${item.title} — explore our solutions and services.`,
              columns: this.buildColumns(children),
            }
          : undefined,
      };
    });
  }

  private buildColumns(children: RawMenuItem[]): { heading?: string; items: MegaMenuItem[] }[] {
    if (!children || children.length === 0) return [];

    const hasGrandchildren = children.some((c) => (c.children || []).length > 0);
    if (hasGrandchildren) {
      return children.map((child) => ({
        heading: child.heading,
        items: this.mapMenuItems(child.children || []),
      }));
    }

    return [
      {
        heading: children[0]?.heading || undefined,
        items: this.mapMenuItems(children),
      },
    ];
  }

  private mapMenuItems(items: RawMenuItem[]): MegaMenuItem[] {
    return (items || []).map((item) => ({
      label: item.title ?? '',
      icon: item.icon ?? undefined,
      route: item.link ?? undefined,
      children:
        (item.children || []).length > 0
          ? this.mapMenuItems(item.children!)
          : undefined,
    }));
  }
}
