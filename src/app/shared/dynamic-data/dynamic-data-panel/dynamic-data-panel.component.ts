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
import { DynamicDataConfig, createDefaultDataConfig } from '../dynamic-data.model';
import { SectionDataField, DATA_TYPE_OPTIONS, DATA_TYPE_GROUPS, createEmptyField, duplicateField, SectionDataType } from '../section-data-field.model';
import { ApiTestDialogComponent } from '../api-test-dialog/api-test-dialog.component';

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
  config = input<DynamicDataConfig>(createDefaultDataConfig());
  configChange = output<DynamicDataConfig>();

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

  sourceTypeOptions = [
    { label: 'API Endpoint', value: 'api' },
    { label: 'Manual Data', value: 'manual' },
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

  headerKeys = computed(() => {
    const cfg = this.config();
    return cfg?.apiHeaders ? Object.keys(cfg.apiHeaders) : [];
  });

  getGroupedTypes() {
    const grouped: Record<string, typeof DATA_TYPE_OPTIONS> = {};
    for (const group of this.dataTypeGroups) {
      grouped[group] = this.dataTypeOptions.filter(o => o.group === group);
    }
    return grouped;
  }

  getTypeInfo(type: SectionDataType) {
    return this.dataTypeOptions.find(o => o.value === type) || this.dataTypeOptions[0];
  }

  updateField<K extends keyof DynamicDataConfig>(key: K, value: DynamicDataConfig[K]): void {
    this.configChange.emit({ ...this.config(), [key]: value });
  }

  setSourceType(type: string): void {
    this.updateField('sourceType', type as any);
  }

  addDataField(): void {
    const cfg = this.config();
    const fields = [...cfg.data, createEmptyField()];
    this.updateField('data', fields);
  }

  duplicateDataField(index: number): void {
    const cfg = this.config();
    const fields = [...cfg.data];
    fields.splice(index + 1, 0, duplicateField(cfg.data[index]));
    this.updateField('data', fields);
  }

  removeDataField(index: number): void {
    const cfg = this.config();
    const fields = cfg.data.filter((_, i) => i !== index);
    this.updateField('data', fields);
  }

  updateDataField(index: number, patch: Partial<SectionDataField>): void {
    const cfg = this.config();
    const fields = [...cfg.data];
    fields[index] = { ...fields[index], ...patch };
    this.updateField('data', fields);
  }

  moveFieldUp(index: number): void {
    if (index === 0) return;
    const cfg = this.config();
    const fields = [...cfg.data];
    [fields[index - 1], fields[index]] = [fields[index], fields[index - 1]];
    this.updateField('data', fields);
  }

  moveFieldDown(index: number): void {
    const cfg = this.config();
    if (index >= cfg.data.length - 1) return;
    const fields = [...cfg.data];
    [fields[index], fields[index + 1]] = [fields[index + 1], fields[index]];
    this.updateField('data', fields);
  }

  toggleExpandField(index: number): void {
    this.expandedField.set(this.expandedField() === index ? null : index);
  }

  addHeader(): void {
    const cfg = this.config();
    const headers = { ...cfg.apiHeaders, '': '' };
    this.updateField('apiHeaders', headers);
  }

  updateHeaderKey(oldKey: string, newKey: string): void {
    const cfg = this.config();
    const headers: Record<string, string> = {};
    for (const [k, v] of Object.entries(cfg.apiHeaders)) {
      if (k === oldKey) {
        headers[newKey] = v;
      } else {
        headers[k] = v;
      }
    }
    this.updateField('apiHeaders', headers);
  }

  updateHeaderValue(key: string, value: string): void {
    const cfg = this.config();
    this.updateField('apiHeaders', { ...cfg.apiHeaders, [key]: value });
  }

  removeHeader(key: string): void {
    const cfg = this.config();
    const headers: Record<string, string> = {};
    for (const [k, v] of Object.entries(cfg.apiHeaders)) {
      if (k !== key) headers[k] = v;
    }
    this.updateField('apiHeaders', headers);
  }

  openApiTest(): void {
    this.showApiTest.set(true);
  }

  closeApiTest(): void {
    this.showApiTest.set(false);
  }
}
