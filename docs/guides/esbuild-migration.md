<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Esbuild Migration

## Current Scope

The first migration phase provides separate esbuild browser build and development server targets based on the Angular `application` and `dev-server` builders.

This phase intentionally does not migrate custom webpack features.
It currently covers the B2B browser application only.
Server-side rendering and service workers are disabled for the esbuild targets and will be migrated separately.
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

Build output is written to `dist/esbuild/browser`.
Each build replaces the previous output.
To serve the generated files with SPA fallback, run:

```bash
npx serve -s dist/esbuild/browser -l 4200
```

## Implemented Compatibility Changes

- Font URLs no longer use webpack's `~` resolver syntax.
- Dynamically imported JSON localization files use their default export.
- Build-time constants required by the browser application are defined by the esbuild target.

## Known Limitations

- The production browser application still expects configuration, locale, and hydration data from SSR. A standalone production CSR deployment is not supported in this phase.
- The build reports existing Sass `@import` deprecations.
- The production initial bundle currently exceeds its warning budget.
- CSS optimization skips selectors that it cannot process.

Both development and production browser builds compile successfully.
Full production runtime validation will be possible after the SSR target has been migrated.
