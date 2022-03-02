import { requireFormlyCodeDocumentationRule } from '../src/rules/require-formly-code-documentation';

import { RuleTestConfig } from './_execute-tests';

const config: RuleTestConfig = {
  ruleName: 'require-formly-code-documentation',
  rule: requireFormlyCodeDocumentationRule,
  tests: {
    valid: [],
    invalid: [],
  },
};

export default config;
