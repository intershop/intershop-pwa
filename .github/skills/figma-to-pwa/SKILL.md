---
name: figma-to-pwa
description: 'Design-to-code: translate a Figma design into Intershop PWA Angular components. Use when the user shares a figma.com link, asks to implement UI from a Figma design, or to make an existing view match one.'
---

# Figma → Intershop PWA (design-to-code)

Translate Figma designs into Angular + SCSS + Bootstrap code that matches the
conventions of this Intershop-PWA-style project. The generated Figma code
(React/Tailwind) is a **reference to adapt**, never something to copy verbatim.

> General SCSS rules — component vs. global stylesheets, reusing tokens, global styles and existing class recipes, the utility-vs-custom policy, selectors, `$space-default` spacing, the Bootstrap grid/gutter rules, and the component-SCSS Bootstrap `@import` nuance — live in [`.github/instructions/styles.instructions.md`](../../instructions/styles.instructions.md) and are **not** repeated here. The points below are specific to translating a Figma design.

## Procedure

### 1. Read the design before writing code

- If the Figma MCP server exposes design-to-code guidance (a prompt, resource, or skill), read it before calling `get_design_context`.
- Call `get_design_context` (code + screenshot) **and** `get_metadata` to understand the **hierarchy and placement**. Metadata reveals where elements really live (e.g. a title card sitting _above_ tabs vs _inside_ a panel) — the flat code often hides this.
- Note exact values from the design: font sizes, line heights, colors, paddings, gaps, border radii, and the **proportions** between regions (e.g. 760px / 377px ≈ `col-8` / `col-4`).

### 2. Map to project tokens — don't invent

- Map design values to existing theme variables (`src/styles/themes/**/variables.scss`, e.g. `$CORPORATE-PRIMARY`, `$color-inverse`, `$font-family-bold`) and global element styles (`src/styles/global/global.scss`, e.g. an `<h1>` already provides the uppercase heading style) before writing any rule.
- **Fonts: map weight to a font-family, not `font-weight`.** Figma uses a single family (`Roboto`) and expresses weight numerically, but the PWA loads separate font faces (see `src/styles/global/fonts/roboto.scss`). A text at `font-weight: 700` in Figma becomes `font-family: $font-family-bold;` in the PWA — do **not** use `font-weight: bold`.
- **Distrust the export's `var(--bs/...)` / `var(--color/...)` references.** Figma auto-maps a variable whose _computed value_ happens to match (e.g. a border exported as `--bs/carousel-caption-color` only because it resolves to white). Don't reuse that exact variable — map to the semantically correct theme token (here `$color-inverse`). Note that a border painted the same color as the fill is invisible (a placeholder), so decide deliberately whether the element needs a real border.
- Use **Bootstrap Icons** (`<i class="bi bi-...">`), never inline SVG from the export. Watch two Bootstrap-Icons pitfalls:
  - Glyphs render with `vertical-align: -.125em`, so they sit low when centered in a button/flex — set `vertical-align: 0` on the `.bi::before` inside the centered container.
  - The chosen glyph may not match the design's orientation (e.g. `bi-send-fill` points 45° up-right; a horizontal paper plane needs `transform: rotate(45deg)`). Compare against the screenshot and rotate if needed.
- When a reused Bootstrap component (e.g. `badge`, `input-group`, `form-control`, `btn`) differs from the design, override only the differing defaults (weight → `font-family`, `font-size`, `text-align`) via a custom class.

### 3. Layout & responsive strategy

- Reproduce the design's **proportions and spacing**, not just the elements.
- **Top spacing:** other pages get their top offset from the global `h1` margin (`margin-top: $space-default`). If the design starts without a heading, give the first block `margin-top: $space-default` so the page aligns with the rest.
- **Don't reproduce the export's flex nesting — use flex only where it is necessary.** Figma wraps almost everything in flex containers; most are redundant. Add `display: flex` only where the layout genuinely needs it (aligning/distributing along an axis, or a direction change), and rely on normal block flow (and the Bootstrap grid for columns) otherwise. Flatten wrappers that just repeat a parent's flex context — e.g. a child flex box with the same `flex-direction`/`align-items` as its parent can be removed and its children promoted, dropping a DOM level.
- Choose the switch mechanism deliberately and explain it:
  - **`deviceType`** (`AppFacade.deviceType$`) for _structural_ differences — different DOM per breakpoint, stateful components, or anything that must render correctly for SSR/SEO. Avoids duplicate component instances.
  - **Bootstrap responsive classes** (`d-none d-lg-*`) for _pure presentational_ show/hide of a single block.
- **Responsive stacking for a component's own layout** follows the utility-class rule in the [SCSS instructions](../../instructions/styles.instructions.md). Note the Bootstrap spacer scale differs slightly from the theme (`3` = 1rem ≈ 16px vs `$space-default` 15px) — keep spacing in SCSS when you need exact `$space-default` values.
- **`justify-content: space-between` collapses to a zero gap** when the content already fills the container height (e.g. a bottom-pinned input row jammed against the block above). Add an explicit `margin-top`/min-gap so there is always separation, while `space-between` still pins to the bottom on taller viewports.

### 4. Localization

- By default, localize visible text via the `translate` pipe with keys added to `en_US`, `de_DE`, and `fr_FR` under `src/assets/i18n/`, in the appropriate namespace.
- Skip localization only when the user explicitly says the text needs none.

### 5. Architecture & components

- Follow existing page/module patterns: lazy-loaded feature modules using `SharedModule`, with `standalone: false` components.
- Component conventions (`OnPush`, `ish-` selector, facades, `async` pipe, control-flow syntax) and file naming follow the [component-patterns](../../instructions/component-patterns.instructions.md) and [naming-patterns](../../instructions/naming-patterns.instructions.md) instructions.

### 6. Self-review checklist before finishing

- [ ] Every rule in the [styles instructions](../../instructions/styles.instructions.md) applied to the changed `.scss` and `.html` files?
- [ ] No blindly-reused `var(--bs/...)` / `var(--color/...)` from the export?
- [ ] Icons via Bootstrap Icons (no inline SVG), correctly centered (`vertical-align: 0`) and oriented (rotated if needed)?
- [ ] Flex used only where the layout needs it (no leftover redundant flex wrappers from the export)?
- [ ] Responsive strategy chosen and justified (`deviceType` vs Bootstrap classes)?
- [ ] Top spacing aligns with other pages (heading-less designs start with `margin-top: $space-default`)?
- [ ] Visible text localized in en/de/fr (unless told otherwise)?
- [ ] Proportions and spacing match the design?
- [ ] `npm run format` run, and `npm run lint` reports no errors?
