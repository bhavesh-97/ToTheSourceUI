import { SafeHtml } from "@angular/platform-browser";

export interface MegaMenuColumn {
  heading?: string;
  items: MegaMenuItem[];
}

export interface MegaMenuItem {
  label: string;
  icon?: string;
  route?: string;
  children?: MegaMenuItem[];
}

export interface NavItem {
  label: string;
  route?: string;
  megaMenu?: {
    description: SafeHtml | string;
    columns: MegaMenuColumn[];
  };
}

export interface RawMenuItem {
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
