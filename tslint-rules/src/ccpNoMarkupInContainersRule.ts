import * as ast from '@angular/compiler';
import { NgWalker } from 'codelyzer/angular/ngWalker';
import { BasicTemplateAstVisitor } from 'codelyzer/angular/templates/basicTemplateAstVisitor';
import * as Lint from 'tslint';
import { SourceFile } from 'typescript';

const MESSAGE = 'Container templates should not contain markup. ';

class ContainerTemplateVisitor extends BasicTemplateAstVisitor {
  visitElement(element: ast.ElementAst, context) {
    this.validateElement(element);
    super.visitElement(element, context);
  }

  validateElement(element: ast.ElementAst) {
    if (!element.name.startsWith('ish-') && !element.name.startsWith('ng-') && element.name !== 'div') {
      this.addFailureFromStartToEnd(
        element.sourceSpan.start.offset,
        element.sourceSpan.end.offset,
        `${MESSAGE} Found '${element.name}'.`
      );
    }

    const failures = element.attrs.map(attr => this.validateAttr(attr)).filter(x => !!x);
    if (failures && failures.length) {
      this.addFailureFromStartToEnd(
        element.sourceSpan.start.offset,
        element.sourceSpan.end.offset,
        `${MESSAGE} ${failures.join(' ')}`
      );
    }
  }

  validateAttr(attr: ast.AttrAst) {
    if (attr.name === 'class' || attr.name === 'style') {
      return `Found '${attr.name}' with value '${attr.value}'.`;
    } else {
      return;
    }
  }
}

export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: SourceFile): Lint.RuleFailure[] {
    if (!sourceFile.fileName.match(/.*\/containers\/.*.ts/)) {
      return [];
    }
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), { templateVisitorCtrl: ContainerTemplateVisitor })
    );
  }
}
