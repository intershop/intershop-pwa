import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils';

import { normalizePath } from '../helpers';

const messages = {
  inputAssignmentError: `Assigning to @Input decorated properties is forbidden.`,
};

/** Disallows the reassignment of properties marked with angular's `@Input` decorator.
 */
const noAssignmentToInputsRule: TSESLint.RuleModule<keyof typeof messages> = {
  defaultOptions: undefined,
  meta: {
    messages,
    type: 'problem',
    schema: [],
  },
  create: context => {
    // only apply to component files
    if (normalizePath(context.getFilename()).search(/.(component|container).ts/) < 0) {
      return {};
    }

    const inputs: string[] = [];

    /**
     * checks whether a PropertyDefinition is decorated with the @Input() decorator
     */
    function checkIsInput(node: TSESTree.PropertyDefinition): boolean {
      const decorators = node.decorators;
      if (!decorators?.length) {
        return false;
      }
      return decorators
        .filter(decorator => decorator.expression.type === AST_NODE_TYPES.CallExpression)
        .map(decorator => decorator.expression as TSESTree.CallExpression)
        .map(callExpression =>
          callExpression.callee.type === AST_NODE_TYPES.Identifier ? callExpression.callee.name : ''
        )
        .reduce((acc, curr) => curr === 'Input' || acc, false);
    }

    return {
      PropertyDefinition(node): void {
        if (checkIsInput(node)) {
          inputs.push(node.key.type === AST_NODE_TYPES.Identifier ? node.key.name : '');
        }
      },
      AssignmentExpression(node) {
        if (
          node.left.type === AST_NODE_TYPES.MemberExpression &&
          node.left.object.type === AST_NODE_TYPES.ThisExpression &&
          node.left.property.type === AST_NODE_TYPES.Identifier &&
          inputs.includes(node.left.property.name)
        ) {
          context.report({
            node,
            messageId: 'inputAssignmentError',
          });
        }
      },
    };
  },
};

export default noAssignmentToInputsRule;
