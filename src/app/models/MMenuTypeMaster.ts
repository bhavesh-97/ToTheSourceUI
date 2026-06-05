import { MCommonEntitiesMaster } from "./MCommonEntitiesMaster";

export class MMenuTypeMaster {
  menuTypeID: number = 0;
  menuTypeCode: string = "";
  menuTypeName: string = "";
  menuTypeIcon: string = "";
  description: string = "";
  mCommonEntitiesMaster: MCommonEntitiesMaster = new MCommonEntitiesMaster();
}