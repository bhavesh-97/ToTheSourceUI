import { SectionDataField } from './section-data-field.model';

export type DataSourceType = 'api' | 'manual';
export type ApiHttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface DynamicDataConfig {
  sourceType: DataSourceType;
  apiUrl: string;
  apiMethod: ApiHttpMethod;
  apiHeaders: Record<string, string>;
  apiBody: string;
  data: SectionDataField[];
  cacheSeconds: number;
}

export function createDefaultDataConfig(): DynamicDataConfig {
  return {
    sourceType: 'manual',
    apiUrl: '',
    apiMethod: 'GET',
    apiHeaders: {},
    apiBody: '',
    data: [],
    cacheSeconds: 300,
  };
}
