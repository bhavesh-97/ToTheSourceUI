import { MCommonEntitiesMaster } from "../../../models/MCommonEntitiesMaster";

export class MMenuMappingMaster {
  mappingID: number = 0;
  menuID: number = 0;
  menuName: string = "";
  menuURL: string = "";
  icon: string = "";
  menuTypeID: number = 0;
  menuTypeCode: string = "";
  menuTypeName: string = "";
  menuRank: number = 0;
  parentID: number = 0;
  parentMenuName: string = "";
  parentMenuURL: string = "";
  parentMenuIcon: string = "";
  siteAreaID: number = 0;
  areaName: string = "";
  mCommonEntitiesMaster: MCommonEntitiesMaster = new MCommonEntitiesMaster();
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
  mappingID: number = 0;
  menuID: number = 0;
  menuTypeID: number = 0;
  parentID: number = 0;
  siteAreaID: number = 0;
  menuRank: number = 0;
  mCommonEntitiesMaster?: MCommonEntitiesMaster;
}
