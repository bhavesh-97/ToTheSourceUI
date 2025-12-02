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
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import * as Editor from '@ckeditor/ckeditor5-build-decoupled-document';
import { NotificationService } from '../../../services/notification.service';
import { PopupMessageType } from '../../../models/PopupMessageType';
import { DrawerModule } from 'primeng/drawer';
import { TextEditorComponent } from '../../../@theme/components/WYSIWYG-Editors/text-editor';
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
            ConfirmDialogModule,
            CKEditorModule ],
  templateUrl: './template-master.html',
  styleUrl: './template-master.css'
})

export class TemplateMaster implements OnInit, AfterViewChecked {
  @ViewChild('previewFrame') previewFrame!: ElementRef<HTMLIFrameElement>;
  messageContent = '';
  // CKEditor 5 v44+ – No version error
  @ViewChild('ckeditor') ckeditor: any;

  // THIS LINE FIXES THE ERROR
  public Editor = (Editor as any).default || Editor;

  public editorConfig = {
    toolbar: [
      'sourceEditing', '|',
      'heading', 'bold', 'italic', 'underline', 'strikethrough', '|',
      'link', 'bulletedList', 'numberedList', '|',
      'outdent', 'indent', 'blockQuote', 'insertTable', 'mediaEmbed', '|',
      'fontFamily', 'fontSize', 'fontColor', '|',
      'code', 'codeBlock', '|',
      'undo', 'redo'
    ],
    htmlSupport: { allow: [{ name: /.*/, attributes: true, classes: true, styles: true }] },
    height: 600
  };

  templates = signal<Template[]>([]);
  dialogVisible = false;
  isNew = false;

  form = {
    name: '',
    type: 'website' as TemplateType,
    status: 'draft' as TemplateStatus,
    html: `<div class="hero min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-600 text-white">
  <h1 class="fade-up text-8xl font-black">Welcome</h1>
</div>`,
    css: `.hero { display: grid; place-items: center; }`,
    gsapConfig: {
      global: { defaults: { duration: 1.5, ease: "power4.out" } },
      rules: [
        {
          id: "1",
          label: "Hero Fade Up",
          selector: ".fade-up",
          from: { opacity: 0, y: 100 },
          to: { opacity: 1, y: 0 },
          stagger: { each: 0.2 },
          scrollTrigger: { enabled: true, start: "top 80%" }
        }
      ]
    }
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
      id: 'demo1',
      name: 'Modern Hero 2025',
      type: 'website',
      status: 'published',
      thumbnail: 'https://via.placeholder.com/600x400/7c3aed/ffffff?text=HERO',
      html: this.form.html,
      css: this.form.css,
      gsapConfig: this.form.gsapConfig
    };
  }

  ngAfterViewChecked() {
  }

  openDialog(isNew: boolean, tpl?: Template) {
    this.isNew = isNew;
    if (isNew) {
      this.form = {
        name: '',
        type: 'website',
        status: 'draft',
        html: '<div class="py-32 text-center"><h1 class="fade-up">New Template</h1></div>',
        css: '',
        gsapConfig: { global: { defaults: {
          duration: 1,
          ease: ''
        } }, rules: [] }
      };
    } else if (tpl) {
      this.form = {
        name: tpl.name,
        type: tpl.type,
        status: tpl.status,
        html: tpl.html,
        css: tpl.css,
        gsapConfig: JSON.parse(JSON.stringify(tpl.gsapConfig))
      };
    }
    this.dialogVisible = true;
  }

  save() {
    debugger;
    if (!this.form.name.trim()) {
      this.notificationService.showMessage('Name is required!', 'Error', PopupMessageType.Error);
      return;
    }

    const template: Template = {
      id: this.isNew ? Date.now().toString() : this.templates().find(t => t.name === this.form.name)?.id || Date.now().toString(),
      name: this.form.name.trim(),
      type: this.form.type,
      status: this.form.status,
      thumbnail: `https://via.placeholder.com/600x400/10b981/fff?text=${this.form.name.slice(0,3).toUpperCase()}`,
      html: this.form.html,
      css: this.form.css,
      gsapConfig: this.form.gsapConfig
    };

    if (this.isNew) {
      this.templates.update(t => [...t, template]);
    } else {
      this.templates.update(t => t.map(x => x.id === template.id ? template : x));
    }

    localStorage.setItem('cms_templates', JSON.stringify(this.templates()));
    this.notificationService.showMessage('Saved!', 'Success', PopupMessageType.Success);
    this.dialogVisible = false;
  }

  deleteTemplate(tpl: Template) {
    if (confirm(`Delete "${tpl.name}" permanently?`)) {
      this.templates.update(t => t.filter(x => x.id !== tpl.id));
      localStorage.setItem('cms_templates', JSON.stringify(this.templates()));
      this.notificationService.showMessage('Deleted', 'Info', PopupMessageType.Info);
    }
  }

  duplicate(tpl: Template) {
    const copy = { ...tpl, id: Date.now().toString(), name: tpl.name + ' (Copy)' };
    this.templates.update(t => [...t, copy]);
    localStorage.setItem('cms_templates', JSON.stringify(this.templates()));
  }

  addRule() {
    this.form.gsapConfig.rules.push({
      id: 'r_' + Date.now(),
      label: 'New Animation',
      selector: '.animate-me',
      from: { opacity: 0, y: 60 },
      to: { opacity: 1, y: 0 },
      stagger: { each: 0.1 },
      scrollTrigger: { enabled: true, start: 'top 85%' }
    });
  }

  removeRule(i: number) {
    this.form.gsapConfig.rules.splice(i, 1);
  }
}

type TemplateType = 'website' | 'admin' | 'email';
type TemplateStatus = 'published' | 'draft' | 'warning' | 'success';
interface Template {
  id: string;
  name: string;
  type: TemplateType;
  status: TemplateStatus;
  thumbnail: string;
  html: string;
  css: string;
  gsapConfig: any;
}