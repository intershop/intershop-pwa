<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Working with ESLint

- [Configuring ESLint](#configuring-eslint)
- [Disabling ESLint Rules](#disabling-eslint-rules)
  - [Examples](#examples)
- [Custom ESLint Rules](#custom-eslint-rules)
- [Further Reading](#further-reading)

The PWA uses [ESLint](https://eslint.org) for static code analysis and to enforce best practices.
In order to use ESLint with Angular, we use the [`typescript-eslint`](https://typescript-eslint.io) and [`angular-eslint`](https://github.com/angular-eslint/angular-eslint) packages extensively.

The PWA's ruleset is configured in [`eslint.config.mjs`](../../eslint.config.mjs) and includes base rulesets to extend from, plugins with additional rules as well as a configuration for our custom rules.

To read more about the Intershop PWA's custom rules, see [Custom ESLint rules](#custom-eslint-rules).

## Configuring ESLint

An ESLint rule configuration is a key-value-pair of a `rules` object in `eslint.config.mjs`.
There are separate rulesets for `typescript` and `html` files.
Consider the following example:

```json
'@angular-eslint/component-selector': [
          'error',
          {
            type: 'element',
            prefix: ['ish],
            style: 'kebab-case',
          }
        ],
```

The key specifies the rule to configure, in this case `@angular-eslint/component-selector`.

The value specifies a rule's options and can be structured in two different ways:

1. Only a string, with a value of `error`, `warn` or `off`. This simply enables or disables the rule and sets a severity level.
2. An array with at least one entry, where the first entry is always the severity level (`error` or `warn`). The following entries are rule-specific configuration and will be passed to the rule.

Refer to the relevant documentation of the standard ESLint ruleset, various plugins or our custom rules to learn more about what each rule does and how to configure them.

For more information on how to configure every aspect of ESLint, refer to the extensive documentation of [ESLint](https://eslint.org) as well as [`typescript-eslint`](https://typescript-eslint.io) and [`angular-eslint`](https://github.com/angular-eslint/angular-eslint).

## Disabling ESLint Rules

Fix a reported problem in the code instead of disabling the rule with an `eslint-disable` comment.
Most findings have a better solution, e.g., moving reusable logic of a file that exceeds `max-lines` into a helper, or using the alternative named in the rule message.

Add a disable comment only if there is no useful alternative, e.g., for a false positive or a deliberate exception the rule cannot recognize.
In that case:

- Name the disabled rule, because a bare `eslint-disable` also hides all other findings.
- Keep the scope as small as possible: prefer `eslint-disable-next-line` to a file-wide `eslint-disable`.
- Give the reason after `--`, so reviewers can judge the exception.

### Examples

A file that exceeds the `max-lines` limit configured in `eslint.config.mjs` usually contains logic that can be moved elsewhere, e.g., methods that do not use the state of a service into a helper of the related model, so the rule should not be disabled.

:warning: **Wrong: Disabled Rule Instead of a Fix**

```typescript
/* eslint-disable max-lines */
@Injectable({ providedIn: 'root' })
export class ApiTokenService {
  // ... exceeds the max-lines limit, including methods without service state like:
  private isTokenGrant(req: HttpRequest<unknown>) {
    return req.method === 'POST' && req.url.endsWith('/token') && req.body instanceof HttpParams;
  }
}
```

Variation attribute values can be strings or numbers and must be equal if `'1.0' == 1`, which neither `===` nor a string or number conversion achieves for all values.

:heavy_check_mark: **Justified Exception with Rule, Smallest Scope and Reason**

```typescript
private static isEqual(obj1: VariationAttribute['value'], obj2: VariationAttribute['value']): boolean {
  // eslint-disable-next-line eqeqeq -- needed for comparison of string, integers and floats
  return ProductVariationHelper.toValue(obj1) == ProductVariationHelper.toValue(obj2);
}
```

## Custom ESLint Rules

To keep the codebase clean, easily maintainable and functional, the Intershop PWA provides a large number of custom ESLint rules.
These rules are located in the `eslint-rules` project.
The custom rules are developed separately from the main source code, which uses the compiled rules as a local developer dependency in its `package.json`.

To work with and develop new custom ESLint rules, follow these steps:

1. Generate a new rule using our schematic: `ng g eslint-rule` (alias `er`). This generates a new rule file at `eslint-rules/src/rules` and a test file at `eslint-rules/tests`.
2. Write the rule code. Refer to [Working with Rules](https://eslint.org/docs/latest/extend/custom-rules) as well as examples from available rules to understand how. Add reusable helper functions to `helpers.ts` to reduce repetition.
3. Write rule tests. Refer to [Testing](https://typescript-eslint.io/developers/custom-rules/#testing) for documentation on the `RuleTester` API that is used in tests. Use `npm run test:eslint-rules` to execute your tests.
4. Build the `eslint-rules` project with your changes using `npm run build:eslint-rules`. The resulting JavaScript files will be located in the `eslint-rules/dist` folder. A generated `index.ts` exports the rules to be consumed in the `eslint.config.mjs` configuration file.
5. Add the new rule to the ESLint configuration in [`eslint.config.mjs`](../../eslint.config.mjs).
6. _Optional_: Restart the ESLint server using the `ESLint: Restart ESLint server` command to see your new configuration applied in VSCode. You can access the command via the editor commands (default keybinding: `ctrl + shift + p`).

## Further Reading

- [Best Practices: Prettier & ESLint](https://www.angulararchitects.io/blog/best-practices-prettier-eslint/) - Angular Architects article on ESLint and Prettier best practices
