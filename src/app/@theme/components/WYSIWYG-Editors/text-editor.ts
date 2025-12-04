import { 
  Component, 
  ElementRef, 
  ViewChild, 
  AfterViewInit, 
  Inject, 
  forwardRef 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { MenuModule } from 'primeng/menu';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-text-editor',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ButtonModule, 
    ToolbarModule, 
    MenuModule,
    ColorPickerModule, 
    DialogModule, 
    FileUploadModule, 
    TooltipModule, 
    DividerModule,
    InputTextModule,
    CheckboxModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextEditorComponent),
      multi: true
    }
  ],
  templateUrl: './text-editor.html',
  styleUrls: ['./text-editor.scss']
})
export class TextEditorComponent implements AfterViewInit, ControlValueAccessor {
  @ViewChild('editor') editor!: ElementRef<HTMLDivElement>;
  @ViewChild('resizer') resizer!: ElementRef<HTMLDivElement>;

  // Internal content variable
  private _content = '';
  
  // UI state variables
  isDark = false;
  isSource = false;
  showLink = false;
  showImage = false;

  linkUrl = ''; 
  linkText = ''; 
  linkNewTab = true;
  textColor = '#1f2937';
  bgColor = '#fbbf24';

  private isResizing = false;
  private onChange = (value: string) => {};
  private onTouched = () => {};

  constructor(@Inject(DOCUMENT) private doc: Document) {}

  ngAfterViewInit() {
    this.updateEditorContent();
    this.setupEditor();
    this.setupResize();
  }

  // Internal method to update editor content
  private updateEditorContent(content?: string) {
    const valueToUse = content !== undefined ? content : this._content;
    
    if (!this.editor?.nativeElement) return;
    
    if (this.isSource) {
      this.editor.nativeElement.textContent = valueToUse || '';
    } else {
      this.editor.nativeElement.innerHTML = valueToUse || '<p>Start typing...</p>';
    }
  }

  private setupEditor() {
    this.editor.nativeElement.addEventListener('input', () => this.sync());
    this.editor.nativeElement.addEventListener('blur', () => this.onBlur());
    this.editor.nativeElement.addEventListener('dragover', e => e.preventDefault());
    this.editor.nativeElement.addEventListener('drop', e => {
      e.preventDefault();
      const file = e.dataTransfer?.files[0];
      if (file?.type.startsWith('image/')) this.uploadImage(file);
    });
  }

  private setupResize() {
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
    this.updateEditorContent();
    this.sync();
  }

  private sync() {
    if (!this.editor?.nativeElement) return;
    
    const newContent = this.isSource
      ? this.editor.nativeElement.textContent || ''
      : this.editor.nativeElement.innerHTML;
    
    // Update internal value and notify
    if (newContent !== this._content) {
      this._content = newContent;
      this.onChange(this._content);
    }
  }

  onBlur() {
    this.onTouched();
  }

  exportHTML() {
    const blob = new Blob([this._content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; 
    a.download = 'document.html'; 
    a.click();
    URL.revokeObjectURL(url);
  }

  // ControlValueAccessor Implementation
  writeValue(value: string): void {
    this._content = value || '';
    this.updateEditorContent(this._content);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (this.editor?.nativeElement) {
      this.editor.nativeElement.contentEditable = isDisabled ? 'false' : 'true';
    }
  }
}