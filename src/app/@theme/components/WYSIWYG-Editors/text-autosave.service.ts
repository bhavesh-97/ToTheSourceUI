import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextAutosaveService {
  private saveInterval: any = null;
  private isEnabled = false;
  private saveCallback: ((content: string) => void) | null = null;
  private lastSavedContent: string = '';

  constructor() { }

  /**
   * Start autosave with a callback function
   * @param callback Function to call when autosave triggers
   * @param intervalMs Interval in milliseconds between saves (default: 30000)
   */
  start(callback: (content: string) => void, intervalMs: number = 30000): void {
    this.saveCallback = callback;
    this.isEnabled = true;
    
    // Clear any existing interval
    if (this.saveInterval) {
      clearInterval(this.saveInterval);
    }
    
    // Set new interval
    this.saveInterval = setInterval(() => {
      this.performSave();
    }, intervalMs);
  }

  /**
   * Stop autosave
   */
  stop(): void {
    this.isEnabled = false;
    if (this.saveInterval) {
      clearInterval(this.saveInterval);
      this.saveInterval = null;
    }
    this.saveCallback = null;
  }

  /**
   * Perform a save operation
   */
  private performSave(): void {
    if (this.saveCallback && this.isEnabled) {
      // In a real implementation, we would get the current content from the editor
      // For now, we'll just call the callback with empty string
      // The component should pass the actual content when calling start()
      this.saveCallback(this.lastSavedContent);
    }
  }

  /**
   * Update the content to be saved
   * @param content The current editor content
   */
  updateContent(content: string): void {
    this.lastSavedContent = content;
  }

  /**
   * Check if autosave is currently enabled
   */
  isSavingEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Force an immediate save
   */
  forceSave(): void {
    this.performSave();
  }
}