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

### Migration commits

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

## Builder and configuration

- The custom webpack builder `@angular-builders/custom-webpack` was replaced by `@angular-builders/custom-esbuild` in [`angular.json`](../../angular.json).
- The large custom webpack configuration in `templates/webpack/webpack.custom.ts` was removed.
  Its responsibilities were split into small, focused pieces:
  - Build-time constants (`PRODUCTION_MODE`, `PWA_VERSION`, `THEME`, `SSR`, ...) are now provided by the esbuild plugin [`tools/esbuild/define-constants.plugin.ts`](../../tools/esbuild/define-constants.plugin.ts).
  - CSS tree-shaking moved from `purgecss-webpack-plugin` to a PostCSS plugin in [`tools/postcss-purgecss-config`](../../tools/postcss-purgecss-config/index.cjs), which is opt-in via the `PURGE_CSS` environment variable (enabled for production builds).
  - Removing `data-testing-*` attributes from templates for production is now handled by the preload script [`tools/esbuild/remove-data-testing-attributes.cjs`](../../tools/esbuild/remove-data-testing-attributes.cjs) instead of a webpack loader.
    It is only applied by `npm run build` (via `scripts/build-pwa.js`) for production builds; a direct `ng build` keeps the attributes.
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
This is enforced by the [`define-constants.plugin.ts`](../../tools/esbuild/define-constants.plugin.ts) esbuild plugin, which derives the `THEME` and `PRODUCTION_MODE` constants from the resolved configuration.
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
