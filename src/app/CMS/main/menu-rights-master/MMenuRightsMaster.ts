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

export class SaveMenuRightsRequest {
  RoleID: number = 0;
  AdminID: number = 0;
  MenuRights: SaveMenuRights[] = [];
}
export class SaveMenuRights
{
    MenuRightsID: number = 0;
    MappingID: number = 0;
    RoleID: number = 0;
    AdminID: number = 0;
    Permission: MRights = new MRights();
    MCommonEntitiesMaster: MCommonEntitiesMaster = new MCommonEntitiesMaster();
}
export class MenuRightItem {
  MenuRightsID: number = 0; 
  MappingID: number = 0;    
  RoleID: number = 0;
  AdminID: number = 0;
  CanView: boolean = false;
  CanInsert: boolean = false;
  CanUpdate: boolean = false;
  CanDelete: boolean = false;
  MCommonEntitiesMaster: MCommonEntitiesMaster = new MCommonEntitiesMaster();
}