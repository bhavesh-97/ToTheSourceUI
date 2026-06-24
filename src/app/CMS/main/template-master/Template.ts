import { MCommonEntitiesMaster } from "../../../models/MCommonEntitiesMaster";
import { DynamicDataConfig } from "../../../shared/dynamic-data/dynamic-data.model";
export type TemplateStatus = 'published' | 'draft' | 'warning' | 'success';

export class Template {
  templateID: number = 0;
  templateName: string = "";
  templateCode: string = "";
  templateContent: string = "";
  templateTypeID: number = 0;
  templateTypeName: string = "";
  dynamicDataConfig?: DynamicDataConfig;
  mCommonEntitiesMaster?: MCommonEntitiesMaster;
}
export class TemplateType {
  templateTypeID: number = 0;
  templateTypeName: string = "";
  mCommonEntitiesMaster?: MCommonEntitiesMaster;
}