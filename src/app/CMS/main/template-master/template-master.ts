import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { NotificationService } from '../../../services/notification.service';
import { PopupMessageType } from '../../../models/PopupMessageType';
import { DrawerModule } from 'primeng/drawer';
import { TextEditorComponent } from '../../../@theme/components/WYSIWYG-Editors/text-editor';
import { Template, TemplateStatus } from './Template';
import { MCommonEntitiesMaster } from '../../../models/MCommonEntitiesMaster';
@Component({
  selector: 'app-template-master',
  imports: [CommonModule, 
            FormsModule, 
            RouterModule,
            ButtonModule, 
            TableModule, 
            TagModule, 
            DrawerModule,
            DialogModule,
            InputTextModule, 
            TextareaModule, 
            TextEditorComponent,
            ConfirmDialogModule],
  templateUrl: './template-master.html',
  styleUrl: './template-master.css'
})

export class TemplateMaster implements OnInit {
  @ViewChild('previewFrame') previewFrame!: ElementRef<HTMLIFrameElement>;
  messageContent = '';
  templates = signal<Template[]>([]);
  dialogVisible = false;
  isNew = false;

  form = {
    TemplateID: 0,
    TemplateName: '',
    status: 'draft' as TemplateStatus,
    html: ``
  };

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
              status: 'published',
              html: this.form.html
        };
  }

  openDialog(isNew: boolean, tpl?: Template) {
    this.isNew = isNew;
    if (isNew) {
      this.form = {
        TemplateID: 0,
        TemplateName: '',
        status: 'draft',
        html: '<div class="py-32 text-center"><h1 class="fade-up">New Template</h1></div>'
      }
    } else if (tpl) {
      this.form = {
        TemplateID: tpl.TemplateID,
        TemplateName: tpl.TemplateName,
        status: tpl.status,
        html: tpl.html
      };
    }
    this.dialogVisible = true;
  }

  save() {
    debugger;
    if (!this.form.TemplateName.trim()) {
      this.notificationService.showMessage('Name is required!', 'Error', PopupMessageType.Error);
      return;
    }

    const template: Template = {
      // TemplateID: this.isNew ? Date.now().toString() : this.templates().find(t => t.TemplateName === this.form.TemplateName)?.TemplateID || Date.now().toString(),
      TemplateID: this.form.TemplateID,
      TemplateName: this.form.TemplateName.trim(),
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
}
