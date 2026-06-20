export interface ValidationResult {
  valid: boolean;
  errors: string[];
  sanitized: string;
}

export class CodeSanitizer {

  private static readonly DANGEROUS_CSS_PATTERNS = [
    /expression\s*\(/gi,
    /-moz-binding\s*:/gi,
    /behavior\s*:/gi,
    /@import/gi,
    /javascript\s*:/gi,
    /data\s*:\s*text\/html/gi,
    /url\s*\(\s*['"]?\s*javascript/gi,
    /url\s*\(\s*['"]?\s*data\s*:\s*text\/html/gi,
    /position\s*:\s*fixed/gi,
    /z-index\s*:\s*\d{5,}/gi,
  ];

  private static readonly DANGEROUS_JS_PATTERNS = [
    /document\s*\.\s*cookie/gi,
    /document\s*\.\s*write/gi,
    /\.innerHTML\s*=/gi,
    /eval\s*\(/gi,
    /Function\s*\(/gi,
    /setTimeout\s*\(\s*['"]/gi,
    /setInterval\s*\(\s*['"]/gi,
    /window\s*\.\s*open/gi,
    /XMLHttpRequest/gi,
    /fetch\s*\(/gi,
    /navigator\s*\.\s*userAgent/gi,
    /localStorage/gi,
    /sessionStorage/gi,
    /\bon\w+\s*=/gi,
    /<\s*iframe/gi,
    /<\s*object/gi,
    /<\s*embed/gi,
    /<\s*applet/gi,
  ];

  private static readonly BLOCKED_TAGS = [
    'script', 'iframe', 'object', 'embed', 'applet', 'form',
    'input', 'textarea', 'select', 'button', 'link', 'meta',
    'base', 'bgsound', 'sound', 'video', 'audio',
  ];

  static validateCss(css: string): ValidationResult {
    const errors: string[] = [];
    let sanitized = css;

    if (!css || !css.trim()) {
      return { valid: true, errors: [], sanitized: '' };
    }

    for (const pattern of this.DANGEROUS_CSS_PATTERNS) {
      if (pattern.test(css)) {
        errors.push(`Blocked dangerous CSS pattern: ${pattern.source.substring(0, 40)}...`);
        sanitized = sanitized.replace(pattern, '/* BLOCKED */');
      }
    }

    const braceCount = (css.match(/{/g) || []).length - (css.match(/}/g) || []).length;
    if (braceCount !== 0) {
      errors.push('Unbalanced CSS braces detected');
    }

    if (css.length > 50000) {
      errors.push('CSS exceeds maximum length (50KB)');
      sanitized = css.substring(0, 50000);
    }

    return { valid: errors.length === 0, errors, sanitized };
  }

  static validateJs(js: string): ValidationResult {
    const errors: string[] = [];
    let sanitized = js;

    if (!js || !js.trim()) {
      return { valid: true, errors: [], sanitized: '' };
    }

    for (const pattern of this.DANGEROUS_JS_PATTERNS) {
      if (pattern.test(js)) {
        errors.push(`Blocked dangerous JS pattern: ${pattern.source.substring(0, 40)}...`);
        sanitized = sanitized.replace(pattern, '/* BLOCKED */');
      }
    }

    if (js.length > 100000) {
      errors.push('JavaScript exceeds maximum length (100KB)');
      sanitized = js.substring(0, 100000);
    }

    return { valid: errors.length === 0, errors, sanitized };
  }

  static validateHtml(html: string): ValidationResult {
    const errors: string[] = [];
    let sanitized = html;

    if (!html || !html.trim()) {
      return { valid: true, errors: [], sanitized: '' };
    }

    const lowerHtml = html.toLowerCase();
    for (const tag of this.BLOCKED_TAGS) {
      const regex = new RegExp(`<\\s*${tag}[\\s>].*?>`, 'gi');
      if (regex.test(lowerHtml)) {
        errors.push(`Blocked HTML tag: <${tag}>`);
        sanitized = sanitized.replace(regex, `<!-- BLOCKED <${tag}> -->`);
      }
    }

    const eventHandlerRegex = /\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;
    if (eventHandlerRegex.test(html)) {
      errors.push('Blocked inline event handlers (onclick, onerror, etc.)');
      sanitized = sanitized.replace(eventHandlerRegex, 'data-blocked-handler="true"');
    }

    if (html.length > 200000) {
      errors.push('HTML exceeds maximum length (200KB)');
      sanitized = html.substring(0, 200000);
    }

    return { valid: errors.length === 0, errors, sanitized };
  }

  static sanitizeForDisplay(html: string): string {
    if (!html) return '';
    let result = html;
    result = result.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    result = result.replace(/\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
    result = result.replace(/javascript\s*:/gi, '');
    result = result.replace(/data\s*:\s*text\/html/gi, '');
    return result;
  }

  static sanitizeClassName(className: string): string {
    if (!className) return '';
    return className.replace(/[^a-zA-Z0-9\s_-]/g, '').substring(0, 200);
  }

  static sanitizeSlug(slug: string): string {
    if (!slug) return '';
    return slug
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 100);
  }
}
