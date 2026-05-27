import { Injectable } from '@angular/core';

interface FormattingState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  superscript: boolean;
  subscript: boolean;
  code: boolean;
  blockquote: boolean;
  list: boolean;
  orderedList: boolean;
  unorderedList: boolean;
  heading: boolean;
  paragraph: boolean;
  link: boolean;
  image: boolean;
  table: boolean;
  pre: boolean;
  codeBlock: boolean;
  currentFont?: string;
  currentFontSize?: string;
  currentColor?: string;
  currentBackground?: string;
  currentAlignment?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TextFormattingService {
  constructor() { }

  /**
   * Apply bold formatting
   */
  toggleBold(): void {
    document.execCommand('bold', false);
  }

  /**
   * Apply italic formatting
   */
  toggleItalic(): void {
    document.execCommand('italic', false);
  }

  /**
   * Apply underline formatting
   */
  toggleUnderline(): void {
    document.execCommand('underline', false);
  }

  /**
   * Apply strikethrough formatting
   */
  toggleStrikethrough(): void {
    document.execCommand('strikeThrough', false);
  }

  /**
   * Apply superscript formatting
   */
  toggleSuperscript(): void {
    document.execCommand('superscript', false);
  }

  /**
   * Apply subscript formatting
   */
  toggleSubscript(): void {
    document.execCommand('subscript', false);
  }

  /**
   * Apply code formatting
   */
  toggleCode(): void {
    document.execCommand('formatBlock', false, 'code');
  }

  /**
   * Apply blockquote formatting
   */
  toggleBlockquote(): void {
    document.execCommand('formatBlock', false, 'blockquote');
  }

  /**
   * Apply heading formatting
   */
  toggleHeading(level: string = 'H1'): void {
    document.execCommand('formatBlock', false, `<H${level}>`);
  }

  /**
   * Apply paragraph formatting
   */
  toggleParagraph(): void {
    document.execCommand('formatBlock', false, 'P');
  }

  /**
   * Apply unordered list formatting
   */
  toggleUnorderedList(): void {
    document.execCommand('insertUnorderedList', false);
  }

  /**
   * Apply ordered list formatting
   */
  toggleOrderedList(): void {
    document.execCommand('insertOrderedList', false);
  }

  /**
   * Apply text color
   */
  setTextColor(color: string): void {
    document.execCommand('foreColor', false, color);
  }

  /**
   * Apply background color
   */
  setBackgroundColor(color: string): void {
    document.execCommand('backColor', false, color);
  }

  /**
   * Apply font name
   */
  setFontName(font: string): void {
    document.execCommand('fontName', false, font);
  }

  /**
   * Apply font size
   */
  setFontSize(size: string): void {
    document.execCommand('fontSize', false, size);
  }

  /**
   * Apply text alignment
   */
  setAlignment(align: 'left' | 'center' | 'right' | 'justify'): void {
    switch (align) {
      case 'left':
        document.execCommand('justifyLeft', false);
        break;
      case 'center':
        document.execCommand('justifyCenter', false);
        break;
      case 'right':
        document.execCommand('justifyRight', false);
        break;
      case 'justify':
        document.execCommand('justifyFull', false);
        break;
    }
  }

  /**
   * Clear all formatting
   */
  clearFormatting(): void {
    document.execCommand('removeFormat', false);
  }

  /**
   * Insert horizontal rule
   */
  insertHorizontalRule(): void {
    document.execCommand('insertHorizontalRule', false);
  }

  /**
   * Insert link
   */
  insertLink(url: string, text?: string): void {
    if (text) {
      document.execCommand('createLink', false, url);
      // Additional logic to set link text if needed
    } else {
      document.execCommand('createLink', false, url);
    }
  }

  /**
   * Remove link
   */
  removeLink(): void {
    document.execCommand('unlink', false);
  }

  /**
   * Insert image
   */
  insertImage(src: string, alt: string = ''): void {
    document.execCommand('insertImage', false, src);
    // Additional logic to set alt text if needed
  }

 getCurrentFormatting(): FormattingState {
  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0) {
    return this.emptyFormatting();
  }

  let node = selection.anchorNode as Node | null;

  if (node?.nodeType === Node.TEXT_NODE) {
    node = node.parentNode;
  }

  const element = node as HTMLElement | null;

  return {
    bold: this.hasTag(element, ['B', 'STRONG']),
    italic: this.hasTag(element, ['I', 'EM']),
    underline: this.hasTag(element, ['U']),
    strikethrough: this.hasTag(element, ['S', 'STRIKE']),
    superscript: this.hasTag(element, ['SUP']),
    subscript: this.hasTag(element, ['SUB']),

    code: this.hasTag(element, ['CODE']),
    codeBlock: this.hasTag(element, ['PRE', 'CODE']),
    pre: this.hasTag(element, ['PRE']),

    blockquote: this.hasTag(element, ['BLOCKQUOTE']),

    orderedList: this.hasTag(element, ['OL']),
    unorderedList: this.hasTag(element, ['UL']),
    list:
      this.hasTag(element, ['OL']) ||
      this.hasTag(element, ['UL']),

    heading: this.hasTag(element, [
      'H1',
      'H2',
      'H3',
      'H4',
      'H5',
      'H6'
    ]),

    paragraph: this.hasTag(element, ['P']),

    link: this.hasTag(element, ['A']),
    image: this.hasTag(element, ['IMG']),
    table: this.hasTag(element, ['TABLE'])
  };
}
  private hasTag(element: HTMLElement | null,tags: string[]): boolean {
    let current: HTMLElement | null = element;

    while (current) {
      if (tags.includes(current.tagName)) {
        return true;
      }
  
      current = current.parentElement;
    }

    return false;
  }
  private emptyFormatting(): FormattingState {
  return {
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    superscript: false,
    subscript: false,
    code: false,
    blockquote: false,
    list: false,
    orderedList: false,
    unorderedList: false,
    heading: false,
    paragraph: false,
    link: false,
    image: false,
    table: false,
    pre: false,
    codeBlock: false
  };
}
  /**
   * Check if a specific formatting is active
   */
  isFormattingActive(command: string): boolean {
    return document.queryCommandState(command);
  }

  /**
   * Get the value of a formatting command
   */
  getFormattingValue(command: string): string {
    return document.queryCommandValue(command);
  }
}