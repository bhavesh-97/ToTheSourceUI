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
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
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
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
// import { InputSwitchModule } from 'primeng/inputswitch';
import { MessageService } from 'primeng/api';
import { DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';
import { ResizableModule, ResizeEvent } from 'angular-resizable-element';

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
    ToastModule,
    ConfirmDialogModule,
    SplitButtonModule,
    SliderModule,
    RadioButtonModule,
    ToggleSwitchModule,
    // InputSwitchModule,
    ResizableModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextEditorComponent),
      multi: true
    },
    MessageService
  ], 
  templateUrl: './text-editor.html',
  styleUrls: ['./text-editor.scss']
})
export class TextEditorComponent implements AfterViewInit, OnDestroy, ControlValueAccessor, OnChanges {
  @ViewChild('editor') editor!: ElementRef<HTMLDivElement>;
  @ViewChild('editorContainer') editorContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('fontMenu') fontMenu: any;
  @ViewChild('colorMenu') colorMenu: any;

  // Input properties for customization
  @Input() width: string = '100%';
  @Input() height: string = '500px';
  @Input() minHeight: string = '200px';
  @Input() maxHeight: string = '800px';
  @Input() minWidth: string = '200px';
  @Input() maxWidth: string = '800px';
  @Input() placeholder: string = 'Start typing here...';
  @Input() showToolbar: boolean = true;
  @Input() showStatusBar: boolean = true;
  @Input() allowResize: boolean = true;
  @Input() allowFullscreen: boolean = true;
  @Input() autoSave: boolean = false;
  @Input() autoSaveInterval: number = 30000; // 30 seconds
  @Input() maxUndoSteps: number = 50;
  
  @Output() contentChanged = new EventEmitter<string>();
  @Output() wordCountChanged = new EventEmitter<number>();
  @Output() charCountChanged = new EventEmitter<number>();
  @Output() editorFocus = new EventEmitter<void>();
  @Output() editorBlur = new EventEmitter<void>();
  showOverflowMenu = false;
  isMobileView = false;
  overflowMenuItems: any[] = [];
  selectedCategory = 'Smileys';
  private checkViewport() {
  this.isMobileView = window.innerWidth < 768;
  
  // Update overflow menu items based on viewport
  this.updateOverflowMenu();
  }
  private updateOverflowMenu() {
  this.overflowMenuItems = [
    { 
      label: 'Font Settings', 
      icon: 'fa fa-font',
      command: () => {
        this.showFontDialog = true;
        this.showOverflowMenu = false;
      }
    },
    { 
      label: 'Insert Table', 
      icon: 'fa fa-table',
      command: () => {
        this.showTableConfig = true;
        this.showOverflowMenu = false;
      }
    },
    { 
      label: 'Insert Code', 
      icon: 'fa fa-code',
      command: () => {
        this.showCodeDialog = true;
        this.showOverflowMenu = false;
      }
    },
    { 
      label: 'Insert Emoji', 
      icon: 'fa fa-smile',
      command: () => {
        this.showEmojiPicker = true;
        this.showOverflowMenu = false;
      }
    },
    { 
      label: 'Special Characters', 
      icon: 'fa fa-percentage',
      command: () => {
        this.showSpecialChars = true;
        this.showOverflowMenu = false;
      }
    },
    { 
      separator: true 
    },
    { 
      label: 'Document Statistics', 
      icon: 'fa fa-chart-bar',
      command: () => {
        this.wordCountInfo();
        this.showOverflowMenu = false;
      }
    },
    { 
      label: 'History', 
      icon: 'fa fa-history',
      command: () => {
        this.showHistoryDialog = true;
        this.showOverflowMenu = false;
      }
    },
    { 
      label: 'Settings', 
      icon: 'fa fa-cog',
      command: () => {
        this.showSettingsDialog = true;
        this.showOverflowMenu = false;
      }
    }
  ];
}
  // Font options with categories
  fontOptions: FontOption[] = [
    { label: 'Arial', value: 'Arial', family: 'Arial, sans-serif' },
    { label: 'Times New Roman', value: 'Times New Roman', family: 'Times New Roman, serif' },
    { label: 'Georgia', value: 'Georgia', family: 'Georgia, serif' },
    { label: 'Verdana', value: 'Verdana', family: 'Verdana, sans-serif' },
    { label: 'Courier New', value: 'Courier New', family: 'Courier New, monospace' },
    { label: 'Comic Sans MS', value: 'Comic Sans MS', family: 'Comic Sans MS, cursive' },
    { label: 'Trebuchet MS', value: 'Trebuchet MS', family: 'Trebuchet MS, sans-serif' },
    { label: 'Impact', value: 'Impact', family: 'Impact, fantasy' },
    { label: 'Tahoma', value: 'Tahoma', family: 'Tahoma, sans-serif' },
    { label: 'Palatino', value: 'Palatino', family: 'Palatino, serif' }
  ];

  fontSizeOptions = [
    { label: '8px', value: '8px' },
    { label: '9px', value: '9px' },
    { label: '10px', value: '10px' },
    { label: '11px', value: '11px' },
    { label: '12px', value: '12px' },
    { label: '14px', value: '14px' },
    { label: '16px', value: '16px' },
    { label: '18px', value: '18px' },
    { label: '20px', value: '20px' },
    { label: '24px', value: '24px' },
    { label: '28px', value: '28px' },
    { label: '32px', value: '32px' },
    { label: '36px', value: '36px' },
    { label: '48px', value: '48px' },
    { label: '64px', value: '64px' }
  ];

  headingOptions = [
    { label: 'Normal Text', value: 'p', size: '16px', weight: 'normal' },
    { label: 'Heading 1', value: 'h1', size: '32px', weight: 'bold' },
    { label: 'Heading 2', value: 'h2', size: '28px', weight: 'bold' },
    { label: 'Heading 3', value: 'h3', size: '24px', weight: 'bold' },
    { label: 'Heading 4', value: 'h4', size: '20px', weight: 'bold' },
    { label: 'Heading 5', value: 'h5', size: '18px', weight: 'bold' },
    { label: 'Heading 6', value: 'h6', size: '16px', weight: 'bold' },
    { label: 'Title', value: 'title', size: '40px', weight: 'bold' },
    { label: 'Subtitle', value: 'subtitle', size: '24px', weight: 'normal' }
  ];

  alignmentOptions = [
    { label: 'Align Left', value: 'left', icon: 'fa-align-left' },
    { label: 'Align Center', value: 'center', icon: 'fa-align-center' },
    { label: 'Align Right', value: 'right', icon: 'fa-align-right' },
    { label: 'Justify', value: 'justify', icon: 'fa-align-justify' }
  ];

  lineHeightOptions = [
    { label: '1.0', value: 1.0 },
    { label: '1.2', value: 1.2 },
    { label: '1.5', value: 1.5 },
    { label: '1.8', value: 1.8 },
    { label: '2.0', value: 2.0 },
    { label: '2.5', value: 2.5 }
  ];

  // Emoji categories
  emojiCategories = [
    { name: 'Smileys', icon: 'fa-smile' },
    { name: 'People', icon: 'fa-user' },
    { name: 'Animals', icon: 'fa-dog' },
    { name: 'Food', icon: 'fa-utensils' },
    { name: 'Travel', icon: 'fa-plane' },
    { name: 'Objects', icon: 'fa-lightbulb' },
    { name: 'Symbols', icon: 'fa-heart' },
    { name: 'Flags', icon: 'fa-flag' }
  ];

  emojis: Emoji[] = [
    // Smileys
    { emoji: '😀', description: 'Grinning Face', category: 'Smileys' },
    { emoji: '😂', description: 'Tears of Joy', category: 'Smileys' },
    { emoji: '🥰', description: 'Smiling Face with Hearts', category: 'Smileys' },
    { emoji: '😎', description: 'Smiling Face with Sunglasses', category: 'Smileys' },
    { emoji: '🤔', description: 'Thinking Face', category: 'Smileys' },
    { emoji: '😴', description: 'Sleeping Face', category: 'Smileys' },
    { emoji: '😡', description: 'Pouting Face', category: 'Smileys' },
    { emoji: '🤢', description: 'Nauseated Face', category: 'Smileys' },
    // People
    { emoji: '👋', description: 'Waving Hand', category: 'People' },
    { emoji: '👍', description: 'Thumbs Up', category: 'People' },
    { emoji: '👏', description: 'Clapping Hands', category: 'People' },
    { emoji: '🙏', description: 'Folded Hands', category: 'People' },
    { emoji: '💪', description: 'Flexed Biceps', category: 'People' },
    // Animals
    { emoji: '🐶', description: 'Dog Face', category: 'Animals' },
    { emoji: '🐱', description: 'Cat Face', category: 'Animals' },
    { emoji: '🐯', description: 'Tiger Face', category: 'Animals' },
    { emoji: '🦁', description: 'Lion Face', category: 'Animals' },
    // Food
    { emoji: '🍎', description: 'Red Apple', category: 'Food' },
    { emoji: '🍕', description: 'Pizza', category: 'Food' },
    { emoji: '🍔', description: 'Hamburger', category: 'Food' },
    { emoji: '☕', description: 'Hot Beverage', category: 'Food' },
    // Travel
    { emoji: '🚗', description: 'Automobile', category: 'Travel' },
    { emoji: '✈️', description: 'Airplane', category: 'Travel' },
    { emoji: '🚀', description: 'Rocket', category: 'Travel' },
    // Objects
    { emoji: '💡', description: 'Light Bulb', category: 'Objects' },
    { emoji: '📌', description: 'Pushpin', category: 'Objects' },
    { emoji: '🔗', description: 'Link', category: 'Objects' },
    { emoji: '📎', description: 'Paperclip', category: 'Objects' },
    // Symbols
    { emoji: '❤️', description: 'Red Heart', category: 'Symbols' },
    { emoji: '⭐', description: 'Star', category: 'Symbols' },
    { emoji: '✅', description: 'Check Mark', category: 'Symbols' },
    { emoji: '❌', description: 'Cross Mark', category: 'Symbols' },
    // Flags
    { emoji: '🇺🇸', description: 'United States', category: 'Flags' },
    { emoji: '🇬🇧', description: 'United Kingdom', category: 'Flags' },
    { emoji: '🇪🇺', description: 'European Union', category: 'Flags' }
  ];
  getEmojisByCategory(category: string): Emoji[] {
    return this.emojis.filter(emoji => emoji.category === category);
  }
  specialCharacters = [
    '©', '®', '™', '€', '$', '£', '¥', '¢', '§', '¶',
    '±', '≠', '≈', '≤', '≥', '∞', '°', 'µ', 'π', '∑',
    '√', '∆', '∂', '∫', '∏', '≈', '≠', '≡', '≅', '∼',
    '→', '←', '↑', '↓', '↔', '⇔', '⇒', '⇐', '∀', '∃',
    '∅', '∈', '∉', '∋', '∩', '∪', '⊂', '⊃', '⊄', '⊆'
  ];
getCharName(char: string): string {
  const charNames: {[key: string]: string} = {
    '©': 'Copyright',
    '®': 'Registered Trademark',
    '™': 'Trademark',
    '€': 'Euro',
    '$': 'Dollar',
    '£': 'Pound',
    '¥': 'Yen',
    '¢': 'Cent',
    '§': 'Section',
    '¶': 'Pilcrow',
    '±': 'Plus-minus',
    '≠': 'Not equal',
    '≈': 'Approximately equal',
    '≤': 'Less than or equal',
    '≥': 'Greater than or equal',
    '∞': 'Infinity',
    '°': 'Degree',
    'µ': 'Micro',
    'π': 'Pi',
    '∑': 'Sum',
    '√': 'Square root',
    '∆': 'Delta',
    '∂': 'Partial differential',
    '∫': 'Integral',
    '∏': 'Product',
    '→': 'Right arrow',
    '←': 'Left arrow',
    '↑': 'Up arrow',
    '↓': 'Down arrow'
  };
  
  return charNames[char] || char;
}
  // Internal content variable
  private _content = '';
  
  // UI state variables
  isDark = false;
  isSource = false;
  isFullscreen = false;
  isReadOnly = false;
  showLink = false;
  showImage = false;
  showTableConfig = false;
  showCodeDialog = false;
  showEmojiPicker = false;
  showSpecialChars = false;
  showFontDialog = false;
  showInsertDialog = false;
  showSettingsDialog = false;
  showHistoryDialog = false;
  showPreviewDialog = false;
  
  // Current editor state
  currentFont = this.fontOptions[0];
  currentFontSize = this.fontSizeOptions[6]; // 16px
  currentHeading = this.headingOptions[0];
  currentAlignment = 'left';
  currentLineHeight = 1.5;
  
  // Form values
  linkUrl = ''; 
  linkText = ''; 
  linkNewTab = true;
  linkNoFollow = false;
  linkTitle = '';
  
  textColor = '#1f2937';
  bgColor = '#ffffff';
  highlightColor = '#fbbf24';
  borderColor = '#e5e7eb';
  
  tableConfig: TableConfig = {
    rows: 3,
    cols: 3,
    header: true,
    border: true,
    striped: false,
    cellPadding: 8
  };

  codeLanguage = 'html';
  codeContent = '';
  
  // Statistics
  wordCount = 0;
  charCount = 0;
  charCountNoSpaces = 0;
  paragraphCount = 0;
  lineCount = 0;
  readingTime = 0;
  
  // Formatting state
  isBold = false;
  isItalic = false;
  isUnderline = false;
  isStrikethrough = false;
  isSuperscript = false;
  isSubscript = false;
  
  // History tracking
  history: HistoryItem[] = [];
  currentHistoryIndex = -1;
  maxHistorySize = 50;
  
  // Auto-save
  private autoSaveTimer: any;
  lastSaved: Date | null = null;
  
  // Editor style
  editorStyle: EditorStyle = {
    fontSize: '16px',
    fontFamily: 'Arial, sans-serif',
    lineHeight: 1.5,
    textAlign: 'left'
  };
  
  // Resizable configuration
  resizableConfig = {
    edges: { bottom: true, right: true, top: false, left: false },
    minWidth: 300,
    minHeight: 200,
    maxWidth: 2000,
    maxHeight: 2000
  };

  // File menu items
  fileMenuItems = [
    {
      label: 'New Document',
      icon: 'fa fa-file',
      command: () => this.newDocument()
    },
    {
      label: 'Save',
      icon: 'fa fa-save',
      command: () => this.exportHTML()
    },
    {
      label: 'Save As...',
      icon: 'fa fa-save',
      items: [
        { label: 'Save as HTML', icon: 'fa fa-code', command: () => this.exportHTML() },
        { label: 'Save as Text', icon: 'fa fa-file-text', command: () => this.exportText() },
        { label: 'Save as PDF', icon: 'fa fa-file-pdf', command: () => this.exportPDF() }
      ]
    },
    {
      separator: true
    },
    {
      label: 'Print',
      icon: 'fa fa-print',
      command: () => this.printContent()
    },
    {
      label: 'Preview',
      icon: 'fa fa-eye',
      command: () => this.showPreview()
    },
    {
      separator: true
    },
    {
      label: 'Undo',
      icon: 'fa fa-undo',
      command: () => this.undo()
    },
    {
      label: 'Redo',
      icon: 'fa fa-redo',
      command: () => this.redo()
    },
    {
      separator: true
    },
    {
      label: 'Settings',
      icon: 'fa fa-cog',
      command: () => this.showSettingsDialog = true
    }
  ];

  // Edit menu items
  editMenuItems = [
    { label: 'Cut', icon: 'fa fa-cut', command: () => this.exec('cut') },
    { label: 'Copy', icon: 'fa fa-copy', command: () => this.exec('copy') },
    { label: 'Paste', icon: 'fa fa-paste', command: () => this.exec('paste') },
    { label: 'Paste as Text', icon: 'fa fa-paste', command: () => this.pasteAsText() },
    { separator: true },
    { label: 'Select All', icon: 'fa fa-mouse-pointer', command: () => this.exec('selectAll') },
    { label: 'Clear Formatting', icon: 'fa fa-eraser', command: () => this.clearFormatting() },
    { separator: true },
    { label: 'Find and Replace', icon: 'fa fa-search', command: () => this.findAndReplace() }
  ];

  // View menu items
  viewMenuItems = [
    { 
      label: 'Zoom', 
      icon: 'fa fa-search-plus',
      items: [
        { label: 'Zoom In', icon: 'fa fa-search-plus', command: () => this.zoomIn() },
        { label: 'Zoom Out', icon: 'fa fa-search-minus', command: () => this.zoomOut() },
        { label: 'Reset Zoom', icon: 'fa fa-search', command: () => this.resetZoom() }
      ]
    },
    { 
      label: 'Theme', 
      icon: 'fa fa-adjust',
      items: [
        { label: 'Light Theme', icon: 'fa fa-sun', command: () => this.setTheme(false) },
        { label: 'Dark Theme', icon: 'fa fa-moon', command: () => this.setTheme(true) },
        { label: 'Auto', icon: 'fa fa-adjust', command: () => this.setTheme('auto') }
      ]
    },
    { label: 'Fullscreen', icon: 'fa fa-expand', command: () => this.toggleFullscreen() },
    { label: 'Source Code', icon: 'fa fa-code', command: () => this.toggleSource() }
  ];

  // Insert menu items
  insertMenuItems = [
    { label: 'Image', icon: 'fa fa-image', command: () => this.showImage = true },
    { label: 'Link', icon: 'fa fa-link', command: () => this.showLink = true },
    { label: 'Table', icon: 'fa fa-table', command: () => this.showTableConfig = true },
    { label: 'Horizontal Line', icon: 'fa fa-minus', command: () => this.insertHorizontalRule() },
    { separator: true },
    { label: 'Emoji', icon: 'fa fa-smile', command: () => this.showEmojiPicker = true },
    { label: 'Special Character', icon: 'fa fa-percentage', command: () => this.showSpecialChars = true },
    { label: 'Code Block', icon: 'fa fa-code', command: () => this.showCodeDialog = true },
    { separator: true },
    { label: 'Date & Time', icon: 'fa fa-calendar', command: () => this.insertDateTime() },
    { label: 'Page Break', icon: 'fa fa-file-alt', command: () => this.insertPageBreak() }
  ];

  private isResizing = false;
  private onChange = (value: string) => {};
  private onTouched = () => {};
  private destroy$ = new Subject<void>();
  private originalStyles: any = {};
  private zoomLevel = 1.0;

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private renderer: Renderer2,
    private messageService: MessageService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['width'] || changes['height']) {
      this.updateEditorDimensions();
    }
    if (changes['autoSave'] || changes['autoSaveInterval']) {
      this.setupAutoSave();
    }
  }

  ngAfterViewInit() {
    this.updateEditorContent();
    this.setupEditor();
    this.setupWordCounter();
    this.setupAutoSave();
    this.updateEditorDimensions();
    this.checkViewport();
    this.updateOverflowMenu();
  
    window.addEventListener('resize', () => this.checkViewport());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.restoreFullscreenStyles();
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }
    window.removeEventListener('resize', () => this.checkViewport());
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardShortcuts(event: KeyboardEvent) {
    // Only handle if editor is focused
    if (!this.editor.nativeElement.contains(document.activeElement)) return;

    // Ctrl/Cmd + Key combinations
    if (event.ctrlKey || event.metaKey) {
      switch(event.key.toLowerCase()) {
        case 'b':
          event.preventDefault();
          this.exec('bold');
          break;
        case 'i':
          event.preventDefault();
          this.exec('italic');
          break;
        case 'u':
          event.preventDefault();
          this.exec('underline');
          break;
        case 'k':
          event.preventDefault();
          this.showLink = true;
          break;
        case 'z':
          event.preventDefault();
          if (event.shiftKey) this.redo();
          else this.undo();
          break;
        case 'y':
          event.preventDefault();
          this.redo();
          break;
        case 's':
          event.preventDefault();
          this.exportHTML();
          break;
        case 'p':
          event.preventDefault();
          this.printContent();
          break;
        case 'f':
          event.preventDefault();
          this.findAndReplace();
          break;
        case 'h':
          event.preventDefault();
          this.showHistoryDialog = true;
          break;
        case '=':
        case '+':
          if (event.shiftKey || event.key === '=') {
            event.preventDefault();
            this.zoomIn();
          }
          break;
        case '-':
          event.preventDefault();
          this.zoomOut();
          break;
        case '0':
          if (event.ctrlKey) {
            event.preventDefault();
            this.resetZoom();
          }
          break;
      }
    }

    // F11 for fullscreen
    if (event.key === 'F11') {
      event.preventDefault();
      this.toggleFullscreen();
    }
  }

  private updateEditorDimensions() {
    if (this.editorContainer?.nativeElement) {
      const container = this.editorContainer.nativeElement;
      this.renderer.setStyle(container, 'width', this.width);
      this.renderer.setStyle(container, 'height', this.height);
      this.renderer.setStyle(container, 'min-height', this.minHeight);
      this.renderer.setStyle(container, 'max-height', this.maxHeight);
    }
  }

  private setupEditor() {
    this.editor.nativeElement.addEventListener('input', () => {
      this.sync();
      this.saveToHistory();
    });
    
    this.editor.nativeElement.addEventListener('blur', () => {
      this.onBlur();
      this.editorBlur.emit();
    });
    
    this.editor.nativeElement.addEventListener('focus', () => {
      this.editorFocus.emit();
    });
    
    this.editor.nativeElement.addEventListener('mouseup', () => this.detectFormatting());
    this.editor.nativeElement.addEventListener('keyup', () => this.detectFormatting());
    
    this.editor.nativeElement.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer!.dropEffect = 'copy';
    });
    
    this.editor.nativeElement.addEventListener('drop', e => {
      e.preventDefault();
      const file = e.dataTransfer?.files[0];
      if (file?.type.startsWith('image/')) {
        this.uploadImage(file);
      } else if (file?.type.startsWith('text/')) {
        this.readTextFile(file);
      }
    });
    
    // Paste event handling with rich formatting options
    this.editor.nativeElement.addEventListener('paste', (e: ClipboardEvent) => {
      e.preventDefault();
      
      const clipboardData = e.clipboardData;
      if (!clipboardData) return;
      
      // Check if there's HTML content
      const html = clipboardData.getData('text/html');
      const text = clipboardData.getData('text/plain');
      
      if (html && !this.shouldCleanPaste(e)) {
        // Paste with formatting
        this.exec('insertHTML', this.sanitizeHtml(html));
      } else {
        // Paste as plain text
        this.exec('insertText', this.sanitizeText(text));
      }
      
      this.sync();
    });
    
    // Initialize with placeholder
    if (!this._content.trim()) {
      this.editor.nativeElement.innerHTML = `<p style="color: #6b7280; font-style: italic;">${this.placeholder}</p>`;
    }
  }

 private shouldCleanPaste(event: ClipboardEvent): boolean {
  const kbEvent = event as ClipboardEvent & KeyboardEvent;
  return kbEvent.shiftKey || this.doc.queryCommandState('pasteAsText');
}


  private sanitizeHtml(html: string): string {
    // Remove potentially dangerous tags and attributes
    const div = document.createElement('div');
    div.innerHTML = html;
    
    // Remove script tags
    const scripts = div.querySelectorAll('script');
    scripts.forEach(script => script.remove());
    
    // Remove event handlers
    div.querySelectorAll('*').forEach(el => {
      Array.from(el.attributes).forEach(attr => {
        if (attr.name.startsWith('on')) {
          el.removeAttribute(attr.name);
        }
      });
    });
    
    return div.innerHTML;
  }

  private sanitizeText(text: string): string {
    return text
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/on\w+="[^"]*"/g, '');
  }

  private setupWordCounter() {
    this.editor.nativeElement.addEventListener('input', () => {
      setTimeout(() => this.updateStatistics(), 100);
    });
  }

  private updateStatistics() {
    const text = this.editor.nativeElement.innerText || '';
    const html = this.editor.nativeElement.innerHTML || '';
    
    // Word count
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    this.wordCount = words.length;
    
    // Character count
    this.charCount = text.length;
    this.charCountNoSpaces = text.replace(/\s+/g, '').length;
    
    // Paragraph count
    this.paragraphCount = (html.match(/<p[^>]*>/gi) || []).length;
    
    // Line count (approximate)
    this.lineCount = text.split(/\r\n|\r|\n/).length;
    
    // Reading time (assuming 200 words per minute)
    this.readingTime = Math.ceil(this.wordCount / 200);
    
    // Emit events
    this.wordCountChanged.emit(this.wordCount);
    this.charCountChanged.emit(this.charCount);
  }

  private setupAutoSave() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }
    
    if (this.autoSave && this.autoSaveInterval > 0) {
      this.autoSaveTimer = setInterval(() => {
        this.autoSaveContent();
      }, this.autoSaveInterval);
    }
  }

  private autoSaveContent() {
    const content = this._content;
    const timestamp = new Date().toISOString();
    
    try {
      localStorage.setItem(`editor_autosave_${timestamp}`, content);
      this.lastSaved = new Date();
      
      // Keep only last 10 autosaves
      const keys = Object.keys(localStorage).filter(key => key.startsWith('editor_autosave_'));
      if (keys.length > 10) {
        keys.sort().slice(0, keys.length - 10).forEach(key => localStorage.removeItem(key));
      }
      
      // this.messageService.add({
      //   severity: 'success',
      //   summary: 'Auto-saved',
      //   detail: 'Your content has been auto-saved',
      //   life: 2000
      // });
    } catch (e) {
      console.error('Auto-save failed:', e);
    }
  }
  restoreFromHistory(index: number) {
  if (index >= 0 && index < this.history.length) {
    this.currentHistoryIndex = index;
    const historyItem = this.history[index];
    this.editor.nativeElement.innerHTML = historyItem.content;
    this.sync();
  }
}
  private saveToHistory() {
    const content = this.editor.nativeElement.innerHTML;
    
    // Don't save if content hasn't changed
    if (this.history.length > 0 && this.history[this.currentHistoryIndex]?.content === content) {
      return;
    }
    
    // Remove any future history if we're not at the end
    if (this.currentHistoryIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentHistoryIndex + 1);
    }
    
    // Add new history item
    this.history.push({
      content: content,
      timestamp: new Date()
    });
    
    // Limit history size
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }
    
    this.currentHistoryIndex = this.history.length - 1;
  }

  undo() {
    if (this.currentHistoryIndex > 0) {
      this.currentHistoryIndex--;
      const historyItem = this.history[this.currentHistoryIndex];
      this.editor.nativeElement.innerHTML = historyItem.content;
      this.sync();
      
      this.messageService.add({
        severity: 'info',
        summary: 'Undo',
        detail: 'Action undone',
        life: 2000
      });
    }
  }

  redo() {
    if (this.currentHistoryIndex < this.history.length - 1) {
      this.currentHistoryIndex++;
      const historyItem = this.history[this.currentHistoryIndex];
      this.editor.nativeElement.innerHTML = historyItem.content;
      this.sync();
      
      this.messageService.add({
        severity: 'info',
        summary: 'Redo',
        detail: 'Action redone',
        life: 2000
      });
    }
  }

  private detectFormatting() {
    const selection = this.doc.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    try {
      this.isBold = this.doc.queryCommandState('bold');
      this.isItalic = this.doc.queryCommandState('italic');
      this.isUnderline = this.doc.queryCommandState('underline');
      this.isStrikethrough = this.doc.queryCommandState('strikethrough');
      
      // Detect superscript/subscript
      const range = selection.getRangeAt(0);
      const parentElement = range.commonAncestorContainer.parentElement;
      if (parentElement) {
        this.isSuperscript = parentElement.tagName === 'SUP' || 
                            window.getComputedStyle(parentElement).verticalAlign === 'super';
        this.isSubscript = parentElement.tagName === 'SUB' || 
                          window.getComputedStyle(parentElement).verticalAlign === 'sub';
      }
    } catch (e) {
      console.warn('Could not detect formatting:', e);
    }
  }

  private updateEditorContent(content?: string) {
    const valueToUse = content !== undefined ? content : this._content;
    
    if (!this.editor?.nativeElement) return;
    
    if (this.isSource) {
      this.editor.nativeElement.textContent = valueToUse || '';
    } else {
      this.editor.nativeElement.innerHTML = valueToUse || `<p style="color: #6b7280; font-style: italic;">${this.placeholder}</p>`;
    }
    
    this.updateStatistics();
    this.cdRef.detectChanges();
  }

  // Editor Actions
  exec(cmd: string, value?: any, showDefaultUI = false) {
    this.doc.execCommand(cmd, showDefaultUI, value);
    this.editor.nativeElement.focus();
    this.sync();
    this.detectFormatting();
  }

  changeFont(font: FontOption) {
    this.currentFont = font;
    this.exec('fontName', font.value);
  }

  changeFontSize(sizeOption: any) {
    this.currentFontSize = sizeOption;
    
    // Use CSS styling for better control
    const selection = this.doc.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (!range.collapsed) {
        const span = this.doc.createElement('span');
        span.style.fontSize = sizeOption.value;
        span.style.lineHeight = this.currentLineHeight.toString();
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

  changeHeading(heading: any) {
    this.currentHeading = heading;
    if (heading.value === 'p') {
      this.exec('formatBlock', '<p>');
    } else if (heading.value === 'title') {
      this.exec('formatBlock', '<h1>');
      this.exec('fontSize', '7');
    } else if (heading.value === 'subtitle') {
      this.exec('formatBlock', '<h2>');
      this.exec('fontSize', '6');
    } else {
      this.exec('formatBlock', `<${heading.value}>`);
    }
  }

  changeAlignment(alignment: string) {
    this.currentAlignment = alignment;
    this.exec('justifyLeft'); // Reset first
    if (alignment !== 'left') {
      this.exec('justify' + alignment.charAt(0).toUpperCase() + alignment.slice(1));
    }
  }

  changeLineHeight(lineHeight: number) {
    this.currentLineHeight = lineHeight;
    this.exec('lineHeight', lineHeight.toString());
  }

  insertLink() {
    if (!this.linkUrl) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter a URL'
      });
      return;
    }

    const rel = this.linkNoFollow ? 'nofollow' : '';
    const target = this.linkNewTab ? '_blank' : '_self';
    const text = this.linkText || this.linkUrl;
    const title = this.linkTitle ? ` title="${this.linkTitle}"` : '';
    
    const html = `<a href="${this.linkUrl}" target="${target}"${title} ${rel ? `rel="${rel}"` : ''} 
                 style="color:#3b82f6; text-decoration:underline;">${text}</a>`;
    
    this.exec('insertHTML', html);
    this.showLink = false;
    this.linkUrl = this.linkText = this.linkTitle = '';
    
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Link inserted successfully'
    });
  }

  uploadImage(file: File) {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select an image file (JPG, PNG, GIF, WebP)'
      });
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Image size should be less than 10MB'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const img = `<img src="${e.target.result}" 
                  style="max-width:100%; height:auto; border-radius:8px; margin:16px 0; cursor:move; display: block;" 
                  class="editor-image" 
                  data-filename="${file.name}"
                  data-size="${file.size}"
                  data-type="${file.type}"
                  contenteditable="false">`;
      this.exec('insertHTML', img);
      
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Image uploaded successfully'
      });
    };
    
    reader.onerror = () => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to read image file'
      });
    };
    
    reader.readAsDataURL(file);
    this.showImage = false;
  }

  readTextFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.exec('insertText', e.target.result);
      
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Text file imported successfully'
      });
    };
    reader.readAsText(file);
  }

  insertTable() {
    const { rows, cols, header, border, striped, cellPadding } = this.tableConfig;
    
    let tableHTML = `<table class="editor-table" style="border-collapse: collapse; width: 100%; margin: 16px 0;" contenteditable="false">`;
    
    if (header) {
      tableHTML += '<thead><tr>';
      for (let c = 0; c < cols; c++) {
        tableHTML += `<th style="border: ${border ? '1px solid #ccc' : 'none'}; padding: ${cellPadding}px; background: #f3f4f6; text-align: left;">Header ${c + 1}</th>`;
      }
      tableHTML += '</tr></thead>';
    }
    
    tableHTML += '<tbody>';
    for (let r = 0; r < rows; r++) {
      const rowClass = striped && r % 2 === 0 ? 'style="background: #f9fafb;"' : '';
      tableHTML += `<tr ${rowClass}>`;
      for (let c = 0; c < cols; c++) {
        tableHTML += `<td style="border: ${border ? '1px solid #ccc' : 'none'}; padding: ${cellPadding}px;">Cell ${r + 1}-${c + 1}</td>`;
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
    const languageClass = this.codeLanguage !== 'plain' ? `language-${this.codeLanguage}` : '';
    
    if (this.codeLanguage === 'html') {
      codeHTML = `<pre><code class="${languageClass}" style="
        background: #1e293b; 
        color: #e2e8f0; 
        padding: 16px; 
        border-radius: 8px; 
        overflow-x: auto;
        font-family: 'Courier New', monospace;
        tab-size: 2;
        margin: 16px 0;">${this.escapeHtml(this.codeContent)}</code></pre>`;
    } else {
      codeHTML = `<pre><code class="${languageClass}" style="
        background: #f8fafc; 
        color: #0f172a; 
        padding: 16px; 
        border-radius: 8px; 
        overflow-x: auto;
        font-family: 'Courier New', monospace;
        border: 1px solid #e2e8f0;
        tab-size: 2;
        margin: 16px 0;">${this.escapeHtml(this.codeContent)}</code></pre>`;
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

  insertDateTime() {
    const now = new Date();
    const dateTime = now.toLocaleString();
    this.exec('insertText', dateTime);
  }

  insertPageBreak() {
    this.exec('insertHTML', '<div style="page-break-after: always; break-after: page;"></div>');
  }

  pasteAsText() {
    this.exec('pasteAsText');
  }

  findAndReplace() {
    const find = prompt('Find:', '');
    if (!find) return;
    
    const replace = prompt('Replace with:', '');
    if (replace === null) return;
    
    const content = this.editor.nativeElement.innerHTML;
    const newContent = content.replace(new RegExp(this.escapeRegExp(find), 'gi'), replace);
    this.editor.nativeElement.innerHTML = newContent;
    this.sync();
  }

  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  clearFormatting() {
    this.exec('removeFormat');
    this.exec('styleWithCSS', false);
    this.detectFormatting();
    
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Formatting cleared'
    });
  }

  newDocument() {
    if (confirm('Are you sure you want to create a new document? Unsaved changes will be lost.')) {
      this.editor.nativeElement.innerHTML = `<p style="color: #6b7280; font-style: italic;">${this.placeholder}</p>`;
      this.sync();
      this.history = [];
      this.currentHistoryIndex = -1;
      
      this.messageService.add({
        severity: 'success',
        summary: 'New Document',
        detail: 'New document created'
      });
    }
  }

  setTheme(isDark: boolean | 'auto') {
    if (isDark === 'auto') {
      this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      this.isDark = isDark;
    }
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
    if (!this.allowFullscreen) return;
    
    this.isFullscreen = !this.isFullscreen;
    
    if (this.isFullscreen) {
      this.enterFullscreen();
    } else {
      this.exitFullscreen();
    }
  }

  private enterFullscreen() {
    const element = this.editorContainer.nativeElement;
    
    // Store original styles
    this.originalStyles = {
      position: element.style.position,
      top: element.style.top,
      left: element.style.left,
      width: element.style.width,
      height: element.style.height,
      zIndex: element.style.zIndex,
      margin: element.style.margin,
      borderRadius: element.style.borderRadius,
      maxWidth: element.style.maxWidth,
      maxHeight: element.style.maxHeight
    };
    
    this.renderer.setStyle(element, 'position', 'fixed');
    this.renderer.setStyle(element, 'top', '0');
    this.renderer.setStyle(element, 'left', '0');
    this.renderer.setStyle(element, 'width', '100vw');
    this.renderer.setStyle(element, 'height', '100vh');
    this.renderer.setStyle(element, 'zIndex', '9999');
    this.renderer.setStyle(element, 'margin', '0');
    this.renderer.setStyle(element, 'borderRadius', '0');
    this.renderer.setStyle(element, 'maxWidth', 'none');
    this.renderer.setStyle(element, 'maxHeight', 'none');
    this.renderer.setStyle(element, 'background', this.isDark ? '#1f2937' : '#ffffff');
    
    document.body.style.overflow = 'hidden';
  }

  private exitFullscreen() {
    const element = this.editorContainer.nativeElement;
    this.restoreFullscreenStyles();
    document.body.style.overflow = '';
  }

  private restoreFullscreenStyles() {
    const element = this.editorContainer.nativeElement;
    if (this.originalStyles) {
      Object.keys(this.originalStyles).forEach(key => {
        this.renderer.setStyle(element, key, this.originalStyles[key] || '');
      });
    }
  }

  zoomIn() {
    this.zoomLevel = Math.min(this.zoomLevel + 0.1, 3.0);
    this.applyZoom();
  }

  zoomOut() {
    this.zoomLevel = Math.max(this.zoomLevel - 0.1, 0.5);
    this.applyZoom();
  }

  resetZoom() {
    this.zoomLevel = 1.0;
    this.applyZoom();
  }

  private applyZoom() {
    this.renderer.setStyle(this.editor.nativeElement, 'transform', `scale(${this.zoomLevel})`);
    this.renderer.setStyle(this.editor.nativeElement, 'transform-origin', 'top left');
    
    this.messageService.add({
      severity: 'info',
      summary: 'Zoom',
      detail: `${Math.round(this.zoomLevel * 100)}%`,
      life: 1000
    });
  }
get content(): string {
  return this._content;
}
  printContent() {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const title = document.title || 'Document';
      const content = this.isSource ? 
        `<pre>${this.escapeHtml(this._content)}</pre>` : 
        this.editor.nativeElement.innerHTML;
      
      printWindow.document.write(`
        <html>
          <head>
            <title>Print ${title}</title>
            <style>
              @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
              body { 
                font-family: Arial, sans-serif; 
                padding: 40px; 
                line-height: 1.6;
                color: #000;
              }
              .editor-content * { 
                max-width: 100% !important; 
                page-break-inside: avoid;
              }
              table { 
                border-collapse: collapse; 
                width: 100%; 
                margin: 20px 0;
              }
              th, td { 
                border: 1px solid #ddd; 
                padding: 8px; 
                text-align: left;
              }
              th { background: #f5f5f5; }
              img { max-width: 100%; height: auto; }
              pre { 
                background: #f5f5f5; 
                padding: 15px; 
                border-radius: 5px;
                overflow-x: auto;
                white-space: pre-wrap;
              }
              @media print {
                body { padding: 0; }
                .no-print { display: none; }
                @page { margin: 2cm; }
              }
            </style>
          </head>
          <body>
            <div class="editor-content">
              ${content}
            </div>
            <div class="no-print" style="margin-top: 30px; text-align: center; color: #666;">
              <p>Printed from ${title} on ${new Date().toLocaleString()}</p>
            </div>
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() {
                  window.close();
                }, 100);
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  }

  exportHTML() {
    const content = this.editor.nativeElement.innerHTML;
    const title = prompt('Enter file name:', `document-${new Date().getTime()}`) || 'document';
    
    const blob = new Blob([`<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px;
        }
        h1, h2, h3, h4, h5, h6 { 
            color: #2c3e50; 
            margin-top: 1.5em; 
            margin-bottom: 0.5em;
        }
        p { margin: 1em 0; }
        a { color: #3498db; text-decoration: none; }
        a:hover { text-decoration: underline; }
        img { max-width: 100%; height: auto; }
        table { 
            border-collapse: collapse; 
            width: 100%; 
            margin: 1em 0;
        }
        th, td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left;
        }
        th { background: #f5f5f5; }
        blockquote { 
            border-left: 4px solid #3498db; 
            margin: 1.5em 0; 
            padding-left: 1em; 
            color: #555;
        }
        pre { 
            background: #f8f9fa; 
            padding: 1em; 
            border-radius: 5px; 
            overflow-x: auto;
            border: 1px solid #e9ecef;
        }
        code { font-family: 'Courier New', monospace; }
    </style>
</head>
<body>
    ${content}
    <footer style="margin-top: 3em; padding-top: 1em; border-top: 1px solid #eee; color: #777; font-size: 0.9em;">
        <p>Exported on ${new Date().toLocaleString()}</p>
    </footer>
</body>
</html>`], { type: 'text/html' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; 
    a.download = `${title}.html`; 
    a.click();
    URL.revokeObjectURL(url);
    
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'HTML exported successfully'
    });
  }

  exportText() {
    const text = this.editor.nativeElement.innerText || '';
    const title = prompt('Enter file name:', `document-${new Date().getTime()}`) || 'document';
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; 
    a.download = `${title}.txt`; 
    a.click();
    URL.revokeObjectURL(url);
    
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Text exported successfully'
    });
  }

  exportPDF() {
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'PDF export would require a PDF generation library. Consider using jsPDF or similar.'
    });
  }

  showPreview() {
    this.showPreviewDialog = true;
  }

  checkSpelling() {
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Spell check would be implemented with a proper spell check API'
    });
  }

  wordCountInfo() {
    this.messageService.add({
      severity: 'info',
      summary: 'Document Statistics',
      detail: `Words: ${this.wordCount} | Characters: ${this.charCount} (${this.charCountNoSpaces} without spaces) | Paragraphs: ${this.paragraphCount} | Reading Time: ${this.readingTime} min`,
      life: 5000
    });
  }

  onResize(event: ResizeEvent) {
    if (event.rectangle.width && event.rectangle.height) {
      this.width = `${event.rectangle.width}px`;
      this.height = `${event.rectangle.height}px`;
    }
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
      this.contentChanged.emit(this._content);
      this.updateStatistics();
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
    this.isReadOnly = isDisabled;
    if (this.editor?.nativeElement) {
      this.editor.nativeElement.contentEditable = isDisabled ? 'false' : 'true';
    }
  }
}