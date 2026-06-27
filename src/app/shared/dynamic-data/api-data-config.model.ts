export interface ApiDataConfigModel {
  apiConfigID: number;
  templateID: number;
  apiUrl: string;
  apiMethod: string;
  apiHeaders: string | null;
  apiBody: string | null;
  cacheSeconds: number;
  mCommonEntitiesMaster?: {
    isActive: boolean;
    createdBy: number;
    createdDate?: string;
    updatedBy: number;
    updatedDate?: string;
    isDeleted: boolean;
  };
}
