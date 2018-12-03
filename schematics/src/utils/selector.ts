import { strings } from '@angular-devkit/core';

export function buildSelector(artifact: string, options: { name?: string; prefix?: string }, projectPrefix: string) {
  let selector = strings.dasherize(options.name);
  if (options.prefix) {
    selector = `${options.prefix}-${selector}`;
  } else if (options.prefix === undefined && projectPrefix) {
    selector = `${projectPrefix}-${selector}`;
  }

  if (artifact === 'container') {
    selector += '-container';
  }

  return selector;
}
