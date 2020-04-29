<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Continuous Integration

This section provides an overview of required continuous integration steps to verify the validity of code contributions.

> All mentioned tools provide feedback on success or failure via exit code.

## Code Integrity

Since Angular projects are JavaScript-based, even though they use TypeScript-based code, everything is highly dynamic.
Parts of the software can still run error free with `webpack-dev-server` (`ng serve`), even if other parts were not compiled or have template errors.

To ensure having a consistent code base, the CI system should always perform at least an ahead-of-time compile step (`ng build --aot`).

Angular in production mode does AoT and applies some more code optimizations that can sometimes clash with definitions or third-party libraries.
To catch this, a production build should be performed: `ng build --prod`.

To check the integrity of the unit tests, the TypeScript compiler can be used: `npx tsc -p src/tsconfig.spec.json`.

## Dependencies

When using `npm` as manager for third-party libraries, all dependencies get pinned down with exact version numbers and archive digests.
A CI system should check if the current `package.json` corresponds to the checked-in `package-lock.json`.

This can be done with Git tooling (check for Git changes after `npm install`) or can be done by hashing `package-lock.json` before and after the install step and comparing hash values.

## Code Formatting

In larger projects it is beneficial for all users to contribute code in a consistent style.
This reduces the number of conflicts when merging code that was developed in parallel.

To ensure that contributed code is properly formatted, run the formatter on the CI server with `npm run format` and check for changes with Git tooling or calculate hashes before and after.

## Unit Testing

[Jest](https://facebook.github.io/jest/) is used as a test runner.
All tests can and should be run on the CI server with `npm test`.

Since jest is very flexible in accepting code with compile errors, the code integrity should be checked separately.

## UI Testing

UI testing is done with [Cypress](https://www.cypress.io/).
This requires a suitable version of Google Chrome to be installed on the CI worker (or in the Docker image used for the tests).

Run UI tests interactively with `npm run e2e`.
Before that you have to start up a PWA application.

## Universal Testing

Since Angular Universal is used for server-side pre-rendering of content to tackle SEO concerns, the CI system should also check if server-side rendering is still working.
For this purpose, it must be checked whether the server response contains content from lazy-loaded modules, in other words making sure all modules have produced compliant HTML markup.

This can be done by pointing `curl` to a product detail page and checking if a specific CSS class could be found (via `grep`) in the HTML.
Have a look into `e2e/test-universal.sh` to see how we are doing that.

## Static Code Analysis

SCA tools help to improve code quality, which leads to better maintainability and thus to a reduction of technical debts.

Intershop uses `tslint` for static code analysis.
Run the linting process on the CI with `"npm run lint".`

If a rule seems too harsh for you, downgrade it to warning level by choosing:

**tslint.json**

```typescript
"rule-name": { "severity": "warning" }
```

Turn it off completely by using `"rule-name": false`.
