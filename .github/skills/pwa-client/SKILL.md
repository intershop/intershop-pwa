---
name: pwa-client
description: 'Build or change how the Intershop PWA calls a backend: REST services for ICM, Sparque, or another external system, with their interfaces, mappers, and models. Use when adding or extending a service under services/, a new endpoint, or a model for API data.'
---

# PWA Client Layer

Builds the services that call a backend and return mapped PWA models.
The rules live in the instructions and guides this skill points to; the skill is the order to apply them in.

## Workflow

1. **Read the rules** before writing code:
   [service-patterns](../../instructions/service-patterns.instructions.md),
   [error-handling](../../instructions/error-handling.instructions.md),
   [naming-patterns](../../instructions/naming-patterns.instructions.md),
   and [Data Handling with Mappers](../../../docs/guides/data-handling-with-mappers.md).
2. **Pick the gateway** for each call:
   - ICM: `ApiService`
   - Sparque: `SparqueApiService`
   - another external system: search for an existing `*-api.service.ts` of that system (e.g., a Flowise chatflow) and reuse it; write a new one only when none exists, and say why in the report.
3. **Generate** every new artifact with the PWA schematics:
   - a service: `ng g service <name> --extension <extension>` (without `--extension` in core), which creates `services/<name>/` with a spec
   - a model: `ng g model <data-object>`

   Done when no service folder was created by hand.

4. **Implement** per data object: interface (raw API data) → mapper → model → service method.
   Watch the gotchas the rules do not spell out:
   - Validate required parameters as the core services do: `return throwError(() => new Error('getProduct() called without a sku'))`.
   - Request context (locale, REST resource, configuration, user) may come from facades; dispatching actions or using the Router or the DOM moves the code to a utility service.
   - Services also run during server-side rendering; leave `window`, `document`, and browser storage out of them.
5. **Verify** and fix until all three are clean:
   - `npx eslint --max-warnings 0 <changed files>` (CI escalates warnings to errors)
   - `npm run compile` (Jest does not type-check specs)
   - `npx jest <changed folders>`

## Report

- The gateway of every external system the task calls, and the reason when it is a new one.
- The files created or changed, and the public API for the layer above: each service method's signature and the model it emits.
