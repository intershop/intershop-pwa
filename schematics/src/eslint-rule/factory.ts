import { apply, applyTemplates, chain, mergeWith, move, Rule, url } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { strings } from '@angular-devkit/core';
import { createTsMorphProject } from '../utils/ts-morph';
import { SyntaxKind } from 'ts-morph';
import { camelize } from '@angular-devkit/core/src/utils/strings';
import { addImportToFile } from '../utils/registration';
import { applyLintFix } from '../utils/lint-fix';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function eslintRule(options: any): Rule {
  // extract properties
  const ruleName = options.name;
  const rulePath = `/eslint-rules/src/rules/${ruleName}.ts`;
  const testPath = `/eslint-rules/tests/${ruleName}.spec.ts`;

  // update options
  options.path = '/eslint-rules/';

  console.log('eslint-rule schematic', ruleName);
  return async host => {
    const workspace = await getWorkspace(host);

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
