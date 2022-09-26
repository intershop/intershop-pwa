import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils';

import { getClosestAncestorByKind, normalizePath } from '../helpers';

interface RuleSetting {
  pattern: string | RegExp;
  replacement: string;
  text: string;
}

const REPLACEMENTS: RuleSetting[] = [
  { pattern: /(toBe|toEqual)\(false\)$/, replacement: 'toBeFalse()', text: 'toBeFalse' },
  { pattern: /(toBe|toEqual)\(true\)$/, replacement: 'toBeTrue()', text: 'toBeTrue' },
  { pattern: /(toBe|toEqual)\(undefined\)$/, replacement: 'toBeUndefined()', text: 'toBeUndefined' },
  { pattern: /(toBe|toEqual)\(\'\'\)$/, replacement: 'toBeEmpty()', text: 'toBeEmpty' },
  { pattern: /(toBe|toEqual)\(\[\]\)$/, replacement: 'toBeEmpty()', text: 'toBeEmpty' },
  { pattern: /(toBe|toEqual)\(\{\}\)$/, replacement: 'toBeEmpty()', text: 'toBeEmpty' },
  { pattern: /\.length\)\.(toBe|toEqual)\(([0-9]+)\)$/, replacement: ').toHaveLength($2)', text: 'toHaveLength' },
  { pattern: /(toBe|toEqual)\(NaN\)$/, replacement: 'toBeNaN()', text: 'toBeNaN' },
];

const messages = {
  alternative: `use {{alternative}}`,
};

/**
 * Enforces a consistent coding style in jest tests by disallowing certain matchers and offering replacements.
 * This rule provides a number of default rules but can be configured in the eslint configuration.
 * Provide an array of objects with the following properties:
 *
 * pattern:     RegExp defining the matcher pattern you want to prohibit.
 * replacement: String that will be used to replace the pattern.
 * text:        String which will be displayed in the eslint error message.
 *
 */
const useJestExtendedMatchersInTestsRule: TSESLint.RuleModule<keyof typeof messages, [RuleSetting[]]> = {
  defaultOptions: undefined,
  meta: {
    messages,
    type: 'problem',
    fixable: 'code',
    schema: [
      {
        type: 'array',
        items: {
          type: 'object',
          required: ['pattern', 'replacement', 'text'],
          properties: {
            pattern: { type: 'string', description: 'The jest matcher pattern to avoid.' },
            replacement: { type: 'string', description: 'What to replace the pattern with.' },
            text: { type: 'string', description: 'The content of the rule error.' },
          },
          additionalProperties: false,
        },
      },
    ],
  },
  create: context => {
    if (!normalizePath(context.getFilename()).endsWith('.spec.ts')) {
      return {};
    }
    const [options] = context.options;
    const mergedReplacements = [
      ...REPLACEMENTS,
      ...(options?.map(rep => ({ ...rep, pattern: new RegExp(rep.pattern) })) ?? []),
    ];
    return {
      'MemberExpression > Identifier'(node: TSESTree.Identifier) {
        const callExpression = getClosestAncestorByKind(context, AST_NODE_TYPES.CallExpression);
        const callExpressionText = context.getSourceCode().getText(callExpression);
        if (callExpressionText.includes('expect')) {
          mergedReplacements.forEach(rep => {
            const match = callExpressionText.match(rep.pattern)?.[0];
            if (match) {
              context.report({
                node,
                messageId: 'alternative',
                data: {
                  alternative: rep.text,
                },
                fix: fixer =>
                  fixer.replaceTextRange(
                    callExpression.range,
                    callExpressionText.replace(rep.pattern, rep.replacement)
                  ),
              });
            }
          });
        }
      },
    };
  },
};

export default useJestExtendedMatchersInTestsRule;
