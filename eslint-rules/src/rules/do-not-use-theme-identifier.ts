import { TSESLint } from '@typescript-eslint/utils';

import { normalizePath } from '../helpers';

const DEFAULT_FILE_PATTERN = '.*\\.(component|directive|pipe)\\.ts';

const messages = {
  doNotUseThemeIdentifier: 'Do not use THEME variable here. Instead use correctly named overrides.',
};

/**
 * Disallows the `THEME` variable in Angular artifacts, because it bypasses the component override mechanism.
 * Use correctly named override files instead.
 *
 * The file pattern can be configured, default: `.*\.(component|directive|pipe)\.ts`
 */
const doNotUseThemeIdentifierRule: TSESLint.RuleModule<keyof typeof messages, [string]> = {
  meta: {
    docs: {
      description: `Using the THEME variable in Angular artifacts directly bypasses the concept of component overrides and leads to bad practice. This rule warns about the use. The pattern for files can be configured. Default is "${DEFAULT_FILE_PATTERN}"`,
      url: '',
    },
    messages,
    type: 'problem',
    schema: [
      {
        type: 'string',
      },
    ],
  },
  create(context) {
    const config = context.options[0] ?? DEFAULT_FILE_PATTERN;

    if (!new RegExp(config).test(normalizePath(context.filename))) {
      return {};
    }

    return {
      'Identifier[name="THEME"]'(node) {
        context.report({
          node,
          messageId: 'doNotUseThemeIdentifier',
        });
      },
    };
  },
};

export default doNotUseThemeIdentifierRule;
