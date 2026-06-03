import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, QueryList, Renderer2, signal, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { NotificationService } from '../../../services/notification.service';
import { PopupMessageType } from '../../../models/PopupMessageType';
import { TextEditorComponent } from '../../../@theme/components/WYSIWYG-Editors/text-editor';
import { Template, TemplateType } from './Template';
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { FormFieldConfig } from '../../../Interfaces/FormFieldConfig';
import { ValidationRules } from '../../../shared/utilities/validation-rules.enum';
import { ConfirmationService } from 'primeng/api';
import { FormUtils } from '../../../shared/utilities/form-utils';
import { TemplateMasterService } from './template-master.service';
import { Select } from "primeng/select";
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  selector: 'app-template-master',
  imports: [CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TableModule,
    TagModule,
    TextareaModule,
    ReactiveFormsModule,
    TextEditorComponent,
    ConfirmDialogModule,
    ToggleSwitchModule,
     IconField, InputIcon, Select],
  templateUrl: './template-master.html',
  styleUrl: './template-master.css'
})
export class TemplateMaster implements OnInit {
  
  @ViewChild('dt') dt!: Table;
  @ViewChildren('inputField') inputElements!: QueryList<ElementRef>;
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(NotificationService);
  private TemplateMasterService = inject(TemplateMasterService);
  private fb = inject(FormBuilder); 
  private FormUtils = inject(FormUtils);
  private renderer = inject(Renderer2);
  
  dialogVisible = false;
  isNew = false;
  loading: boolean = true;
  showImportDialog = false;
  importName = '';
  importType = '';
  importHtml = '';
  templetelist: Template[] = [];
  saving: boolean = false;
  searchValue: string = '';
  rows: number = 10;
  totalRecords: number = 0;
  roleDialogHeader: string = '';
  templateForm!: FormGroup;   
  templateTypes: TemplateType[] = [];
  selectedTemplateType: TemplateType | null = null;

   private formFields: FormFieldConfig[] = [
       { name: 'templateID', isMandatory: false, events: [] },
       { name: 'templateTypeID', isMandatory: true, validationMessage: 'Please select a Template Type.', events: [] },
       { name: 'templateName', isMandatory: true,validationMessage: 'Please enter a valid Template Name.', events: [{ type: 'keypress', validationRule: ValidationRules.LettersWithWhiteSpace }] },
       { name: 'templateCode', isMandatory: true,validationMessage: 'Please enter a valid Template Code.', events: [{ type: 'keypress', validationRule: ValidationRules.AlphanumericOnly }] },
       { name: 'templateContent', isMandatory: true,validationMessage: 'Please enter a valid data.', events: [] },
       { name: 'mCommonEntitiesMaster.isActive', isMandatory: false, validationMessage: '', events: [] },
     ];
  
  constructor(){
    this.templateForm = this.FormUtils.createFormGroup(this.formFields, this.fb);
  }
   ngOnInit() {
     this.loadData();
     this.loadTemplateTypes();
   }
  ngAfterViewInit() {
      this.FormUtils.registerFormFieldEventListeners(this.formFields, this.inputElements.toArray(), this.renderer,this.templateForm);
  }
   loadData() {
        this.loading = true;
        this.TemplateMasterService.GetAllTemplateDetails().subscribe({
           next: (res) => {
             if (!res.isError) {
               var response = typeof res.result === 'string' ? JSON.parse(res.result) : res.result;
               this.loading = false;
               this.templetelist = response;
               // console.log("templetelist",this.templetelist);
               this.totalRecords = this.templetelist.length;
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

   loadTemplateTypes() {
        this.TemplateMasterService.GetTemplateTypes().subscribe({
           next: (res) => {
             if (!res.isError) {
               var response = typeof res.result === 'string' ? JSON.parse(res.result) : res.result;
               this.templateTypes = response;
               // console.log("templateTypes", this.templateTypes);
             } else {
               this.messageService.showMessage(res.strMessage, res.title, res.type);
             }
           },
           error: () => {
             this.messageService.showMessage(
               'Something went wrong while connecting to the server.',
               'Error',
               PopupMessageType.Error
             );
           }
         });
   }
   openDialog(isNew: boolean, tpl?: Template) {
     // debugger;
     this.isNew = isNew;
     if (isNew) {
       this.templateForm.reset( {
         templateID: 0,
         templateTypeID: 0,
         templateName: '',
         templateCode: '',
         mCommonEntitiesMaster:{
             isActive: true
         },
         templateContent: ''
       });
     } 
     else if (tpl) {
       this.templateForm.patchValue({
         templateID: tpl.templateID,
         templateTypeID: tpl.templateTypeID,
         templateName: tpl.templateName,
         templateCode: tpl.templateCode,
         templateContent: tpl.templateContent,
         mCommonEntitiesMaster:{
             isActive: tpl.mCommonEntitiesMaster?.isActive
         },
       });
     }
     this.dialogVisible = true;
   }
  deletetemplate(temp: Template) {
    this.confirmationService.confirm({
      key: 'roleDialog',
      message: `Are you sure you want to delete <b>${temp.templateName}</b>? This action cannot be undone.`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
            try {
                  this.TemplateMasterService.DeleteTemplate(temp.templateID).subscribe({
                          next: (res) => {
                                    if (!res.isError) {
                                      this.templateForm.reset();
                                      this.loadData();
                                      this.messageService.showMessage(res.strMessage, res.title, res.type);
                                      this.dialogVisible = false;
                                    } else {
                                      this.messageService.showMessage(res.strMessage, res.title, res.type);
                                  }
                              },
                          error: (e) => {
                                this.messageService.showMessage('Something went wrong while connecting to the server.','Error',PopupMessageType.Error);
                              }
                        });
              } catch (error) {
                    this.messageService.showMessage('Failed to delete role. Please try again.', 'Error', PopupMessageType.Error);
              } finally {
                    this.dialogVisible = false;
              } 
        }
    });
  }

  async SaveTemplate() {
    // debugger;
     if (this.templateForm.invalid) {

    this.templateForm.markAllAsTouched();

    Object.keys(this.templateForm.controls).forEach(key => {

      const control = this.templateForm.get(key);

      if (control?.invalid) {
        console.log('Invalid Field:', key);
        console.log('Errors:', control.errors);
      }
    });

    return;
  }

  // console.log(this.templateForm.value);
    // Mark all controls as touched to show validation errors
    // this.markFormGroupTouched(this.roleForm);
    const outcome = this.FormUtils.validateFormFields(this.formFields, this.templateForm, this.inputElements.toArray(), this.renderer);
    if (outcome.isError) {
      this.messageService.showMessage(outcome.strMessage, outcome.title, outcome.type);
      return;
    }  
    // const tempModel = this.templateForm.getRawValue();

    // console.log(JSON.stringify(tempModel, null, 2));

    const tempModel = this.FormUtils.getAllFormFieldData(this.formFields, this.templateForm, this.inputElements.toArray(), Template);
    this.saving = true;
    try {
         this.TemplateMasterService.SaveTemplate(tempModel).subscribe({
            next: (res) => {
                if (!res.isError) {
                  // debugger;
                  // var response = JSON.parse(res.result);
                  const response = res.result;
                  this.templateForm.reset();
                  this.loadData();
                  this.messageService.showMessage(res.strMessage, res.title, res.type);
                  this.dialogVisible = false;
                } else {
                  this.messageService.showMessage(res.strMessage, res.title, res.type);
              }
            },
            error: (e) => {
                 console.error('Error saving template:', e);
                this.messageService.showMessage('Something went wrong while connecting to the server.','Error',PopupMessageType.Error);
              }
          });
    } catch (error) {
      this.messageService.showMessage('Failed to save role. Please try again.', 'Error', PopupMessageType.Error);
    } finally {
      this.saving = false;
      this.dialogVisible = false;
    }
  }
}