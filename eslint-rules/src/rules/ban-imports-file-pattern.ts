import { TSESLint, TSESTree } from '@typescript-eslint/utils';

import { normalizePath } from '../helpers';

export interface RuleSetting {
  filePattern: string;
  name: string;
  importNamePattern?: string;
  starImport?: boolean;
  message: string;
}

const messages = {
  banImportsFilePatternError: `{{message}}`,
};

/**
 * Allows you to specify imports that you don't want to use in files specified by a pattern.
 *
 * filePattern        RegExp pattern to specify the file, which needs to be validated
 * name               RegExp pattern for the import source (path)
 * importNamePattern  RegExp pattern for the import specifier
 * starImport         validate the no import * as from given name are contained
 * message            error message, which should be displayed, when the validation failed
 */
const banImportsFilePatternRule: TSESLint.RuleModule<keyof typeof messages, [RuleSetting[]]> = {
  defaultOptions: undefined,
  meta: {
    messages,
    type: 'problem',
    schema: [
      {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            filePattern: { type: 'string' },
            name: { type: 'string' },
            importNames: { type: 'array' },
            starImport: { type: 'boolean' },
            message: { type: 'string' },
          },
        },
      },
    ],
  },
  create: context => ({
    ImportDeclaration(node: TSESTree.ImportDeclaration) {
      const rules = context.options[0];
      rules.forEach(rule => {
        if (
          new RegExp(rule.filePattern).test(normalizePath(context.getFilename())) &&
          new RegExp(rule.name).test(node.source.value) &&
          checkValidityOfSpecifiers(node.specifiers, rule.importNamePattern, rule.starImport)
        ) {
          context.report({
            node,
            data: {
              message: `${rule.message}`,
            },
            messageId: 'banImportsFilePatternError',
          });
        } else {
          return {};
        }
      });
    },
  }),
};

/**
 * validate given rules against the specifiers of the current import declaration
 *
 * @param specifiers all specifiers of the import declaration
 * @param importName the pattern to check
 * @param starImport flag to check for star import
 * @returns the validity of the specifiers
 */
const checkValidityOfSpecifiers = (
  specifiers: TSESTree.ImportClause[],
  importName: string,
  starImport: boolean
): boolean =>
  (!importName && !starImport) ||
  (importName && specifiers.some(specifier => new RegExp(importName).test(specifier.local.name))) ||
  (starImport && specifiers.some(specifier => specifier.type === TSESTree.AST_NODE_TYPES.ImportNamespaceSpecifier));

export default banImportsFilePatternRule;
