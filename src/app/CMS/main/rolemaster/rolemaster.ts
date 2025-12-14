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
import { MRoleMaster } from './MRoleMaster';
import { ConfirmationService } from 'primeng/api';
import { FormFieldConfig } from '../../../Interfaces/FormFieldConfig';
import { ValidationRules } from '../../../shared/utilities/validation-rules.enum';
import { FormUtils } from '../../../shared/utilities/form-utils.ts';
import { RolemasterService } from './rolemaster.service';

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
  styleUrl: './rolemaster.css'
})
export class Rolemaster implements OnInit {
  @ViewChild('dt') dt!: Table;
  @ViewChildren('inputField') inputElements!: QueryList<ElementRef>;
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(NotificationService);
  private RoleMasterService = inject(RolemasterService);
  private fb = inject(FormBuilder); 
  private FormUtils = inject(FormUtils);
  private renderer = inject(Renderer2);
  roles: MRoleMaster[] = [];
  selectedRoles: MRoleMaster[] = [];
  loading: boolean = true;
  saving: boolean = false;
  searchValue: string = '';
  rows: number = 10;
  totalRecords: number = 0;
  displayDialog: boolean = false;
  roleDialogHeader: string = '';
  roleForm!: FormGroup; 

  private formFields: FormFieldConfig[] = [
    { name: 'RoleID', isMandatory: false, events: [] },
    { name: 'RoleName', isMandatory: true,validationMessage: 'Please enter a valid Role Name.', events: [{ type: 'keypress', validationRule: ValidationRules.LettersWithWhiteSpace }] },
    { name: 'RoleLevel', isMandatory: true,validationMessage: 'Please enter a valid Role Level.', min:1, max:10, events: [{ type: 'keypress', validationRule: ValidationRules.NumberOnly },{ type: 'focusout', validationRule: ValidationRules.NumberOnly }] },
    { name: 'MCommonEntitiesMaster.IsActive', isMandatory: false, validationMessage: '', events: [] },
  ];

  constructor(){
    this.roleForm = this.FormUtils.createFormGroup(this.formFields, this.fb);
  }
  ngOnInit() {
    this.loadData();
  }
  ngAfterViewInit() {
      this.FormUtils.registerFormFieldEventListeners(this.formFields, this.inputElements.toArray(), this.renderer,this.roleForm);
  }
  loadData() {
       this.loading = true;
       this.RoleMasterService.GetAllRoleDetails().subscribe({
          next: (res) => {
            console.log(res);
            if (!res.isError) {
              debugger;
              var response = JSON.parse(res.result);
              this.loading = false;
              this.roles = response;
              
              console.log(this.roles);
              this.totalRecords = this.roles.length;
              // this.messageService.showMessage(res.strMessage, res.title, res.type);
            } else {
              this.messageService.showMessage(res.strMessage, res.title, res.type);
            }
          },
          error: () => {
            this.loading = false;
            this.messageService.showMessage(
              'Something went wrong while connecting to the server.',
              'Error',
              PopupMessageType.Error
            );
          }
        });
    // setTimeout(() => {
    //   this.roles = [
    //     { 
    //       RoleID: 1, 
    //       RoleName: 'User', 
    //       RoleLevel: 1, 
    //       MCommonEntitiesMaster :{
    //         isActive: true
    //       }
    //     },
    //     { 
    //       RoleID: 2, 
    //       RoleName: 'Tester', 
    //       RoleLevel: 2,
    //       MCommonEntitiesMaster :{
    //         isActive: true
    //       }
    //     },
    //     { 
    //       RoleID: 3, 
    //       RoleName: 'Support', 
    //       RoleLevel: 3,
    //       MCommonEntitiesMaster :{
    //         isActive: false
    //       }
    //     },
    //     { 
    //       RoleID: 10, 
    //       RoleName: 'Administrator',  
    //       RoleLevel: 1,
    //       MCommonEntitiesMaster :{
    //         isActive: true
    //       }
    //     }
    //   ];
    //   this.totalRecords = this.roles.length;
    //   this.loading = false;
    // }, 800);
  }

  openNew() {
    this.roleForm.reset({
      RoleID: 0,
      RoleName: '',
      RoleLevel: 0,
      MCommonEntitiesMaster:{
        IsActive: true
      }
    });
    this.roleDialogHeader = 'Create New Role';
    this.displayDialog = true;
  }

  editRole(role: MRoleMaster) {
    this.roleForm.patchValue({
      RoleID: role.RoleID,
      RoleName: role.RoleName,
      RoleLevel:role.RoleLevel,
       MCommonEntitiesMaster:{
        IsActive: role.MCommonEntitiesMaster.IsActive
      }
    });    
    this.roleDialogHeader = 'Edit Role';
    this.displayDialog = true;
  }
  
  deleteRole(role: MRoleMaster) {
    this.confirmationService.confirm({
      key: 'roleDialog',
      message: `Are you sure you want to delete <b>${role.RoleName}</b>? This action cannot be undone.`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
            try {
                  this.RoleMasterService.DeleteRole(role).subscribe({
                          next: (res) => {
                                    console.log(res);
                                    if (!res.isError) {
                                      this.roleForm.reset();
                                      this.loadData();
                                      this.messageService.showMessage(res.strMessage, res.title, res.type);
                                      this.displayDialog = false;
                                    } else {
                                      this.messageService.showMessage(res.strMessage, res.title, res.type);
                                  }
                              },
                          error: () => {
                                this.messageService.showMessage('Something went wrong while connecting to the server.','Error',PopupMessageType.Error);
                              }
                        });
              } catch (error) {
                    this.messageService.showMessage('Failed to delete role. Please try again.', 'Error', PopupMessageType.Error);
              } finally {
                    this.displayDialog = false;
              } 
        }
    });
  }

  async saveRole() {
    debugger;
    // Mark all controls as touched to show validation errors
    // this.markFormGroupTouched(this.roleForm);
    const outcome = this.FormUtils.validateFormFields(this.formFields, this.roleForm, this.inputElements.toArray(), this.renderer);
    if (outcome.isError) {
      this.messageService.showMessage(outcome.strMessage, outcome.title, outcome.type);
      return;
    }  
    const roleModel = this.FormUtils.getAllFormFieldData(this.formFields, this.roleForm, this.inputElements.toArray(), MRoleMaster);
    this.saving = true;
    try {
         this.RoleMasterService.SaveRole(roleModel).subscribe({
            next: (res) => {
                console.log(res);
                if (!res.isError) {
                  debugger;
                  // var response = JSON.parse(res.result);
                  const response = res.result;
                  this.roleForm.reset();
                  this.loadData();
                  this.messageService.showMessage(res.strMessage, res.title, res.type);
                  this.displayDialog = false;
                } else {
                  this.messageService.showMessage(res.strMessage, res.title, res.type);
              }
            },
            error: () => {
                this.messageService.showMessage('Something went wrong while connecting to the server.','Error',PopupMessageType.Error);
              }
          });
    } catch (error) {
      this.messageService.showMessage('Failed to save role. Please try again.', 'Error', PopupMessageType.Error);
    } finally {
      this.saving = false;
      this.displayDialog = false;
    }
  }


  clear(table: Table) {
    table.clear();
    this.searchValue = '';
    this.rows = 10;
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  getSeverity(isActive: boolean): 'success' | 'danger' | 'warning' {
    return isActive ? 'success' : 'danger';
  }

  getStatusText(isActive: boolean): string {
    return isActive ? 'Active' : 'Inactive';
  }
}