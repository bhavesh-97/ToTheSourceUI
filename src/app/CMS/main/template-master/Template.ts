import { MCommonEntitiesMaster } from "../../../models/MCommonEntitiesMaster";
export type TemplateStatus = 'published' | 'draft' | 'warning' | 'success';

export class Template {
  TemplateID: number = 0;
  TemplateName: string = "";
  TemplateType: string = "";
  html: string = "";
  status: TemplateStatus = 'draft';
  MCommonEntitiesMaster?: MCommonEntitiesMaster;
}