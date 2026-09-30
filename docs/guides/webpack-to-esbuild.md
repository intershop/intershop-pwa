<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# From webpack to esbuild

This guide is a **starting point** for understanding the migration of the Intershop PWA build from the webpack-based toolchain to the esbuild/Vite-based Angular application builder.
It highlights the most relevant differences and points to the files that changed.
It is intentionally not exhaustive and will be extended as the migration settles.

## Why the change

Angular's `@angular-devkit/build-angular:browser` (webpack) is superseded by the `@angular/build:application` builder, which uses esbuild for bundling and Vite for the development server.
The main benefits are significantly faster cold builds and rebuilds, faster `ng serve` startup, and less custom build configuration to maintain.

## Goal of the experimental branch

<!-- cspell:ignore expirement shortstat -->

`expirement/esbuild-cleanup` provides a migration that can be reviewed by purpose, while retaining the PWA's B2B/B2C builds, browser and SSR behavior, production optimizations, and PM2 deployment.
The goal is to reduce the migration diff against `develop` compared with the original `feat/esbuild-migration` branch by removing unnecessary changes, simplifying the implementation, and merging independent preparations first.
It replaces the custom webpack pipeline with Angular's application builder and Vite development server.
Custom theme overrides remain a separate follow-up.

The branch starts with preparations that can be reviewed and merged into `develop` while it still uses webpack.
`expirement/esbuild-preparations-clean` contains those seven commits without the builder migration.
Three already have preparation PRs; the remaining four also have independent branches.
Some preparations remove compatibility obstacles, while others fix existing runtime or test behavior.
They should not all be treated as requirements for esbuild.

### Diff size compared with develop

These measurements use fixed snapshots from September 30, 2026, before this comparison was added to the guide.
The `develop` reference is `0fb0c8769`; comparisons against it use Git's three-dot syntax, matching a PR's merge-base comparison.
Counts include `package-lock.json` and documentation.

| Comparison                                                                    | Files changed | Lines added | Lines removed |
| ----------------------------------------------------------------------------- | ------------: | ----------: | ------------: |
| Original local migration used for the cleanup, `af6177445`, against `develop` |            75 |       9,074 |         7,478 |
| Original remote migration, `091218236`, against `develop`                     |            76 |       9,138 |         7,477 |
| Cleaned migration including preparations, `49b82e6b6`, against `develop`      |            72 |       9,049 |         7,258 |
| Remaining migration, `49b82e6b6`, against the preparation head, `9b7ce49fc`   |            62 |       8,818 |         7,110 |

The local original snapshot is the baseline used for the cleanup; the remote original also includes a later SEO fix.
The cleanup reduces the combined diff by three files and 245 added or removed lines compared with that local baseline.
Reviewing the migration against the preparation branch reduces it to 62 files and 15,928 added or removed lines, compared with 75 files and 16,552 lines in the local original.
This smaller migration diff depends on using the preparation branch as the PR base or merging its changes into `develop` first.
Splitting commits alone does not reduce the aggregate diff against `develop`.
After merging the preparations, recheck the migration PR against the updated `develop`, since intervening changes or conflict resolutions can affect the counts.

To reproduce the snapshot comparisons:

```sh
git diff --shortstat 0fb0c8769...af6177445
git diff --shortstat 0fb0c8769...091218236
git diff --shortstat 0fb0c8769...49b82e6b6
git diff --shortstat 9b7ce49fc..49b82e6b6
```

### Preparation commits and their purpose

| Commit      | Preparation                           | Reason for including it before the migration                                                                                                                                                                                                                                                   |
| ----------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `43513dc3f` | Translation and font imports          | Reads dynamically imported JSON through its default export and replaces webpack-specific `~` font URLs. These changes remove import and asset-resolution assumptions that do not carry over to esbuild. See [#2193](https://github.com/intershop/intershop-pwa/pull/2193).                     |
| `948b7475f` | Store Devtools configuration          | Uses `PRODUCTION_MODE` instead of a replacement module. This simplifies the configurations carried into the new builder and keeps Devtools disabled in production. Esbuild does not require this particular implementation. See [#2182](https://github.com/intershop/intershop-pwa/pull/2182). |
| `100a85397` | Angular SSR request token             | Uses Angular's `REQUEST` and the Web `Request` API in SEO and Markdown rendering. Vite SSR supplies this standard token; custom Express SSR provides it by converting the Node request. See [#2191](https://github.com/intershop/intershop-pwa/pull/2191).                                     |
| `8d1dfeb24` | Active-theme routing and cache purges | Fixes routing for inactive and hyphenated themes and waits for upstream purge responses. This is an independent runtime fix for the multi-theme deployment retained by the migration. Branch: `fix/ssr-active-theme-routing`.                                                                  |
| `45b1b4973` | SSR health checks                     | Makes health checks run without an explicit `ICM_BASE_URL`, terminate timed-out requests, and wait for successful probes before reporting success. This is an independent deployment fix. Branch: `fix/ssr-health-checks`.                                                                     |
| `3ed77020f` | PM2 metrics collection                | Fixes restart-count accumulation when worker data is missing and handles bus failures and startup without IPC. These monitoring fixes can be reviewed independently of the new SSR packaging. Branch: `fix/pm2-metrics-collection`.                                                            |
| `0fd10bbfe` | Basket and CMS test synchronization   | Waits for the basket update response and targets the intended homepage CMS request when simulating errors. This reduces timing assumptions and unrelated intercepted failures. Branch: `test/stabilize-basket-and-cms-errors`.                                                                 |

### What the removal tests established

Each of the last four preparations was removed separately from the migration, with the other preparations retained.
Every variant passed the B2C development browser/SSR build and runtime packaging.
Chrome checks confirmed browser configuration loading, a working home page, and missing product/category pages returning 404 while preserving their URLs.

The distributor, health-check, and metrics removals reproduced the operational defects described above, but did not prevent the tested build or storefront behavior.
Metrics failure checks used controlled PM2 data with the real metrics library.
The seven existing REST-error Cypress tests and three focused basket quantity persistence checks passed both with and without the test preparation.
These runs did not demonstrate that the test changes are required, and do not establish reliability under every network timing condition.

The checks tested individual removals, not removal of all four together.
They did not repeat production builds, Docker validation, a live PM2 cluster, or the full Cypress suite.
Keep the runtime fixes as independent improvements rather than describing them as esbuild prerequisites.

### Migration commits after the preparations

Review the migration in this order:

1. `5e4ae9d88` switches Angular builders, build scripts, and the SSR runtime layout together.
2. `2963f0267` restores production removal of `data-testing-*` attributes before Angular compiles the templates.
3. `a18b87787` restores production CSS purging through PostCSS, including dependencies, activation, and safelisting.
4. `428121b96` adapts Docker, CI, and documentation to the new output and commands.
5. `c6a2dd6f7` fixes error-URL preservation and state transfer for the new SSR lifecycle.

The final SSR fix belongs with the migration because Angular's Vite SSR engine interprets a changed server location as an HTTP redirect.
It uses `skipLocationChange` when rendering missing-resource errors and supports Angular's `RESPONSE_INIT` when no custom Express response is available.
It also excludes router state from NgRx transfer so the browser keeps its own URL and emits the navigation action used to load configuration.
Using `take(1)` instead of `first()` lets route extraction finish without a navigation action or an `EmptyError`.

## Preparations before switching builders

Incorporate these preparations while still using webpack to reduce the scope of the esbuild migration.
If your PWA version already includes them, only adapt the corresponding client customizations.

### SSR request handling ([#2191](https://github.com/intershop/intershop-pwa/pull/2191))

- Import `REQUEST` from `@angular/core` and adapt custom consumers and mocks from Express to the Web `Request` API, including URL and header access.
- In custom Express SSR bootstraps, provide `createWebRequestFromNodeRequest(req, ['x-forwarded-proto'])` from `@angular/ssr/node`.
- Preserve the fallback when no request is available, including `document.baseURI` for browser SEO URLs.

### Translation and font imports ([#2193](https://github.com/intershop/intershop-pwa/pull/2193))

- Return the default export of dynamically imported translation JSON with `.then(module => module.default)`, including custom language loaders.
- Replace webpack-specific `~` font URLs with paths to the files in `node_modules`, relative to each stylesheet.

### Store Devtools configuration ([#2182](https://github.com/intershop/intershop-pwa/pull/2182))

- Use `PRODUCTION_MODE` for conditional registration in `store-devtools.module.ts`, and remove the obsolete `store-devtools.module.production.ts` and its file replacements from custom Angular configurations.
- Adapt any intentional production enablement to the new conditional registration; the default remains development only.

Before switching builders, run the project's tests and webpack development and production builds for all active themes.
Verify SSR SEO URLs behind the project's proxy and after browser navigation, translations, font loading, and the expected Store Devtools availability.

## Builder and configuration

- The custom webpack builder `@angular-builders/custom-webpack` was replaced by `@angular-builders/custom-esbuild` in [`angular.json`](../../angular.json).
- The large custom webpack configuration in `templates/webpack/webpack.custom.ts` was removed.
  Its responsibilities were split into small, focused pieces:
  - Build-time constants (`PRODUCTION_MODE`, `PWA_VERSION`, `THEME`, `SSR`, ...) are now provided by the esbuild plugin [`templates/esbuild/esbuild-define-constants.ts`](../../templates/esbuild/esbuild-define-constants.ts).
  - CSS tree-shaking moved from `purgecss-webpack-plugin` to a PostCSS plugin in [`tools/postcss-purgecss-config`](../../tools/postcss-purgecss-config/index.cjs), which is opt-in via the `PURGE_CSS` environment variable (enabled for production builds).
  - Removing `data-testing-*` attributes from templates for production is now handled by the preload script [`scripts/remove-data-testing-attributes.cjs`](../../scripts/remove-data-testing-attributes.cjs) instead of a webpack loader.
- Theme file replacements (environment and theme-specific files) are now expressed through the standard `fileReplacements` of the `build` target configurations in [`angular.json`](../../angular.json).

## Dependency changes

Removed (webpack-specific): `@angular-builders/custom-webpack`, `purgecss-webpack-plugin`, `@types/webpack`, `file-replace-loader`, and the `@babel/*` plugins that were only required by the custom webpack pipeline.

Added (esbuild-specific): `@angular-builders/custom-esbuild`, `esbuild`, `@fullhuman/postcss-purgecss` with the local `@intershop/postcss-purgecss-config`, and `sonda` (replacing `webpack-bundle-analyzer` for bundle analysis).

## Changed `ng serve` syntax

With the webpack builder the development server accepted composable, comma-separated configurations, for example:

```
ng serve --configuration "b2c,production"
```

The esbuild/Vite development server resolves the entire build from a single `buildTarget`, so it no longer merges independent `serve` configurations.
Serving a theme is now done through the theme's own `serve` configuration:

```
ng serve --configuration b2c
ng s -c b2c --port 4300 --open
```

To serve a theme with a different environment or with server-side rendering, point `--build-target` at the corresponding `build` configuration (which still supports the composable comma form):

```
ng serve --build-target=intershop-pwa:build:b2c,production
ng serve --build-target=intershop-pwa:build:b2c,development,ssr
```

The build target must always name exactly one theme (`b2b` or `b2c`) and one mode (`development` or `production`).
This is enforced by the [`esbuild-define-constants.ts`](../../templates/esbuild/esbuild-define-constants.ts) esbuild plugin, which derives the `THEME` and `PRODUCTION_MODE` constants from the resolved configuration.
Therefore a theme-less `serve` or SSR command is not possible; omitting the theme fails the build with an `Expected exactly one theme configuration` error.

### Serving with SSR

The `dev:ssr` script is retained for compatibility, so the familiar command still works:

```
npm run dev:ssr
```

Only its implementation changed: with webpack it ran the dedicated `ng run intershop-pwa:serve-ssr` target, whereas it now uses the standard dev server via `ng serve --build-target=intershop-pwa:build:b2b,development,ssr` (server-side rendering against the default theme `b2b`).
To run SSR for another theme, invoke the equivalent command directly, for example `ng serve --build-target=intershop-pwa:build:b2c,development,ssr`.
Additional dev-server options can be appended, for example `npm run dev:ssr -- --ssl` or `npm run dev:ssr -- --port 4300`.

See [Development Environment](./development.md#development-server) for the day-to-day commands and [Building and Running Server-Side Rendering](./ssr-startup.md) for the full SSR setup.

## Bundle analysis

The webpack-based `webpack-bundle-analyzer` was replaced by `sonda`.
Run `npm run analyze` to build with source maps and open the report.

## SSR runtime scaffolding in `dist/`

Previously the SSR runtime files (for example `entrypoint.sh`) were committed directly into the build-output folder `dist/` and kept tracked via an allowlist `dist/.gitignore`.
These files now live in source at [`src/ssr/server-scripts`](../../src/ssr/server-scripts) and are bundled/copied into `dist/` at build time by [`scripts/build-ssr-runtime.js`](../../scripts/build-ssr-runtime.js).
As a result `dist/` is fully generated and simply ignored by the root [`.gitignore`](../../.gitignore), so the per-folder `dist/.gitignore` and the committed runtime files were removed.

## Related documentation

- [Guide - Development Environment](./development.md)
- [Guide - Building and Running Server-Side Rendering](./ssr-startup.md)
- [Guide - Migration Notes](./migrations.md)
- [Guide - Themes](./themes.md)
