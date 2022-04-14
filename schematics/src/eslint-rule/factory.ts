import { strings } from '@angular-devkit/core';
import { Rule, apply, applyTemplates, chain, mergeWith, move, url } from '@angular-devkit/schematics';
import { PWAEslintRuleOptionsSchema as Options } from 'schemas/eslint-rule/schema';

import { applyLintFix } from '../utils/lint-fix';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function eslintRule(options: Options): Rule {
  return async _ => {
    const operations: Rule[] = [];

    operations.push(
      mergeWith(
        apply(url('./files'), [
          applyTemplates({
            ...strings,
            ...options,
          }),
          move('/eslint-rules/'),
        ])
      )
    );
    operations.push(applyLintFix());

    return chain(operations);
  };
}
