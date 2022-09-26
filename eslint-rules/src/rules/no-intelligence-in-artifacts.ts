import { TSESLint, TSESTree } from '@typescript-eslint/utils';

import { normalizePath } from '../helpers';

export type RuleSetting = Partial<{
  ngrx: string;
  service: string;
  router: string;
  facade: string;
}>;

const messages = {
  noIntelligenceError: `{{ error }}`,
};

/**
 * Disallows the use of certain code artifacts (ngrx, service, router or facade usage) in certain files.
 *
 * Each key of the configuration object is a regular expression.
 * It will be matched to check for the unwanted code artifacts and provide a specific error message.
 */
const noIntelligenceInArtifactsRule: TSESLint.RuleModule<keyof typeof messages, [Record<string, RuleSetting>]> = {
  defaultOptions: undefined,
  meta: {
    messages,
    type: 'problem',
    schema: [
      {
        type: 'object',
        additionalProperties: {
          type: 'object',
          properties: {
            ngrx: { type: 'string' },
            service: { type: 'string' },
            router: { type: 'string' },
            facade: { type: 'string' },
          },
          additionalProperties: false,
        },
      },
    ],
  },
  create: context => {
    // helper methods to check artifacts and report errors
    function checkService(imp: string, node: TSESTree.ImportDeclaration) {
      if (rules.service && /\/services(\/|$)/.test(imp)) {
        context.report({
          node,
          data: {
            error: rules.service,
          },
          messageId: 'noIntelligenceError',
        });
      }
    }

    function checkNgrx(imp: string, node: TSESTree.ImportDeclaration) {
      if (rules.ngrx && (/\/store\//.test(imp) || imp.startsWith('@ngrx') || imp.endsWith('/ngrx-testing'))) {
        context.report({
          node,
          data: {
            error: rules.ngrx,
          },
          messageId: 'noIntelligenceError',
        });
      }
    }

    function checkFacade(imp: string, node: TSESTree.ImportDeclaration) {
      if (rules.facade && (/\/facades\//.test(imp) || imp.endsWith('.facade'))) {
        context.report({
          node,
          data: {
            error: rules.facade,
          },
          messageId: 'noIntelligenceError',
        });
      }
    }

    function checkRouter(imp: string, node: TSESTree.ImportDeclaration) {
      if (rules.router && imp.startsWith('@angular/router')) {
        context.report({
          node,
          data: {
            error: rules.router,
          },
          messageId: 'noIntelligenceError',
        });
      }
    }

    const [options] = context.options;
    const ruleMatch = Object.keys(options).find(regexp =>
      new RegExp(regexp).test(normalizePath(context.getFilename()))
    );
    if (!ruleMatch) {
      return {};
    }
    const rules = options[ruleMatch];
    return {
      ImportDeclaration(node) {
        const imp = node.source.value.toString();
        checkService(imp, node);
        checkNgrx(imp, node);
        checkFacade(imp, node);
        checkRouter(imp, node);
      },
    };
  },
};

export default noIntelligenceInArtifactsRule;
