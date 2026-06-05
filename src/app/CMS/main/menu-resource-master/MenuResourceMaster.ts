import { MCommonEntitiesMaster } from "../../../models/MCommonEntitiesMaster";

export class MMenuResourceMaster {
  menuID: number = 0;
  menuName: string = "";
  menuURL: string = "";
  icon: string = "";
  description: string = "";
  mCommonEntitiesMaster: MCommonEntitiesMaster = new MCommonEntitiesMaster();
}
