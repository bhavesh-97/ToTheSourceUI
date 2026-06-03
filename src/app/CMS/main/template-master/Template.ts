import { MCommonEntitiesMaster } from "../../../models/MCommonEntitiesMaster";
export type TemplateStatus = 'published' | 'draft' | 'warning' | 'success';

export class Template {
  templateID: number = 0;
  templateName: string = "";
  templateCode: string = "";
  templateContent: string = "";
  templateTypeID: number = 0;
  templateTypeName: string = "";
  mCommonEntitiesMaster?: MCommonEntitiesMaster;
}
export class TemplateType {
  templateTypeID: number = 0;
  templateTypeName: string = "";
  mCommonEntitiesMaster?: MCommonEntitiesMaster;
}