import { MCommonEntitiesMaster } from "../../../models/MCommonEntitiesMaster";
import { MRights } from "../../../models/MRights";
import { MMenuMappingMaster } from "../menu-mapping-master/MenuMappingMaster";

export class MMenuRightsMaster {
  MenuRightsID: number = 0;
  MappingID: number = 0;
  MenuID: number = 0;
  RoleID: number = 0;
  AdminID: number = 0;
  EntityID: number = 0; // RoleID or AdminID
  EntityType: 'Role' | 'Admin' = 'Role';
  MRights: MRights = new MRights();
  MMenuMappingMaster: MMenuMappingMaster = new MMenuMappingMaster();
  MCommonEntitiesMaster: MCommonEntitiesMaster = new MCommonEntitiesMaster();
}

export interface RoleOption {
  RoleID: number;
  RoleName: string;
  RoleCode: string;
}

export interface AdminOption {
  AdminID: number;
  AdminName: string;
  Email: string;
}

export interface SaveMenuRightsRequest {
  EntityID: number;
  EntityType: 'Role' | 'Admin';
  MenuRights: MenuRightItem[];
}

export interface MenuRightItem {
  MappingID: number;
  MenuID: number;
  Rights: MRights;
}