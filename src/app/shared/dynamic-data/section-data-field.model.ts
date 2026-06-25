export type SectionDataType =
  | 'text'
  | 'number'
  | 'image'
  | 'url'
  | 'color'
  | 'boolean'
  | 'html'
  | 'richtext'
  | 'date'
  | 'datetime'
  | 'time'
  | 'email'
  | 'phone'
  | 'icon'
  | 'video'
  | 'file'
  | 'json';

export interface SectionDataField {
  key: string;
  type: SectionDataType;
  value: string;
  label?: string;
}

export const DATA_TYPE_OPTIONS: { label: string; value: SectionDataType; icon: string; group: string }[] = [
  { label: 'Text', value: 'text', icon: 'pi pi-font', group: 'Basic' },
  { label: 'Number', value: 'number', icon: 'pi pi-hashtag', group: 'Basic' },
  { label: 'Rich Text', value: 'richtext', icon: 'pi pi-file-edit', group: 'Basic' },
  { label: 'HTML', value: 'html', icon: 'pi pi-code', group: 'Basic' },
  { label: 'JSON', value: 'json', icon: 'pi pi-database', group: 'Basic' },
  { label: 'Image URL', value: 'image', icon: 'pi pi-image', group: 'Media' },
  { label: 'Video URL', value: 'video', icon: 'pi pi-video', group: 'Media' },
  { label: 'File URL', value: 'file', icon: 'pi pi-file', group: 'Media' },
  { label: 'Icon', value: 'icon', icon: 'pi pi-star', group: 'Media' },
  { label: 'Link URL', value: 'url', icon: 'pi pi-link', group: 'Link' },
  { label: 'Email', value: 'email', icon: 'pi pi-envelope', group: 'Contact' },
  { label: 'Phone', value: 'phone', icon: 'pi pi-phone', group: 'Contact' },
  { label: 'Date', value: 'date', icon: 'pi pi-calendar', group: 'Date & Time' },
  { label: 'Date & Time', value: 'datetime', icon: 'pi pi-calendar-plus', group: 'Date & Time' },
  { label: 'Time', value: 'time', icon: 'pi pi-clock', group: 'Date & Time' },
  { label: 'Color', value: 'color', icon: 'pi pi-circle-fill', group: 'Appearance' },
  { label: 'Toggle', value: 'boolean', icon: 'pi pi-check-circle', group: 'Appearance' },
];

export const DATA_TYPE_GROUPS = ['Basic', 'Media', 'Link', 'Contact', 'Date & Time', 'Appearance'];

export function createEmptyField(): SectionDataField {
  return { key: '', type: 'text', value: '', label: '' };
}

export function duplicateField(field: SectionDataField): SectionDataField {
  return { ...field, key: field.key + '_copy', label: field.label ? field.label + ' (Copy)' : '' };
}

export function fieldsToRecord(fields: SectionDataField[]): Record<string, any> {
  const record: Record<string, any> = {};
  for (const f of fields) {
    if (!f.key) continue;
    const val = f.value;
    switch (f.type) {
      case 'number':
        record[f.key] = Number(val) || 0;
        break;
      case 'boolean':
        record[f.key] = val === 'true' || val === '1';
        break;
      case 'json':
        if (typeof val === 'string' && val.trim().startsWith('[') || val.trim().startsWith('{')) {
          try { record[f.key] = JSON.parse(val); } catch { record[f.key] = val; }
        } else {
          record[f.key] = val;
        }
        break;
      default:
        record[f.key] = val;
    }
  }
  return record;
}

export function recordToFields(record: Record<string, any>): SectionDataField[] {
  if (!record) return [];
  return Object.entries(record).map(([key, value]) => {
    let type: SectionDataType = 'text';
    if (typeof value === 'number') type = 'number';
    else if (typeof value === 'boolean') type = 'boolean';
    else if (typeof value === 'string') {
      if (/^#[0-9a-fA-F]{3,8}$/.test(value) || value.startsWith('rgb')) type = 'color';
      else if (/\.(jpg|jpeg|png|gif|svg|webp|avif)$/i.test(value)) type = 'image';
      else if (/\.(mp4|webm|ogg|mov)$/i.test(value)) type = 'video';
      else if (/\.(pdf|doc|docx|xls|xlsx|zip|rar)$/i.test(value)) type = 'file';
      else if (/^[a-z][\w-]*(-[a-z0-9]+)*(\s[a-z][\w-]*)*$/i.test(value) && value.includes('pi ')) type = 'icon';
      else if (/^https?:\/\//.test(value)) type = 'url';
      else if (/^[\w.-]+@[\w.-]+\.\w+$/.test(value)) type = 'email';
      else if (/^[\d\s()+-]{7,}$/.test(value)) type = 'phone';
      else if (/^\d{4}-\d{2}-\d{2}$/.test(value)) type = 'date';
      else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)) type = 'datetime';
      else if (/^\d{2}:\d{2}/.test(value)) type = 'time';
      else if (/<[a-z][\s\S]*>/i.test(value)) type = 'html';
    }
    return { key, type, value: String(value ?? ''), label: '' };
  });
}
