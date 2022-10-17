import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils';

import { normalizePath } from '../helpers';

const messages = {
  noDoneError: `asynchronous operations in tests should call done callback, see https://facebook.github.io/jest/docs/en/asynchronous.html`,
};

/**
 * Enforces the usage of a done() callback in tests that rely on asynchronous logic (subscribe calls).
 */
const useAsyncSynchronizationInTestsRule: TSESLint.RuleModule<keyof typeof messages> = {
  defaultOptions: undefined,
  meta: {
    messages,
    type: 'problem',
    schema: [],
  },
  create: context => {
    // helper functions
    function isDoneCallback(arg: TSESTree.Node): boolean {
      const text = context.getSourceCode().getText(arg);
      return text === 'done' || text.search(/\sdone\(\)/) >= 0;
    }

    function isDoneCallbackPartialSubscriber(arg: TSESTree.CallExpressionArgument): boolean {
      return (
        arg.type === AST_NODE_TYPES.ObjectExpression &&
        arg.properties
          .filter(p => p.type === AST_NODE_TYPES.Property)
          .filter((p: TSESTree.Property) =>
            ['complete', 'error', 'next'].includes(context.getSourceCode().getText(p.key))
          )
          .some((p: TSESTree.Property) => isDoneCallback(p.value))
      );
    }

    function isDoneInSetTimeout(statement: TSESTree.Statement): boolean {
      return (
        statement.type === AST_NODE_TYPES.ExpressionStatement &&
        statement.expression.type === AST_NODE_TYPES.CallExpression &&
        statement.expression.callee.type === AST_NODE_TYPES.Identifier &&
        statement.expression.callee.name === 'setTimeout' &&
        isDoneCallback(statement.expression.arguments[0])
      );
    }

    function isDoneCalledExplicitly(statement: TSESTree.Statement): boolean {
      return (
        statement.type === AST_NODE_TYPES.ExpressionStatement &&
        statement.expression.type === AST_NODE_TYPES.CallExpression &&
        statement.expression.callee.type === AST_NODE_TYPES.Identifier &&
        statement.expression.callee.name === 'done'
      );
    }

    function arrowFunctionBodyContainsDone(body: TSESTree.BlockStatement | TSESTree.Expression): boolean {
      return (
        body.type === AST_NODE_TYPES.BlockStatement &&
        body.body.some(statement => isDoneInSetTimeout(statement) || isDoneCalledExplicitly(statement))
      );
    }

    if (!normalizePath(context.getFilename()).endsWith('.spec.ts')) {
      return {};
    }
    return {
      'CallExpression > MemberExpression[property.name="subscribe"]'(memberExpNode: TSESTree.MemberExpression) {
        // check if arguments contain done callback or partial subscriber with done callback
        const callExp = memberExpNode.parent as TSESTree.CallExpression;
        if (callExp.arguments.some(arg => isDoneCallback(arg) || isDoneCallbackPartialSubscriber(arg))) {
          return;
        }

        const ancestors = context.getAncestors();

        // check if subscribe is contained in fakeAsync
        if (
          ancestors.filter(
            a =>
              a.type === AST_NODE_TYPES.CallExpression &&
              a.callee.type === AST_NODE_TYPES.Identifier &&
              a.callee.name === 'fakeAsync'
          ).length > 0
        ) {
          return;
        }
        // check if done is used in block outside of subscribe
        if (
          ancestors.filter(
            a =>
              a.type === AST_NODE_TYPES.ArrowFunctionExpression &&
              a.params.some(p => context.getSourceCode().getText(p) === 'done') &&
              arrowFunctionBodyContainsDone(a.body)
          ).length > 0
        ) {
          return;
        }

        context.report({
          node: callExp,
          messageId: 'noDoneError',
        });
      },
    };
  },
};

export default useAsyncSynchronizationInTestsRule;
