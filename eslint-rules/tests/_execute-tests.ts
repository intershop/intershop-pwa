import { TSESLint } from '@typescript-eslint/experimental-utils';
import { RuleTester, RunTests } from '@typescript-eslint/experimental-utils/dist/ts-eslint';
import { readdirSync } from 'fs';
import { join, normalize } from 'path';
import { throwError } from 'rxjs';

export type RuleTestConfig<TOptions extends readonly unknown[] = []> = {
  ruleName: string;
  rule: TSESLint.RuleModule<string, TOptions, TSESLint.RuleListener>;
  tests: RunTests<string, Readonly<unknown[]>>;
};

/**
 * This is a script to execute all eslint tests that are in this directory.
 * Note that all tests must `export default` a config of type `RuleTestConfig`.
 * To run tests only for a single rule, simply add a rule name (or part of one) as this scripts argument.
 * To add an argument while running via npm, use this syntax: `npm run test:eslint-rules -- <RULE NAME>`
 */

// instantiate rule tester (with absolute path to @typescript-eslint/parser via __dirname - https://github.com/eslint/eslint/issues/11728)
const ruleTester = new RuleTester({
  parser: join(normalize(process.cwd()), 'node_modules', '@typescript-eslint', 'parser'),
});

// read all existing rule paths & longest file path for formatting
const ruleTestPaths = readdirSync('eslint-rules/tests').filter(f => f !== '_execute-tests.ts');

let longestFilePath = ruleTestPaths
  .map(path => path.replace('.spec.ts', ' '))
  .reduce((acc, curr) => Math.max(acc, curr.length), 0);

// extract optional file argument
const fileArgument = process.argv[2];

// if file argument exists, only run for one file - otherwise run for all files
if (fileArgument) {
  const filePath = ruleTestPaths.find(path => path.includes(fileArgument));
  longestFilePath = filePath.length;
  runTests([filePath]);
} else {
  runTests(ruleTestPaths);
}

// recursively run tests after each other
function runTests(paths: string[]) {
  if (paths.length === 0) {
    return;
  }
  import(`./${paths[0]}`)
    .then(runSingleTest)
    .catch(handleError)
    .finally(() => runTests(paths.slice(1)));
}

/* eslint-disable no-console */
function runSingleTest(ruleFile: { default: RuleTestConfig }) {
  const ruleConfig = ruleFile.default;
  process.stdout.write(`Testing ${ruleConfig.ruleName}...  `);

  ruleTester.run(ruleConfig.ruleName, ruleConfig.rule, ruleConfig.tests);
  // colorful aligned checkmark magic
  console.log('\x1b[32m%s\x1b[0m', `\u2713`.padStart(longestFilePath - ruleConfig.ruleName.length));
}

function handleError(error: unknown) {
  // colorful error message
  console.log('\x1b[31m%s\x1b[0m', `ERROR`);
  console.log(error);
  throwError(() => error);
}
