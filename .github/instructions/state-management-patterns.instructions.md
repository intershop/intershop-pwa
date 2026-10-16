---
applyTo: '**/*.ts'
---

## State Management Patterns

- The project uses NgRx for state management.
- State management is handled through effects and facades.
- Prefer Action Creators over Action Types for better type safety and maintainability.
- Facades are the thin layer between components and the NgRx store, consumed by components and context facades. Logic beyond store access belongs to a utility service (`utils/[feature]/[feature].service.ts`).
- Component-scoped state lives in a context facade (`RxState`, provided by the component, e.g. `ProductContextFacade`), which may hold the logic of its context, see [Context Facades](../../docs/concepts/state-management.md#context-facades).

## Examples

- [Basket Effects](../../src/app/core/store/customer/basket/basket-items.effects.ts)
- [Shopping Facade](../../src/app/core/facades/shopping.facade.ts)
