<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Application Builder Migration

The PWA currently keeps the Angular application builder and the legacy custom webpack targets in parallel.

The primary build path is the application-builder wrapper:

```bash
npm run build
npm run serve
npm run serve -- --port=4300
npm run build:watch
npm run dev:ssr
npm run analyze
npm run build:application-spike -- --configuration=b2b,production
```

The wrapper applies the migration-specific behavior that is not represented by a plain `angular.json` target:

- theme and file replacement resolution
- temporary HTML/SCSS resource overlays
- `data-testing-*` stripping
- PurgeCSS
- service worker patching
- server compatibility output
- runtime defines such as `PRODUCTION_MODE`, `THEME`, `SERVICE_WORKER`, and `SSR`

The legacy webpack path remains available for parity checks and fallback use:

```bash
npm run build:webpack -- --configuration=b2b,production
npm run build:webpack:server -- --configuration=b2b,production
npm run build:watch:webpack
npm run serve:webpack -- --configuration=b2b,development
npm run analyze:webpack
npm run dev:ssr:webpack
```

`build:watch` defaults to `b2b,development`. For another theme, call the build wrapper directly, e.g.:

```bash
npm run build -- --configuration=b2c,development --watch
```

`analyze` reads the application builder's esbuild metafile at `dist/stats.json`.
Use `analyze:webpack` for the legacy Webpack stats format and `webpack-bundle-analyzer`.

Do not replace the `build` and `server` targets in `angular.json` with the application builder directly while the wrapper still owns migration behavior.
The final switch should either keep the wrapper as the official build entrypoint or move the wrapper behavior into a proper Angular builder target.
