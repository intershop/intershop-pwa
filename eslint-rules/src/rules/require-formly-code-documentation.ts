import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils';

import { getClosestAncestorByKind } from '../helpers';

const messages = {
  missingDocumentationError: `Missing documentation for {{ artifactName }}. \n Please provide documentation for all Formly types, wrappers and extensions.`,
};

const requireFormlyCodeDocumentationRule: TSESLint.RuleModule<keyof typeof messages> = {
  defaultOptions: undefined,
  meta: {
    messages,
    type: 'problem',
    schema: [],
  },
  create: context => {
    function hasPrecedingComment(node: TSESTree.ClassDeclaration) {
      return (
        context.getSourceCode().getCommentsBefore(node)?.length > 0 ||
        (node.decorators?.[0] && context.getSourceCode().getCommentsBefore(node.decorators[0])?.length > 0)
      );
    }
    if (!context.getFilename().includes('formly')) {
      return {};
    }
    return {
      ClassDeclaration(node) {
        if (isFormlyArtifactClass(node) && !hasPrecedingComment(node)) {
          context.report({
            node,
            messageId: 'missingDocumentationError',
            data: {
              artifactName: node.id.name,
            },
          });
        }
      },
      'ExportNamedDeclaration Identifier'(node: TSESTree.Identifier) {
        if (
          node.typeAnnotation?.typeAnnotation?.type === AST_NODE_TYPES.TSTypeReference &&
          node.typeAnnotation.typeAnnotation.typeName.type === AST_NODE_TYPES.Identifier &&
          node.typeAnnotation.typeAnnotation.typeName.name === 'FormlyExtension' &&
          context
            .getSourceCode()
            .getCommentsBefore(getClosestAncestorByKind(context, AST_NODE_TYPES.ExportNamedDeclaration)).length === 0
        ) {
          context.report({
            node,
            messageId: 'missingDocumentationError',
            data: {
              artifactName: node.name,
            },
          });
        }
      },
    };
  },
};

function isFormlyArtifactClass(node: TSESTree.ClassDeclaration): boolean {
  return (
    ['FieldType', 'FieldWrapper'].some(
      superClass => node.superClass?.type === AST_NODE_TYPES.Identifier && node.superClass?.name === superClass
    ) ||
    node.implements?.some(
      impl => impl.expression.type === AST_NODE_TYPES.Identifier && impl.expression.name === 'FormlyExtension'
    )
  );
}

export default requireFormlyCodeDocumentationRule;
