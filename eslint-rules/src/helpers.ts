import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils';

/**
 * Checks whether the given class declaration is of type 'Component'
 *
 * @param node the class declaration, which need to be checked
 * @returns the result of the check
 */
export const isComponent = (node: TSESTree.ClassDeclaration): boolean => isType(node, ['Component']);

/**
 * check the given class declaration to be from given types
 *
 * @param node the class declaration, which need to be checked
 * @param types the wanted types (e.g. 'Component', 'Pipe', ...)
 * @returns the result of the check
 */
export const isType = (node: TSESTree.ClassDeclaration, types: string[]): boolean => {
  const decorator = node.decorators?.[0];
  if (!decorator) {
    return false;
  }
  return (
    decorator.expression.type === AST_NODE_TYPES.CallExpression &&
    decorator.expression.callee.type === AST_NODE_TYPES.Identifier &&
    types.includes(decorator.expression.callee.name)
  );
};

/**
 * look for the first node in the currently-traversed node, which matches the searched node type
 *
 * @param context the context for search
 * @param type the wanted node type
 * @returns the matching node
 */
export function getClosestAncestorByKind(
  context: TSESLint.RuleContext<string, readonly unknown[]>,
  type: AST_NODE_TYPES
): TSESTree.Node {
  const ancestors = context.getAncestors();
  for (let i = ancestors.length - 1; i >= 0; i--) {
    if (ancestors[i].type === type) {
      return ancestors[i];
    }
  }
}

export const objectContainsProperty = (node: TSESTree.ObjectExpression, propName: string): boolean =>
  node.properties.find(
    prop =>
      prop.type === AST_NODE_TYPES.Property && prop.key.type === AST_NODE_TYPES.Identifier && prop.key.name === propName
  ) !== undefined;

/**
 * normalize path to avoid problems with different operating systems
 */
export const normalizePath = (filePath: string): string => filePath.replace(/\\/g, '/');
