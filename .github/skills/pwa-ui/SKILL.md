---
name: pwa-ui
description: 'Build or change Intershop PWA components and their integration into pages: components, templates, styles, localization, and lazy components of extensions. Use when adding or extending a component, showing a feature on a page, or wiring an extension into shell, pages, or shared. For a Figma design, use figma-to-pwa.'
---

# PWA UI Layer

Builds the components of a feature and integrates them into the pages.
The rules live in the instructions and guides this skill points to; the skill is the order to apply them in.
When the task comes with a Figma design, run [figma-to-pwa](../figma-to-pwa/SKILL.md) for the visual translation and this skill for the rest.

## Workflow

1. **Read the rules** before writing code:
   [component-patterns](../../instructions/component-patterns.instructions.md),
   [styles](../../instructions/styles.instructions.md),
   [performance-patterns](../../instructions/performance-patterns.instructions.md),
   [naming-patterns](../../instructions/naming-patterns.instructions.md),
   and [Accessibility](../../../docs/guides/accessibility.md).
2. **Place the component**:
   - core feature: `src/app/shared/components/` or the page under `src/app/pages/`
   - extension: its `shared/` folder, integrated into `shell`, `pages`, or `shared` only through a lazy component, as [Integrating Extensions](../../../docs/concepts/project-structure.md#integrating-extensions) describes
3. **Generate** every new artifact with the PWA schematics:
   - a component: `ng g component <folder>/<name>` (e.g., `extensions/<extension>/shared/<name>`)
   - a lazy component of an extension: `ng g lazy-component extensions/<extension>/shared/<name>/<name>.component.ts`
   - a page: `ng g page <name>` (`--extension <extension>` for an extension)

   Done when no component, lazy component, or page was created by hand.

4. **Implement** template → component class → styles → localization.
   Watch the gotchas the rules do not spell out:
   - Data comes from facades only; the component holds view state, while rules of the feature belong to the facade or the store.
   - Put every visible text into `src/assets/i18n/en_US.json`, `de_DE.json`, and `fr_FR.json` with a key in the feature's namespace.
   - Lazy components render only when the extension's feature toggle is on; the page template needs no `*ishFeature` for them.
5. **Verify** and fix until all are clean:
   - `npx eslint --max-warnings 0 <changed files>` and `npx stylelint <changed .scss files>` (CI escalates warnings to errors)
   - `npm run compile` (Jest does not type-check specs)
   - `npx jest <changed folders>`, including the specs of the pages the lazy component was added to
   - the changed files are UTF-8 without byte order mark (BOM), as `.editorconfig` requires

## Report

- Where each component sits and how it reaches the page (directly or as `ish-lazy-<name>`).
- The files created or changed, including the localization keys.
