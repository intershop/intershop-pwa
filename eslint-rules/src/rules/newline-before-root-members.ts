import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils';

const messages = {
  newLineBeforeRootMembers: `New line missing`,
};

/**
 * Checks whether root members of a typescript file (except for imports) are preceded by an empty line.
 */
const newlineBeforeRootMembersRule: TSESLint.RuleModule<keyof typeof messages> = {
  defaultOptions: undefined,
  meta: {
    messages,
    type: 'problem',
    fixable: 'code',
    schema: [],
  },
  create: context => ({
    'Program:exit'(node: TSESTree.Program) {
      const rootMembers = [...node.body];
      for (let i = 0; i < rootMembers.length - 1; i++) {
        const current = rootMembers[i];

        // newline after the last import but not between imports themselves
        if (isNewlineException(current) && rootMembers[i + 1].type === current.type) {
          continue;
        }

        const lines = context.getSourceCode().getLines();
        const currentLastLine = current.loc.end.line;

        if (lines[currentLastLine] === '') {
          continue;
        }
        context.report({
          node: current,
          messageId: 'newLineBeforeRootMembers',
          fix: fixer => fixer.insertTextAfter(current, '\n'),
        });
      }
    },
  }),
};

function isNewlineException(node: TSESTree.Node) {
  return (
    node.type === AST_NODE_TYPES.ImportDeclaration ||
    node.type === AST_NODE_TYPES.ExportNamedDeclaration ||
    node.type === AST_NODE_TYPES.ExportDefaultDeclaration ||
    node.type === AST_NODE_TYPES.ExportAllDeclaration
  );
}

export default newlineBeforeRootMembersRule;
