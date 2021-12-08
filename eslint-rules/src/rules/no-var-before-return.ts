import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/experimental-utils';

function filterBlockStatement(body: TSESTree.Statement[]): TSESTree.Statement[] {
  return body?.filter((element, index, array) =>
    element.type === AST_NODE_TYPES.VariableDeclaration
      ? array[index + 1]?.type === AST_NODE_TYPES.ReturnStatement
      : element.type === AST_NODE_TYPES.ReturnStatement
      ? array[index - 1]?.type === AST_NODE_TYPES.VariableDeclaration
      : false
  );
}

function checkNoVarBeforeReturn(body: TSESTree.Statement[]): boolean {
  return (
    body.length === 2 &&
    body[0].type === AST_NODE_TYPES.VariableDeclaration &&
    body[0].declarations[0].id.type === AST_NODE_TYPES.Identifier &&
    body[1].type === AST_NODE_TYPES.ReturnStatement &&
    body[1].argument.type === AST_NODE_TYPES.Identifier &&
    body[0].declarations[0].id.name === body[1].argument.name
  );
}

export const noVarBeforeReturnRule: TSESLint.RuleModule<string, []> = {
  meta: {
    messages: {
      varError: `Don't return a variable, which is declared right before. Return the variable value instead.`,
    },
    type: 'problem',
    schema: [],
  },
  create: context => ({
    BlockStatement(node) {
      const filteredBody = filterBlockStatement(node.body);
      if (checkNoVarBeforeReturn(filteredBody)) {
        filteredBody.map(element =>
          context.report({
            node: element,
            messageId: 'varError',
          })
        );
      }
    },
  }),
};
