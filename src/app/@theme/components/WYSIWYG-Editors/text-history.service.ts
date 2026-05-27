import { Injectable } from '@angular/core';
import { EditorState } from './editor-style.interface';

@Injectable({
  providedIn: 'root'
})
export class TextHistoryService {
  private history: EditorState[] = [];
  private currentIndex = -1;
  private maxSize: number;

  constructor() {
    this.maxSize = 100; // default, can be configured
  }

  /**
   * Set the maximum size of the history stack
   */
  setMaxSize(size: number): void {
    this.maxSize = size;
    // Trim history if it exceeds the new max size
    while (this.history.length > this.maxSize) {
      this.history.shift();
      this.currentIndex = Math.max(-1, this.currentIndex - 1);
    }
  }

  /**
   * Push a new state to the history stack
   * Any states after the current index are discarded (as per typical undo/redo behavior)
   */
  push(state: EditorState): void {
    // Remove any states after the current index (if we're not at the top)
    this.history = this.history.slice(0, this.currentIndex + 1);
    
    // Add the new state
    this.history.push(state);
    this.currentIndex++;
    
    // Enforce max size
    if (this.history.length > this.maxSize) {
      this.history.shift();
      this.currentIndex--;
    }
  }

  /**
   * Undo to the previous state
   * @returns The previous state or null if none available
   */
  undo(): EditorState | null {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.history[this.currentIndex];
    }
    return null;
  }

  /**
   * Redo to the next state
   * @returns The next state or null if none available
   */
  redo(): EditorState | null {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      return this.history[this.currentIndex];
    }
    return null;
  }

  /**
   * Get the current state from history
   * @returns The current state or null if history is empty
   */
  getCurrent(): EditorState | null {
    if (this.currentIndex >= 0 && this.currentIndex < this.history.length) {
      return this.history[this.currentIndex];
    }
    return null;
  }

  /**
   * Check if undo is available
   */
  canUndo(): boolean {
    return this.currentIndex > 0;
  }

  /**
   * Check if redo is available
   */
  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  /**
   * Clear the history stack
   */
  clear(): void {
    this.history = [];
    this.currentIndex = -1;
  }

  /**
   * Get the number of items in the history stack
   */
  size(): number {
    return this.history.length;
  }

  /**
   * Get the current index in the history stack
   */
  getCurrentIndex(): number {
    return this.currentIndex;
  }
}