import { RuleModule, RuleTester, RunTests } from '@typescript-eslint/utils/ts-eslint';
import { basename } from 'path';

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
});

function testRule<TMessageIds extends string = string, TOptions extends unknown[] = []>(
  rule: RuleModule<TMessageIds, TOptions>,
  config: RunTests<TMessageIds, TOptions>
): void {
  ruleTester.run(basename(expect.getState().testPath).replace('.spec.ts', ''), rule, config);
}

export default testRule;
