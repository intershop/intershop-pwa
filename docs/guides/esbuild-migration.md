<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Esbuild Migration

## Current Scope

The migration provides separate esbuild browser and server-side rendering targets based on the Angular `application` and `dev-server` builders.

The current scope intentionally does not migrate custom webpack features.
It covers the B2B application only.
Service workers remain disabled for the esbuild targets.
Webpack compatibility is not a goal.

## Build and Serve

Build the development configuration:

```bash
npx ng run intershop-pwa:build-esbuild:development
```

Start the development server:

```bash
npm run start:esbuild
```

Build the production configuration:

```bash
npm run build:esbuild
```

Serve the production configuration with the Angular development server:

```bash
npx ng run intershop-pwa:serve-esbuild:production
```

Build the production configuration with server-side rendering:

```bash
npm run build:ssr:esbuild
```

Start the generated server-side rendering build:

```bash
npm run start:ssr:esbuild
```

Browser output is written to `dist/esbuild/browser` and server output to `dist/esbuild/server`.
Each build replaces the previous output.
To serve the generated files with SPA fallback, run:

```bash
npx serve -s dist/esbuild/browser -l 4200
```

## Implemented Compatibility Changes

- Font URLs no longer use webpack's `~` resolver syntax.
- Dynamically imported JSON localization files use their default export.
- Build-time constants required by the browser application are defined by the esbuild target.
- The SSR build initializes the existing `SSR` constant separately for its browser and server bundles.
- The existing Express and Angular `CommonEngine` server is reused with the esbuild output paths.

## Known Limitations

- A standalone production CSR deployment is not supported because the production application expects configuration, locale, and hydration data from SSR.
- Custom webpack features and service workers have not been migrated.
- The build reports existing Sass `@import` deprecations.
- The production initial bundle currently exceeds its warning budget.
- CSS optimization skips selectors that it cannot process.

The production SSR build compiles successfully.
Runtime rendering, hydration, localization, styling, and the browser console were validated for the English and French home pages.
The Lighthouse performance baseline and comparison workflows run against the esbuild SSR build.
