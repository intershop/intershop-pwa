import * as fs from 'fs';
import { parse } from 'path';
import { ClassDeclaration, Node, Project, ReferenceFindableNode, SyntaxKind, ts } from 'ts-morph';

/* eslint-disable no-console */

// RegEx for file exceptions
const fileExceptionsRegex = /\/src\/environments\/|.*\.production\.ts|\/server\.ts$/;

const classMethodCheckRegex = /.*(Mapper|Helper|Facade|Service|State)$/;

const project = new Project({ tsConfigFilePath: 'tsconfig.all.json' });

const rootDirectory = `${project.getRootDirectories()[0].getPath()}/`;

let isError = false;

let warningCount = 0;

let errorCount = 0;

function logError(message: string) {
  console.error('ERROR', message);
  errorCount++;
  isError = true;
}

function logWarning(message: string) {
  console.warn('WARNING', message);
  warningCount++;
}

const args = process.argv.splice(2);

const failFast = args.includes('--fail-fast') || args.includes('--ff');

const fileArgs = args.filter(arg => !arg.startsWith('--'));

const files = fileArgs.length ? project.getSourceFiles(fileArgs) : project.getSourceFiles();

if (failFast) {
  // shuffle array
  for (let i = files.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [files[i], files[j]] = [files[j], files[i]];
  }
}

for (const file of files) {
  if (isError && failFast) {
    break;
  }
  if (fileArgs.length) {
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

  if (/\.component\.ts/.test(file.getFilePath())) {
    const template = file.getFilePath().replace(/\.component\.ts$/, '.component.html');
    if (fs.existsSync(template)) {
      const templateContent = fs.readFileSync(template, 'utf-8');
      const minifiedTemplate = removeAllComments(templateContent);
      file.getClasses().forEach(componentClass => checkComponent(componentClass, minifiedTemplate));
    }
  }

  if (/\.actions?\.ts$/.test(file.getFilePath())) {
    file
      .getDescendantStatements()
      .filter(stmt => Node.isVariableStatement(stmt) && stmt.hasModifier(SyntaxKind.ExportKeyword))
      .forEach(action => checkAction(action));
  }
}

function checkAction(node: Node) {
  if (!isNodeIgnored(node) && Node.isVariableStatement(node)) {
    const actions = node
      .getChildrenOfKind(SyntaxKind.VariableDeclarationList)
      .map(l => l.getLastChild()?.getFirstChild())
      .flat()
      .filter(Boolean)
      .map(node => {
        if (Node.isVariableDeclaration(node)) {
          const actionInitNode = node
            .getChildrenOfKind(SyntaxKind.CallExpression)
            .map(ce => ce.getArguments()[0])
            .flat()[0];

          let type: string;
          if (Node.isStringLiteral(actionInitNode)) {
            type = /\[(.*?)\]/.exec(actionInitNode.getLiteralValue())[1];
          } else if (Node.isObjectLiteralExpression(actionInitNode)) {
            type = actionInitNode
              .getProperty('source')
              .getChildrenOfKind(SyntaxKind.StringLiteral)[0]
              .getLiteralValue();
          } else {
            return;
          }

          return { node, name: node.getName(), type };
        }
      })
      .filter(Boolean);

    actions.forEach(a => {
      const references = a.node
        .findReferencesAsNodes()
        .filter(n => !Node.isImportSpecifier(n.getParent()))
        .map(n => n.getSourceFile().getBaseNameWithoutExtension())
        .filter(n => !n.endsWith('.spec'));

      const { internal, external } = references.reduce(
        (acc, val) => {
          if (/(\.effects?|\.reducers?|-store\.module|\.service)$/.test(val)) {
            acc.internal.push(val);
          } else {
            acc.external.push(val);
          }
          return acc;
        },
        { internal: [], external: [] }
      );

      const isInternal: (type: string) => boolean = type => ['Internal', 'API'].some(t => type.endsWith(t));

      if (references.length === 1 && internal.length) {
        logWarning(`${printRef(a.node)}: ${a.name} is only used once internally and should be removed.`);
      } else if (isInternal(a.type) && external.length) {
        logError(
          `${printRef(a.node)}: ${
            a.name
          } is marked as Internal and accessed outside of the state management. Either it shouldn't be internal or it should not be accessed outside. Offenders: ${external}`
        );
      } else if (!isInternal(a.type) && !external.length) {
        logError(
          `${printRef(a.node)}: ${
            a.name
          } is not accessed outside of the state management. It should either be marked as Internal or be removed.`
        );
      }
    });
  }
}

function printRef(node: Node) {
  const path = node.getSourceFile().getFilePath().replace(rootDirectory, '');
  return `${path}:${node.getStartLineNumber()}`;
}

function removeAllComments(content: string) {
  return content.replace(/<!--[\s\S]*?-->/g, '');
}

function usedOnComponentTemplate(template: string, name: string) {
  return new RegExp(`\\b${name.replace(/\$$/, '')}\\b`).test(template);
}

function isNodeIgnored(node: Node) {
  const ignoreTriggers = ['not-dead-code', 'visible-for-testing'];

  const ignoreComment = node.getPreviousSiblingIfKind(SyntaxKind.SingleLineCommentTrivia)?.getText();
  if (ignoreTriggers.some(trigger => ignoreComment?.includes(trigger))) {
    if (process.env.DEBUG) {
      console.warn('ignoring (A)', node.getText());
    }
    return true;
  }

  if (
    node
      .getLeadingCommentRanges()
      .map(c => c.getText())
      .some(c => ignoreTriggers.some(trigger => c.includes(trigger)))
  ) {
    if (process.env.DEBUG) {
      console.warn('ignoring (B)', node.getText());
    }
    return true;
  }

  // get parent VariableStatement
  const parent = node
    .getParentWhile(p => p.getKind() !== SyntaxKind.VariableStatement)
    ?.getParentIfKind(SyntaxKind.VariableStatement);
  if (parent) {
    return isNodeIgnored(parent);
  }
}

function checkComponent(componentClass: ClassDeclaration, template: string) {
  const allowedNames: string[] = [];

  // get interface methods
  componentClass.getImplements().forEach(implement => {
    const ident = implement.getExpressionIfKind(SyntaxKind.Identifier);
    if (ident) {
      allowedNames.push(
        ...ident
          .getDefinitionNodes()
          .map(def => {
            if (Node.isInterfaceDeclaration(def)) {
              return def
                .getMembers()
                .map(m => {
                  if (Node.isMethodSignature(m)) {
                    return m.getName();
                  }
                })
                .filter(Boolean);
            }
          })
          .flat()
      );
    }
  });

  // find extend names
  const ext = componentClass.getExtends()?.getExpression();
  if (Node.isIdentifier(ext)) {
    allowedNames.push(
      ...ext
        .getDefinitionNodes()
        .map(def => {
          if (Node.isClassDeclaration(def)) {
            return def
              .getMembers()
              .filter(node => !(node.getCombinedModifierFlags() & ts.ModifierFlags.Static))
              .map(m => {
                if (Node.isMethodDeclaration(m)) {
                  return m.getName();
                } else if (Node.isPropertyDeclaration(m)) {
                  return m.getName();
                }
              })
              .filter(Boolean);
          }
        })
        .flat()
    );
  }

  // eslint-disable-next-line complexity
  componentClass.getMembers().forEach(member => {
    if (isNodeIgnored(member)) {
      return;
    }

    if (Node.isConstructorDeclaration(member)) {
      member.getParameters().forEach(parameter => {
        if (parameter.getModifiers().some(modifier => modifier.getKind() === SyntaxKind.PublicKeyword)) {
          const name = parameter.getName();
          if (!usedOnComponentTemplate(template, name)) {
            logError(`${printRef(parameter)}: ${name} is not used on template and should be private.`);
          }
        } else if (
          parameter.getModifiers().some(modifier => modifier.getKind() === SyntaxKind.PrivateKeyword) &&
          parameter.findReferencesAsNodes()?.length === 0
        ) {
          logError(`${printRef(parameter)}: ${parameter.getName()} is not used and should be removed.`);
        }
      });
    } else if (Node.isMethodDeclaration(member)) {
      if (isNodeIgnored(member)) {
        return;
      }

      if (member.getDecorators().some(decorator => decorator.getName() === 'HostListener')) {
        if (process.env.DEBUG) {
          console.warn('ignoring (1)', member.getText());
        }
        return;
      }

      if (member.getName() === 'show' && /-(dialog|modal)\.component\.ts$/.test(member.getSourceFile().getBaseName())) {
        if (process.env.DEBUG) {
          console.warn('ignoring (2)', member.getText());
        }
        return;
      }

      if (allowedNames.includes(member.getName())) {
        if (process.env.DEBUG) {
          console.warn('ignoring (3)', member.getText());
        }
        return;
      }

      if (
        !member.getModifiers().some(modifier => modifier.getKind() === SyntaxKind.PrivateKeyword) &&
        !usedOnComponentTemplate(template, member.getName())
      ) {
        logError(`${printRef(member)}: ${member.getName()} is not used on template and should be private.`);
      }
    } else if (
      Node.isPropertyDeclaration(member) &&
      !member.getModifiers().some(modifier => modifier.getKind() === SyntaxKind.PrivateKeyword)
    ) {
      const name = member.getName();
      if (allowedNames.includes(name)) {
        if (process.env.DEBUG) {
          console.warn('ignoring (4)', member.getText());
        }
        return;
      }
      if (
        ['Input', 'Output', 'ViewChild', 'ViewChildren'].some(decorator =>
          member.getDecorators().some(d => d.getName() === decorator)
        )
      ) {
        if (!usedOnComponentTemplate(template, name) && member.findReferencesAsNodes()?.length === 0) {
          logError(`${printRef(member)}: ${name} is not used and should be removed.`);
        }
      } else if (!usedOnComponentTemplate(template, name)) {
        logError(`${printRef(member)}: ${name} is not used on template and should be private.`);
      }
    }
  });
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
      logError(`${printRef(destroy)}: ${destroy.getName()} is not used in class.`);
    }
  }
}

function isExported(node: Node) {
  return Node.isExportable(node) && node.isExported();
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
    logError(
      `${printRef(node)}: ${node.getKindName()} only used in tests: ${
        Node.hasName(node) ? node.getName() : node.getText()
      }`
    );
  }
  return onlyLocal;
}

// eslint-disable-next-line complexity
function checkNode(node: Node) {
  if (
    Node.hasName(node) &&
    /.*(Reducers|Effects)$/.test(node.getName()) &&
    node.getSourceFile().getBaseName().endsWith('-store.module.ts')
  ) {
    return;
  }

  if (!Node.isReferenceFindable(node)) {
    return;
  }

  if (fileExceptionsRegex.test(node.getSourceFile().getFilePath())) {
    return;
  }

  if (isNodeIgnored(node)) {
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
    logError(
      `${printRef(node)}: ${node.getKindName()} has unused export/visibility: ${
        Node.hasName(node) ? node.getName() : node.getText()
      }`
    );
  } else if (Node.isClassDeclaration(node) && Node.hasName(node) && classMethodCheckRegex.test(node.getName())) {
    node
      .getMembers()
      .filter(m => !Node.isConstructorDeclaration(m))
      /* eslint-disable-next-line no-bitwise */
      .filter(m => !(m.getCombinedModifierFlags() & ts.ModifierFlags.Private))
      .forEach(checkNode);
  } else if (Node.isInterfaceDeclaration(node) && Node.hasName(node) && classMethodCheckRegex.test(node.getName())) {
    node.getMembers().forEach(checkNode);
  } else if (Node.isEnumDeclaration(node) && Node.hasName(node) && classMethodCheckRegex.test(node.getName())) {
    node.getMembers().forEach(checkNode);
  }
}

if (warningCount || errorCount) {
  console.warn('Found', errorCount, 'errors', 'and', warningCount, 'warnings');
} else {
  console.log('No dead code found');
}

if (isError) {
  process.exit(1);
}
