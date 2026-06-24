export class DynamicDataResolver {

  static resolve(html: string, data: Record<string, any> | null | undefined): string {
    if (!html || !data) return html || '';
    let result = html;

    result = this.processConditionals(result, data);
    result = this.processLoops(result, data);
    result = this.processVariables(result, data);

    return result;
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

  private static processLoops(html: string, data: Record<string, any>): string {
    const loopRegex = /\{\{#each\s+(\w+(?:\.\w+)*)\}\}([\s\S]*?)\{\{\/each\}\}/g;
    return html.replace(loopRegex, (match, path, template) => {
      const items = this.resolvePath(data, path);
      if (!Array.isArray(items) || items.length === 0) return '';
      return items.map((item: any, index: number) => {
        let itemData: Record<string, any>;
        if (typeof item === 'object' && item !== null) {
          itemData = { ...item, _index: index, _first: index === 0, _last: index === items.length - 1 };
        } else {
          itemData = { value: item, _index: index, _first: index === 0, _last: index === items.length - 1 };
        }
        let rendered = this.processVariables(template, itemData);
        rendered = this.processConditionals(rendered, itemData);
        return rendered;
      }).join('');
    });
  }

  private static processConditionals(html: string, data: Record<string, any>): string {
    const ifRegex = /\{\{#if\s+(\w+(?:\.\w+)*)\}\}([\s\S]*?)(?:\{\{else\}\}([\s\S]*?))?\{\{\/if\}\}/g;
    return html.replace(ifRegex, (match, path, truthyBlock, falsyBlock) => {
      const value = this.resolvePath(data, path);
      const isTruthy = value !== undefined && value !== null && value !== false && value !== '' && value !== 0;
      return isTruthy ? truthyBlock : (falsyBlock || '');
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
