<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Application Builder Migration

The PWA uses the Angular application builder through the project build wrapper.
The wrapper is the supported build entrypoint because it carries project-specific behavior that is not represented by a plain `ng run` invocation.

## Official Build Entrypoints

Use the npm scripts for local builds, CI, and release builds:

```bash
npm run build
npm run build -- --configuration=b2b,production
npm run build -- --configuration=b2c,production
npm run build -- --configuration=b2b,development
npm run build -- --configuration=b2c,development
npm run build -- --configuration=b2c,development --watch
```

The direct application-builder script is kept for matrix, parity, and container checks:

```bash
npm run build:application-builder -- --configuration=b2b,production
npm run matrix:application-builder
npm run compare:application-builder
```

Do not treat direct `ng run intershop-pwa:...` build invocations as the supported migration API.
They bypass wrapper behavior and can produce artifacts that differ from `npm run build`.

## CI Build Coverage

CI should keep using the existing workflow jobs and build steps.
Do not add a separate application-builder workflow only for this migration.

The existing build commands are the application-builder gate:

- `.github/workflows/development.yml` runs `npm run build -- --configuration=b2b,production`.
- `.github/workflows/integration.yml` runs `npm run build:multi`, which expands to `npm run build -- --configuration=<theme>,production` for each active theme.
- `.github/workflows/lighthouse-accessibility.yml` runs `npm run build`.
- `.github/workflows/windows.yml` runs `npm run build -- --configuration=b2b,development` through the developer workflow script.

Webpack checks must stay explicit legacy or fallback invocations, such as `build:webpack` or `serve:webpack`.
They must not replace the wrapper commands above.

The standard Angular development server is wired to a browser-only application-builder target:

```bash
ng serve
ng serve --configuration=b2c
```

Use `npm run dev:ssr:b2b` or `npm run dev:ssr:b2c` when developing the SSR path.
Use `npm run serve:webpack` only when you explicitly need the legacy custom Webpack dev server.

Serve multi-build output by pointing the application-builder server at a theme output:

```bash
npm run build:multi
npm run serve:application --browser-folder=dist/b2b/browser --server-entry=dist/b2b/server
npm run serve:application --port=4300 --browser-folder=dist/b2c/browser --server-entry=dist/b2c/server
```

## Wrapper Responsibilities

The wrapper keeps the behavior that previously lived in the custom Webpack build path or around it:

- theme resolution for `b2b` and `b2c`
- Angular file replacement normalization
- HTML and SCSS resource replacements via temporary overlays before the Angular build
- production `data-testing-*` stripping
- PurgeCSS post-processing
- service-worker cache-check patching
- compile-time defines such as `PRODUCTION_MODE`, `SERVICE_WORKER`, `SSR`, and version labels
- browser/server output wiring for SSR
- active-file and replacement diagnostics

`angular.json` remains the builder backend.
The npm wrapper remains the public build frontend.

## Legacy Webpack Fallbacks

The legacy custom Webpack path remains available for comparison and fallback use:

```bash
npm run build:webpack -- --configuration=b2b,production
npm run build:webpack:server -- --configuration=b2b,production
npm run serve:webpack -- --configuration=b2b,development
npm run analyze:webpack
```

These scripts should stay explicitly named as Webpack/legacy paths.
They are not the default build path.

## Accepted Migration Gaps

The following Webpack differences are intentionally not recreated in the application-builder wrapper:

- Webpack `keep_classnames`
- Webpack-specific chunk splitting
- the `undici` Babel-loader workaround

If one of these becomes a runtime issue, address it as a targeted follow-up instead of expanding the general wrapper.

## Analysis

Use the application-builder analyzer for the official output:

```bash
npm run analyze
```

`analyze` reads the application-builder metafile and writes `dist/stats.json` for bundle inspection.
Use `analyze:webpack` only when comparing against the legacy Webpack stats format.
