import { MCommonEntitiesMaster } from "../../../models/MCommonEntitiesMaster";

export class MMenuMappingMaster {
  // MappingID: number = 0;
  MenuID: number = 0;
  // MenuType: number = 0;
  // ParentID: number = 0;
  // MenuRank: number = 0;
    MenuName: string = "";
  MenuURL: string = "";
  Icon: string = "";
  MCommonEntitiesMaster: MCommonEntitiesMaster = new MCommonEntitiesMaster();
}
