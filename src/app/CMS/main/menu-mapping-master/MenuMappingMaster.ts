import { MCommonEntitiesMaster } from "../../../models/MCommonEntitiesMaster";

export class MMenuMappingMaster {
  MenuID: number = 0;
  MenuName: string = "";
  MenuURL: string = "";
  Icon: string = "";
  MCommonEntitiesMaster: MCommonEntitiesMaster = new MCommonEntitiesMaster();
}
