---
applyTo: '**/*.service.ts'
---

## Service Patterns

- Always use `@Injectable({ providedIn: 'root' })` for singleton services
- Always validate required parameters - throw descriptive errors for missing data
- Return mapped PWA models only: raw responses are typed in `[data-object].interface.ts` and mapped by `[data-object].mapper.ts`, also for non-ICM APIs and streamed responses
- Keep request body types that only the service uses as non-exported interfaces in the service file
- REST services in `services/[feature]/` only access the API; logic that orchestrates facades, the Router or the DOM is a utility service in `utils/[feature]/[feature].service.ts`
- Return Observables - avoid nested subscribe() calls
- Use ApiService for HTTP calls, not HttpClient directly
- Use SparqueApiService for interactions with Sparque API
- Document public methods

## Examples

- [ProductsService](../../src/app/core/services/products/products.service.ts)
- [BasketService](../../src/app/core/services/basket/basket.service.ts)
