import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils';

function getElementBeforeReturnStatement(node: TSESTree.ReturnStatement): TSESTree.Statement {
  if (node.parent.type === AST_NODE_TYPES.BlockStatement) {
    const index = node.parent.body.findIndex(element => element.type === AST_NODE_TYPES.ReturnStatement);
    return node.parent.body[index - 1];
  }
}

function checkNoVarBeforeReturn(node: TSESTree.ReturnStatement): boolean {
  const elementBeforeReturn = getElementBeforeReturnStatement(node);
  return (
    elementBeforeReturn?.type === AST_NODE_TYPES.VariableDeclaration &&
    elementBeforeReturn.declarations[0].id.type === AST_NODE_TYPES.Identifier &&
    node.argument.type === AST_NODE_TYPES.Identifier &&
    elementBeforeReturn.declarations[0].id.name === node.argument.name
  );
}

const messages = {
  varError: `Don't return a variable, which is declared right before. Return the variable value instead.`,
};

const noVarBeforeReturnRule: TSESLint.RuleModule<keyof typeof messages> = {
  defaultOptions: undefined,
  meta: {
    messages,
    fixable: 'code',
    type: 'problem',
    schema: [],
  },
  create: context => ({
    ReturnStatement(node) {
      if (checkNoVarBeforeReturn(node)) {
        const variable = getElementBeforeReturnStatement(node);
        const loc = {
          start: variable.loc.start,
          end: node.loc.end,
        };
        if (variable.type === AST_NODE_TYPES.VariableDeclaration) {
          const sourceCode = context.getSourceCode();
          context.report({
            loc,
            messageId: 'varError',
            fix: fixer => [
              fixer.removeRange([variable.range[0], node.range[0]]),
              fixer.replaceText(node.argument, sourceCode.getText(variable.declarations[0].init)),
            ],
          });
        }
      }
    },
  }),
};

export default noVarBeforeReturnRule;
