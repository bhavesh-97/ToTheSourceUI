// user-login.model.ts
import { MCommonEntitiesMaster } from './MCommonEntitiesMaster';

export class MUser {
  public UserID: number = 0;
  public FullName: string = '';
  public UserName: string = '';
  public MobileNumber: string = '';
  public EmailID: string = '';
  public Password: string = '';
  public IsPasswordReset: boolean = false;
  public token?: string;
  public refreshToken?: string;
  public userMenu: any;
  public menuList: any;
  public realmId: string | undefined;
  public standardDateFormat: any;
  public standardDateOnlyFormat: any;
  public logid: string | undefined;
  public idamUserId: string | undefined;
  public realmName: string | undefined;
  public MCommonEntitiesMaster: MCommonEntitiesMaster = new MCommonEntitiesMaster();
}
