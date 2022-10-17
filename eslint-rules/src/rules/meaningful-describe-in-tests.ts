import { strings } from '@angular-devkit/core';
import { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { basename } from 'path';

const messages = {
  meaningfulDescribeInTests: 'The top level describes of the test should be constructed out of the file name.',
};

const meaningfulDescribeInTestsRule: TSESLint.RuleModule<keyof typeof messages> = {
  defaultOptions: undefined,
  meta: {
    docs: {
      description:
        'A rule making sure the top-level describes match the file name. This is good for hiding tests that came into life with copy&paste.',
      recommended: 'warn',
      url: '',
    },
    messages,
    type: 'suggestion',
    fixable: 'code',
    schema: [],
  },
  create(context) {
    if (!context.getFilename().endsWith('.spec.ts')) {
      return {};
    }

    const expected = strings
      .classify(basename(context.getFilename()).replace('.spec.ts', '').replace(/\W/g, '-'))
      .replace(/[A-Z]/g, ' $&')
      .trim();

    return {
      'Program > ExpressionStatement > CallExpression[callee.name="describe"]'(node: TSESTree.CallExpression) {
        if (node.arguments[0]?.type === TSESTree.AST_NODE_TYPES.Literal && node.arguments[0].value !== expected) {
          context.report({
            node: node.arguments[0],
            messageId: 'meaningfulDescribeInTests',
            fix: fixer => fixer.replaceText(node.arguments[0], `'${expected}'`),
          });
        }
      },
    };
  },
};

export default meaningfulDescribeInTestsRule;
