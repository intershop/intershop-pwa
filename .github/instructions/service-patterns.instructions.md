---
applyTo: '**/*.service.ts'
---

## Service Patterns

- Always use `@Injectable({ providedIn: 'root' })` for singleton services
- Always validate required parameters - throw descriptive errors for missing data
- Use dedicated mapper classes for data transformation
- Return Observables - avoid nested subscribe() calls
- Use ApiService for HTTP calls, not HttpClient directly
- Use SparqueApiService for interactions with Sparque API
- Document public methods

## Examples

- [ProductsService](../../src/app/core/services/products/products.service.ts)
- [BasketService](../../src/app/core/services/basket/basket.service.ts)
