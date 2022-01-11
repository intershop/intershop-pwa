import { AST_NODE_TYPES, TSESLint } from '@typescript-eslint/experimental-utils';

import { normalizePath } from '../helpers';

/**
 * Validates and fixes the environment.*.ts files to contain only property signatures in camelCase format.
 */
export const useCamelCaseEnvironmentPropertiesRule: TSESLint.RuleModule<string, []> = {
  meta: {
    messages: {
      camelCaseError: `Property {{property}} is not camelCase formatted.`,
    },
    type: 'problem',
    fixable: 'code',
    schema: [],
  },
  create(context) {
    if (normalizePath(context.getFilename()).match(/[\\\/\w\-\:]*\/environment[\.\w]*\.ts$/)) {
      return {
        Identifier(node) {
          if (
            node.parent.type === AST_NODE_TYPES.TSPropertySignature &&
            !node.name.match(/^([a-z][A-Za-z0-9]*|[a-z][a-z]_[A-Z][A-Z])$/)
          ) {
            context.report({
              node,
              messageId: 'camelCaseError',
              data: {
                property: node.name,
              },
              fix: fixer => {
                const camelCaseName = node.name
                  .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
                    index === 0 ? word.toLowerCase() : word.toUpperCase()
                  )
                  .replace(/(?:_[a-zA-Z0-9])/g, word => word.substring(1).toLocaleUpperCase())
                  .replace(/\s+/g, '');
                return fixer.replaceText(node, camelCaseName);
              },
            });
          }
        },
      };
    }
    return {};
  },
};
