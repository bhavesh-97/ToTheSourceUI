import { MCommonEntitiesMaster } from "../../../models/MCommonEntitiesMaster";

export class MMenuResourceMaster {
  MenuID: number = 0;
  MenuName: string = "";
  MenuURL: string = "";
  Icon: string = "";
  MCommonEntitiesMaster: MCommonEntitiesMaster = new MCommonEntitiesMaster();
}
