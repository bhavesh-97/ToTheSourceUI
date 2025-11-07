// src/app/@theme/components/tiny-mce/tiny-mce.component.ts
import {
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  AfterViewInit,
  Output,
  inject,
} from '@angular/core';
import { LocationStrategy } from '@angular/common';

// ──────────────────────────────────────────────────────────────
// TINYMCE 7.3.0 – OFFICIAL VITE-COMPATIBLE IMPORTS (NOV 2025)
// ──────────────────────────────────────────────────────────────
import 'tinymce/tinymce';
import 'tinymce/models/dom';
import 'tinymce/themes/silver';
import 'tinymce/icons/default';

// Core plugins (these are the ONLY ones that need explicit import)
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/code';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/media';
import 'tinymce/plugins/table';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/help';

// PASTE is now BUILT-IN → NO IMPORT NEEDED

// Skins (local copy)
import 'tinymce/skins/ui/oxide/skin.css';
import 'tinymce/skins/ui/oxide/content.css';

@Component({
  selector: 'ngx-tiny-mce',
  standalone: true,
  template: `
    <div class="tinymce-wrapper">
      <div id="editor-{{ uniqueId }}"></div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        overflow: hidden;
      }
      .tinymce-wrapper ::ng-deep .tox-tinymce {
        border: none !important;
      }
      .tinymce-wrapper ::ng-deep .tox-statusbar {
        border-top: 1px solid #e2e8f0;
      }
    `,
  ],
})
export class TinyMCEComponent implements AfterViewInit, OnDestroy {
  private elementRef = inject(ElementRef);
  private location = inject(LocationStrategy);

  @Output() editorContent = new EventEmitter<string>();
  @Output() editorKeyup = new EventEmitter<string>();

  private editor: any;
  uniqueId = `tinymce-${Math.random().toString(36).substr(2, 9)}`;

  ngAfterViewInit(): void {
    const base = this.location.getBaseHref() || '/';

    (window as any).tinymce.init({
      selector: `#editor-${this.uniqueId}`,
      height: 500,
      menubar: true,
      branding: false,
      statusbar: true,
      resize: true,

      // ALL WORKING PLUGINS (no more 404s)
      plugins:
        'advlist autolink lists link image charmap code fullscreen media table searchreplace wordcount help paste',

      toolbar:
        'undo redo | formatselect | bold italic underline strikethrough | ' +
        'forecolor backcolor | alignleft aligncenter alignright alignjustify | ' +
        'bullist numlist outdent indent | link image media table | ' +
        'code fullscreen | help',

      // LOCAL ASSETS – CRITICAL FOR VITE
      skin_url: `${base}assets/tinymce/skins/ui/oxide`,
      content_css: `${base}assets/tinymce/skins/ui/oxide/content.css`,

      // Fix Angular routing
      relative_urls: false,
      remove_script_host: false,
      convert_urls: true,

      // Optional: image upload
      // images_upload_url: '/api/upload',

      setup: (editor: any) => {
        this.editor = editor;

        editor.on('init', () => {
          console.log('TinyMCE 7.3.0 Ready!');
        });

        editor.on('keyup change undo redo', () => {
          const content = editor.getContent();
          this.editorKeyup.emit(content);
          this.editorContent.emit(content);
        });
      },
    });
  }

  ngOnDestroy(): void {
    if (this.editor) {
      this.editor.remove();
      this.editor = null;
    }
  }

  // Public API
  setContent(content: string): void {
    this.editor?.setContent(content);
  }

  getContent(): string {
    return this.editor?.getContent() ?? '';
  }
}