// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/naming-convention
const { RuleTester } = require('@typescript-eslint/rule-tester');

import type { RunTests } from '@typescript-eslint/rule-tester';
import { TSESLint } from '@typescript-eslint/utils';
import { basename } from 'path';

const ruleTester = new RuleTester();

function testRule<TMessageIds extends string = string, TOptions extends unknown[] = []>(
  rule: TSESLint.RuleModule<TMessageIds, TOptions>,
  config: RunTests<TMessageIds, TOptions>
): void {
  ruleTester.run(basename(expect.getState().testPath).replace('.spec.ts', ''), rule, config);
}

export default testRule;
