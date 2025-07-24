---
applyTo: '**/*.spec.ts'
---

## Testing Patterns and Guidelines

### Test Structure

- **TestBed Configuration:** Use `beforeEach(async ())` for TestBed setup
- **Component Declaration:** Use `MockComponent()` for child components
- **Service Mocking:** Use `ts-mockito` with `mock()`, `instance()`, `when()`, `verify()`
- **Store Testing:** Use `provideMockStore()` for NgRx testing
- **Test Naming Pattern:** Use meaningful `describe()` blocks derived from method names or effect names

### Mocking Patterns

- **Components:** `MockComponent(ChildComponent)`
- **Directives:** `MockDirective(DirectiveName)`
- **Pipes:** `MockPipe(PipeName, returnValue)`
- **Services:** `{ provide: ServiceName, useFactory: () => instance(mock(ServiceName)) }`

### Jest Matchers

- Use `jest-extended` matchers: `toBeTrue()`, `toBeFalse()`, `toBeEmpty()`
- Prefer specific matchers over `toBe(true/false)`
- Use `toHaveLength()` instead of `.length` checks

### Common Test Patterns

- **Always test:** Component creation with `expect(component).toBeTruthy()`
- **Mock external dependencies:** APIs, other services, router
- **Test inputs/outputs:** Component @Input/@Output properties
- **Test error states:** Error handling and user feedback

### File Naming

- test file: `*.spec.ts`

## Examples

- [LoadingComponent](../../src/app/shared/components/common/loading/loading.component.spec.ts)
- [BudgetWidgetComponent](../../projects/organization-management/src/app/components/budget-widget/budget-widget.component.spec.ts)
- [BasketPromotionCodeEffects](../../src/app/core/store/customer/basket/basket-promotion-code.effects.spec.ts)
