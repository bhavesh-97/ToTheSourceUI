// user-login.model.ts
import { MCommonEntitiesMaster } from './MCommonEntitiesMaster';

export class MUserLogin {
  public UserID: number = 0;
  public FullName: string = '';
  public MobileNumber: string = '';
  public EmailID: string = '';
  public Password: string = '';
  public IsPasswordReset: boolean = false;
  public MCommonEntitiesMaster: MCommonEntitiesMaster = new MCommonEntitiesMaster();
}
