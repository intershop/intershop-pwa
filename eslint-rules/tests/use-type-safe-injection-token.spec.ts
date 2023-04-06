import useTypeSafeInjectionTokenRule from '../src/rules/use-type-safe-injection-token';

import testRule from './rule-tester';

function cleanWhitespace(str: string) {
  return str
    .split('\n')
    .map(line => line.trim())
    .join('\n');
}

testRule(useTypeSafeInjectionTokenRule, {
  valid: [
    {
      name: 'should not report on correctly typed injection',
      code: `class Test {
        constructor(
          private test: string,
          @Inject(TOKEN) private token: InjectSingle<typeof TOKEN>
        ) {}
      }`,
    },
    {
      name: 'should not report on correctly typed standard token',
      code: `class Test {
        constructor(
          @Inject(APP_BASE_HREF) baseHref: string
        ) {}
      }`,
    },
    {
      name: 'should not report on string tokens',
      code: `class Test {
        constructor(@Inject('token') token: unknown) {}
      }`,
    },
  ],
  invalid: [
    {
      name: 'should report on incorrectly typed injection',
      code: cleanWhitespace(`class Test {
        constructor(@Inject(TOKEN) token: unknown) {}
      }`),
      errors: [
        {
          messageId: 'USE_INFERRED_TYPE',
          suggestions: [
            {
              messageId: 'USE_INFERRED_TYPE_APPLY',
              data: { expected: 'InjectSingle<typeof TOKEN>' },
              output: cleanWhitespace(`class Test {
                constructor(@Inject(TOKEN) token: InjectSingle<typeof TOKEN>) {}
              }`),
            },
            {
              messageId: 'USE_INFERRED_TYPE_APPLY',
              data: { expected: 'InjectMultiple<typeof TOKEN>' },
              output: cleanWhitespace(`class Test {
                constructor(@Inject(TOKEN) token: InjectMultiple<typeof TOKEN>) {}
              }`),
            },
          ],
        },
      ],
    },
    {
      name: 'should report on incorrectly typed standard token',
      code: cleanWhitespace(`class Test {
        constructor(@Inject(APP_BASE_HREF) token: unknown) {}
      }`),
      errors: [
        {
          messageId: 'USE_STANDARD_TYPE',
          suggestions: [
            {
              messageId: 'USE_STANDARD_TYPE',
              data: { expected: 'string' },
              output: cleanWhitespace(`class Test {
                constructor(@Inject(APP_BASE_HREF) token: string) {}
              }`),
            },
          ],
        },
      ],
    },
  ],
});
