import { Injectable } from '@angular/core';
import { EditorState, FormattingState, EditorMetadata } from './editor-style.interface';

@Injectable({
  providedIn: 'root'
})
export class TextEditorService {
  private editorState: EditorState = {
    content: '',
    selection: null,
    formatting: {
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
    },
    metadata: {
      version: '',
      generator: '',
      lastModifiedBy: '',
      createdBy: '',
      createdDate: new Date(),
      modifiedDate: new Date(),
      totalEdits: 0,
      totalTime: 0,
      wordCount: 0,
      charCount: 0
    },
    version: '1.0.0',
    lastModified: new Date(),
    created: new Date(),
    author: '',
    title: '',
    description: '',
    keywords: [],
    language: 'en',
    category: '',
    tags: [],
    status: 'draft',
    visibility: 'public',
    permissions: {},
    collaborators: [],
    comments: [],
    trackChanges: [],
    revisions: [],
    bookmarks: [],
    annotations: [],
    highlights: [],
    links: [],
    images: [],
    tables: [],
    media: [],
    codeBlocks: [],
    templates: [],
    styles: [],
    scripts: [],
    customData: {}
  };

  constructor() { }

  getState(): EditorState {
    return { ...this.editorState };
  }

  setState(state: Partial<EditorState>): void {
    this.editorState = { ...this.editorState, ...state };
    this.editorState.lastModified = new Date();
  }

  updateContent(content: string): void {
    this.editorState.content = content;
    this.editorState.lastModified = new Date();
    this.editorState.metadata.totalEdits++;
  }

  updateSelection(selection: Selection | null): void {
    this.editorState.selection = selection;
  }

  updateFormatting(formatting: Partial<FormattingState>): void {
    this.editorState.formatting = { ...this.editorState.formatting, ...formatting };
  }

  updateMetadata(metadata: Partial<EditorMetadata>): void {
    this.editorState.metadata = { ...this.editorState.metadata, ...metadata };
  }

  resetState(): void {
    this.editorState = {
      content: '',
      selection: null,
      formatting: {
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
      },
      metadata: {
        version: '',
        generator: '',
        lastModifiedBy: '',
        createdBy: '',
        createdDate: new Date(),
        modifiedDate: new Date(),
        totalEdits: 0,
        totalTime: 0,
        wordCount: 0,
        charCount: 0
      },
      version: '1.0.0',
      lastModified: new Date(),
      created: new Date(),
      author: '',
      title: '',
      description: '',
      keywords: [],
      language: 'en',
      category: '',
      tags: [],
      status: 'draft',
      visibility: 'public',
      permissions: {},
      collaborators: [],
      comments: [],
      trackChanges: [],
      revisions: [],
      bookmarks: [],
      annotations: [],
      highlights: [],
      links: [],
      images: [],
      tables: [],
      media: [],
      codeBlocks: [],
      templates: [],
      styles: [],
      scripts: [],
      customData: {}
    };
  }
}