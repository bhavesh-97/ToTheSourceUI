import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { NotificationService } from '../../../services/notification.service';
import { PopupMessageType } from '../../../models/PopupMessageType';
import { TextEditorComponent } from '../../../@theme/components/WYSIWYG-Editors/text-editor';
import { Template, TemplateStatus } from './Template';

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
            TextEditorComponent,
            ConfirmDialogModule,
            ToggleButtonModule],
  templateUrl: './template-master.html',
  styleUrl: './template-master.css'
})
export class TemplateMaster implements OnInit {
  templates = signal<Template[]>([]);
  dialogVisible = false;
  isNew = false;
  showImportDialog = false;

  // Import form properties
  importName = '';
  importType = '';
  importHtml = '';

  form = {
    TemplateID: 0,
    TemplateName: '',
    TemplateType: '',
    status: 'draft' as TemplateStatus,
    html: ``
  };

  // Helper property for toggle button
  get isPublished(): boolean {
    return this.form.status === 'published';
  }

  set isPublished(value: boolean) {
    this.form.status = value ? 'published' : 'draft';
  }

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    const saved = localStorage.getItem('cms_templates');
    if (saved) {
      this.templates.set(JSON.parse(saved));
    } else {
      this.templates.set([this.demoTemplate()]);
    }
  }

  demoTemplate(): Template {
    return {
              TemplateID: 1,
              TemplateName: 'Modern Hero 2025',
              TemplateType: 'Website',
              status: 'published',
              html: ''
          };
  }

  // Dialog methods
  openDialog(isNew: boolean, tpl?: Template) {
    this.isNew = isNew;
    if (isNew) {
      this.form = {
        TemplateID: 0,
        TemplateName: '',
        TemplateType: '',
        status: 'draft',
        html: ''
      }
    } else if (tpl) {
      this.form = {
        TemplateID: tpl.TemplateID,
        TemplateName: tpl.TemplateName,
        TemplateType: tpl.TemplateType,
        status: tpl.status,
        html: tpl.html
      };
    }
    this.dialogVisible = true;
  }

  save() {
    if (!this.form.TemplateName.trim()) {
      this.notificationService.showMessage('Name is required!', 'Error', PopupMessageType.Error);
      return;
    }

    const template: Template = {
      TemplateID: this.form.TemplateID,
      TemplateName: this.form.TemplateName.trim(),
      TemplateType: this.form.TemplateType.trim(),
      status: this.form.status,
      html: this.form.html
    };

    if (this.isNew) {
      this.templates.update(t => [...t, template]);
    } else {
      this.templates.update(t => t.map(x => x.TemplateID === template.TemplateID ? template : x));
    }

    localStorage.setItem('cms_templates', JSON.stringify(this.templates()));
    this.notificationService.showMessage('Saved!', 'Success', PopupMessageType.Success);
    this.dialogVisible = false;
  }

  deleteTemplate(tpl: Template) {
    if (confirm(`Delete "${tpl.TemplateName}" permanently?`)) {
      this.templates.update(t => t.filter(x => x.TemplateID !== tpl.TemplateID));
      localStorage.setItem('cms_templates', JSON.stringify(this.templates()));
      this.notificationService.showMessage('Deleted', 'Info', PopupMessageType.Info);
    }
  }

  duplicate(tpl: Template) {
    const copy = { ...tpl, TemplateID: 0, TemplateName: tpl.TemplateName + ' (Copy)' };
    this.templates.update(t => [...t, copy]);
    localStorage.setItem('cms_templates', JSON.stringify(this.templates()));
  }

  // Import template methods
  importTemplate() {
    if (!this.importName.trim()) {
      this.notificationService.showMessage('Template name is required!', 'Error', PopupMessageType.Error);
      return;
    }
    
    const template: Template = {
      TemplateID: Date.now(),
      TemplateName: this.importName.trim(),
      TemplateType: this.importType.trim() || 'Custom',
      status: 'draft',
      html: this.importHtml
    };
    
    this.templates.update(t => [...t, template]);
    localStorage.setItem('cms_templates', JSON.stringify(this.templates()));
    this.showImportDialog = false;
    this.notificationService.showMessage('Template imported Successfully!', 'Success', PopupMessageType.Success);
    
    // Reset import form
    this.importName = '';
    this.importType = '';
    this.importHtml = '';
  }
}