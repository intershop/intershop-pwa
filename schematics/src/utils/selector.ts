import { strings } from '@angular-devkit/core';

export function buildSelector(options: { name?: string; prefix?: string }, projectPrefix: string) {
  const selector = strings.dasherize(options.name);
  if (options.prefix === '') {
    return selector;
  }

  const prefix = options.prefix || projectPrefix;

  if (!selector.startsWith(`${prefix}-`)) {
    return `${prefix}-${selector}`;
  }

  return selector;
}
