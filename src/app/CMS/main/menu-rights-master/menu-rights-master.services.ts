import { Injectable } from '@angular/core';
import { JsonResponseModel } from '../../../models/JsonResponseModel';
import { delay, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AdminOption, MMenuRightsMaster, RoleOption, SaveMenuRightsRequest } from './MMenuRightsMaster';
import { MCommonEntitiesMaster } from '../../../models/MCommonEntitiesMaster';
import { MMenuMappingMaster } from '../menu-mapping-master/MenuMappingMaster';
import { PopupMessageType } from '../../../models/PopupMessageType';

@Injectable({
  providedIn: 'root'
})
export class MenuRightsMasterServices {
   private baseUrl = 'api/MenuRightsMaster';

  constructor(private http: HttpClient) { }

  // Get all roles for dropdown
  // GetAllRoles(): Observable<JsonResponseModel> {
  //   return this.http.get<JsonResponseModel>(`${this.baseUrl}/GetAllRoles`);
  // }
    GetAllRoles(): Observable<JsonResponseModel> {
    const response: JsonResponseModel = {
      isError: false,
      result: JSON.stringify(this.mockRoles),
      strMessage: 'Roles retrieved successfully',
      title: PopupMessageType.Success,
      type: PopupMessageType.Success
    };
    return of(response).pipe(delay(500));
  }
  // Get all admins for dropdown
  // GetAllAdmins(): Observable<JsonResponseModel> {
  //   return this.http.get<JsonResponseModel>(`${this.baseUrl}/GetAllAdmins`);
  // }
  GetAllAdmins(): Observable<JsonResponseModel> {
    const response: JsonResponseModel = {
      isError: false,
      result: JSON.stringify(this.mockAdmins),
      strMessage: 'Admins retrieved successfully',
      title: PopupMessageType.Success,
      type: PopupMessageType.Success
    };
    return of(response).pipe(delay(500));
  }
  // Get menu rights by entity (Role/Admin)
  // GetMenuRightsByEntity(entityID: number, entityType: 'Role' | 'Admin'): Observable<JsonResponseModel> {
  //   return this.http.get<JsonResponseModel>(
  //     `${this.baseUrl}/GetRightsByEntity/${entityID}/${entityType}`
  //   );
  // }
 GetMenuRightsByEntity(entityID: number, entityType: 'Role' | 'Admin'): Observable<JsonResponseModel> {
    let rightsData: any[] = [];
    
    if (entityType === 'Role') {
      switch(entityID) {
        case 1: // Super Admin
          rightsData = this.mockSuperAdminRights;
          break;
        case 2: // Admin
          rightsData = this.mockAdminRights;
          break;
        case 5: // Viewer
          rightsData = this.mockViewerRights;
          break;
        default:
          // Return empty rights for other roles
          rightsData = this.mockMenuMappings.map(item => ({
            MenuID: item.MenuID,
            Rights: { CanView: false, CanInsert: false, CanUpdate: false, CanDelete: false }
          }));
      }
    } else if (entityType === 'Admin') {
      switch(entityID) {
        case 1: // John Doe
          rightsData = this.mockAdmin1Rights;
          break;
        default:
          // Return empty rights for other admins
          rightsData = this.mockMenuMappings.map(item => ({
            MenuID: item.MenuID,
            Rights: { CanView: false, CanInsert: false, CanUpdate: false, CanDelete: false }
          }));
      }
    }
    const fullRightsData: any[] = rightsData.map(rightItem => {
      const menuMapping = this.mockMenuMappings.find(m => m.MenuID === rightItem.MenuID);
      if (!menuMapping) return null;

      return {
        RightsID: entityID * 1000 + menuMapping.MenuID,
        MappingID: menuMapping.MappingID,
        MenuID: menuMapping.MenuID,
        MenuName: menuMapping.MenuName,
        MenuURL: menuMapping.MenuURL,
        Icon: menuMapping.Icon,
        MenuTypeID: menuMapping.MenuTypeID,
        ParentID: menuMapping.ParentID,
        MenuRank: menuMapping.MenuRank,
        SiteAreaID: menuMapping.SiteAreaID,
        AreaName: menuMapping.AreaName,
        Rights: rightItem.Rights,
        IsActive: true,
        EntityID: entityID,
        EntityType: entityType,
        RoleID: entityType === 'Role' ? entityID : 0,
        AdminID: entityType === 'Admin' ? entityID : 0,
        MCommonEntitiesMaster: menuMapping.MCommonEntitiesMaster
      };
    }).filter(item => item !== null);

    const response: JsonResponseModel = {
      isError: false,
      result: JSON.stringify(fullRightsData),
      strMessage: `Rights for ${entityType} ID ${entityID} retrieved successfully`,
      title: PopupMessageType.Success,
      type: PopupMessageType.Error
    };
    return of(response).pipe(delay(800));
  }

  // Get all menu mapping for tree structure
  // GetAllMenuMappingDetails(): Observable<JsonResponseModel> {
  //   return this.http.get<JsonResponseModel>(`${this.baseUrl}/GetAllMenuMappings`);
  // }
  GetAllMenuMappingDetails(): Observable<JsonResponseModel> {
    const response: JsonResponseModel = {
      isError: false,
      result: JSON.stringify(this.mockMenuMappings),
      strMessage: 'Menu mappings retrieved successfully',
      title: PopupMessageType.Success,
      type: PopupMessageType.Success
    };
    return of(response).pipe(delay(700));
  }
  // Save menu rights
  // SaveMenuRights(request: SaveMenuRightsRequest): Observable<JsonResponseModel> {
  //   return this.http.post<JsonResponseModel>(`${this.baseUrl}/SaveMenuRights`, request);
  // }
  SaveMenuRights(request: SaveMenuRightsRequest): Observable<JsonResponseModel> {
    console.log('Saving rights:', request);
    
    // Simulate save operation
    const response: JsonResponseModel = {
      isError: false,
      result: JSON.stringify({
        success: true,
        entityID: request.EntityID,
        entityType: request.EntityType
      }),
      strMessage: `Menu rights saved successfully for ${request.EntityType} ID ${request.EntityID}`,
      title: PopupMessageType.Success,
      type: PopupMessageType.Success
    };
    return of(response).pipe(delay(1000));
  }
  // Copy rights from one entity to another
  // CopyRights(fromEntityID: number, fromEntityType: 'Role' | 'Admin', 
  //            toEntityID: number, toEntityType: 'Role' | 'Admin'): Observable<JsonResponseModel> {
  //   return this.http.post<JsonResponseModel>(`${this.baseUrl}/CopyRights`, {
  //     fromEntityID,
  //     fromEntityType,
  //     toEntityID,
  //     toEntityType
  //   });
  // }
 CopyRights(fromEntityID: number, fromEntityType: 'Role' | 'Admin', 
             toEntityID: number, toEntityType: 'Role' | 'Admin'): Observable<JsonResponseModel> {
    console.log('Copying rights:', { fromEntityID, fromEntityType, toEntityID, toEntityType });
    
    // Simulate copy operation
    const response: JsonResponseModel = {
      isError: false,
      result: JSON.stringify({ 
        success: true, 
        fromEntityID, 
        fromEntityType, 
        toEntityID, 
        toEntityType 
      }),
      strMessage: `Rights copied successfully from ${fromEntityType} ID ${fromEntityID} to ${toEntityType} ID ${toEntityID}`,
      title: PopupMessageType.Success,
      type:PopupMessageType.Success
    };
    return of(response).pipe(delay(1200));
  }
    // Mock Data
  private mockRoles: RoleOption[] = [
    { RoleID: 1, RoleName: 'Super Admin', RoleCode: 'SA' },
    { RoleID: 2, RoleName: 'Admin', RoleCode: 'AD' },
    { RoleID: 3, RoleName: 'Manager', RoleCode: 'MG' },
    { RoleID: 4, RoleName: 'User', RoleCode: 'US' },
    { RoleID: 5, RoleName: 'Viewer', RoleCode: 'VR' },
    { RoleID: 6, RoleName: 'Editor', RoleCode: 'ED' }
  ];

  private mockAdmins: AdminOption[] = [
    { AdminID: 1, AdminName: 'John Doe', Email: 'john.doe@example.com' },
    { AdminID: 2, AdminName: 'Jane Smith', Email: 'jane.smith@example.com' },
    { AdminID: 3, AdminName: 'Robert Johnson', Email: 'robert.j@example.com' },
    { AdminID: 4, AdminName: 'Emily Davis', Email: 'emily.d@example.com' },
    { AdminID: 5, AdminName: 'Michael Wilson', Email: 'michael.w@example.com' }
  ];

  // Sample menu mappings
  public mockMenuMappings: MMenuMappingMaster[] = [
    {
      MappingID: 1,
      MenuID: 1,
      MenuName: 'Dashboard',
      MenuURL: '/dashboard',
      Icon: 'pi pi-home',
      MenuTypeID: 1,
      MenuTypeCode: 'MAIN',
      MenuTypeName: 'Main Menu',
      MenuRank: 1,
      ParentID: 0,
      ParentMenuName: '',
      ParentMenuURL: '',
      ParentMenuIcon: '',
      SiteAreaID: 1,
      AreaName: 'Admin Panel',
      MCommonEntitiesMaster: { IsActive: true }
    },
    {
      MappingID: 2,
      MenuID: 2,
      MenuName: 'User Management',
      MenuURL: '/users',
      Icon: 'pi pi-users',
      MenuTypeID: 1,
      MenuTypeCode: 'MAIN',
      MenuTypeName: 'Main Menu',
      MenuRank: 2,
      ParentID: 0,
      ParentMenuName: '',
      ParentMenuURL: '',
      ParentMenuIcon: '',
      SiteAreaID: 1,
      AreaName: 'Admin Panel',
      MCommonEntitiesMaster: { IsActive: true }
    },
    {
      MappingID: 3,
      MenuID: 3,
      MenuName: 'Add User',
      MenuURL: '/users/add',
      Icon: 'pi pi-user-plus',
      MenuTypeID: 2,
      MenuTypeCode: 'SUB',
      MenuTypeName: 'Sub Menu',
      MenuRank: 1,
      ParentID: 2,
      ParentMenuName: 'User Management',
      ParentMenuURL: '/users',
      ParentMenuIcon: 'pi pi-users',
      SiteAreaID: 1,
      AreaName: 'Admin Panel',
      MCommonEntitiesMaster: { IsActive: true }
    },
    {
      MappingID: 4,
      MenuID: 4,
      MenuName: 'Edit User',
      MenuURL: '/users/edit',
      Icon: 'pi pi-user-edit',
      MenuTypeID: 3,
      MenuTypeCode: 'ACTION',
      MenuTypeName: 'Action',
      MenuRank: 2,
      ParentID: 2,
      ParentMenuName: 'User Management',
      ParentMenuURL: '/users',
      ParentMenuIcon: 'pi pi-users',
      SiteAreaID: 1,
      AreaName: 'Admin Panel',
      MCommonEntitiesMaster: { IsActive: true }
    },
    {
      MappingID: 5,
      MenuID: 5,
      MenuName: 'Delete User',
      MenuURL: '/users/delete',
      Icon: 'pi pi-user-minus',
      MenuTypeID: 3,
      MenuTypeCode: 'ACTION',
      MenuTypeName: 'Action',
      MenuRank: 3,
      ParentID: 2,
      ParentMenuName: 'User Management',
      ParentMenuURL: '/users',
      ParentMenuIcon: 'pi pi-users',
      SiteAreaID: 1,
      AreaName: 'Admin Panel',
      MCommonEntitiesMaster: { IsActive: true }
    },
    {
      MappingID: 6,
      MenuID: 6,
      MenuName: 'Content Management',
      MenuURL: '/cms',
      Icon: 'pi pi-file',
      MenuTypeID: 1,
      MenuTypeCode: 'MAIN',
      MenuTypeName: 'Main Menu',
      MenuRank: 3,
      ParentID: 0,
      ParentMenuName: '',
      ParentMenuURL: '',
      ParentMenuIcon: '',
      SiteAreaID: 1,
      AreaName: 'Admin Panel',
      MCommonEntitiesMaster: { IsActive: true }
    },
    {
      MappingID: 7,
      MenuID: 7,
      MenuName: 'Articles',
      MenuURL: '/cms/articles',
      Icon: 'pi pi-book',
      MenuTypeID: 2,
      MenuTypeCode: 'SUB',
      MenuTypeName: 'Sub Menu',
      MenuRank: 1,
      ParentID: 6,
      ParentMenuName: 'Content Management',
      ParentMenuURL: '/cms',
      ParentMenuIcon: 'pi pi-file',
      SiteAreaID: 1,
      AreaName: 'Admin Panel',
      MCommonEntitiesMaster: { IsActive: true }
    },
    {
      MappingID: 8,
      MenuID: 8,
      MenuName: 'Categories',
      MenuURL: '/cms/categories',
      Icon: 'pi pi-tags',
      MenuTypeID: 2,
      MenuTypeCode: 'SUB',
      MenuTypeName: 'Sub Menu',
      MenuRank: 2,
      ParentID: 6,
      ParentMenuName: 'Content Management',
      ParentMenuURL: '/cms',
      ParentMenuIcon: 'pi pi-file',
      SiteAreaID: 1,
      AreaName: 'Admin Panel',
      MCommonEntitiesMaster: { IsActive: true }
    },
    {
      MappingID: 9,
      MenuID: 9,
      MenuName: 'Add Article',
      MenuURL: '/cms/articles/add',
      Icon: 'pi pi-plus-circle',
      MenuTypeID: 3,
      MenuTypeCode: 'ACTION',
      MenuTypeName: 'Action',
      MenuRank: 1,
      ParentID: 7,
      ParentMenuName: 'Articles',
      ParentMenuURL: '/cms/articles',
      ParentMenuIcon: 'pi pi-book',
      SiteAreaID: 1,
      AreaName: 'Admin Panel',
      MCommonEntitiesMaster: { IsActive: true }
    },
    {
      MappingID: 10,
      MenuID: 10,
      MenuName: 'Edit Article',
      MenuURL: '/cms/articles/edit',
      Icon: 'pi pi-pencil',
      MenuTypeID: 3,
      MenuTypeCode: 'ACTION',
      MenuTypeName: 'Action',
      MenuRank: 2,
      ParentID: 7,
      ParentMenuName: 'Articles',
      ParentMenuURL: '/cms/articles',
      ParentMenuIcon: 'pi pi-book',
      SiteAreaID: 1,
      AreaName: 'Admin Panel',
      MCommonEntitiesMaster: { IsActive: true }
    },
    {
      MappingID: 11,
      MenuID: 11,
      MenuName: 'Settings',
      MenuURL: '/settings',
      Icon: 'pi pi-cog',
      MenuTypeID: 1,
      MenuTypeCode: 'MAIN',
      MenuTypeName: 'Main Menu',
      MenuRank: 4,
      ParentID: 0,
      ParentMenuName: '',
      ParentMenuURL: '',
      ParentMenuIcon: '',
      SiteAreaID: 1,
      AreaName: 'Admin Panel',
      MCommonEntitiesMaster: { IsActive: true }
    },
    {
      MappingID: 12,
      MenuID: 12,
      MenuName: 'System Settings',
      MenuURL: '/settings/system',
      Icon: 'pi pi-server',
      MenuTypeID: 2,
      MenuTypeCode: 'SUB',
      MenuTypeName: 'Sub Menu',
      MenuRank: 1,
      ParentID: 11,
      ParentMenuName: 'Settings',
      ParentMenuURL: '/settings',
      ParentMenuIcon: 'pi pi-cog',
      SiteAreaID: 1,
      AreaName: 'Admin Panel',
      MCommonEntitiesMaster: { IsActive: true }
    },
    {
      MappingID: 13,
      MenuID: 13,
      MenuName: 'User Settings',
      MenuURL: '/settings/user',
      Icon: 'pi pi-user-cog',
      MenuTypeID: 2,
      MenuTypeCode: 'SUB',
      MenuTypeName: 'Sub Menu',
      MenuRank: 2,
      ParentID: 11,
      ParentMenuName: 'Settings',
      ParentMenuURL: '/settings',
      ParentMenuIcon: 'pi pi-cog',
      SiteAreaID: 1,
      AreaName: 'Admin Panel',
      MCommonEntitiesMaster: { IsActive: true }
    }
  ];

  // Mock rights data for Role ID 1 (Super Admin)
  private mockSuperAdminRights: MMenuRightsMaster[] = [
    {
      MenuID: 1, MRights: { CanView: true, CanInsert: false, CanUpdate: false, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 2, MRights: { CanView: true, CanInsert: true, CanUpdate: true, CanDelete: true },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 3, MRights: { CanView: true, CanInsert: true, CanUpdate: false, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 4, MRights: { CanView: true, CanInsert: false, CanUpdate: true, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 5, MRights: { CanView: true, CanInsert: false, CanUpdate: false, CanDelete: true },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 6, MRights: { CanView: true, CanInsert: true, CanUpdate: true, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 7, MRights: { CanView: true, CanInsert: true, CanUpdate: true, CanDelete: true },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 8, MRights: { CanView: true, CanInsert: true, CanUpdate: true, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 9, MRights: { CanView: true, CanInsert: true, CanUpdate: false, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 10, MRights: { CanView: true, CanInsert: false, CanUpdate: true, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 11, MRights: { CanView: true, CanInsert: false, CanUpdate: true, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 12, MRights: { CanView: true, CanInsert: false, CanUpdate: true, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 13, MRights: { CanView: true, CanInsert: false, CanUpdate: true, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    }
  ];

  // Mock rights data for Role ID 2 (Admin)
  private mockAdminRights: MMenuRightsMaster[] = [
    {
      MenuID: 1, MRights: { CanView: true, CanInsert: false, CanUpdate: false, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 2, MRights: { CanView: true, CanInsert: true, CanUpdate: true, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 3, MRights: { CanView: true, CanInsert: true, CanUpdate: false, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 4, MRights: { CanView: true, CanInsert: false, CanUpdate: true, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 5, MRights: { CanView: true, CanInsert: false, CanUpdate: false, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 6, MRights: { CanView: true, CanInsert: true, CanUpdate: true, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 7, MRights: { CanView: true, CanInsert: true, CanUpdate: true, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 8, MRights: { CanView: true, CanInsert: true, CanUpdate: true, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 9, MRights: { CanView: true, CanInsert: true, CanUpdate: false, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 10, MRights: { CanView: true, CanInsert: false, CanUpdate: true, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 11, MRights: { CanView: true, CanInsert: false, CanUpdate: false, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 12, MRights: { CanView: true, CanInsert: false, CanUpdate: false, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 13, MRights: { CanView: true, CanInsert: false, CanUpdate: false, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    }
  ];

  // Mock rights data for Role ID 5 (Viewer)
  private mockViewerRights: MMenuRightsMaster[] = [
    {
      MenuID: 1, MRights: { CanView: true, CanInsert: false, CanUpdate: false, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 2, MRights: { CanView: true, CanInsert: false, CanUpdate: false, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 3, MRights: { CanView: true, CanInsert: false, CanUpdate: false, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 4, MRights: { CanView: true, CanInsert: false, CanUpdate: false, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 5, MRights: { CanView: true, CanInsert: false, CanUpdate: false, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 6, MRights: { CanView: true, CanInsert: false, CanUpdate: false, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 7, MRights: { CanView: true, CanInsert: false, CanUpdate: false, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 8, MRights: { CanView: true, CanInsert: false, CanUpdate: false, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 9, MRights: { CanView: false, CanInsert: false, CanUpdate: false, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 10, MRights: { CanView: false, CanInsert: false, CanUpdate: false, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 11, MRights: { CanView: false, CanInsert: false, CanUpdate: false, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 12, MRights: { CanView: false, CanInsert: false, CanUpdate: false, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 13, MRights: { CanView: false, CanInsert: false, CanUpdate: false, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    }
  ];

  // Mock Admin ID 1 rights
  private mockAdmin1Rights: MMenuRightsMaster[] = [
    {
      MenuID: 1, MRights: { CanView: true, CanInsert: false, CanUpdate: false, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 2, MRights: { CanView: true, CanInsert: true, CanUpdate: true, CanDelete: true },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 3, MRights: { CanView: true, CanInsert: true, CanUpdate: false, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 4, MRights: { CanView: true, CanInsert: false, CanUpdate: true, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 5, MRights: { CanView: true, CanInsert: false, CanUpdate: false, CanDelete: true },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 6, MRights: { CanView: true, CanInsert: true, CanUpdate: true, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 7, MRights: { CanView: true, CanInsert: true, CanUpdate: true, CanDelete: true },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 8, MRights: { CanView: true, CanInsert: true, CanUpdate: true, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 9, MRights: { CanView: true, CanInsert: true, CanUpdate: false, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 10, MRights: { CanView: true, CanInsert: false, CanUpdate: true, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 11, MRights: { CanView: true, CanInsert: false, CanUpdate: true, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 12, MRights: { CanView: true, CanInsert: false, CanUpdate: true, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    },
    {
      MenuID: 13, MRights: { CanView: true, CanInsert: false, CanUpdate: true, CanDelete: false },
      MappingID: 0,
      RoleID: 0,
      AdminID: 0,
      EntityID: 0,
      EntityType: 'Role',
      MMenuMappingMaster: new MMenuMappingMaster,
      MCommonEntitiesMaster: new MCommonEntitiesMaster
    }
  ];

}
