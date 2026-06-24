import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import { DynamicDataConfig } from '../dynamic-data.model';
import { DynamicDataService } from '../dynamic-data.service';

@Component({
  selector: 'app-api-test-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, DialogModule, TextareaModule, TagModule],
  templateUrl: './api-test-dialog.component.html',
  styleUrls: ['./api-test-dialog.component.scss'],
})
export class ApiTestDialogComponent {
  private dynamicDataService = inject(DynamicDataService);

  visible = input(false);
  config = input<DynamicDataConfig | null>(null);
  closeDialog = output<void>();

  testing = signal(false);
  result = signal<any>(null);
  error = signal('');
  duration = signal(0);
  hasRun = signal(false);

  runTest(): void {
    const cfg = this.config();
    if (!cfg || !cfg.apiUrl) return;

    this.testing.set(true);
    this.hasRun.set(true);
    this.result.set(null);
    this.error.set('');

    this.dynamicDataService.testApiCall(cfg).subscribe(res => {
      this.result.set(res.data);
      this.error.set(res.error);
      this.duration.set(res.duration);
      this.testing.set(false);
    });
  }

  get responsePreview(): string {
    const data = this.result();
    if (!data) return '';
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  }

  get availableKeys(): string[] {
    const data = this.result();
    if (!data || typeof data !== 'object') return [];
    if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
      return Object.keys(data[0]);
    }
    return Object.keys(data);
  }

  onClose(): void {
    this.result.set(null);
    this.error.set('');
    this.hasRun.set(false);
    this.closeDialog.emit();
  }
}
