import { MCommonEntitiesMaster } from "../../../models/MCommonEntitiesMaster";

export class MMenuMappingMaster {
  MappingID: number = 0;
  MenuID: number = 0;
  MenuName: string = "";
  MenuURL: string = "";
  Icon: string = "";
  MenuType: number = 0;
  MenuRank: number = 0;
  ParentID: number = 0;
  ParentMenuName: string = "";
  ParentMenuURL: string = "";
  ParentMenuIcon: string = "";
  MCommonEntitiesMaster: MCommonEntitiesMaster = new MCommonEntitiesMaster();
}

export interface MenuTypeOption {
  label: string;
  value: number;
  icon: string;
}

export interface StatusOption {
  label: string;
  value: boolean;
}

export interface ParentMenuOption {
  label: string;
  value: number;
  data: MMenuMappingMaster | null; 
}
export class SaveMenuMappingRequest {
  MappingID: number = 0;
  MenuID: number = 0;
  MenuType: number = 0;
  ParentID: number = 0;
  MenuRank: number = 0;
  MCommonEntitiesMaster?: MCommonEntitiesMaster;
}
