import { strings } from '@angular-devkit/core';
import { Selectors } from '@angular-eslint/utils';
import { ASTUtils, TSESLint, TSESTree } from '@typescript-eslint/utils';
import * as fs from 'fs';
import * as path from 'path';

import { normalizePath } from '../helpers';

const messages = {
  shouldPointToBasicFile: 'Override should point to basic component file.',
  testOverrideTemplateMissing: 'Did not find template override ({{ expectedTemplate }}) this spec is supposed to test.',
  testOverrideTSMissing: 'Did not find TS import ({{ expectedTS }}) this spec is supposed to test.',
  pointToBasicFile: 'Replace with basic component file.',
};

const useCorrectComponentOverridesRule: TSESLint.RuleModule<keyof typeof messages> = {
  defaultOptions: undefined,
  meta: {
    docs: {
      description:
        'For component overrides to work correctly, every Component decorator has to point its URLs to the component base files for HTML and SCSS. This rule checks if this is the case. Additionally, if a test is composed for a component override, this rule checks if the correct component files are used (because the override mechanism does not work with jest).',
      recommended: 'warn',
      url: '',
      suggestion: true,
    },
    messages,
    type: 'problem',
    schema: [],
    hasSuggestions: true,
  },
  create(context) {
    const fileName = path.basename(normalizePath(context.getFilename()));
    const fileBaseName = fileName.replace(/component.*/, 'component');
    if (/\.component\.(?!spec)([a-z]+\.)?ts$/.test(fileName)) {
      return {
        [`${Selectors.COMPONENT_CLASS_DECORATOR} ObjectExpression > Property[key.name="templateUrl"] > Literal`](
          node: TSESTree.Literal
        ) {
          const expected = `./${fileBaseName}.html`;
          if (node.value !== expected) {
            context.report({
              node,
              messageId: 'shouldPointToBasicFile',
              suggest: [{ fix: fixer => fixer.replaceText(node, `'${expected}'`), messageId: 'pointToBasicFile' }],
            });
          }
        },

        [`${Selectors.COMPONENT_CLASS_DECORATOR} ObjectExpression > Property[key.name="styleUrls"] > ArrayExpression`](
          node: TSESTree.ArrayExpression
        ) {
          const expected = `./${fileBaseName}.scss`;
          if (!node.elements.some(el => el.type === TSESTree.AST_NODE_TYPES.Literal && el.value === expected)) {
            const suggest = [];
            if (node.elements.length <= 1) {
              suggest.push({
                fix: fixer => fixer.replaceText(node, `['${expected}']`),
                messageId: 'pointToBasicFile',
              });
            }

            context.report({
              node,
              messageId: 'shouldPointToBasicFile',
              suggest,
            });
          }
        },
      };
    } else if (/\.component\.[a-z]+\.spec\.ts$/.test(fileName)) {
      function getText(node) {
        return context.getSourceCode().getText(node);
      }

      const expectTemplateOverride = fs.existsSync(context.getFilename().replace(/\.spec\.ts$/, '.html'));
      let hasCorrectTemplateOverride = false;
      const expectedTemplate = fileName.replace('.spec.ts', '.html');

      const expectTSOverride = fs.existsSync(context.getFilename().replace(/\.spec\.ts$/, '.ts'));
      let hasCorrectTSOverride = false;
      const expectedTS = fileName.replace('.spec.ts', '');

      const classifiedBaseName = strings.classify(fileBaseName.replace(/\W/g, '-'));

      if (expectTSOverride || expectTemplateOverride) {
        const methods = {
          'Program:exit'(node: TSESTree.Program) {
            if (expectTemplateOverride && !hasCorrectTemplateOverride) {
              context.report({
                node,
                messageId: 'testOverrideTemplateMissing',
                data: {
                  expectedTemplate,
                },
              });
            }
            if (expectTSOverride && !hasCorrectTSOverride) {
              context.report({
                node,
                messageId: 'testOverrideTSMissing',
                data: {
                  expectedTS,
                },
              });
            }
          },
        };

        if (expectTemplateOverride) {
          methods['CallExpression[callee.property.name="overrideComponent"]'] = (node: TSESTree.CallExpression) => {
            if (node.arguments.length === 2) {
              const arg1 = node.arguments[0];
              const isCorrectOverrideKey = ASTUtils.isIdentifier(arg1) && arg1.name === classifiedBaseName;

              const arg2 = node.arguments[1];
              const isCorrectTemplateReplace =
                arg2.type === TSESTree.AST_NODE_TYPES.ObjectExpression &&
                arg2.properties[0].type === TSESTree.AST_NODE_TYPES.Property &&
                ASTUtils.isIdentifier(arg2.properties[0].key) &&
                arg2.properties[0].key.name === 'set' &&
                getText(arg2.properties[0].value)
                  .replace(/\s*/g, '')
                  .includes(`template:require('./${expectedTemplate}')`);

              hasCorrectTemplateOverride = isCorrectOverrideKey && isCorrectTemplateReplace;
            }
          };
        }

        if (expectTSOverride) {
          methods[`ImportDeclaration[source.value="./${expectedTS}"] > ImportSpecifier`] = (
            node: TSESTree.ImportSpecifier
          ) => {
            hasCorrectTSOverride = node.imported.name === classifiedBaseName;
          };
        }

        return methods;
      }
    }

    return {};
  },
};

export default useCorrectComponentOverridesRule;
