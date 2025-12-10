import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Added
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { NotificationService } from '../../../services/notification.service';
import { PopupMessageType } from '../../../models/PopupMessageType';
import { RoleMaster } from './MRoleMaster';
import { ConfirmationService } from 'primeng/api';


@Component({
  selector: 'app-rolemaster',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, // Changed from FormsModule
    RouterModule,
    ButtonModule, 
    TableModule, 
    TagModule, 
    SelectModule,
    IconFieldModule,
    InputIconModule,
    ToggleSwitchModule,
    InputTextModule,
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
  private fb = inject(FormBuilder); 
  roles: RoleMaster[] = [];
  selectedRoles: RoleMaster[] = [];
  loading: boolean = true;
  saving: boolean = false;
  searchValue: string = '';
  rows: number = 10;
  totalRecords: number = 0;
  displayDialog: boolean = false;
  roleDialogHeader: string = '';
  roleForm!: FormGroup; 
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
 
  ngOnInit() {
    this.initializeForm(); 
    this.loadData();
  }
  initializeForm() {
    this.roleForm = this.fb.group({
      roleID: [0],
      roleName: ['', [Validators.required, Validators.minLength(2)]],
      isActive: [true]
    });
  }

  loadData() {
    this.loading = true;
    setTimeout(() => {
      this.roles = [
        { 
          roleID: 1, 
          roleName: 'User', 
          MCommonEntitiesMaster :{
            isActive: true
          }
        },
        { 
          roleID: 2, 
          roleName: 'Tester', 
          MCommonEntitiesMaster :{
            isActive: true
          }
        },
        { 
          roleID: 3, 
          roleName: 'Support', 
          MCommonEntitiesMaster :{
            isActive: false
          }
        },
        { 
          roleID: 10, 
          roleName: 'Administrator',  
          MCommonEntitiesMaster :{
            isActive: true
          }
        }
      ];
      this.totalRecords = this.roles.length;
      this.loading = false;
    }, 800);
  }

  openNew() {
    this.roleForm.reset({
      roleID: 0,
      roleName: '',
      isActive: true
    });
    this.roleDialogHeader = 'Create New Role';
    this.displayDialog = true;
  }

  // Edit existing role
  editRole(role: RoleMaster) {
    this.roleForm.patchValue({
      roleID: role.roleID,
      roleName: role.roleName,
      isActive: role.MCommonEntitiesMaster.isActive
    });    
    this.roleDialogHeader = 'Edit Role';
    this.displayDialog = true;
  }
  async saveRole() {
    // Mark all controls as touched to show validation errors
    this.markFormGroupTouched(this.roleForm);
    
    if (this.roleForm.invalid) {
      this.messageService.showMessage('Please fill in all required fields correctly.', 'Validation Error', PopupMessageType.Warning);
      return;
    }

    this.saving = true;
    try {
      const formValue = this.roleForm.value;
      const newRole: RoleMaster = {
        ...formValue,
        permissionsMap: { ...formValue.permissionsMap }
      };

      if (newRole.roleID === 0) {
        newRole.roleID = Date.now();
        this.roles = [...this.roles, newRole];
        this.messageService.showMessage('Role created successfully!', 'Success', PopupMessageType.Success);
      } else {
        this.roles = this.roles.map(r => 
          r.roleID === newRole.roleID ? newRole : r
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

  // Helper to mark all form controls as touched
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  onRowsChange(event: any) {
    this.rows = event.value;
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