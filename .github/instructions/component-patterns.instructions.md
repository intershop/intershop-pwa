---
applyTo: '**/*.component.ts'
---

## Component Patterns

- Always use `OnPush` change detection
- Use `ish-` prefix for selectors
- Use facades instead of direct service calls where possible
- Never inject the store directly - use facades instead
- Implement proper subscription cleanup with `takeUntilDestroyed` pattern
- Use built-in control flow syntax in templates (`@if`, `@for`, etc.)
- Keep templates simple - delegate business logic to facades
- Prefer `async` pipe over manual subscriptions
- Use `formly` forms when creating forms
- Avoid using getters in templates for performance reasons

## Examples

- [ProductAddToBasketComponent](../../src/app/shared/components/product/product-add-to-basket/product-add-to-basket.component.ts)
- [CostCenterFormComponent](../../projects/organization-management/src/app/components/cost-center-form/cost-center-form.component.ts)
