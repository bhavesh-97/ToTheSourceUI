import { MCommonEntitiesMaster } from "./MCommonEntitiesMaster";

export class MMenuTypeMaster {
  MenuTypeID: number = 0;
  MenuTypeCode: string = "";
  MenuTypeName: string = "";
  MenuTypeIcon: string = "";
  Description: string = "";
  MCommonEntitiesMaster: MCommonEntitiesMaster = new MCommonEntitiesMaster();
}