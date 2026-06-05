export interface WebHeaderMenuItem {
  mappingID: number;
  menuID: number;
  title: string;
  description: string;
  isParentMenu: boolean;
  parentMenuID: number;
  link?: string | null;
  icon?: string | null;
  children: WebHeaderMenuItem[];
}

export interface WebHeaderMenuResponse {
  menu: WebHeaderMenuItem[];
}