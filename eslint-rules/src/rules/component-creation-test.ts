import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils';

import { normalizePath } from '../helpers';

export const SHOULD_BE_CREATED_NAME = 'should be created';

const messages = {
  noDescribe: 'All component test files have to include a describe block.',
  noCreationTest: `The component does not have an active '${SHOULD_BE_CREATED_NAME}' test`,
  noComponentTruthyTest: `'${SHOULD_BE_CREATED_NAME}' block does not test if component is truthy`,
  noElementTruthyTest: `'${SHOULD_BE_CREATED_NAME}' block does not test if html element is truthy`,
  noFixtureDetectChangesTest: `'${SHOULD_BE_CREATED_NAME}' block does not test if feature.detectChanges does not throw`,
};

/**
 * Checks whether component tests contain at least a few standard test cases.
 */
const componentCreationTestRule: TSESLint.RuleModule<keyof typeof messages> = {
  defaultOptions: undefined,
  meta: {
    messages,
    fixable: 'code',
    type: 'problem',
    schema: [],
  },
  create: context => {
    // helper functions
    function findComponentTruthy(node: TSESTree.Node) {
      return (
        context
          .getSourceCode()
          .getText(node)
          .search(/.*component.*toBeTruthy.*/) >= 0
      );
    }
    function findElementTruthy(node: TSESTree.Node) {
      return (
        context
          .getSourceCode()
          .getText(node)
          .search(/.*lement.*toBeTruthy.*/) >= 0
      );
    }
    function findFixtureDetectChanges(node: TSESTree.Node) {
      return (
        context
          .getSourceCode()
          .getText(node)
          .search(/[\s\S]*fixture[\s\S]*detectChanges[\s\S]*not\.toThrow[\s\S]*/) >= 0
      );
    }

    if (!(normalizePath(context.getFilename()).search(/.(component|container).spec.ts/) > 0)) {
      return {};
    }

    let firstDescribe: TSESTree.CallExpression;

    let creationTestNode: TSESTree.CallExpression;
    let hasComponentTruthy = false;
    let hasElementTruthy = false;
    let hasFixtureDetectChanges = false;

    return {
      // find correct 'should be created' test that fulfills requirements
      'CallExpression[callee.name="it"]'(node: TSESTree.CallExpression) {
        // check if should be created test exists
        if (
          node.arguments.filter(arg => arg.type === AST_NODE_TYPES.Literal && arg.value === SHOULD_BE_CREATED_NAME)
            .length > 0
        ) {
          creationTestNode = { ...node };
          // check if test fulfills all requirements
          const body = (
            node.arguments.find(
              arg => arg.type === AST_NODE_TYPES.ArrowFunctionExpression
            ) as TSESTree.ArrowFunctionExpression
          ).body;
          if (body.type === AST_NODE_TYPES.BlockStatement) {
            hasComponentTruthy = body.body.some(findComponentTruthy);
            hasElementTruthy = body.body.some(findElementTruthy);
            hasFixtureDetectChanges = body.body.some(findFixtureDetectChanges);
          }
        }
      },
      // find first describe block to display the error at a relevant position
      'CallExpression[callee.name="describe"]:exit'(node: TSESTree.CallExpression) {
        if (!firstDescribe) {
          firstDescribe = node;
        }
      },
      // report errors after everything has been parsed
      'Program:exit'(node: TSESTree.Program) {
        // report missing describe block in empty test
        if (!firstDescribe) {
          context.report({
            node,
            messageId: 'noDescribe',
          });
          return;
        }
        // report missing test error at describe
        if (!creationTestNode) {
          context.report({
            node: firstDescribe.callee,
            messageId: 'noCreationTest',
          });
          return;
        }
        // report specific missing statement errors at creationTest
        if (!hasComponentTruthy) {
          context.report({
            node: creationTestNode.callee,
            messageId: 'noComponentTruthyTest',
          });
        }
        if (!hasElementTruthy) {
          context.report({
            node: creationTestNode.callee,
            messageId: 'noElementTruthyTest',
          });
        }
        if (!hasFixtureDetectChanges) {
          context.report({
            node: creationTestNode.callee,
            messageId: 'noFixtureDetectChangesTest',
          });
        }
      },
    };
  },
};

export default componentCreationTestRule;
