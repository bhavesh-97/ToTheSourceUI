import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import { Table, TableModule } from 'primeng/table';
import { NotificationService } from '../../../services/notification.service';
import { MenuResourceMasterService } from './menu-resource-master.service';
import { FormUtils } from '../../../shared/utilities/form-utils.ts';
import { MMenuResourceMaster } from './MenuResourceMaster';
import { FormFieldConfig } from '../../../Interfaces/FormFieldConfig';
import { ValidationRules } from '../../../shared/utilities/validation-rules.enum';
import { PopupMessageType } from '../../../models/PopupMessageType';
@Component({
  selector: 'app-menu-resource-master',
  imports: [   CommonModule, 
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
    TooltipModule],
  templateUrl: './menu-resource-master.html',
  styleUrl: './menu-resource-master.css',
  providers: [ConfirmationService]
})
export class MenuResourceMaster {
  @ViewChild('dt') dt!: Table;
  @ViewChildren('inputField') inputElements!: QueryList<ElementRef>;
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(NotificationService);
  private MenuResourceMasterService = inject(MenuResourceMasterService);
  private fb = inject(FormBuilder); 
  private FormUtils = inject(FormUtils);
  private renderer = inject(Renderer2);
  MenuResource: MMenuResourceMaster[] = [];
  loading: boolean = true;
  saving: boolean = false;
  searchValue: string = '';
  rows: number = 10;
  totalRecords: number = 0;
  displayDialog: boolean = false;
  MenuResourceDialogHeader: string = '';
  MenuResourceForm!: FormGroup; 

  private formFields: FormFieldConfig[] = [
    { name: 'MenuID', isMandatory: false, events: [] },
    { name: 'MenuName', isMandatory: true,validationMessage: 'Please enter a valid Menu Name.', events: [{ type: 'keypress', validationRule: ValidationRules.LettersWithWhiteSpace }] },
    { name: 'MenuURL', isMandatory: true,validationMessage: 'Please enter a valid Menu URL.', events: [] },
    { name: 'Icon', isMandatory: true,validationMessage: 'Please enter a valid Menu Icon.', events: [] },
    { name: 'MCommonEntitiesMaster.IsActive', isMandatory: false, validationMessage: '', events: [] },
  ];

  constructor(){
    this.MenuResourceForm = this.FormUtils.createFormGroup(this.formFields, this.fb);
  }
  ngOnInit() {
    this.loadData();
  }
  ngAfterViewInit() {
      this.FormUtils.registerFormFieldEventListeners(this.formFields, this.inputElements.toArray(), this.renderer,this.MenuResourceForm);
  }
  loadData() {
       this.loading = true;
       this.MenuResourceMasterService.GetAllMenuResourceDetails().subscribe({
          next: (res) => {
            console.log(res);
            if (!res.isError) {
              debugger;
              var response = JSON.parse(res.result);
              this.loading = false;
              this.MenuResource = response;
              this.totalRecords = this.MenuResource.length;
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
    }

  openNew() {
    this.MenuResourceForm.reset({
      MenuID: 0,
      MenuName: '',
      MenuURL: '',
      Icon: '',
      MCommonEntitiesMaster:{
        IsActive: true
      }
    });
    this.MenuResourceDialogHeader = 'Create New Menu';
    this.displayDialog = true;
  }

  editMenu(role: MMenuResourceMaster) {
    this.MenuResourceForm.patchValue({
      MenuID: role.MenuID,
      MenuName: role.MenuName,
      MenuURL:role.MenuURL,
      Icon:role.Icon,
       MCommonEntitiesMaster:{
        IsActive: role.MCommonEntitiesMaster.IsActive
      }
    });    
    this.MenuResourceDialogHeader = 'Edit Menu';
    this.displayDialog = true;
  }
  
  deleteMenu(role: MMenuResourceMaster) {
    this.confirmationService.confirm({
      key: 'MenuResourceDialog',
      message: `Are you sure you want to delete <b>${role.MenuName}</b>? This action cannot be undone.`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
            try {
                  this.MenuResourceMasterService.DeleteMenuResource(role).subscribe({
                          next: (res) => {
                                    console.log(res);
                                    if (!res.isError) {
                                      this.MenuResourceForm.reset();
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
                    this.messageService.showMessage('Failed to delete Menu. Please try again.', 'Error', PopupMessageType.Error);
              } finally {
                    this.displayDialog = false;
              } 
        }
    });
  }

  async saveRole() {
    debugger;
    // Mark all controls as touched to show validation errors
    // this.markFormGroupTouched(this.MenuResourceForm);
    const outcome = this.FormUtils.validateFormFields(this.formFields, this.MenuResourceForm, this.inputElements.toArray(), this.renderer);
    if (outcome.isError) {
      this.messageService.showMessage(outcome.strMessage, outcome.title, outcome.type);
      return;
    }  
    const roleModel = this.FormUtils.getAllFormFieldData(this.formFields, this.MenuResourceForm, this.inputElements.toArray(), MMenuResourceMaster);
    this.saving = true;
    try {
         this.MenuResourceMasterService.SaveMenuResource(roleModel).subscribe({
            next: (res) => {
                console.log(res);
                if (!res.isError) {
                  debugger;
                  // var response = JSON.parse(res.result);
                  const response = res.result;
                  this.MenuResourceForm.reset();
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
