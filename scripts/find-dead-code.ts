import { parse } from 'path';
import { ClassDeclaration, Node, Project, ReferenceFindableNode, SyntaxKind } from 'ts-morph';

const classMethodCheckRegex = /.*(Mapper|Helper|Facade|Service|State)$/;

const project = new Project({ tsConfigFilePath: 'tsconfig.all.json' });

let isError = false;

const args = process.argv.splice(2);

for (const file of args.length ? project.getSourceFiles(args) : project.getSourceFiles()) {
  if (args.length) {
    // tslint:disable-next-line:no-console
    console.log('at', file.getFilePath());
  }
  file.forEachChild(child => {
    if (Node.isVariableStatement(child)) {
      if (isExported(child)) {
        child.getDeclarations().forEach(checkNode);
      }
    } else if (isExported(child)) {
      checkNode(child);
    }
  });

  if (/\.(component|pipe|directive)\.ts/.test(file.getFilePath())) {
    file.getClasses().forEach(checkDestroyInAngularArtifacts);
  }
}

function checkDestroyInAngularArtifacts(clazz: ClassDeclaration) {
  const destroy = clazz.getProperty('destroy$');
  if (destroy) {
    const references = destroy
      .findReferencesAsNodes()
      .map(reference =>
        reference.getParentWhile((_, c) => !Node.isMethodDeclaration(c) && !Node.isConstructorDeclaration(c))
      )
      .map(
        reference =>
          (Node.isMethodDeclaration(reference) && reference.getName()) ||
          (Node.isConstructorDeclaration(reference) && 'constructor')
      )
      .filter(name => !!name && name !== 'ngOnDestroy');

    if (!references.length) {
      console.warn(
        `ERROR ${destroy
          .getSourceFile()
          .getFilePath()}:${destroy.getStartLineNumber()}: ${destroy.getName()} is not used in class.`
      );
      isError = true;
    }
  }
}

function isExported(node: Node) {
  return Node.isExportableNode(node) && node.isExported();
}

function inTest(node: Node) {
  return node.getSourceFile().getFilePath().endsWith('spec.ts');
}

function isDev(node: Node) {
  const filePath = node.getSourceFile().getFilePath();
  const parsed = parse(filePath);
  return parsed.dir.split('/').includes('dev');
}

function isInDecorator(node: Node) {
  const declaration = node.getParentWhile((_, c) => !Node.isClassDeclaration(c) && !Node.isDecorator(c));
  return Node.isDecorator(declaration);
}

function isProvidedInModule(node: Node) {
  const check = (n: Node) => Node.isPropertyAssignment(n) && n.getName() === 'providers';
  const declaration = node.getParentWhile((_, c) => !check(c));
  return check(declaration);
}

function sameFile(n1: Node, n2: Node) {
  return n1.getSourceFile() === n2.getSourceFile();
}

function isUnreferenced(node: Node & ReferenceFindableNode) {
  const references = node.findReferencesAsNodes();

  if (Node.isFunctionDeclaration(node) && references.some(isInDecorator)) {
    return false;
  } else if (references.some(isProvidedInModule)) {
    return false;
  } else if (isDev(node)) {
    return false;
  }

  const onlyLocal = references.every(n => sameFile(node, n));

  if (
    references.length &&
    (!onlyLocal && Node.isPropertySignature(node)
      ? references.filter(n => !sameFile(node, n)).every(inTest)
      : references.every(inTest))
  ) {
    console.warn(
      `ERROR ${node
        .getSourceFile()
        .getFilePath()}:${node.getStartLineNumber()}: ${node.getKindName()} only used in tests: ${
        Node.hasName(node) ? node.getName() : node.getText()
      }`
    );
    isError = true;
  }
  return onlyLocal;
}

function checkNode(node: Node) {
  if (
    Node.hasName(node) &&
    /.*(Reducers|Effects)$/.test(node.getName()) &&
    node.getSourceFile().getBaseName().endsWith('-store.module.ts')
  ) {
    return;
  }

  if (!Node.isReferenceFindableNode(node)) {
    return;
  }

  if (/\/src\/environments\//.test(node.getSourceFile().getFilePath())) {
    return;
  }

  const ignoreComment = node.getPreviousSiblingIfKind(SyntaxKind.SingleLineCommentTrivia);
  if (ignoreComment && ignoreComment.getText().includes('not-dead-code')) {
    return;
  }

  if (Node.isVariableDeclaration(node)) {
    const name = node.getNameNode();
    // special case for object bindings used for entity selectors
    if (Node.isObjectBindingPattern(name)) {
      name.getElements().forEach(element => {
        checkNode(element.getNameNode());
      });
      return;
    }
  }

  if (isUnreferenced(node)) {
    console.warn(
      `ERROR ${node
        .getSourceFile()
        .getFilePath()}:${node.getStartLineNumber()}: ${node.getKindName()} has unused export/visibility: ${
        Node.hasName(node) ? node.getName() : node.getText()
      }`
    );
    isError = true;
  } else if (Node.isClassDeclaration(node) && Node.hasName(node) && classMethodCheckRegex.test(node.getName())) {
    node
      .getMembers()
      .filter(m => !m.getFirstModifierByKind(SyntaxKind.PrivateKeyword))
      .forEach(checkNode);
  } else if (Node.isInterfaceDeclaration(node) && Node.hasName(node) && classMethodCheckRegex.test(node.getName())) {
    node.getMembers().forEach(checkNode);
  } else if (Node.isEnumDeclaration(node) && Node.hasName(node) && classMethodCheckRegex.test(node.getName())) {
    node.getMembers().forEach(checkNode);
  }
}

if (isError) {
  process.exit(1);
}
