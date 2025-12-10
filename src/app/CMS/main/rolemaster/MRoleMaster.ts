export interface RoleMaster {
  roleID: number;
  roleName: string;
  isActive: boolean;
  permissions: string[]; // e.g., ['users:read', 'roles:delete']
  permissionsMap: { [key: string]: boolean }; // For checkbox binding
}