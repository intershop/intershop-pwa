<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Application Builder Migration

The PWA build uses Angular's application builder.
Use the project scripts instead of calling Angular targets directly, because the scripts add PWA-specific theme handling, file replacement support, SSR startup behavior, and post-processing.

## Commands

```bash
npm run build
npm run build:multi
npm run serve:application-dev
npm run dev:ssr
npm run matrix:application-builder
npm run analyze
```

`npm run build` is the supported build entry point for a single theme configuration.

```bash
npm run build -- --configuration=b2b,production
npm run build -- --configuration=b2c,development
```

`npm run build:multi` builds all active themes from `package.json` `config.active-themes`.
It may run theme builds in parallel, but it falls back to sequential builds when theme-specific resource overrides are present.
This fallback is intentional: HTML and SCSS resource overrides are applied through temporary source overlays, and parallel builds in the same working tree would otherwise read each other's overlay state.

`npm run serve:application-dev` is the replacement for `ng serve`.
Do not use `ng serve` for application-builder development in this project.
The custom dev server is required because the PWA theme system does more than Angular's native file replacements:

- it resolves theme-specific `.b2b.*`, `.b2c.*`, and `.all.*` overrides;
- it overlays component HTML and SCSS resources, which Angular file replacements do not support;
- it watches the original files and their override files together;
- it refreshes the active overlay before rebuilding, so live reload reflects override changes;
- it keeps the generated Angular workspace and cache paths aligned with the active theme.

Without this wrapper, live reload can miss override changes or rebuild against stale resources.

```bash
npm run serve:application-dev -- --configuration=b2b,development --port=4200
npm run serve:application-dev -- --configuration=b2c,development --port=4201
```

`npm run dev:ssr` starts the development SSR flow.
It combines the watch build with the local application-builder server.
The local server prints the same development warning as Angular's old SSR dev server and is not intended for production use.
The development SSR watch build also enables PurgeCSS explicitly so it keeps the legacy `serve-ssr` behavior.

```bash
npm run dev:ssr
npm run dev:ssr:b2b
npm run dev:ssr:b2c
```

`npm run matrix:application-builder` runs the supported application-builder matrix checks.
`npm run analyze` builds stats and opens the application-builder bundle analyzer.

## Direct Server Starts

Theme server bundles can be started directly from `dist`.

```bash
PORT=4000 node dist/b2b/server/main.js
PORT=4001 node dist/b2c/server/main.js
```

When `BROWSER_FOLDER` is not set, the server resolves the browser folder next to the active server bundle, for example `dist/b2c/browser` for `dist/b2c/server/main.js`.
This avoids accidentally serving stale assets from `dist/browser`.

## Overrides

TypeScript replacements such as `environment.b2c.ts` are normal Angular file replacements and can be used in parallel multi builds.

Resource overrides are different:

```text
*.b2b.html
*.b2c.html
*.b2b.scss
*.b2c.scss
```

These files replace component resources that Angular does not replace natively.
The build scripts therefore apply an in-memory or temporary overlay depending on the workflow.
For `build:multi`, theme-specific resource overrides make the build run sequentially to keep the output deterministic.
`.all` overrides do not force sequential builds because every theme receives the same resource.

## Migration Notes

- Use `npm run build`, `npm run build:multi`, `npm run serve:application-dev`, and `npm run dev:ssr` as the supported entry points.
- Replace local `ng serve` usage with `npm run serve:application-dev`.
- Keep Webpack-specific commands only for explicit fallback or comparison work.
- Do not add new custom Webpack configuration for application-builder-only behavior.
- If a local build serves the wrong theme assets, check `BROWSER_FOLDER` and prefer the generated `dist/<theme>/server/main.js` plus its sibling `dist/<theme>/browser` output.
