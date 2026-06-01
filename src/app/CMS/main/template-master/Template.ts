import { MCommonEntitiesMaster } from "../../../models/MCommonEntitiesMaster";
export type TemplateStatus = 'published' | 'draft' | 'warning' | 'success';

export class Template {
  templateID: number = 0;
  templateName: string = "";
  templateCode: string = "";
  templateContent: string = "";
  mCommonEntitiesMaster?: MCommonEntitiesMaster;
}