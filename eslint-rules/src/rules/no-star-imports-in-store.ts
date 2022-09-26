import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils';

import { normalizePath } from '../helpers';

const messages = {
  starImportError: `Don't use star imports in store files. Import what you need individually instead. `,
};

/**
 * Disallows the usage of star/namespace imports (`import * as exampleActions from './example.actions`).
 *
 * Import what you need individually instead:
 *
 * `import { firstAction, secondAction } from './example.actions'`
 */
const noStarImportsInStoreRule: TSESLint.RuleModule<keyof typeof messages> = {
  defaultOptions: undefined,
  meta: {
    messages,
    type: 'problem',
    fixable: 'code',
    schema: [],
  },
  create: context => {
    // helpers
    function reportErrors(starImport: TSESTree.ImportDeclaration) {
      const getImportFix = (fixer: TSESLint.RuleFixer) =>
        fixer.replaceText(
          starImport,
          `import { ${
            starImportUsageMap[importSpecifier]
              ?.map(memberDeclaration =>
                memberDeclaration.property.type === AST_NODE_TYPES.Identifier ? memberDeclaration.property.name : ''
              )
              .filter(v => !!v)
              .join(', ') ?? ''
          } } from '${starImport.source.value}'`
        );

      const getUsageFixes = (fixer: TSESLint.RuleFixer) => [
        ...starImportUsageMap[importSpecifier]?.map(usage =>
          fixer.replaceText(usage, context.getSourceCode().getText(usage.property))
        ),
      ];

      const importSpecifier = starImport.specifiers[0].local.name;
      context.report({
        node: starImport,
        messageId: 'starImportError',
        fix: getImportFix,
      });
      starImportUsageMap[importSpecifier]?.forEach(usage => {
        context.report({
          node: usage,
          messageId: 'starImportError',
          fix: getUsageFixes,
        });
      });
    }

    if (!/^.*\.(effects|reducer|actions|selectors)\.(ts|spec\.ts)$/.test(normalizePath(context.getFilename()))) {
      return {};
    }
    const starImports: TSESTree.ImportDeclaration[] = [];
    const starImportUsageMap: Record<string, TSESTree.MemberExpression[]> = {};
    return {
      ImportDeclaration(node: TSESTree.ImportDeclaration) {
        if (node.specifiers.some(spec => spec.type === AST_NODE_TYPES.ImportNamespaceSpecifier)) {
          starImports.push(node);
        }
      },
      MemberExpression(node) {
        const usedStarImport = starImports.find(
          imp => node.object.type === AST_NODE_TYPES.Identifier && imp.specifiers[0].local.name === node.object.name
        );
        if (usedStarImport) {
          const importSpecifier = usedStarImport.specifiers[0].local.name;
          if (starImportUsageMap[importSpecifier]?.length) {
            starImportUsageMap[importSpecifier].push(node);
          } else {
            starImportUsageMap[importSpecifier] = [node];
          }
        }
      },
      'Program:exit'() {
        starImports.forEach(starImport => {
          reportErrors(starImport);
        });
      },
    };
  },
};

export default noStarImportsInStoreRule;
