import { TSESLint } from '@typescript-eslint/utils';
import { RuleTester, RunTests } from '@typescript-eslint/utils/dist/ts-eslint';
import { basename } from 'path';

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
});

function testRule<TMessageIds extends string = string, TOptions extends unknown[] = []>(
  rule: TSESLint.RuleModule<TMessageIds, TOptions>,
  config: RunTests<TMessageIds, TOptions>
): void {
  ruleTester.run(basename(expect.getState().testPath).replace('.spec.ts', ''), rule, config);
}

export default testRule;
