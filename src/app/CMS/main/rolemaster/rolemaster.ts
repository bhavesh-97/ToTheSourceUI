import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
// import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { NotificationService } from '../../../services/notification.service';
import { PopupMessageType } from '../../../models/PopupMessageType';
import { RoleMaster } from './MRoleMaster';
import { ConfirmationService } from 'primeng/api';

interface PermissionAction {
  key: string;
  label: string;
}

interface PermissionModule {
  name: string;
  key: string;
  actions: PermissionAction[];
}

@Component({
  selector: 'app-rolemaster',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule,
    ButtonModule, 
    TableModule, 
    TagModule, 
    SelectModule,
    IconFieldModule,
    InputIconModule,
    // InputSwitchModule,
    InputTextModule,
    // DropdownModule,
    DialogModule,
    ConfirmDialogModule,
    TooltipModule
  ],
  templateUrl: './rolemaster.html',
  styleUrl: './rolemaster.css',
  providers: [ConfirmationService]
})
export class Rolemaster implements OnInit {
  @ViewChild('dt') dt!: Table;
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(NotificationService);
  
  roles: RoleMaster[] = [];
  selectedRoles: RoleMaster[] = [];
  loading: boolean = true;
  saving: boolean = false;
  searchValue: string = '';
  rows: number = 10;
  totalRecords: number = 0;

  // Dialog properties
  displayDialog: boolean = false;
  roleDialogHeader: string = '';
  currentRole: RoleMaster = this.createEmptyRole();

  // Filter options
  statusFilterOptions = [
    { label: 'All', value: null },
    { label: 'Active', value: true, severity: 'success' },
    { label: 'Inactive', value: false, severity: 'danger' }
  ];
pageSizeOptions = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '25', value: 25 },
    { label: '50', value: 50 }
  ];
  // Permissions configuration
  permissionModules: PermissionModule[] = [
    {
      name: 'Users',
      key: 'users',
      actions: [
        { key: 'read', label: 'Read' },
        { key: 'create', label: 'Create' },
        { key: 'update', label: 'Update' },
        { key: 'delete', label: 'Delete' }
      ]
    },
    {
      name: 'Roles',
      key: 'roles',
      actions: [
        { key: 'read', label: 'Read' },
        { key: 'create', label: 'Create' },
        { key: 'update', label: 'Update' },
        { key: 'delete', label: 'Delete' }
      ]
    },
    {
      name: 'Dashboard',
      key: 'dashboard',
      actions: [
        { key: 'view', label: 'View' },
        { key: 'export', label: 'Export' }
      ]
    }
    // Add more modules as needed
  ];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    setTimeout(() => {
      this.roles = [
        { 
          roleID: 1, 
          roleName: 'User', 
          isActive: true,
          permissions: ['users:read', 'dashboard:view'],
          permissionsMap: { 'users:read': true, 'dashboard:view': true }
        },
        { 
          roleID: 2, 
          roleName: 'Tester', 
          isActive: true,
          permissions: ['users:read', 'users:update', 'roles:read'],
          permissionsMap: { 'users:read': true, 'users:update': true, 'roles:read': true }
        },
        { 
          roleID: 3, 
          roleName: 'Support', 
          isActive: false,
          permissions: ['users:read'],
          permissionsMap: { 'users:read': true }
        },
        // Add more mock data...
        { 
          roleID: 10, 
          roleName: 'Administrator', 
          isActive: true,
          permissions: ['users:*', 'roles:*', 'dashboard:*'], // Full access simulation
          permissionsMap: {} // Populate all true
        }
      ].map(role => ({
        ...role,
        permissionsMap: this.generatePermissionsMap(role.permissions)
      }));
      this.totalRecords = this.roles.length;
      this.loading = false;
    }, 800);
  }

  private generatePermissionsMap(permissions: string[]): { [key: string]: boolean } {
    const map: { [key: string]: boolean } = {};
    permissions.forEach(perm => map[perm] = true);
    // Ensure all possible permissions are initialized
    this.permissionModules.forEach(module => {
      module.actions.forEach(action => {
        const fullKey = `${module.key}:${action.key}`;
        if (map[fullKey] === undefined) map[fullKey] = false;
      });
    });
    return map;
  }

createEmptyRole(): RoleMaster {
  const map: Record<string, boolean> = {};

  // Safe guard – if permissionModules is not yet initialized
  if (this.permissionModules && Array.isArray(this.permissionModules)) {
    this.permissionModules.forEach(mod => {
      mod.actions.forEach(act => {
        map[`${mod.key}:${act.key}`] = false;
      });
    });
  }

  return {
    roleID: 0,
    roleName: '',
    isActive: true,
    permissions: [],
    permissionsMap: map
  };
}
  openNew() {
    this.currentRole = { ...this.createEmptyRole() };
    this.roleDialogHeader = 'Create New Role';
    this.displayDialog = true;
  }

  editRole(role: RoleMaster) {
    this.currentRole = { 
      ...role, 
      permissionsMap: { ...role.permissionsMap } // Deep copy
    };
    this.roleDialogHeader = 'Edit Role';
    this.displayDialog = true;
  }

  updatePermissionsArray() {
    this.currentRole.permissions = Object.keys(this.currentRole.permissionsMap).filter(key => this.currentRole.permissionsMap[key]);
  }

  async saveRole() {
    if (!this.currentRole.roleName.trim()) return;

    this.saving = true;
    try {
      this.updatePermissionsArray();
      if (this.currentRole.roleID === 0) {
        this.currentRole.roleID = Date.now();
        this.roles = [...this.roles, { ...this.currentRole }];
        this.messageService.showMessage('Role created successfully!', 'Success', PopupMessageType.Success);
      } else {
        this.roles = this.roles.map(r => 
          r.roleID === this.currentRole.roleID ? { ...this.currentRole } : r
        );
        this.messageService.showMessage('Role updated successfully!', 'Success', PopupMessageType.Success);
      }
      this.totalRecords = this.roles.length;
      this.displayDialog = false;
    } catch (error) {
      this.messageService.showMessage('Failed to save role. Please try again.', 'Error', PopupMessageType.Error);
    } finally {
      this.saving = false;
    }
  }

  getPermissionDisplay(perm: string): string {
    const [module, action] = perm.split(':');
    const mod = this.permissionModules.find(m => m.key === module);
    const act = mod?.actions.find(a => a.key === action);
    return act ? act.label : perm;
  }

  onRowsChange(event: any) {
    this.rows = event.value;
    // this.dt.paginator({ first: 0, rows: this.rows, page: 0 });
  }

  deleteRole(role: RoleMaster) {
    this.confirmationService.confirm({
      key: 'roleDialog',
      message: `Are you sure you want to delete <b>${role.roleName}</b>? This action cannot be undone.`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.roles = this.roles.filter(r => r.roleID !== role.roleID);
        this.totalRecords = this.roles.length;
        this.selectedRoles = this.selectedRoles.filter(r => r.roleID !== role.roleID);
        this.messageService.showMessage('Role deleted successfully!', 'Success', PopupMessageType.Success);
      }
    });
  }

  deleteSelectedRoles() {
    if (this.selectedRoles.length === 0) return;

    this.confirmationService.confirm({
      key: 'roleDialog',
      message: `Are you sure you want to delete the selected ${this.selectedRoles.length} roles?`,
      header: 'Confirm Bulk Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const deletedIds = this.selectedRoles.map(r => r.roleID);
        this.roles = this.roles.filter(r => !deletedIds.includes(r.roleID));
        this.selectedRoles = [];
        this.totalRecords = this.roles.length;
        this.messageService.showMessage(`${this.selectedRoles.length} roles deleted successfully!`, 'Success', PopupMessageType.Success);
      }
    });
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
    this.rows = 10;
  }

  getSeverity(isActive: boolean): 'success' | 'danger' | 'warning' {
    return isActive ? 'success' : 'danger';
  }

  getStatusText(isActive: boolean): string {
    return isActive ? 'Active' : 'Inactive';
  }
}