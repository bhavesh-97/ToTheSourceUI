import { MCommonEntitiesMaster } from "../../../models/MCommonEntitiesMaster";
import { MRights } from "../../../models/MRights";
import { MMenuMappingMaster } from "../menu-mapping-master/MenuMappingMaster";

export class MMenuRightsMaster {
  MappingID: number = 0;
  MenuID: number = 0;
  RoleID: number = 0;
  AdminID: number = 0;
  MRights: MRights = new MRights();
  MMenuMappingMaster: MMenuMappingMaster = new MMenuMappingMaster();
  MCommonEntitiesMaster: MCommonEntitiesMaster = new MCommonEntitiesMaster();
}
