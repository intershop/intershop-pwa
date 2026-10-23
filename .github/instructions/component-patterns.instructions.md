---
applyTo: '**/*.component.{ts,html}'
---

## Component Patterns

- Always use `OnPush` change detection
- Use `ish-` prefix for selectors
- Give exported shared components a short JSDoc class description, see [Document Only When Needed](../../docs/guides/code-documentation.md#document-only-when-needed)
- Mark inputs that the component cannot work without as `@Input({ required: true })`; inputs with a sensible default stay optional
- Use facades instead of direct service calls where possible
- Never inject the store directly - use facades instead
- Implement proper subscription cleanup with `takeUntilDestroyed` pattern
- Run browser-only DOM work (focus, scrolling, measuring, `window`/`document` listeners) in `afterNextRender` in the constructor; it runs only in the browser after the view is rendered, so no `SSR` check is needed
- Use built-in control flow syntax in templates (`@if`, `@for`, etc.)
- Use native `[class]`/`[style]` bindings instead of `ngClass`/`ngStyle` (exception: `ngClass` object keys with space-separated classes)
- Keep templates simple - delegate business logic to facades
- Prefer `async` pipe over manual subscriptions
- Use `formly` forms when creating forms
- Avoid using getters in templates for performance reasons

## Examples

- [ProductAddToBasketComponent](../../src/app/shared/components/product/product-add-to-basket/product-add-to-basket.component.ts)
- [CostCenterFormComponent](../../projects/organization-management/src/app/components/cost-center-form/cost-center-form.component.ts)
