import { tsquery } from '@phenomnomnominal/tsquery';
import * as Lint from 'tslint';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    if (/^.*\.(effects|reducer|actions|selectors)\.(ts|spec\.ts)$/.test(sourceFile.fileName)) {
      return this.applyWithFunction(sourceFile, ctx => {
        sourceFile.statements
          .filter(ts.isImportDeclaration)
          .filter(importStatement =>
            /^\..*\.(actions|selectors)$/.test(importStatement.moduleSpecifier.getText().replace(/['"]/g, ''))
          )
          .map(importStatement => importStatement.importClause.namedBindings)
          .filter(x => !!x)
          .filter(ts.isNamespaceImport)
          .forEach(node => {
            this.visitNamespaceImportDeclaration(ctx, node);
          });
      });
    }
    return [];
  }

  private visitNamespaceImportDeclaration(ctx: Lint.WalkContext<void>, importStatement: ts.NamespaceImport) {
    const importString = importStatement.name.text;

    // get all Nodes that use the star import
    const importNodes = tsquery(
      ctx.sourceFile,
      `PropertyAccessExpression[expression.name=${importString}],TypeReference > QualifiedName[left.text=${importString}]`
    ).sort((a, b) => b.getStart() - a.getStart());

    // replace all star import references
    importNodes.forEach(node => {
      const fix = Lint.Replacement.deleteText(node.getStart(), importString.length + 1);
      ctx.addFailureAtNode(node, 'star imports are banned', fix);
    });

    // replace import itself
    const newImportStrings = importNodes
      .map(node => node.getText().replace(`${importString}.`, '').split('.')[0])
      .filter((node, index, array) => array.indexOf(node) === index)
      .sort();

    const importFix = new Lint.Replacement(
      importStatement.getStart(),
      importStatement.getWidth(),
      `{\n  ${newImportStrings.join(',\n  ')},\n}`
    );
    ctx.addFailureAtNode(importStatement, `Star imports in ngrx store files are banned.`, importFix);
  }
}
