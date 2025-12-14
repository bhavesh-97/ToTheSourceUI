import { Component, ElementRef, inject, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { FormFieldConfig } from '../../../Interfaces/FormFieldConfig';
import { PopupMessageType } from '../../../models/PopupMessageType';
import { NotificationService } from '../../../services/notification.service';
import { FormUtils } from '../../../shared/utilities/form-utils.ts';
import { ValidationRules } from '../../../shared/utilities/validation-rules.enum';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import { MenuMappingMasterService } from './menu-mapping-master.service';
import { MMenuMappingMaster } from './MenuMappingMaster';

@Component({
  selector: 'app-menu-mapping-master',
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
  templateUrl: './menu-mapping-master.html',
  styleUrl: './menu-mapping-master.css'
})
export class MenuMappingMaster {
  @ViewChild('dt') dt!: Table;
  @ViewChildren('inputField') inputElements!: QueryList<ElementRef>;
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(NotificationService);
  private MenuMappingMasterService = inject(MenuMappingMasterService);
  private fb = inject(FormBuilder); 
  private FormUtils = inject(FormUtils);
  private renderer = inject(Renderer2);
  MenuMapping: MMenuMappingMaster[] = [];
  loading: boolean = true;
  saving: boolean = false;
  searchValue: string = '';
  rows: number = 10;
  totalRecords: number = 0;
  displayDialog: boolean = false;
  MenuMappingDialogHeader: string = '';
  MenuMappingForm!: FormGroup; 

  private formFields: FormFieldConfig[] = [
    { name: 'MenuID', isMandatory: false, events: [] },
    { name: 'MenuName', isMandatory: true,validationMessage: 'Please enter a valid Menu Name.', events: [{ type: 'keypress', validationRule: ValidationRules.LettersWithWhiteSpace }] },
    { name: 'MenuURL', isMandatory: true,validationMessage: 'Please enter a valid Menu URL.', events: [] },
    { name: 'Icon', isMandatory: true,validationMessage: 'Please enter a valid Menu Icon.', events: [] },
    { name: 'MCommonEntitiesMaster.IsActive', isMandatory: false, validationMessage: '', events: [] },
  ];

  constructor(){
    this.MenuMappingForm = this.FormUtils.createFormGroup(this.formFields, this.fb);
  }
  ngOnInit() {
    this.loadData();
  }
  ngAfterViewInit() {
      this.FormUtils.registerFormFieldEventListeners(this.formFields, this.inputElements.toArray(), this.renderer,this.MenuMappingForm);
  }
  loadData() {
       this.loading = true;
       this.MenuMappingMasterService.GetAllMenuMappingDetails().subscribe({
          next: (res) => {
            console.log(res);
            if (!res.isError) {
              debugger;
              var response = JSON.parse(res.result);
              this.loading = false;
              this.MenuMapping = response;
              this.totalRecords = this.MenuMapping.length;
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
    this.MenuMappingForm.reset({
      MenuID: 0,
      MenuName: '',
      MenuURL: '',
      Icon: '',
      MCommonEntitiesMaster:{
        IsActive: true
      }
    });
    this.MenuMappingDialogHeader = 'Create New Menu';
    this.displayDialog = true;
  }

  editMenu(mapping: MMenuMappingMaster) {
    this.MenuMappingForm.patchValue({
      MenuID: mapping.MenuID,
      MenuName: mapping.MenuName,
      MenuURL:mapping.MenuURL,
      Icon:mapping.Icon,
       MCommonEntitiesMaster:{
        IsActive: mapping.MCommonEntitiesMaster.IsActive
      }
    });    
    this.MenuMappingDialogHeader = 'Edit Menu';
    this.displayDialog = true;
  }
  
  deleteMenu(mapping: MMenuMappingMaster) {
    this.confirmationService.confirm({
      key: 'MenuMappingDialog',
      message: `Are you sure you want to delete <b>${mapping.MenuName}</b>? This action cannot be undone.`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
            try {
                  this.MenuMappingMasterService.DeleteMenuMapping(mapping).subscribe({
                          next: (res) => {
                                    console.log(res);
                                    if (!res.isError) {
                                      this.MenuMappingForm.reset();
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

  async savemapping() {
    debugger;
    // Mark all controls as touched to show validation errors
    // this.markFormGroupTouched(this.MenuMappingForm);
    const outcome = this.FormUtils.validateFormFields(this.formFields, this.MenuMappingForm, this.inputElements.toArray(), this.renderer);
    if (outcome.isError) {
      this.messageService.showMessage(outcome.strMessage, outcome.title, outcome.type);
      return;
    }  
    const mappingModel = this.FormUtils.getAllFormFieldData(this.formFields, this.MenuMappingForm, this.inputElements.toArray(), MMenuMappingMaster);
    this.saving = true;
    try {
         this.MenuMappingMasterService.SaveMenuMapping(mappingModel).subscribe({
            next: (res) => {
                console.log(res);
                if (!res.isError) {
                  debugger;
                  // var response = JSON.parse(res.result);
                  const response = res.result;
                  this.MenuMappingForm.reset();
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
      this.messageService.showMessage('Failed to save Mapping. Please try again.', 'Error', PopupMessageType.Error);
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