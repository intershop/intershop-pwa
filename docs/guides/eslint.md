<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Working with ESLint

The PWA uses [ESLint](https://eslint.org) for static code analysis and to enforce best practices.
In order to use ESLint with Angular, we use the [`typescript-eslint`](https://typescript-eslint.io) and [`angular-eslint`](https://github.com/angular-eslint/angular-eslint) packages extensively.

The PWA's ruleset is configured in [`.eslintrc.json`](../../.eslintrc.json) and includes base rulesets to extend from, plugins with additional rules as well as a configuration for our custom rules.

To read more about the Intershop PWA's custom rules, see [Custom ESLint rules](#custom-eslint-rules).

## Configuring ESLint

An ESLint rule configuration is a key-value-pair of a `rules` object in `.eslintrc.json`.
There are separate rulesets for `typescript` and `html` files.
Consider the following example:

```json
"@angular-eslint/component-selector": [
          "error",
          {
            "type": "element",
            "prefix": ["ish"],
            "style": "kebab-case"
          }
        ],
```

The key specifies the rule to configure, in this case `@angular-eslint/component-selector`.

The value specifies a rule's options and can be structured in two different ways:

1. Only a string, with a value of `error`, `warn` or `off`. This simply enables or disables the rule and sets a severity level.
2. An array with at least one entry, where the first entry is always the severity level (`error` or `warn`). The following entries are rule-specific configuration and will be passed to the rule.

Refer to the relevant documentation of the standard ESLint ruleset, various plugins or our custom rules to learn more about what each rule does and how to configure them.

For more information on how to configure every aspect of ESLint, refer to the extensive documentation of [ESLint](https://eslint.org) as well as [`typescript-eslint`](https://typescript-eslint.io) and [`angular-eslint`](https://github.com/angular-eslint/angular-eslint).

## Custom ESLint Rules

To keep the codebase clean, easily maintainable and functional, the Intershop PWA provides a large number of custom ESLint rules.
These rules are located in the `eslint-rules` project.
The custom rules are developed separately from the main source code, which uses the compiled rules as a local developer dependency in its `package.json`.

To work with and develop new custom ESLint rules, follow these steps:

1. Generate a new rule using our schematic: `ng g eslint-rule` (alias `er`). This generates a new rule file at `eslint-rules/src/rules` and a test file at `eslint-rules/tests`.
2. Write the rule code. Refer to [Working with Rules](https://eslint.org/docs/developer-guide/working-with-rules) as well as examples from available rules to understand how. Add reusable helper functions to `helpers.ts` to reduce repetition.
3. Write rule tests. Refer to [Testing](https://typescript-eslint.io/docs/development/custom-rules#testing) for documentation on the `RuleTester` API that is used in tests. Use `npm run test:eslint-rules` to execute your tests.
4. Build the `eslint-rules` project with your changes using `npm run build:eslint-rules`. The resulting JavaScript files will be located in the `eslint-rules/dist` folder. A generated `index.ts` exports the rules to be consumed in the `.eslintrc.json` configuration file.
5. Add the new rule to the ESLint configuration in [`.eslintrc.json`](../../.eslintrc.json).
6. _Optional_: Restart the ESLint server using the `ESLint: Restart ESLint server` command to see your new configuration applied in VSCode. You can access the command via the editor commands (default keybinding: `ctrl + shift + p`).
