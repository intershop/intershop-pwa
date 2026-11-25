---
name: pwa-store
description: 'Build or change where the Intershop PWA keeps state: NgRx stores, effects, selectors, and facades. Use when adding or extending a store or facade, persisting state across reloads or tabs, or deciding between URL, cookie, context facade, store, or browser storage.'
---

# PWA State Layer

Builds the state of a feature: the place each piece of state lives, the NgRx store, and the facade the components use.
The rules live in the instructions and concept docs this skill points to; the skill is the order to apply them in.

## Workflow

1. **Choose the place.**
   For every piece of state the task keeps, take the first matching row of [Where to Keep State](../../../docs/concepts/state-management.md#where-to-keep-state).
   Done when every piece has its row; when no row fits, ask the user.
   Only the store rows continue with step 3; a context facade follows [Context Facades](../../../docs/concepts/state-management.md#context-facades).
2. **Read the rules** before writing code:
   [state-management-patterns](../../instructions/state-management-patterns.instructions.md),
   [error-handling](../../instructions/error-handling.instructions.md),
   [naming-patterns](../../instructions/naming-patterns.instructions.md),
   and [Data Handling with Mappers](../../../docs/guides/data-handling-with-mappers.md) for data from an API.
3. **Generate** every new artifact with the PWA schematics, so the files, the `index.ts` of a store, and the registrations come out right:
   - a new extension with its store module and facade: `ng g extension <extension>`
   - a store: `ng g store <store> --extension <extension>`, or `--feature <group>` in the core store
   - a core store group: `ng g store-group <group>`
   - a model: `ng g model <data-object>`

   Done when no store folder or facade was created by hand.

4. **Implement** bottom-up: model, interface, and mapper → actions → reducer → selectors → effects → facade.
   Watch the gotchas the rules do not spell out:
   - Effects of a class subscribe in declaration order; in a lazily loaded feature store, an effect that dispatches on subscription comes after the effects that react to its action.
   - Stored state that is cleared on logout reuses the key format of `dataRetentionMeta` (`{baseHref}-{prefix}-{key}`); keep the prefix and key in one constant shared by the store module and the cleanup.
5. **Verify** and fix until all three are clean:
   - `npx eslint --max-warnings 0 <changed files>` (CI escalates warnings to errors)
   - `npm run compile` (Jest does not type-check specs)
   - `npx jest <changed folders>` for the generated and existing specs

## Report

- One line per piece of state: where it lives and the row of _Where to Keep State_ that decided it.
- The files created or changed, and the public API for the layer above: the facade's streams and methods, and the actions other stores react to.
