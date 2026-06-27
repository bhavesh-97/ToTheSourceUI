import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { InputNumberModule } from 'primeng/inputnumber';
import { SectionDataField, DATA_TYPE_OPTIONS, DATA_TYPE_GROUPS, createEmptyField, duplicateField, SectionDataType, fieldsToRecord } from '../section-data-field.model';
import { ApiTestDialogComponent } from '../api-test-dialog/api-test-dialog.component';
import { ApiDataConfigModel } from '../api-data-config.model';

@Component({
  selector: 'app-dynamic-data-panel',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ButtonModule, InputTextModule, TextareaModule,
    SelectModule, ToggleSwitchModule, TooltipModule, TagModule, InputNumberModule,
    ApiTestDialogComponent,
  ],
  templateUrl: './dynamic-data-panel.component.html',
  styleUrls: ['./dynamic-data-panel.component.scss'],
})
export class DynamicDataPanelComponent {
  manualFields = input<SectionDataField[]>([]);
  manualFieldsChange = output<SectionDataField[]>();
  apiConfig = input<ApiDataConfigModel | null>(null);
  apiConfigChange = output<ApiDataConfigModel | null>();

  activeTab = signal<'manual' | 'api'>('manual');
  showApiTest = signal(false);
  dataTypeOptions = DATA_TYPE_OPTIONS;
  dataTypeGroups = DATA_TYPE_GROUPS;
  expandedField = signal<number | null>(null);

  apiMethodOptions = [
    { label: 'GET', value: 'GET' },
    { label: 'POST', value: 'POST' },
    { label: 'PUT', value: 'PUT' },
    { label: 'DELETE', value: 'DELETE' },
  ];



  iconOptions = [
    'pi pi-star', 'pi pi-heart', 'pi pi-check', 'pi pi-times', 'pi pi-plus', 'pi pi-minus',
    'pi pi-search', 'pi pi-user', 'pi pi-users', 'pi pi-lock', 'pi pi-unlock', 'pi pi-cog',
    'pi pi-home', 'pi pi-folder', 'pi pi-file', 'pi pi-image', 'pi pi-video', 'pi pi-camera',
    'pi pi-phone', 'pi pi-envelope', 'pi pi-map-marker', 'pi pi-clock', 'pi pi-calendar',
    'pi pi-link', 'pi pi-external-link', 'pi pi-download', 'pi pi-upload', 'pi pi-cloud',
    'pi pi-database', 'pi pi-server', 'pi pi-desktop', 'pi pi-mobile', 'pi pi-tablet',
    'pi pi-shopping-cart', 'pi pi-credit-card', 'pi pi-wallet', 'pi pi-dollar',
    'pi pi-chart-bar', 'pi pi-chart-line', 'pi pi-chart-pie', 'pi pi-bell', 'pi pi-bookmark',
    'pi pi-tag', 'pi pi-share-alt', 'pi pi-reply', 'pi pi-forward', 'pi pi-print',
    'pi pi-refresh', 'pi pi-sync', 'pi pi-history', 'pi pi-arrow-up', 'pi pi-arrow-down',
    'pi pi-arrow-left', 'pi pi-arrow-right', 'pi pi-chevron-up', 'pi pi-chevron-down',
    'pi pi-chevron-left', 'pi pi-chevron-right', 'pi pi-sort', 'pi pi-filter',
    'pi pi-eye', 'pi pi-eye-slash', 'pi pi-shield', 'pi pi-flag', 'pi pi-book',
    'pi pi-graduation-cap', 'pi pi-globe', 'pi pi-comment', 'pi pi-comments',
    'pi pi-thumbs-up', 'pi pi-thumbs-down', 'pi pi-smile', 'pi pi-moon', 'pi pi-sun',
    'pi pi-bolt', 'pi pi-fire', 'pi pi-key', 'pi pi-microphone', 'pi pi-volume-up',
    'pi pi-play', 'pi pi-pause', 'pi pi-stop', 'pi pi-forward', 'pi pi-backward',
  ];

  tipDataSource = 'Configure where this section gets its data.';
  tipApiUrl = 'Full URL of the REST endpoint to fetch data from';
  tipHeaders = 'Optional HTTP headers (e.g. Authorization)';
  tipBody = 'JSON body for POST/PUT requests';
  tipCache = 'How long to cache the API response. 0 = no cache.';
  tipDataFields = 'Add key-value pairs. Use the key name in your template HTML to display these values.';
  tipSyntax = '<span>Use <code>{' + '{' + 'variableName' + '}' + '}</code> in your template HTML to bind these values. Supports nested: <code>{' + '{' + 'item.title' + '}' + '}</code></span>';

  // --- Sanitization ---

  private sanitizeFieldKey(key: string): string {
    return key.replace(/[^a-zA-Z0-9_]/g, '').substring(0, 255);
  }

  private sanitizeFieldValue(value: string, type: string): string {
    if (!value) return value;
    if (type === 'html' || type === 'richtext') {
      return value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
        .replace(/javascript\s*:/gi, '')
        .replace(/data\s*:\s*text\/html/gi, '')
        .substring(0, 50000);
    }
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .substring(0, 50000);
  }

  private sanitizeFieldLabel(label: string): string {
    if (!label) return label;
    return label.replace(/<[^>]*>/g, '').substring(0, 255);
  }

  setActiveTab(tab: 'manual' | 'api'): void {
    this.activeTab.set(tab);
  }

  // --- Manual Field Methods ---

  addManualField(): void {
    const fields = [...this.manualFields(), createEmptyField()];
    this.manualFieldsChange.emit(fields);
  }

  duplicateManualField(index: number): void {
    const fields = [...this.manualFields()];
    fields.splice(index + 1, 0, duplicateField(this.manualFields()[index]));
    this.manualFieldsChange.emit(fields);
  }

  removeManualField(index: number): void {
    const fields = this.manualFields().filter((_, i) => i !== index);
    this.manualFieldsChange.emit(fields);
  }

  updateManualField(index: number, patch: Partial<SectionDataField>): void {
    const fields = [...this.manualFields()];
    const sanitized = { ...patch };
    if (sanitized.key !== undefined) sanitized.key = this.sanitizeFieldKey(sanitized.key);
    if (sanitized.value !== undefined) sanitized.value = this.sanitizeFieldValue(sanitized.value, fields[index].type);
    if (sanitized.label !== undefined) sanitized.label = this.sanitizeFieldLabel(sanitized.label);
    fields[index] = { ...fields[index], ...sanitized };
    this.manualFieldsChange.emit(fields);
  }

  moveManualFieldUp(index: number): void {
    if (index === 0) return;
    const fields = [...this.manualFields()];
    [fields[index - 1], fields[index]] = [fields[index], fields[index - 1]];
    this.manualFieldsChange.emit(fields);
  }

  moveManualFieldDown(index: number): void {
    const fields = this.manualFields();
    if (index >= fields.length - 1) return;
    const arr = [...fields];
    [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
    this.manualFieldsChange.emit(arr);
  }

  // --- API Config Methods ---

  apiHeaderKeys = computed(() => {
    const cfg = this.apiConfig();
    if (!cfg?.apiHeaders) return [];
    try {
      return Object.keys(JSON.parse(cfg.apiHeaders));
    } catch {
      return [];
    }
  });

  getApiHeaderValue(key: string): string {
    const cfg = this.apiConfig();
    if (!cfg?.apiHeaders) return '';
    try {
      const headers = JSON.parse(cfg.apiHeaders);
      return headers[key] || '';
    } catch {
      return '';
    }
  }

  private updateApiConfig(patch: Partial<ApiDataConfigModel>): void {
    const current = this.apiConfig();
    const updated: ApiDataConfigModel = {
      apiConfigID: current?.apiConfigID || 0,
      templateID: current?.templateID || 0,
      apiUrl: current?.apiUrl || '',
      apiMethod: current?.apiMethod || 'GET',
      apiHeaders: current?.apiHeaders || null,
      apiBody: current?.apiBody || null,
      cacheSeconds: current?.cacheSeconds ?? 300,
      ...current,
      ...patch
    };
    this.apiConfigChange.emit(updated);
  }

  private sanitizeApiUrl(url: string): string {
    if (!url) return url;
    const sanitized = url.replace(/[<>"']/g, '').substring(0, 2000);
    try {
      const parsed = new URL(sanitized);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return '';
      return sanitized;
    } catch {
      return '';
    }
  }

  private sanitizeJsonContent(json: string | null): string | null {
    if (!json) return json;
    try {
      const parsed = JSON.parse(json);
      return JSON.stringify(parsed).substring(0, 50000);
    } catch {
      return json.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                 .replace(/\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
                 .substring(0, 50000);
    }
  }

  updateApiUrl(url: string): void {
    this.updateApiConfig({ apiUrl: this.sanitizeApiUrl(url) });
  }

  updateApiMethod(method: string): void {
    const valid = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    if (valid.includes(method.toUpperCase())) {
      this.updateApiConfig({ apiMethod: method.toUpperCase() });
    }
  }

  updateApiBody(body: string): void {
    this.updateApiConfig({ apiBody: this.sanitizeJsonContent(body) });
  }

  updateApiCache(seconds: number): void {
    const clamped = Math.max(0, Math.min(86400, seconds || 0));
    this.updateApiConfig({ cacheSeconds: clamped });
  }

  addApiHeader(): void {
    const cfg = this.apiConfig();
    const headers: Record<string, string> = {};
    if (cfg?.apiHeaders) {
      try { Object.assign(headers, JSON.parse(cfg.apiHeaders)); } catch {}
    }
    headers[''] = '';
    this.updateApiConfig({ apiHeaders: JSON.stringify(headers) });
  }

  updateApiHeaderKey(oldKey: string, newKey: string): void {
    const cfg = this.apiConfig();
    const headers: Record<string, string> = {};
    if (cfg?.apiHeaders) {
      try { Object.assign(headers, JSON.parse(cfg.apiHeaders)); } catch {}
    }
    if (oldKey in headers) {
      const sanitizedKey = newKey.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 255);
      headers[sanitizedKey] = headers[oldKey];
      if (oldKey !== sanitizedKey) delete headers[oldKey];
    }
    this.updateApiConfig({ apiHeaders: JSON.stringify(headers) });
  }

  updateApiHeaderValue(key: string, value: string): void {
    const cfg = this.apiConfig();
    const headers: Record<string, string> = {};
    if (cfg?.apiHeaders) {
      try { Object.assign(headers, JSON.parse(cfg.apiHeaders)); } catch {}
    }
    headers[key] = value.replace(/[<>]/g, '').substring(0, 2000);
    this.updateApiConfig({ apiHeaders: JSON.stringify(headers) });
  }

  removeApiHeader(key: string): void {
    const cfg = this.apiConfig();
    const headers: Record<string, string> = {};
    if (cfg?.apiHeaders) {
      try { Object.assign(headers, JSON.parse(cfg.apiHeaders)); } catch {}
    }
    delete headers[key];
    this.updateApiConfig({ apiHeaders: JSON.stringify(headers) });
  }

  testApiConfig = computed(() => {
    const cfg = this.apiConfig();
    return {
      sourceType: 'api' as const,
      apiUrl: cfg?.apiUrl || '',
      apiMethod: (cfg?.apiMethod || 'GET') as any,
      apiHeaders: {} as Record<string, string>,
      apiBody: cfg?.apiBody || '',
      data: [],
      cacheSeconds: 0
    };
  });

  openApiTest(): void {
    this.showApiTest.set(true);
  }

  closeApiTest(): void {
    this.showApiTest.set(false);
  }

  toggleExpandField(index: number): void {
    this.expandedField.set(this.expandedField() === index ? null : index);
  }
}
