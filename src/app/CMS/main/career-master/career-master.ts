import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { NotificationService } from '../../../services/notification.service';
import { PopupMessageType } from '../../../models/PopupMessageType';
import { MCareer } from './MCareer';
import { ConfirmationService } from 'primeng/api';
import { CareerMasterService } from './career-master.service';

@Component({
  selector: 'app-career-master',
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
    InputNumberModule,
    TextareaModule,
    DatePickerModule,
    DialogModule,
    ConfirmDialogModule,
    TooltipModule
  ],
  templateUrl: './career-master.html',
  styleUrl: './career-master.css'
})
export class CareerMaster implements OnInit {
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(NotificationService);
  private careerService = inject(CareerMasterService);
  private fb = inject(FormBuilder);

  careers: MCareer[] = [];
  loading: boolean = true;
  saving: boolean = false;
  searchValue: string = '';
  rows: number = 10;
  totalRecords: number = 0;
  displayDialog: boolean = false;
  dialogHeader: string = '';
  careerForm!: FormGroup;

  departmentOptions = ['Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Product', 'Support'];
  typeOptions = ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Freelance'];
  levelOptions = ['Entry-Level', 'Mid-Level', 'Senior-Level', 'Lead', 'Manager', 'Director'];

  constructor() {
    this.initForm();
  }

  ngOnInit() {
    this.loadData();
  }

  private initForm(model?: Partial<MCareer>) {
    const m = model || new MCareer();
    this.careerForm = this.fb.group({
      CareerID: [m.CareerID],
      Title: [m.Title, Validators.required],
      Department: [m.Department, Validators.required],
      Location: [m.Location, Validators.required],
      EmploymentType: [m.EmploymentType, Validators.required],
      ExperienceLevel: [m.ExperienceLevel, Validators.required],
      MinExperience: [m.MinExperience],
      MaxExperience: [m.MaxExperience],
      SalaryRange: [m.SalaryRange],
      Description: [m.Description, Validators.required],
      Requirements: [m.Requirements],
      Responsibilities: [m.Responsibilities],
      Benefits: [m.Benefits],
      IsRemote: [m.IsRemote],
      ApplicationUrl: [m.ApplicationUrl],
      ApplicationDeadline: [m.ApplicationDeadline],
      SortOrder: [m.SortOrder],
      MCommonEntitiesMaster: this.fb.group({
        isActive: [m.MCommonEntitiesMaster?.isActive ?? true]
      })
    });
  }

  loadData() {
    this.loading = true;
    this.careerService.GetAll().subscribe({
      next: (res) => {
        if (!res.isError) {
          this.careers = res.result as MCareer[];
          this.loading = false;
          this.totalRecords = this.careers.length;
        } else {
          this.messageService.showMessage(res.strMessage, res.title, res.type);
        }
      },
      error: () => {
        this.loading = false;
        this.messageService.showMessage('Something went wrong while connecting to the server.', 'Error', PopupMessageType.Error);
      }
    });
  }

  openNew() {
    this.initForm();
    this.dialogHeader = 'Create New Job Posting';
    this.displayDialog = true;
  }

  editCareer(career: MCareer) {
    this.initForm(career);
    this.dialogHeader = 'Edit Job Posting';
    this.displayDialog = true;
  }

  deleteCareer(career: MCareer) {
    this.confirmationService.confirm({
      key: 'careerDialog',
      message: `Are you sure you want to delete <b>${career.Title}</b>? This action cannot be undone.`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.careerService.Delete(career).subscribe({
          next: (res) => {
            if (!res.isError) {
              this.loadData();
              this.messageService.showMessage(res.strMessage, res.title, res.type);
              this.displayDialog = false;
            } else {
              this.messageService.showMessage(res.strMessage, res.title, res.type);
            }
          },
          error: () => {
            this.messageService.showMessage('Something went wrong while connecting to the server.', 'Error', PopupMessageType.Error);
          }
        });
      }
    });
  }

  saveCareer() {
    if (this.careerForm.invalid) {
      this.careerForm.markAllAsTouched();
      this.messageService.showMessage('Please fill in all required fields.', 'Validation Error', PopupMessageType.Error);
      return;
    }

    const formValue = this.careerForm.value;
    const model = new MCareer();
    model.CareerID = formValue.CareerID || 0;
    model.Title = formValue.Title;
    model.Department = formValue.Department;
    model.Location = formValue.Location;
    model.EmploymentType = formValue.EmploymentType;
    model.ExperienceLevel = formValue.ExperienceLevel;
    model.MinExperience = formValue.MinExperience || 0;
    model.MaxExperience = formValue.MaxExperience || 0;
    model.SalaryRange = formValue.SalaryRange || '';
    model.Description = formValue.Description;
    model.Requirements = formValue.Requirements || '';
    model.Responsibilities = formValue.Responsibilities || '';
    model.Benefits = formValue.Benefits || '';
    model.IsRemote = formValue.IsRemote || false;
    model.ApplicationUrl = formValue.ApplicationUrl || '';
    model.ApplicationDeadline = formValue.ApplicationDeadline || '';
    model.SortOrder = formValue.SortOrder || 0;
    model.MCommonEntitiesMaster.isActive = formValue.MCommonEntitiesMaster?.isActive ?? true;

    this.saving = true;
    this.careerService.Save(model).subscribe({
      next: (res) => {
        if (!res.isError) {
          this.loadData();
          this.messageService.showMessage(res.strMessage, res.title, res.type);
          this.displayDialog = false;
        } else {
          this.messageService.showMessage(res.strMessage, res.title, res.type);
        }
      },
      error: () => {
        this.messageService.showMessage('Something went wrong while connecting to the server.', 'Error', PopupMessageType.Error);
      },
      complete: () => {
        this.saving = false;
      }
    });
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
    this.rows = 10;
  }

  getSeverity(isActive: boolean): 'success' | 'danger' | 'warn' {
    return isActive ? 'success' : 'danger';
  }

  getStatusText(isActive: boolean): string {
    return isActive ? 'Active' : 'Inactive';
  }

  getTypeSeverity(type: string): 'info' | 'success' | 'warn' | 'contrast' | 'secondary' {
    switch (type) {
      case 'Full-Time': return 'info';
      case 'Part-Time': return 'success';
      case 'Contract': return 'warn';
      case 'Internship': return 'contrast';
      default: return 'secondary';
    }
  }
}
