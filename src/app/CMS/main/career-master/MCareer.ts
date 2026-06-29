import { MCommonEntitiesMaster } from "../../../models/MCommonEntitiesMaster";

export class MCareer {
  CareerID: number = 0;
  Title: string = '';
  Department: string = '';
  Location: string = '';
  EmploymentType: string = 'Full-Time';
  ExperienceLevel: string = 'Mid-Level';
  MinExperience: number = 0;
  MaxExperience: number = 0;
  SalaryRange: string = '';
  Description: string = '';
  Requirements: string = '';
  Responsibilities: string = '';
  Benefits: string = '';
  IsRemote: boolean = false;
  ApplicationUrl: string = '';
  ApplicationDeadline: string = '';
  SortOrder: number = 0;
  MCommonEntitiesMaster: MCommonEntitiesMaster = new MCommonEntitiesMaster();
}
