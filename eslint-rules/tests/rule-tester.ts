import { TSESLint } from '@typescript-eslint/utils';
import { basename } from 'path';

const ruleTester = new TSESLint.RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
});

function testRule<TMessageIds extends string = string, TOptions extends unknown[] = []>(
  rule: TSESLint.RuleModule<TMessageIds, TOptions>,
  config: TSESLint.RunTests<TMessageIds, TOptions>
): void {
  ruleTester.run(basename(expect.getState().testPath).replace('.spec.ts', ''), rule, config);
}

export default testRule;
