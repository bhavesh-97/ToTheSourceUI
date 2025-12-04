import { 
  Component, 
  ElementRef, 
  ViewChild, 
  AfterViewInit, 
  Inject, 
  forwardRef,
  OnDestroy,
  Renderer2,
  HostListener,
  ChangeDetectorRef
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
import { InputNumberModule } from 'primeng/inputnumber';
// import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SelectModule } from 'primeng/select';
// import { MessageService } from 'primeng/api';
import { DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';
import { NotificationService } from '../../../services/notification.service';
import { PopupMessageType } from '../../../models/PopupMessageType';

interface FontOption {
  label: string;
  value: string;
}

interface TableConfig {
  rows: number;
  cols: number;
  header: boolean;
  border: boolean;
}

interface Emoji {
  emoji: string;
  description: string;
}

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
    CheckboxModule,
    SelectModule,
    InputNumberModule,
    // ToastModule,
    ConfirmDialogModule,
    ConfirmPopupModule,
    SplitButtonModule
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
export class TextEditorComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
  @ViewChild('editor') editor!: ElementRef<HTMLDivElement>;
  @ViewChild('resizer') resizer!: ElementRef<HTMLDivElement>;
// Add this property to the component class:
fileMenuItems = [
  {
    label: 'Print',
    icon: 'pi pi-print',
    command: () => this.printContent()
  },
  {
    label: 'Export as HTML',
    icon: 'pi pi-file-export',
    command: () => this.exportHTML()
  },
  {
    label: 'Export as Text',
    icon: 'pi pi-file',
    command: () => this.exportText()
  },
  {
    separator: true
  },
  {
    label: 'Check Spelling',
    icon: 'pi pi-spell-check',
    command: () => this.checkSpelling()
  }
];
  // Font options
  fontOptions: FontOption[] = [
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Times New Roman', value: 'Times New Roman, serif' },
    { label: 'Courier New', value: 'Courier New, monospace' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Verdana', value: 'Verdana, sans-serif' },
    { label: 'Trebuchet MS', value: 'Trebuchet MS, sans-serif' },
    { label: 'Comic Sans MS', value: 'Comic Sans MS, cursive' },
    { label: 'Impact', value: 'Impact, fantasy' }
  ];

  fontSizeOptions = [
    { label: 'Small (12px)', value: '12px' },
    { label: 'Normal (16px)', value: '16px' },
    { label: 'Large (20px)', value: '20px' },
    { label: 'Huge (24px)', value: '24px' },
    { label: 'Title (32px)', value: '32px' }
  ];

  headingOptions = [
    { label: 'Paragraph', value: 'p' },
    { label: 'Heading 1', value: 'h1' },
    { label: 'Heading 2', value: 'h2' },
    { label: 'Heading 3', value: 'h3' },
    { label: 'Heading 4', value: 'h4' },
    { label: 'Heading 5', value: 'h5' },
    { label: 'Heading 6', value: 'h6' }
  ];

  codeLanguageOptions = [
    { label: 'HTML', value: 'html' },
    { label: 'CSS', value: 'css' },
    { label: 'JavaScript', value: 'javascript' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'JSON', value: 'json' },
    { label: 'Plain Text', value: 'plain' }
  ];

  // Emoji categories
  emojis: Emoji[] = [
    { emoji: '😀', description: 'Grinning Face' },
    { emoji: '😂', description: 'Tears of Joy' },
    { emoji: '🥰', description: 'Smiling Face with Hearts' },
    { emoji: '😎', description: 'Smiling Face with Sunglasses' },
    { emoji: '🤔', description: 'Thinking Face' },
    { emoji: '👍', description: 'Thumbs Up' },
    { emoji: '👏', description: 'Clapping Hands' },
    { emoji: '🎉', description: 'Party Popper' },
    { emoji: '💡', description: 'Light Bulb' },
    { emoji: '📌', description: 'Pushpin' },
    { emoji: '🔗', description: 'Link' },
    { emoji: '📎', description: 'Paperclip' }
  ];

  specialCharacters = [
    '©', '®', '™', '€', '$', '£', '¥', '¢', '§', '¶',
    '±', '≠', '≈', '≤', '≥', '∞', '°', 'µ', 'π', '∑',
    '√', '∆', '∂', '∫', '∏', '≈', '≠', '≡', '≅', '∼'
  ];

  // Internal content variable
  private _content = '';
  
  // UI state variables
  isDark = false;
  isSource = false;
  isFullscreen = false;
  showLink = false;
  showImage = false;
  showTableConfig = false;
  showCodeDialog = false;
  showEmojiPicker = false;
  showSpecialChars = false;
  
  // Form values
  linkUrl = ''; 
  linkText = ''; 
  linkNewTab = true;
  linkNoFollow = false;
  
  textColor = '#1f2937';
  bgColor = '#ffffff';
  highlightColor = '#fbbf24';
  
  selectedFont = this.fontOptions[0];
  selectedFontSize = this.fontSizeOptions[1];
  selectedHeading = this.headingOptions[0];
  selectedCodeLanguage = this.codeLanguageOptions[0];
  
  tableConfig: TableConfig = {
    rows: 3,
    cols: 3,
    header: true,
    border: true
  };

  codeContent = '';
  
  wordCount = 0;
  charCount = 0;
  readingTime = 0;
  
  // Formatting state
  isBold = false;
  isItalic = false;
  isUnderline = false;
  isStrikethrough = false;
  isSuperscript = false;
  isSubscript = false;
  
  // Custom dialogs visibility
  showFontDialog = false;
  showTableDialog = false;
  showInsertDialog = false;
  
  private isResizing = false;
  private onChange = (value: string) => {};
  private onTouched = () => {};
  private destroy$ = new Subject<void>();
  private originalStyles: any = {};

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private renderer: Renderer2,
    private messageService: NotificationService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.updateEditorContent();
    this.setupEditor();
    this.setupResize();
    this.setupFormatDetection();
    this.setupWordCounter();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.restoreFullscreenStyles();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardShortcuts(event: KeyboardEvent) {
    // Ctrl/Cmd + B for Bold
    if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
      event.preventDefault();
      this.exec('bold');
    }
    // Ctrl/Cmd + I for Italic
    if ((event.ctrlKey || event.metaKey) && event.key === 'i') {
      event.preventDefault();
      this.exec('italic');
    }
    // Ctrl/Cmd + U for Underline
    if ((event.ctrlKey || event.metaKey) && event.key === 'u') {
      event.preventDefault();
      this.exec('underline');
    }
    // Ctrl/Cmd + K for Link
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      this.showLink = true;
    }
    // Ctrl/Cmd + Z for Undo
    if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
      event.preventDefault();
      this.exec('undo');
    }
    // Ctrl/Cmd + Shift + Z for Redo
    if ((event.ctrlKey || event.metaKey) && event.key === 'z' && event.shiftKey) {
      event.preventDefault();
      this.exec('redo');
    }
    // F11 for fullscreen
    if (event.key === 'F11') {
      event.preventDefault();
      this.toggleFullscreen();
    }
  }

  private setupEditor() {
    this.editor.nativeElement.addEventListener('input', () => this.sync());
    this.editor.nativeElement.addEventListener('blur', () => this.onBlur());
    this.editor.nativeElement.addEventListener('mouseup', () => this.detectFormatting());
    this.editor.nativeElement.addEventListener('keyup', () => this.detectFormatting());
    this.editor.nativeElement.addEventListener('dragover', e => e.preventDefault());
    this.editor.nativeElement.addEventListener('drop', e => {
      e.preventDefault();
      const file = e.dataTransfer?.files[0];
      if (file?.type.startsWith('image/')) this.uploadImage(file);
    });
    
    // Paste event handling
    this.editor.nativeElement.addEventListener('paste', (e: ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData?.getData('text/plain') || '';
      
      // Clean up pasted text - remove formatting
      const cleanText = this.sanitizeText(text);
      this.doc.execCommand('insertText', false, cleanText);
      this.sync();
    });
  }

  private sanitizeText(text: string): string {
    // Remove unwanted HTML tags but keep basic formatting
    return text
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/on\w+="[^"]*"/g, '');
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

  private setupFormatDetection() {
    this.editor.nativeElement.addEventListener('keyup', () => this.detectFormatting());
    this.editor.nativeElement.addEventListener('mouseup', () => this.detectFormatting());
  }

  private detectFormatting() {
    const selection = this.doc.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    try {
      const range = selection.getRangeAt(0);
      const parentElement = range.commonAncestorContainer.parentElement;
      
      if (parentElement) {
        this.isBold = this.doc.queryCommandState('bold');
        this.isItalic = this.doc.queryCommandState('italic');
        this.isUnderline = this.doc.queryCommandState('underline');
        this.isStrikethrough = this.doc.queryCommandState('strikethrough');
        
        // Check for superscript/subscript
        this.isSuperscript = parentElement.tagName === 'SUP' || 
                            window.getComputedStyle(parentElement).verticalAlign === 'super';
        this.isSubscript = parentElement.tagName === 'SUB' || 
                          window.getComputedStyle(parentElement).verticalAlign === 'sub';
      }
    } catch (e) {
      console.warn('Could not detect formatting:', e);
    }
  }

  private setupWordCounter() {
    // Debounce word count updates
    this.editor.nativeElement.addEventListener('input', () => {
      setTimeout(() => this.updateWordCount(), 100);
    });
  }

  private updateWordCount() {
    const text = this.editor.nativeElement.innerText || '';
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    this.wordCount = words.length;
    this.charCount = text.length;
    this.readingTime = Math.ceil(this.wordCount / 200); // 200 words per minute
  }

  private updateEditorContent(content?: string) {
    const valueToUse = content !== undefined ? content : this._content;
    
    if (!this.editor?.nativeElement) return;
    
    if (this.isSource) {
      this.editor.nativeElement.textContent = valueToUse || '';
    } else {
      this.editor.nativeElement.innerHTML = valueToUse || '<p><br></p>';
    }
    
    this.updateWordCount();
    this.cdRef.detectChanges();
  }

  // Editor Actions
  exec(cmd: string, value?: any, showDefaultUI = false) {
    this.doc.execCommand(cmd, showDefaultUI, value);
    this.editor.nativeElement.focus();
    this.sync();
    this.detectFormatting();
  }

  changeFont() {
    this.exec('fontName', this.selectedFont.value);
    this.showFontDialog = false;
  }

  changeFontSize() {
    // Use CSS styling for better control
    const selection = this.doc.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (!range.collapsed) {
        const span = this.doc.createElement('span');
        span.style.fontSize = this.selectedFontSize.value;
        span.style.lineHeight = '1.5';
        try {
          range.surroundContents(span);
        } catch (e) {
          // If surrounding fails, insert text with span
          const text = range.toString();
          span.textContent = text;
          range.deleteContents();
          range.insertNode(span);
        }
        this.sync();
      }
    }
  }

  changeHeading() {
    if (this.selectedHeading.value === 'p') {
      this.exec('formatBlock', '<p>');
    } else {
      this.exec('formatBlock', `<${this.selectedHeading.value}>`);
    }
  }

  insertLink() {
    if (!this.linkUrl) {
      this.messageService.showMessage('Please enter a URL',PopupMessageType.Warning,PopupMessageType.Warning);
      return;
    }

    const rel = this.linkNoFollow ? 'nofollow' : '';
    const target = this.linkNewTab ? '_blank' : '_self';
    const text = this.linkText || this.linkUrl;
    
    const html = `<a href="${this.linkUrl}" target="${target}" ${rel ? `rel="${rel}"` : ''} 
                 style="color:#3b82f6; text-decoration:underline;">${text}</a>`;
    
    this.exec('insertHTML', html);
    this.showLink = false;
    this.linkUrl = this.linkText = '';
    this.messageService.showMessage('Link inserted successfully',PopupMessageType.Success,PopupMessageType.Success);
  }

  uploadImage(file: File) {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      this.messageService.showMessage('Please select an image file',PopupMessageType.Error,PopupMessageType.Error);
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.messageService.showMessage('Image size should be less than 5MB',PopupMessageType.Error,PopupMessageType.Error);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const img = `<img src="${e.target.result}" 
                  style="max-width:100%; height:auto; border-radius:12px; margin:10px 0; cursor:move;" 
                  class="editor-image" 
                  contenteditable="false">`;
      this.exec('insertHTML', img);
      
      this.messageService.showMessage('Image uploaded successfully',PopupMessageType.Success,PopupMessageType.Success);
    };
    
    reader.onerror = () => {
      this.messageService.showMessage('Failed to read image file',PopupMessageType.Error,PopupMessageType.Error);
    };
    
    reader.readAsDataURL(file);
    this.showImage = false;
  }

  insertTable() {
    const { rows, cols, header, border } = this.tableConfig;
    
    let tableHTML = '<table class="editor-table" style="border-collapse: collapse; width: 100%;" contenteditable="false">';
    
    if (header) {
      tableHTML += '<thead><tr>';
      for (let c = 0; c < cols; c++) {
        tableHTML += `<th style="border: ${border ? '1px solid #ccc' : 'none'}; padding: 8px; background: #f3f4f6;">Header ${c + 1}</th>`;
      }
      tableHTML += '</tr></thead>';
    }
    
    tableHTML += '<tbody>';
    for (let r = 0; r < rows; r++) {
      tableHTML += '<tr>';
      for (let c = 0; c < cols; c++) {
        tableHTML += `<td style="border: ${border ? '1px solid #ccc' : 'none'}; padding: 8px;">Cell ${r + 1}-${c + 1}</td>`;
      }
      tableHTML += '</tr>';
    }
    tableHTML += '</tbody></table>';
    
    this.exec('insertHTML', tableHTML);
    this.showTableConfig = false;
  }

  insertEmoji(emoji: string) {
    this.exec('insertText', emoji);
    this.showEmojiPicker = false;
  }

  insertSpecialChar(char: string) {
    this.exec('insertText', char);
    this.showSpecialChars = false;
  }

  insertCode() {
    if (!this.codeContent.trim()) return;
    
    let codeHTML = '';
    const languageClass = this.selectedCodeLanguage.value !== 'plain' ? `language-${this.selectedCodeLanguage.value}` : '';
    
    if (this.selectedCodeLanguage.value === 'html') {
      codeHTML = `<pre><code class="${languageClass}" style="
        background: #1e293b; 
        color: #e2e8f0; 
        padding: 16px; 
        border-radius: 8px; 
        overflow-x: auto;
        font-family: 'Courier New', monospace;
        tab-size: 2;">${this.escapeHtml(this.codeContent)}</code></pre>`;
    } else {
      codeHTML = `<pre><code class="${languageClass}" style="
        background: #f8fafc; 
        color: #0f172a; 
        padding: 16px; 
        border-radius: 8px; 
        overflow-x: auto;
        font-family: 'Courier New', monospace;
        border: 1px solid #e2e8f0;
        tab-size: 2;">${this.escapeHtml(this.codeContent)}</code></pre>`;
    }
    
    this.exec('insertHTML', codeHTML);
    this.showCodeDialog = false;
    this.codeContent = '';
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  insertHorizontalRule() {
    this.exec('insertHTML', '<hr style="border: none; border-top: 2px solid #e5e7eb; margin: 24px 0;">');
  }

  clearFormatting() {
    this.exec('removeFormat');
    this.exec('styleWithCSS', false);
    this.detectFormatting();
    
    this.messageService.showMessage('Formatting cleared',PopupMessageType.Success,PopupMessageType.Success);
  }

  toggleTheme() {
    this.isDark = !this.isDark;
  }

  toggleSource() {
    this.isSource = !this.isSource;
    this.updateEditorContent();
    this.sync();
  }

  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
    
    if (this.isFullscreen) {
      this.enterFullscreen();
    } else {
      this.exitFullscreen();
    }
  }

  private enterFullscreen() {
    const element = this.editor.nativeElement.closest('.pro-editor');
    if (element) {
      // Store original styles
      this.originalStyles = {
        position: (element as HTMLElement).style.position,
        top: (element as HTMLElement).style.top,
        left: (element as HTMLElement).style.left,
        width: (element as HTMLElement).style.width,
        height: (element as HTMLElement).style.height,
        zIndex: (element as HTMLElement).style.zIndex,
        margin: (element as HTMLElement).style.margin,
        borderRadius: (element as HTMLElement).style.borderRadius
      };
      
      this.renderer.setStyle(element, 'position', 'fixed');
      this.renderer.setStyle(element, 'top', '0');
      this.renderer.setStyle(element, 'left', '0');
      this.renderer.setStyle(element, 'width', '100vw');
      this.renderer.setStyle(element, 'height', '100vh');
      this.renderer.setStyle(element, 'zIndex', '9999');
      this.renderer.setStyle(element, 'margin', '0');
      this.renderer.setStyle(element, 'borderRadius', '0');
      this.renderer.setStyle(element, 'background', this.isDark ? '#1f2937' : '#ffffff');
      
      document.body.style.overflow = 'hidden';
    }
  }

  private exitFullscreen() {
    const element = this.editor.nativeElement.closest('.pro-editor');
    if (element) {
      this.restoreFullscreenStyles();
      document.body.style.overflow = '';
    }
  }

  private restoreFullscreenStyles() {
    const element = this.editor.nativeElement.closest('.pro-editor');
    if (element && this.originalStyles) {
      Object.keys(this.originalStyles).forEach(key => {
        this.renderer.setStyle(element, key, this.originalStyles[key] || '');
      });
    }
  }

  printContent() {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Document</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .editor-content * { max-width: 100% !important; }
              @media print {
                body { padding: 0; }
              }
            </style>
          </head>
          <body>
            ${this.editor.nativeElement.innerHTML}
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  }

  exportHTML() {
    const blob = new Blob([this._content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; 
    a.download = `document-${new Date().getTime()}.html`; 
    a.click();
    URL.revokeObjectURL(url);
    
    this.messageService.showMessage('HTML exported successfully',PopupMessageType.Success,PopupMessageType.Success);
  }

  exportText() {
    const text = this.editor.nativeElement.innerText || '';
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; 
    a.download = `document-${new Date().getTime()}.txt`; 
    a.click();
    URL.revokeObjectURL(url);
    
    this.messageService.showMessage('Text exported successfully',PopupMessageType.Success,PopupMessageType.Success);
  }

  checkSpelling() {
    this.messageService.showMessage('Spell check would be implemented with a proper spell check API',PopupMessageType.Info,PopupMessageType.Info);
  }

  wordCountInfo() {
    this.messageService.showMessage(`Words: ${this.wordCount} | Characters: ${this.charCount} | Reading Time: ${this.readingTime} min`, PopupMessageType.Info, PopupMessageType.Info);
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
      this.updateWordCount();
    }
  }

  onBlur() {
    this.onTouched();
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