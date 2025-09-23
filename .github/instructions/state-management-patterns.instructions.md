---
applyTo: '**/*.ts'
---

## State Management Patterns

- The project uses NgRx for state management.
- State management is handled through effects and facades.
- Prefer Action Creators over Action Types for better type safety and maintainability.

## Examples

- [Basket Effects](../../src/app/core/store/customer/basket/basket-items.effects.ts)
- [Shopping Facade](../../src/app/core/facades/shopping.facade.ts)
