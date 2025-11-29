// user-login.model.ts
import { MenuItem } from 'primeng/api';
import { MCommonEntitiesMaster } from './MCommonEntitiesMaster';

export class MUser {
  public UserID: number = 0;
  public FullName: string = '';
  public UserName: string = '';
  public MobileNumber: string = '';
  public EmailID: string = '';
  public Password: string = '';
  public IsPasswordReset: boolean = false;
  public ProfileImage: string = '';        
  public RoleName: string = '';            
  public ProfileMenuList: MenuItem[] = [];    
  public token?: string;
  public refreshToken?: string;
  public standardDateFormat: any;
  public standardDateOnlyFormat: any;
  public logid: string | undefined;
  public MCommonEntitiesMaster: MCommonEntitiesMaster = new MCommonEntitiesMaster();
}
