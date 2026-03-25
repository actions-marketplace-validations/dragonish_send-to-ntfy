export function getSafeValue(input: string): string {
  if (input.includes(',') || input.includes(';')) {
    return `"${input}"`;
  }
  return input;
}

export function parseString(input: string, defaultValue: string): string {
  return input.trim() || defaultValue;
}

export function parseApiUrl(baseUrl: string, topic: string): string {
  return (baseUrl.endsWith('/') ? baseUrl.trim() : baseUrl.trim() + '/') + topic.trim();
}

export function parsePriority(input: string, defaultValue: number): number {
  const priority = parseInt(input.trim());
  return Number.isNaN(priority) ? defaultValue : priority > 0 && priority < 6 ? priority : defaultValue;
}

export function parseBoolean(input: string): boolean {
  return ['1', 'yes', 'true', 'on'].includes(input.trim());
}

export function parseTags(input: string): string[] {
  return input
    .split(',')
    .map(v => v.trim())
    .filter(v => v);
}

function isActionButtons(value: unknown): value is ActionButtons {
  if (!Array.isArray(value)) {
    return false;
  }

  const isValidBaseAction = (action: unknown): boolean => {
    if (typeof action !== 'object' || action === null) return false;
    const a = action as Record<string, unknown>;
    return typeof a.action === 'string' && typeof a.label === 'string';
  };

  for (const item of value) {
    if (!isValidBaseAction(item)) return false;
    const a = item as Record<string, unknown>;

    if (a.action === 'view') {
      if (typeof a.url !== 'string') return false;
    } else if (a.action === 'broadcast') {
      if (a.intent !== undefined && typeof a.intent !== 'string') return false;
      if (a.extras !== undefined && (typeof a.extras !== 'object' || a.extras === null)) return false;
    } else if (a.action === 'http') {
      if (typeof a.url !== 'string') return false;
      if (a.method !== undefined && typeof a.method !== 'string') return false;
      if (a.headers !== undefined && (typeof a.headers !== 'object' || a.headers === null)) return false;
      if (a.body !== undefined && typeof a.body !== 'string') return false;
    } else if (a.action === 'copy') {
      if (typeof a.value !== 'string') return false;
    } else {
      return false;
    }
  }

  return true;
}

export function parseActions(input: string): ActionButtons | undefined | null {
  const str = input.trim();
  if (str.length === 0) {
    return undefined;
  }

  try {
    const res = JSON.parse(input.trim());
    return isActionButtons(res) ? res : null;
  } catch {
    return null;
  }
}
