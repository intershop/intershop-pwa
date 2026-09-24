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
