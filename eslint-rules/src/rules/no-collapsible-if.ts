import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils';

const messages = {
  noCollapsibleIfError: `If-statements can be merged.`,
};

/**
 * Finds and merges collapsible if statements.
 */
const noCollapsibleIfRule: TSESLint.RuleModule<keyof typeof messages> = {
  defaultOptions: undefined,
  meta: {
    messages,
    fixable: 'code',
    type: 'problem',
    schema: [],
  },
  create: context => ({
    IfStatement(node: TSESTree.IfStatement) {
      const condition2 = collapsibleIfStatement(node);
      if (condition2) {
        context.report({
          node,
          messageId: 'noCollapsibleIfError',
          fix: fixer =>
            fixer.replaceText(
              node,
              collapseIf({ sourceCode: context.getSourceCode(), node, condition1: node.test, condition2 })
            ),
        });
      }
    },
  }),
};

/**
 * check whether the if statement can be merged
 *
 * @param node the current if statement
 * @returns the second condition, when if statement is collapsible, otherwise false
 */
function collapsibleIfStatement(node: TSESTree.IfStatement): TSESTree.Expression | false {
  return node.consequent &&
    !node.alternate &&
    node.consequent.type === AST_NODE_TYPES.BlockStatement &&
    node.consequent.body.length === 1 &&
    node.consequent.body[0].type === AST_NODE_TYPES.IfStatement &&
    !node.consequent.body[0].alternate
    ? node.consequent.body[0].test
    : false;
}

/**
 * build the collapsed if statement
 *
 * @param param sourceCode  The source code of the current if statement
 * @param param node        The current if statement
 * @param param condition1  The test expression of the first if
 * @param param condition2  The test expression of the second if
 * @returns the source code with merged if statements
 */
function collapseIf({
  sourceCode,
  node,
  condition1,
  condition2,
}: {
  sourceCode: Readonly<TSESLint.SourceCode>;
  node: TSESTree.IfStatement;
  condition1: TSESTree.Expression;
  condition2: TSESTree.Expression;
}): string {
  const firstIfCondition: string = sourceCode.getText(condition1);
  const secondIfCondition = sourceCode.getText(condition2);
  let consequent = sourceCode.getText(node.consequent).replace(/(if( )*\([^\{]*\{)[\r\n]/, '');
  const reg = new RegExp('[\r\n]( )*}', 'g');
  reg.exec(consequent);
  consequent = consequent.replace(consequent.substring(reg.lastIndex, consequent.lastIndexOf('}') + 1), '');
  return `if((${firstIfCondition}) && (${secondIfCondition}))${consequent}`;
}

export default noCollapsibleIfRule;
