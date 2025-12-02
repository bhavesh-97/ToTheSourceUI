// src/app/shared/components/rich-text-editor/rich-text-editor.component.ts
import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit, SimpleChanges, DOCUMENT, Inject, HostListener, OnChanges, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MenuModule } from 'primeng/menu';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { DividerModule } from 'primeng/divider';
import { ColorPickerModule } from 'primeng/colorpicker';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';
interface Font { name: string; value: string }
interface Size { name: string; value: string }
@Component({
  selector: 'app-text-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, ToolbarModule, MenuModule,
    ColorPickerModule, DialogModule, FileUploadModule, TooltipModule, DividerModule],
  templateUrl: './text-editor.html',
  styleUrls: ['./text-editor.scss']
})
export class TextEditorComponent implements AfterViewInit, OnChanges, ControlValueAccessor {
  @Input() content = '';
  @Output() contentChange = new EventEmitter<string>();

  @ViewChild('editor') editor!: ElementRef<HTMLDivElement>;
  @ViewChild('resizer') resizer!: ElementRef<HTMLDivElement>;

  isDark = false;
  isSource = false;
  showLink = false;
  showImage = false;

  linkUrl = ''; linkText = ''; linkNewTab = true;
  textColor = '#1f2937';
  bgColor = '#fbbf24';

  private isResizing = false;
  private onChange = (value: string) => {}; // Part of ControlValueAccessor
  private onTouched = () => {}; // Part of ControlValueAccessor

  constructor(@Inject(DOCUMENT) private doc: Document) {}

  ngAfterViewInit() {
    this.updateEditorContent(); // Refactored to use internal setter
    this.setupEditor();
    this.setupResize();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['content'] && !changes['content'].firstChange) {
      this.updateEditorContent(); // Update internal editor when input changes
    }
  }

  // Internal method to update editor content (handles both modes)
  private updateEditorContent() {
    if (this.isSource) {
      this.editor.nativeElement.textContent = this.content || '';
    } else {
      this.editor.nativeElement.innerHTML = this.content || '<p>Start typing...</p>';
    }
  }

  setupEditor() {
    this.editor.nativeElement.addEventListener('input', () => this.sync());
    this.editor.nativeElement.addEventListener('dragover', e => e.preventDefault());
    this.editor.nativeElement.addEventListener('drop', e => {
      e.preventDefault();
      const file = e.dataTransfer?.files[0];
      if (file?.type.startsWith('image/')) this.uploadImage(file);
    });
  }

  setupResize() {
    const resizer = this.resizer.nativeElement;
    resizer.addEventListener('mousedown', (e: MouseEvent) => {
      this.isResizing = true;
      e.preventDefault();
    });

    this.doc.addEventListener('mousemove', (e: MouseEvent) => {
      if (!this.isResizing) return;
      const height = window.innerHeight - e.clientY - 100;
      this.editor.nativeElement.style.height = Math.max(300, height) + 'px';
    });

    this.doc.addEventListener('mouseup', () => {
      this.isResizing = false;
    });
  }

  exec(cmd: string, value?: any) {
    this.doc.execCommand(cmd, false, value);
    this.editor.nativeElement.focus();
    this.sync();
  }

  insertLink() {
    if (!this.linkUrl) return;
    const text = this.linkText || this.linkUrl;
    const html = `<a href="${this.linkUrl}" target="${this.linkNewTab ? '_blank' : '_self'}" style="color:#3b82f6; text-decoration:underline;">${text}</a>`;
    this.exec('insertHTML', html);
    this.showLink = false;
    this.linkUrl = this.linkText = '';
  }

  uploadImage(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const img = `<img src="${e.target.result}" style="max-width:100%; height:auto; border-radius:12px; margin:10px 0;" />`;
      this.exec('insertHTML', img);
    };
    reader.readAsDataURL(file);
  }

  insertTable() {
    const table = `
      <table class="editor-table">
        <tr><th>Header 1</th><th>Header 2</th></tr>
        <tr><td>Cell 1</td><td>Cell 2</td></tr>
        <tr><td>Cell 3</td><td>Cell 4</td></tr>
      </table>`;
    this.exec('insertHTML', table);
  }

  toggleTheme() {
    this.isDark = !this.isDark;
  }

  toggleSource() {
    this.isSource = !this.isSource;
    this.updateEditorContent(); // Use internal update instead of direct assignment
    this.sync();
  }

  sync() {
    this.content = this.isSource
      ? this.editor.nativeElement.textContent || ''
      : this.editor.nativeElement.innerHTML;
    this.contentChange.emit(this.content);
    this.onChange(this.content); // Notify ngModel of changes
  }

  // ControlValueAccessor methods
  writeValue(value: string): void {
    this.content = value || '';
    this.updateEditorContent(); // Update internal editor when external value changes
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Optional: Handle disabled state if needed (e.g., make editor read-only)
    if (isDisabled) {
      this.editor.nativeElement.setAttribute('contenteditable', 'false');
    } else {
      this.editor.nativeElement.setAttribute('contenteditable', 'true');
    }
  }

  // Mark as touched on blur (optional, for form validation)
  onBlur() {
    this.onTouched();
  }

  exportHTML() {
    const blob = new Blob([this.content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'document.html'; a.click();
  }

  static ngAcceptInputType_content: string | null;

  providers = [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextEditorComponent),
      multi: true
    }
  ];
}