// user-login.model.ts
import { MenuItem } from 'primeng/api';
import { MCommonEntitiesMaster } from './MCommonEntitiesMaster';

export class MUser {
  public userID: number = 0;
  public fullName: string = '';
  public userName: string = '';
  public mobileNumber: string = '';
  public emailID: string = '';
  public password: string = '';
  public isPasswordReset: boolean = false;
  public profileImage: string = '';        
  public roleName: string = '';            
  public profileMenuList: MenuItem[] = [];    
  public token?: string;
  public refreshToken?: string;
  public standardDateFormat: any;
  public standardDateOnlyFormat: any;
  public logid: string | undefined;
  public mCommonEntitiesMaster: MCommonEntitiesMaster = new MCommonEntitiesMaster();
}
