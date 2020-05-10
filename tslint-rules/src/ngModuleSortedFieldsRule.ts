import { tsquery } from '@phenomnomnominal/tsquery';
import * as Lint from 'tslint';
import * as ts from 'typescript';

function getInitializer(property: ts.Node & { initializer?: ts.Node }) {
  return property && ts.isArrayLiteralExpression(property.initializer) ? property.initializer : undefined;
}

function selectSpreadArray(node: ts.Node) {
  return ts.isSpreadElement(node) && ts.isIdentifier(node.expression);
}

/**
 * Implementation of the ng-module-sorted-fields rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
  ignoreTokens: string[] = [];
  arrayDeclarations: string[] = [];

  constructor(options: Lint.IOptions) {
    super(options);

    if (options.ruleArguments && options.ruleArguments[0] && options.ruleArguments[0]['ignore-tokens']) {
      this.ignoreTokens = options.ruleArguments[0]['ignore-tokens'];
    }
  }

  private sortSpreadArrayDeclaration(ctx: Lint.WalkContext, arrName: string, moving: { [clazz: string]: string }) {
    tsquery(ctx.sourceFile, `VariableDeclaration:has(Identifier[name=${arrName}])`).forEach(
      (decl: ts.VariableDeclaration) => {
        this.sortList(ctx, getInitializer(decl), moving, false);
      }
    );
  }

  private sortList(
    ctx: Lint.WalkContext,
    array: ts.ArrayLiteralExpression,
    moving: { [clazz: string]: string },
    remove: boolean
  ): string {
    if (!array) {
      return;
    }

    const list = array.getChildAt(1) as ts.SyntaxList;

    if (this.ignoreTokens.some(token => array.elements.find(node => new RegExp(token).test(node.getText())))) {
      return;
    }

    let elements;
    if (remove) {
      const movingClasses = Object.keys(moving);
      elements = array.elements
        // remove elements that are moved away
        .filter(node => !(remove && movingClasses.includes(node.getText())));
    } else {
      const name = (array.parent as ts.VariableDeclaration).name.getText();
      // add dummy elements for adding
      const adding = Object.keys(moving)
        .filter(key => moving[key] === name)
        .reduce((acc, val) => [...acc, val], []);
      elements = [...array.elements, ...adding.map(val => ({ getText: () => val }))];
    }

    const whiteSpace =
      array.elements.length === 0
        ? ''
        : array.elements.length === 1
        ? // single space if array has only one element
          ' '
        : // fetch whitespace from last element in current array
          array.elements
            .filter((_, idx, arr) => idx === arr.length - 1)
            .map(el => el.getFullText().replace(/[^\s].*$/s, ''))[0];

    const isMultiLineArray = array.elements.some(el => /\n/.test(el.getFullText()));

    let sorted = elements
      .map(node => node.getText())
      .sort()
      // filter duplicates
      .filter((val, idx, arr) => idx === arr.indexOf(val))
      // add whitespace to element if it was the first in a collapsed array
      .map((val, idx) => (idx === 0 ? val : /^\s/.test(val) ? val : whiteSpace + val))
      .join(',');

    if (isMultiLineArray) {
      sorted += ',';
    }

    if (!remove && !/\n/.test(sorted)) {
      const name = (array.parent as ts.VariableDeclaration).name.getText();
      const declaration = `const ${name} = [${sorted}];`;
      if (declaration.length >= 120) {
        sorted = `\n  ${sorted.split(', ').join(',\n  ')},\n`;
      }
    }

    // compare ignoring leading whitespace
    const original = list.getFullText().replace(/^\s*/, '');

    if (sorted !== original) {
      ctx.addFailureAtNode(list, 'list is not sorted', Lint.Replacement.replaceNode(list, sorted));
    }

    array.elements.filter(selectSpreadArray).forEach((node: ts.SpreadElement) => {
      const arrName = node.expression.getText();
      this.arrayDeclarations.push(arrName);
    });
  }

  private checkForSpreadArrayInclusion(
    arr: ts.Expression[] | ts.NodeArray<ts.Expression>
  ): { [clazz: string]: string } {
    if (!arr) {
      return {};
    }
    const spreadArray = arr.find(selectSpreadArray);
    if (spreadArray) {
      return arr
        .filter(node => !selectSpreadArray(node))
        .reduce((acc, node) => ({ ...acc, [node.getText()]: spreadArray.getText().substr(3) }), {});
    }
  }

  private checkForPairedSpreadArrayInclusion(
    arr1: ts.ArrayLiteralExpression,
    arr2: ts.ArrayLiteralExpression
  ): { [clazz: string]: string } {
    if (arr1 && arr2) {
      const intersection = arr1.elements.filter(node => arr2.elements.find(n => n.getText() === node.getText()));

      return [arr1, arr2].reduce(
        (acc, list) => ({
          ...acc,
          ...this.checkForSpreadArrayInclusion(
            list.elements.filter(node => intersection.find(n => n.getText() === node.getText()))
          ),
          ...this.checkForSpreadArrayInclusion(
            list.elements.filter(node => !intersection.find(n => n.getText() === node.getText()))
          ),
        }),
        {}
      );
    }
    return {};
  }

  private checkModuleDefinition(ctx: Lint.WalkContext, objectLiteralExpression: ts.ObjectLiteralExpression) {
    const exportsInitializer = getInitializer(
      objectLiteralExpression.properties.find(
        el => ts.isPropertyAssignment(el) && el.name.getText() === 'exports'
      ) as ts.PropertyAssignment
    );
    const declarationsInitializer = getInitializer(
      objectLiteralExpression.properties.find(
        el => ts.isPropertyAssignment(el) && el.name.getText() === 'declarations'
      ) as ts.PropertyAssignment
    );
    const importsInitializer = getInitializer(
      objectLiteralExpression.properties.find(
        el => ts.isPropertyAssignment(el) && el.name.getText() === 'imports'
      ) as ts.PropertyAssignment
    );

    const moving = {
      ...(exportsInitializer ? {} : this.checkForSpreadArrayInclusion(declarationsInitializer?.elements)),
      ...(exportsInitializer ? {} : this.checkForSpreadArrayInclusion(importsInitializer?.elements)),
      ...this.checkForPairedSpreadArrayInclusion(exportsInitializer, importsInitializer),
      ...this.checkForPairedSpreadArrayInclusion(exportsInitializer, declarationsInitializer),
    };

    this.sortList(ctx, exportsInitializer, moving, true);
    this.sortList(ctx, declarationsInitializer, moving, true);
    this.sortList(ctx, importsInitializer, moving, true);

    this.arrayDeclarations
      .filter((val, idx, arr) => arr.indexOf(val) === idx)
      .forEach(arrName => {
        this.sortSpreadArrayDeclaration(ctx, arrName, moving);
      });
  }

  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, ctx => {
      if (ctx.sourceFile.fileName.endsWith('module.ts')) {
        tsquery(
          ctx.sourceFile,
          'Decorator:has(Identifier[name=NgModule]) ObjectLiteralExpression'
        ).forEach((el: ts.ObjectLiteralExpression) => this.checkModuleDefinition(ctx, el));
      }

      if (ctx.sourceFile.fileName.endsWith('spec.ts')) {
        tsquery(
          ctx.sourceFile,
          'CallExpression:has(Identifier[name=TestBed]):has(Identifier[name=configureTestingModule]) > ObjectLiteralExpression'
        ).forEach((el: ts.ObjectLiteralExpression) => this.checkModuleDefinition(ctx, el));
      }
    });
  }
}
