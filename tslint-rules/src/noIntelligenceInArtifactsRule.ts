import { tsquery } from '@phenomnomnominal/tsquery';
import * as Lint from 'tslint';
import * as ts from 'typescript';

interface RuleSetting {
  ngrx: string;
  service: string;
  router: string;
  facade: string;
}

function markErrorsForImportDeclaration(
  ctx: Lint.WalkContext,
  importDeclaration: ts.ImportDeclaration,
  message: string
) {
  if (ts.isNamedImports(importDeclaration.importClause.namedBindings)) {
    importDeclaration.importClause.namedBindings.elements.forEach(el => {
      tsquery(
        ctx.sourceFile,
        ['NewExpression', 'TypeReference', 'CallExpression']
          .map(q => q + ` > Identifier[text=${el.getText()}]`)
          .join(',')
      ).forEach(ele => ctx.addFailureAtNode(ele, message));
    });
  } else {
    ctx.addFailureAtNode(importDeclaration, message);
  }
}

export class Rule extends Lint.Rules.AbstractRule {
  ruleSettings: { [key: string]: RuleSetting } = {};

  constructor(options: Lint.IOptions) {
    super(options);

    this.ruleSettings = options.ruleArguments[0] || {};
  }

  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    const ruleMatch = Object.keys(this.ruleSettings).find(key => new RegExp(key).test(sourceFile.fileName));

    if (!ruleMatch) {
      return [];
    }

    const rules = this.ruleSettings[ruleMatch];

    return this.applyWithFunction(sourceFile, ctx => {
      tsquery(ctx.sourceFile, 'ImportDeclaration').forEach((importDeclaration: ts.ImportDeclaration) => {
        const imp = importDeclaration.moduleSpecifier
          .getText()
          .substr(1, importDeclaration.moduleSpecifier.getText().length - 2);

        if (rules.service && /\/services(\/|$)/.test(imp)) {
          markErrorsForImportDeclaration(ctx, importDeclaration, rules.service);
        }

        if (rules.ngrx && (/\/store\//.test(imp) || imp.startsWith('@ngrx') || imp.endsWith('/ngrx-testing'))) {
          markErrorsForImportDeclaration(ctx, importDeclaration, rules.ngrx);
        }

        if (rules.facade && (/\/facades\//.test(imp) || imp.endsWith('.facade'))) {
          markErrorsForImportDeclaration(ctx, importDeclaration, rules.facade);
        }

        if (rules.router && imp.startsWith('@angular/router')) {
          markErrorsForImportDeclaration(ctx, importDeclaration, rules.router);
        }
      });
    });
  }
}
