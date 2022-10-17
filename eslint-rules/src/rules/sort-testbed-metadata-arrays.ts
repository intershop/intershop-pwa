import { TSESLint, TSESTree } from '@typescript-eslint/utils';

import { normalizePath } from '../helpers';

const messages = {
  sortTestBedMetadataArrays: '`TestBed` metadata arrays should be sorted in ASC alphabetical order',
};

const sortTestbedMetadataArraysRule: TSESLint.RuleModule<keyof typeof messages> = {
  defaultOptions: undefined,
  meta: {
    type: 'suggestion',
    fixable: 'code',
    schema: [],
    messages,
  },
  create(context) {
    function getText(node) {
      return context.getSourceCode().getText(node);
    }

    if (!normalizePath(context.getFilename()).endsWith('.spec.ts')) {
      return {};
    }

    return {
      'CallExpression[callee.object.name="TestBed"][callee.property.name="configureTestingModule"] > ObjectExpression > Property > ArrayExpression'({
        elements,
      }: TSESTree.ArrayExpression) {
        // logic from https://github.com/angular-eslint/angular-eslint/blob/master/packages/eslint-plugin/src/rules/sort-ngmodule-metadata-arrays.ts

        const unorderedNodes = elements
          .map((current, index, list) => [current, list[index + 1]])
          .find(([current, next]) => next && getText(current).localeCompare(getText(next)) === 1);

        if (!unorderedNodes) return;

        const [unorderedNode, nextNode] = unorderedNodes;
        context.report({
          node: nextNode,
          messageId: 'sortTestBedMetadataArrays',
          fix: fixer => [
            fixer.replaceText(unorderedNode, getText(nextNode)),
            fixer.replaceText(nextNode, getText(unorderedNode)),
          ],
        });
      },
    };
  },
};

export default sortTestbedMetadataArraysRule;
