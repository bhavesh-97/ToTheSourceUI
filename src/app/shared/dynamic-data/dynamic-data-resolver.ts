export class DynamicDataResolver {

  static resolve(html: string, data: Record<string, any> | null | undefined): string {
    if (!html || !data) return html || '';
    return this.processTemplate(html, data);
  }

  private static processTemplate(html: string, data: Record<string, any>): string {
    let result = html;
    result = this.processBlock(result, data, 'each');
    result = this.processBlock(result, data, 'if');
    result = this.processVariables(result, data);
    return result;
  }

  private static processBlock(html: string, data: Record<string, any>, type: 'each' | 'if'): string {
    const openTag = `{{#${type}`;
    const closeTag = `{{/${type}}}`;

    let result = '';
    let i = 0;

    while (i < html.length) {
      const openIdx = html.indexOf(openTag, i);

      if (openIdx === -1) {
        result += html.substring(i);
        break;
      }

      result += html.substring(i, openIdx);

      const argEnd = html.indexOf('}}', openIdx);
      if (argEnd === -1) {
        result += html.substring(openIdx);
        break;
      }

      const arg = html.substring(openIdx + openTag.length, argEnd).trim();
      const blockContentStart = argEnd + 2;

      const blockEnd = this.findMatchingClose(html, blockContentStart, type);
      if (blockEnd === -1) {
        result += html.substring(openIdx);
        break;
      }

      const blockContent = html.substring(blockContentStart, blockEnd);
      const afterClose = blockEnd + closeTag.length;

      if (type === 'each') {
        result += this.processEachBlock(arg, blockContent, data);
      } else if (type === 'if') {
        result += this.processIfBlock(arg, blockContent, data);
      }

      i = afterClose;
    }

    return result;
  }

  private static findMatchingClose(html: string, start: number, type: 'each' | 'if'): number {
    const openTag = `{{#${type}`;
    const closeTag = `{{/${type}}}`;
    let depth = 1;
    let pos = start;

    while (depth > 0 && pos < html.length) {
      const nextOpen = html.indexOf(openTag, pos);
      const nextClose = html.indexOf(closeTag, pos);

      if (nextClose === -1) return -1;

      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth++;
        pos = nextOpen + openTag.length;
      } else {
        depth--;
        if (depth === 0) return nextClose;
        pos = nextClose + closeTag.length;
      }
    }

    return -1;
  }

  private static processEachBlock(arg: string, content: string, data: Record<string, any>): string {
    let items = this.resolvePath(data, arg);
    if (typeof items === 'string') {
      try { items = JSON.parse(items); } catch { return ''; }
    }
    if (!Array.isArray(items) || items.length === 0) return '';

    return items.map((item: any, index: number) => {
      let itemData: Record<string, any>;
      if (typeof item === 'object' && item !== null) {
        itemData = { ...item, _index: index, _first: index === 0, _last: index === items.length - 1 };
      } else {
        itemData = { value: item, _index: index, _first: index === 0, _last: index === items.length - 1 };
      }
      return this.processTemplate(content, itemData);
    }).join('');
  }

  private static processIfBlock(arg: string, content: string, data: Record<string, any>): string {
    const elseSplit = this.splitElse(content);
    const value = this.resolvePath(data, arg);
    const isTruthy = value !== undefined && value !== null && value !== false && value !== '' && value !== 0;

    if (isTruthy) {
      return this.processTemplate(elseSplit.truthy, data);
    } else {
      return elseSplit.falsy ? this.processTemplate(elseSplit.falsy, data) : '';
    }
  }

  private static splitElse(content: string): { truthy: string; falsy: string } {
    const elseTag = '{{else}}';
    let depth = 0;
    let i = 0;

    while (i < content.length) {
      if (content.substring(i, i + 5) === '{{#if') {
        depth++;
        i += 5;
      } else if (content.substring(i, i + 6) === '{{/if}}') {
        depth--;
        i += 6;
      } else if (content.substring(i, i + 8) === elseTag && depth === 0) {
        return {
          truthy: content.substring(0, i),
          falsy: content.substring(i + 8)
        };
      } else {
        i++;
      }
    }

    return { truthy: content, falsy: '' };
  }

  private static processVariables(html: string, data: Record<string, any>): string {
    return html.replace(/\{\{(\w+(?:\.\w+)*?)(?:\s*\|\s*(.+?))?\}\}/g, (match, path, fallback) => {
      const value = this.resolvePath(data, path);
      if (value !== undefined && value !== null && value !== '') {
        return String(value);
      }
      return fallback !== undefined ? fallback.trim() : '';
    });
  }

  private static resolvePath(obj: Record<string, any>, path: string): any {
    if (!obj || !path) return undefined;
    const parts = path.split('.');
    let current: any = obj;
    for (const part of parts) {
      if (current === null || current === undefined) return undefined;
      current = current[part];
    }
    return current;
  }
}
