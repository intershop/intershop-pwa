import { parse } from 'comment-json';
import * as fs from 'fs';
import * as Lint from 'tslint';
import * as ts from 'typescript';

function getAbsolutePath(base: string, rel: string): string {
  if (rel.startsWith('..')) {
    const myPath = base.split('/');
    myPath.pop();
    const otherPath = rel.split('/').reverse();
    while (otherPath.length && otherPath[otherPath.length - 1] === '..') {
      otherPath.pop();
      myPath.pop();
    }
    for (const el of otherPath.reverse()) {
      myPath.push(el);
    }
    return myPath.join('/');
  }
}

function getRelativePath(base: string, abs: string): string {
  const basePath = base.split('/');
  basePath.pop();
  const absPath = abs.split('/');

  while (basePath[0] === absPath[0]) {
    basePath.shift();
    absPath.shift();
  }

  while (basePath.length) {
    basePath.pop();
    absPath.splice(0, 0, '..');
  }

  return absPath.join('/');
}

export class Rule extends Lint.Rules.AbstractRule {
  private shortImports: { pattern: string; replacement: string }[] = [];

  constructor(options: Lint.IOptions) {
    super(options);
    try {
      const config = parse(fs.readFileSync('./tsconfig.json', { encoding: 'utf-8' }));
      if (config && config.compilerOptions && config.compilerOptions.paths) {
        const paths = config.compilerOptions.paths;
        this.shortImports = Object.keys(paths).map(key => ({
          pattern: '.*/' + paths[key][0].replace(/\/\*$/, '/'),
          replacement: key.replace(/\/\*$/, '/'),
        }));
      }
    } catch (err) {
      console.warn(err);
    }
  }

  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, ctx => {
      const importStatements = ctx.sourceFile.statements.filter(stm =>
        ts.isImportDeclaration(stm)
      ) as ts.ImportDeclaration[];

      importStatements.forEach(stm => {
        const stringLiteral = stm.getChildren().find(e => ts.isStringLiteral(e)) as ts.StringLiteral;
        const text = stringLiteral.getText();
        const fromString = text.substring(1, text.length - 1);

        let failureFound = false;
        const absPath = getAbsolutePath(ctx.sourceFile.fileName, fromString);
        this.shortImports.forEach(({ pattern, replacement }) => {
          if (new RegExp(pattern).test(absPath)) {
            ctx.addFailureAtNode(
              stringLiteral,
              `Import path should rely on ${replacement.replace(/\/.*/g, '')}.`,
              new Lint.Replacement(
                stringLiteral.getStart(),
                stringLiteral.getEnd() - stringLiteral.getStart(),
                `'${absPath.replace(new RegExp(pattern), replacement)}'`
              )
            );
            failureFound = true;
          }
        });
        if (!failureFound && absPath) {
          const newRel = getRelativePath(ctx.sourceFile.fileName, absPath);
          if (newRel !== fromString) {
            ctx.addFailureAtNode(
              stringLiteral,
              `Import path can be simplified to '${newRel}'.`,
              new Lint.Replacement(
                stringLiteral.getStart(),
                stringLiteral.getEnd() - stringLiteral.getStart(),
                `'${newRel}'`
              )
            );
          }
        }
      });
    });
  }
}
