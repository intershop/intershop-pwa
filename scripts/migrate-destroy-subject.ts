/**
 * ATTENTION: This script will refactor only the typescript files, when the implementation contains the recommended technique to complete open subscriptions within components, directives or pipes with a destroy$ subject.
 * Other implementations will not be effected by this script.
 * Please make sure after running the script, that the refactored files are working as expected.
 */

import {
  ClassDeclaration,
  MethodDeclaration,
  Node,
  Project,
  PropertyAccessExpression,
  PropertyDeclaration,
  SourceFile,
  SyntaxKind,
  ts,
} from 'ts-morph';

// Create a new project
const project = new Project();

// Load all TypeScript files from src and projects directory
const sourceFiles = project.addSourceFilesAtPaths('{src,projects}/**/!(*.spec).ts');

// Process each loaded source file
for (const sourceFile of sourceFiles) {
  analyzeFile(sourceFile);
}

/**
 * Refactor file, add missing imports and save changes
 */
function analyzeFile(sourceFile: SourceFile) {
  sourceFile.forEachDescendant(traverseThroughNodes);
  sourceFile.fixMissingImports();
  sourceFile.saveSync();
}

function traverseThroughNodes(node: Node<ts.Node>) {
  if (node.isKind(SyntaxKind.ClassDeclaration)) {
    // destroy$ property just relevant for components, directives and pipes with implemented OnDestroy method
    if (!isType(node, ['Component', 'Directive', 'Pipe']) || !hasClassImplements(node, ['OnDestroy'])) {
      return;
    }

    // get destroy PropertyDeclaration node
    const destroyProperty = getDestroyProperty(node);

    if (destroyProperty) {
      // replace destroy property with destroyRef = inject(DestroyRef)
      destroyProperty.getNameNode().replaceWithText('destroyRef');
      destroyProperty.setInitializer('inject(DestroyRef)');
    }

    node.getDescendantsOfKind(SyntaxKind.PropertyAccessExpression).forEach(replaceTakeUntilOperator);

    node.getDescendantsOfKind(SyntaxKind.MethodDeclaration).forEach(cleanupOnDestroyImpl);
  }
}

/**
 * Checks if a declarated class is of a certain type
 */
const isType = (node: ClassDeclaration, types: string[]): boolean => {
  if (!node.getModifiers()?.length) {
    return false;
  }

  const decorator = node.getModifiers()[0];

  if (!decorator.isKind(SyntaxKind.Decorator)) {
    return false;
  }

  const expression = decorator.getExpression();

  return (
    expression.isKind(SyntaxKind.CallExpression) &&
    expression.getExpression().isKind(SyntaxKind.Identifier) &&
    types.includes(expression.getExpression().getText())
  );
};

/**
 * Check if Class implements certain lifecycle hooks/interfaces/...
 */
const hasClassImplements = (node: ClassDeclaration, classImplements: string[]): boolean => {
  if (!node.getHeritageClauses()?.length) {
    return false;
  }

  const heritage = node.getHeritageClauses().find(clause => clause.getText().startsWith('implements'));

  return !!heritage
    ?.getTypeNodes()
    .map(node => node.getText())
    .find(type => classImplements.includes(type));
};

/**
 * return destroy property declaration node object
 */
const getDestroyProperty = (node: ClassDeclaration): PropertyDeclaration => {
  const properties = node
    .getMembers()
    .filter(member => member.isKind(SyntaxKind.PropertyDeclaration))
    .map(member => member.asKind(SyntaxKind.PropertyDeclaration));
  const destroyProperty = properties?.find(property => property.getName() === 'destroy$');

  const hasCorrectDestroyProperty =
    destroyProperty?.getModifiers()?.length &&
    destroyProperty.getModifiers()[0].getText() === 'private' &&
    destroyProperty.getInitializer().isKind(SyntaxKind.NewExpression) &&
    destroyProperty.getInitializer().asKind(SyntaxKind.NewExpression).getExpression().getText() === 'Subject' &&
    destroyProperty.getInitializer().asKind(SyntaxKind.NewExpression).getTypeArguments()?.length &&
    destroyProperty.getInitializer().asKind(SyntaxKind.NewExpression).getTypeArguments()[0].getText() === 'void';

  return hasCorrectDestroyProperty ? destroyProperty : undefined;
};

/**
 * replace each takeUntil operator to destroy open subscriptions with new takeUntilDestroyed operator
 */
const replaceTakeUntilOperator = (node: PropertyAccessExpression) => {
  if (node.getExpression().isKind(SyntaxKind.ThisKeyword) && node.getName() === 'destroy$') {
    const parent = node.getParent();

    if (
      parent.isKind(SyntaxKind.CallExpression) &&
      parent.getExpression().getText() === 'takeUntil' &&
      parent.getArguments().length === 1
    ) {
      const isWithinConstructor = parent.getAncestors().find(node => node.isKind(SyntaxKind.Constructor));
      // in constructor the destroyRef property is not needed
      parent.replaceWithText(isWithinConstructor ? 'takeUntilDestroyed()' : 'takeUntilDestroyed(this.destroyRef)');
    }
  }
};

/**
 * (1) remove not needed destroy$ subject functionality within ngOnDestroy method implementation
 * (2) remove OnDestroy lifecycle hook when its not needed after destroy$ property cleanup
 */
const cleanupOnDestroyImpl = (node: MethodDeclaration) => {
  if (node.getName() === 'ngOnDestroy' && node.getBody()?.isKind(SyntaxKind.Block)) {
    const methodBlock = node.getBody().asKind(SyntaxKind.Block);
    const onlyForDestroy =
      methodBlock.getStatements()?.length === 2 &&
      methodBlock.getStatements()[0].isKind(SyntaxKind.ExpressionStatement) &&
      methodBlock.getStatements()[0].getText() === 'this.destroy$.next();' &&
      methodBlock.getStatements()[1].isKind(SyntaxKind.ExpressionStatement) &&
      methodBlock.getStatements()[1].getText() === 'this.destroy$.complete();';

    if (onlyForDestroy) {
      const classNode = node
        .getAncestors()
        .find(node => node.isKind(SyntaxKind.ClassDeclaration))
        .asKind(SyntaxKind.ClassDeclaration);
      const implHeritage = classNode.getHeritageClauseByKind(SyntaxKind.ImplementsKeyword);
      const idx = implHeritage.getTypeNodes().findIndex(node => node.getText() === 'OnDestroy');
      implHeritage.removeExpression(idx);
      node.remove();
    } else {
      methodBlock
        .getStatements()
        .filter(
          statement =>
            statement.isKind(SyntaxKind.ExpressionStatement) &&
            statement
              .getDescendantsOfKind(SyntaxKind.PropertyAccessExpression)
              .find(
                property => property.getName() === 'destroy$' && property.getExpression().isKind(SyntaxKind.ThisKeyword)
              )
        )
        .forEach(expression => expression.remove());
    }
  }
};
