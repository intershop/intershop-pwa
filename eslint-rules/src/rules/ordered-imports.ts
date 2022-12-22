import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils';

const messages = {
  unorderedImports: `Imports are not ordered correctly.`,
};

/**
 * Enforces a certain ordering and grouping of imports:
 *
 * 1. Sort import statements by source.
 * 2. Sort import specifiers by name in each import statement.
 * 3. Group imports by category and in a fixed order:
 *    - general/framework imports
 *    - `ish-` imports
 *    - relative imports starting with `../`
 *    - relative imports from the same folder, starting with `./`
 */
const orderedImportsRule: TSESLint.RuleModule<keyof typeof messages> = {
  defaultOptions: undefined,
  meta: {
    messages,
    type: 'problem',
    fixable: 'code',
    schema: [],
  },
  create: context => {
    // helpers

    function getSortedImportAsString(node: TSESTree.ImportDeclaration): string {
      const nodeText = context.getSourceCode().getText(node);
      if (isDefaultOrNamespaceOrSideeffectImport(node)) {
        return nodeText;
      }
      const sortedNamedImports = (node.specifiers as TSESTree.ImportSpecifier[])
        .map(imp => context.getSourceCode().getText(imp))
        .sort();

      if (/\{.*\}/.test(nodeText)) {
        return nodeText.replace(/\{.*\}/, `{ ${sortedNamedImports.join(', ')} }`);
      }

      return nodeText.replace(
        /\{(.|\n)*\}/,
        `{${lineEnding}  ${sortedNamedImports.join(`,${lineEnding}  `)},${lineEnding}}`
      );
    }

    const importDeclarations: TSESTree.ImportDeclaration[] = [];
    const lineEnding = `\n`;

    return {
      ImportDeclaration(node) {
        importDeclarations.push(node);
      },
      'Program:exit'(node: TSESTree.Program) {
        if (!importDeclarations.length) {
          return;
        }

        // get location for correct error reporting & replacement
        const importSourceLocation = {
          start: importDeclarations[0].loc.start,
          end: importDeclarations[importDeclarations.length - 1].loc.end,
        };

        // group imports by source
        const groups: Record<number, TSESTree.ImportDeclaration[]> = importDeclarations.reduce((acc, val) => {
          const order = getGroupingOrder(val);
          acc[order] = [...(acc?.[order] ?? []), val];
          return acc;
        }, {});

        // sort import statements by source & imports per statement
        const sorter = (leftImport, rightImport) => getFromString(leftImport).localeCompare(getFromString(rightImport));
        const newImports: string = Object.keys(groups)
          .map(orderString => parseInt(orderString, 10))
          .sort()
          .filter(order => !!groups[order])
          .map(order => groups[order].sort(sorter).map(getSortedImportAsString).join(lineEnding))
          .join(`${lineEnding}${lineEnding}`);

        // remove old imports and insert new ones
        const originalImports: string = context
          .getSourceCode()
          .getLines()
          .filter((_, index) => index >= importSourceLocation.start.line - 1 && index < importSourceLocation.end.line)
          .join(lineEnding);

        if (originalImports.trim() !== newImports.trim()) {
          context.report({
            loc: importSourceLocation,
            messageId: 'unorderedImports',
            fix: fixer => [
              // remove everything up to the last import
              fixer.removeRange([node.range[0], importDeclarations[importDeclarations.length - 1].range[1]]),
              // insert new imports at start of file
              fixer.insertTextBefore(node, newImports),
            ],
          });
        }
      },
    };
  },
};

// get value from import statement
function getFromString(node: TSESTree.ImportDeclaration): string {
  return node.source.value.toString();
}

/**
 * get order numbers used for grouping imports:
 * 0 - all imports
 * 1 - imports starting with `ish-`
 * 2 - imports starting with `..`
 * 3 . imports starting with `.`
 */
function getGroupingOrder(node: TSESTree.ImportDeclaration): number {
  const fromStatement = getFromString(node);
  if (!fromStatement.startsWith('.') && !fromStatement.startsWith('ish')) {
    return 0;
  } else if (fromStatement.startsWith('ish')) {
    return 1;
  } else if (fromStatement.startsWith('..')) {
    return 2;
  } else {
    return 3;
  }
}

// check whether import is default or namespace import
function isDefaultOrNamespaceOrSideeffectImport(node: TSESTree.ImportDeclaration) {
  return (
    !node.specifiers.length ||
    node.specifiers[0].type === AST_NODE_TYPES.ImportNamespaceSpecifier ||
    node.specifiers[0].type === AST_NODE_TYPES.ImportDefaultSpecifier
  );
}

export default orderedImportsRule;
