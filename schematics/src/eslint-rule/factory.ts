import { strings } from '@angular-devkit/core';
import { camelize } from '@angular-devkit/core/src/utils/strings';
import { Rule, apply, applyTemplates, chain, mergeWith, move, url } from '@angular-devkit/schematics';
import { SyntaxKind } from 'ts-morph';

import { applyLintFix } from '../utils/lint-fix';
import { addImportToFile } from '../utils/registration';
import { createTsMorphProject } from '../utils/ts-morph';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function eslintRule(options: any): Rule {
  // update options
  options.path = '/eslint-rules/';

  return async _ => {
    const operations: Rule[] = [];

    operations.push(
      mergeWith(
        apply(url('./files'), [
          applyTemplates({
            ...strings,
            ...options,
          }),
          move(options.path),
        ])
      )
    );

    operations.push(addEslintRuleToObject(options));
    operations.push(
      addImportToFile({
        module: '/eslint-rules/src/index.ts',
        artifactName: `${camelize(options.name)}Rule`,
        moduleImportPath: `/eslint-rules/src/rules/${options.name}`,
      })
    );
    operations.push(applyLintFix());

    return chain(operations);
  };
}

function addEslintRuleToObject(options: { name: string }): Rule {
  return host => {
    const tsMorphProject = createTsMorphProject(host);
    tsMorphProject.addSourceFileAtPath('/eslint-rules/src/index.ts');
    const sourceFile = tsMorphProject.getSourceFile('/eslint-rules/src/index.ts');

    sourceFile.getFirstDescendantByKindOrThrow(SyntaxKind.ObjectLiteralExpression).addPropertyAssignment({
      name: `'${options.name}'`,
      initializer: `${camelize(options.name)}Rule`,
    });

    host.overwrite('/eslint-rules/src/index.ts', sourceFile.getText());
  };
}
