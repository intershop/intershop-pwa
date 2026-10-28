---
applyTo: '**/*.scss,**/*.html'
---

## Styling Guidelines (SCSS & template classes)

### Stylesheets & scope

- Prefer component stylesheets (`styleUrls` next to the component). Put a rule in a global partial under `src/styles/pages/**` (imported in `src/styles/main.scss`) only when it is genuinely shared across separate (view-encapsulated) components or otherwise needs global scope — e.g. an element rendered by more than one component.
- Start component SCSS with `@import 'variables';` (the theme partial, resolved via the theme include path) — it is the only project partial in scope. For Bootstrap defaults (`$font-size-lg`, `$line-height-base`, …), `divide()` or Bootstrap mixins, additionally add `@import 'bootstrap/scss/functions';`, `@import 'bootstrap/scss/variables';`, `@import 'bootstrap/scss/mixins';` (these emit no CSS).
- Breakpoints: in component SCSS use `media-breakpoint-down(...)` / `media-breakpoint-up(...)` from the Bootstrap mixins. The `$screen-*` variables (`$screen-xs-max`, …) exist only in the global partials under `src/styles/**`.

### Values & tokens

- Before adding a rule, check whether global element styles (`h1`, `p`, `body`) already provide it and don't redefine inherited values. For new values, use SCSS variables and theme tokens instead of hardcoded values.
- Express spacing with `$space-default` multiples/divisions (e.g. `$space-default * 1.5`, `divide($space-default, 3)`) instead of hardcoded pixels; approximate values are acceptable.

### Utility vs. custom styling

- **Do not use utility classes for a component's general styling.** A component's own layout, spacing, sizing, colors, and background belong in its SCSS. Utility classes are allowed **only** to adjust a child's appearance within the context of a page (e.g. the utilities `px-0 pe-4` in `<div class="col-8 px-0 pe-4"><ish-child /></div>`).
- Bootstrap **component/layout** classes (`badge`, `input-group`, `form-control`, `btn`, `container`/`row`/`col-*`, `nav-tabs`) and icon classes (`bi …`) are components, not utilities, and are fine.
- **Reuse existing class recipes instead of re-implementing their appearance.** When an element should look/behave like an existing pattern, apply the project's classes (e.g. an icon-only button → `btn btn-link btn-tool`; primary/secondary looks → `btn btn-primary` / `btn btn-secondary`) rather than copying their `color`/`background`/`border` and `:hover`/`:focus`/`:active`/`:disabled` states into component SCSS. Global mixins from `src/styles/global/**` (e.g. `btn-primary-appearance`) are **not** in scope in component SCSS, so prefer the class on the markup; keep only the layout-specific overrides (positioning, `flex-basis`, icon size) in the component style sheet.

### Selectors

- Use kebab-case class names; express elements and variants as full dashed names (e.g. `.advisor-icon`, `.advisor-icon-lg`) rather than BEM `&__`/`&--` concatenation. Scope by nesting under a parent block selector (e.g. `.mid-header { .quickorder-link { … } }`) instead of encoding hierarchy into the class name.
- Prefer contextual element/Bootstrap-class selectors over a custom class per element (e.g. `.product-advisor-chat .badge`, `.advisor-welcome h1`, `.advisor-title-card p:first-of-type`). Keep custom classes only for block/root scopes and generic-`div` wrappers with no element or Bootstrap equivalent.
- Keep only classes that do something — remove custom classes that carry no rule and aren't a real hook (selector, test id).

### Layout

- Use the Bootstrap grid (`row` + `col-*` / `col-{bp}-*`, or `row-cols-*`) for responsive multi-column layouts instead of hand-rolled flex rows with wrapper divs; pin the horizontal gap with `--bs-gutter-x: #{$space-default}` rather than the default `1.5rem`.
- Do not use Bootstrap grid gutter classes (`g-*` / `gy-*`) for spacing — their negative margins break alignment. The vertical gutter defaults to `0`; when grid rows wrap, add row-to-row spacing with a small custom rule (`margin-bottom` on the columns, zeroed on the last row via `:nth-last-child(-n + <cols>)`) rather than a `gy-*` class.
- Between flex items, prefer `padding` over `gap` / `row-gap` / `column-gap`.

### Misc

- Put static styles in the component stylesheet instead of `style` attributes; use `[style.*]` bindings only for values computed at runtime (e.g. progress widths, swatch colors).
- Use `!important` only with a one-line comment stating why a specificity fix doesn't work.
- Style a child component from its own style sheet. When a rule must reach into another component's view (e.g. projected or third-party content), put it in a global partial (see _Stylesheets & scope_) instead of using `::ng-deep`.
