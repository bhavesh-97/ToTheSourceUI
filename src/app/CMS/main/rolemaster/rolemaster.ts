import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'; 
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
import { FormFieldConfig } from '../../../Interfaces/FormFieldConfig';
import { ValidationRules } from '../../../shared/utilities/validation-rules.enum';
import { FormUtils } from '../../../shared/utilities/form-utils.ts';

@Component({
  selector: 'app-rolemaster',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
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
  @ViewChildren('inputField') inputElements!: QueryList<ElementRef>;
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(NotificationService);
  private fb = inject(FormBuilder); 
  private FormUtils = inject(FormUtils);
  private renderer = inject(Renderer2);
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

  ngOnInit() {
    this.loadData();
  }
  private formFields: FormFieldConfig[] = [
    { name: 'RoleID', isMandatory: false, events: [] },
    { name: 'RoleName', isMandatory: false,validationMessage: 'Please enter a valid Role Name.', events: [{ type: 'keypress', validationRule: ValidationRules.LettersWithWhiteSpace }] },
    { name: 'isActive', isMandatory: false, validationMessage: '', events: [] },
  ];

  constructor(){
    debugger
    this.roleForm = this.FormUtils.createFormGroup(this.formFields, this.fb);
   }
    ngAfterViewInit() {
      this.FormUtils.registerFormFieldEventListeners(this.formFields, this.inputElements.toArray(), this.renderer,this.roleForm);
    }
  loadData() {
    this.loading = true;
    setTimeout(() => {
      this.roles = [
        { 
          RoleID: 1, 
          RoleName: 'User', 
          MCommonEntitiesMaster :{
            isActive: true
          }
        },
        { 
          RoleID: 2, 
          RoleName: 'Tester', 
          MCommonEntitiesMaster :{
            isActive: true
          }
        },
        { 
          RoleID: 3, 
          RoleName: 'Support', 
          MCommonEntitiesMaster :{
            isActive: false
          }
        },
        { 
          RoleID: 10, 
          RoleName: 'Administrator',  
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
      RoleID: 0,
      RoleName: '',
      isActive: true
    });
    this.roleDialogHeader = 'Create New Role';
    this.displayDialog = true;
  }

  // Edit existing role
  editRole(role: RoleMaster) {
    this.roleForm.patchValue({
      RoleID: role.RoleID,
      RoleName: role.RoleName,
      isActive: role.MCommonEntitiesMaster.isActive
    });    
    this.roleDialogHeader = 'Edit Role';
    this.displayDialog = true;
  }
  async saveRole() {
    debugger;
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

      if (newRole.RoleID === 0) {
        newRole.RoleID = Date.now();
        this.roles = [...this.roles, newRole];
        this.messageService.showMessage('Role created successfully!', 'Success', PopupMessageType.Success);
      } else {
        this.roles = this.roles.map(r => 
          r.RoleID === newRole.RoleID ? newRole : r
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
      message: `Are you sure you want to delete <b>${role.RoleName}</b>? This action cannot be undone.`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.roles = this.roles.filter(r => r.RoleID !== role.RoleID);
        this.totalRecords = this.roles.length;
        this.selectedRoles = this.selectedRoles.filter(r => r.RoleID !== role.RoleID);
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
        const deletedIds = this.selectedRoles.map(r => r.RoleID);
        this.roles = this.roles.filter(r => !deletedIds.includes(r.RoleID));
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