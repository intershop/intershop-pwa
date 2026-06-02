import { Selectors } from '@angular-eslint/utils';
import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils';

const messages = {
  sortStandaloneComponentImports: '`Component` imports should be sorted in ASC alphabetical order',
};

const sortStandaloneComponentImportsRule: TSESLint.RuleModule<keyof typeof messages> = {
  defaultOptions: undefined,
  meta: {
    type: 'suggestion',
    fixable: 'code',
    schema: [],
    messages,
  },
  create(context) {
    function getText(node: TSESTree.Node) {
      return context.sourceCode.getText(node);
    }

    return {
      [`${Selectors.COMPONENT_CLASS_DECORATOR} CallExpression > ObjectExpression > Property[key.name="imports"] > ArrayExpression`]({
        elements,
      }: TSESTree.ArrayExpression) {
        if (!elements.every(isSortableElement)) {
          return;
        }

        const sortedTexts = elements.map(getText).sort((left, right) => left.localeCompare(right));
        const firstUnsortedIndex = elements.findIndex((element, index) => getText(element) !== sortedTexts[index]);

        if (firstUnsortedIndex < 0) {
          return;
        }

        context.report({
          node: elements[firstUnsortedIndex],
          messageId: 'sortStandaloneComponentImports',
          fix: fixer => elements.map((element, index) => fixer.replaceText(element, sortedTexts[index])),
        });
      },
    };
  },
};

function isSortableElement(
  element: TSESTree.ArrayExpression['elements'][number]
): element is Exclude<TSESTree.ArrayExpression['elements'][number], TSESTree.SpreadElement | undefined> {
  return element !== undefined && element.type !== AST_NODE_TYPES.SpreadElement;
}

export default sortStandaloneComponentImportsRule;
