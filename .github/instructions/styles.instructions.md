---
applyTo: '**/*.scss'
---

## SCSS Guidelines

### Stylesheets & scope

- Prefer component stylesheets (`styleUrls` next to the component). Put a rule in a global partial under `src/styles/pages/**` (imported in `src/styles/main.scss`) only when it is genuinely shared across separate (view-encapsulated) components or otherwise needs global scope — e.g. an element rendered by more than one component.
- Component SCSS only sees the theme `variables` partial (include path `src/styles/themes/<theme>`). Bootstrap defaults (`$font-size-lg`, `$line-height-base`, …) and the breakpoints layer (`$screen-xs-max`, …) are **not** available: add `@import 'bootstrap/scss/functions';` (for `divide()`), `@import 'bootstrap/scss/variables';`, `@import 'bootstrap/scss/mixins';` (these emit no CSS) and use `media-breakpoint-down(...)` instead of `$screen-*` variables.

### Values & tokens

- Prefer SCSS variables and theme tokens over hardcoded values.
- Express spacing with `$space-default` multiples/divisions (e.g. `$space-default * 1.5`, `divide($space-default, 3)`) instead of hardcoded pixels; approximate values are acceptable.
- Before adding a rule, check whether global styles or theme variables already provide it (`h1`, `p`, `body`) and don't redefine inherited values.

### Utility vs. custom styling

- **Do not use utility classes for a component's general styling.** A component's own layout, spacing, sizing, colors, and background belong in its SCSS. Utility classes are allowed **only** to adjust a child's appearance within the context of a page (e.g. `<div class="col-8 px-0 pe-4"><ish-child /></div>`).
- Bootstrap **component/layout** classes (`badge`, `input-group`, `form-control`, `btn`, `container`/`row`/`col-*`, `nav-tabs`) and icon classes (`bi …`) are components, not utilities, and are fine.

### Selectors

- Use flat, kebab-case class names; express elements and variants as full dashed names (e.g. `.advisor-icon`, `.advisor-icon-lg`) rather than BEM `&__`/`&--` concatenation. Scope by nesting under a parent block selector (e.g. `.mid-header { .quickorder-link { … } }`) instead of encoding hierarchy into the class name.
- Prefer contextual element/Bootstrap-class selectors over a custom class per element (e.g. `.product-advisor-chat .badge`, `.advisor-welcome h1`, `.advisor-title-card p:first-of-type`). Keep custom classes only for block/root scopes and generic-`div` wrappers with no element or Bootstrap equivalent.
- Keep only classes that do something — remove custom classes that carry no rule and aren't a real hook (selector, test id).

### Layout

- Use the Bootstrap grid (`row` + `col-*` / `col-{bp}-*`, or `row-cols-*`) for responsive multi-column layouts instead of hand-rolled flex rows with wrapper divs; pin the horizontal gap with `--bs-gutter-x: #{$space-default}` rather than the default `1.5rem`.
- Do not use Bootstrap grid gutter classes (`g-*` / `gy-*`) for spacing — their negative margins break alignment. The vertical gutter defaults to `0`; when grid rows wrap, add row-to-row spacing with a small custom rule (`margin-bottom` on the columns, zeroed on the last row via `:nth-last-child(-n + <cols>)`) rather than a `gy-*` class.
- Prefer `padding` over flexbox `gap` / `row-gap` / `column-gap`.

### Misc

- Avoid `!important` unless explicitly justified.
- Avoid deep selectors (`::ng-deep`); use Angular CDK styling practices.
