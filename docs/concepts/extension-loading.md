<!--
kb_concepts
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Extension Loading

- [Overview](#overview)
- [LAZY_FEATURE_PROVIDER Token](#lazy_feature_provider-token)
- [Load Strategies](#load-strategies)
  - [Default: appInit](#default-appinit)
  - [On-Demand Loading](#on-demand-loading)
- [Feature Toggle Integration](#feature-toggle-integration)
- [Extension Classification](#extension-classification)
- [Creating a New Extension](#creating-a-new-extension)

## Overview

Extensions register their NgRx store (and other providers) lazily via the `LAZY_FEATURE_PROVIDER` injection token in a `*-feature.providers.ts` file.
The `ModuleLoaderService` manages the lifecycle of these lazy features — determining **when** each feature's providers are loaded based on the configured `loadStrategy` and the feature toggle state.

All feature provider registrations are spread into `app.config.ts`:

```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    ...provideRatingFeature(),
    ...provideContactUsFeature(),
    // ...
  ],
};
```

This registers the `LAZY_FEATURE_PROVIDER` tokens but does **not** immediately load the store code — the dynamic `import()` keeps each store in a separate chunk that is fetched on demand or at app initialization.

## LAZY_FEATURE_PROVIDER Token

Each extension registers its store via a provider function in `*-feature.providers.ts`:

```typescript
import { LAZY_FEATURE_PROVIDER } from 'ish-core/utils/module-loader/module-loader.service';

export function provideRatingFeature(): (EnvironmentProviders | Provider)[] {
  return [
    {
      provide: LAZY_FEATURE_PROVIDER,
      useValue: {
        feature: 'rating',
        providers: () => import('./store/product-review-store.providers').then(m => m.provideProductReviewStore()),
      },
      multi: true,
    },
  ];
}
```

The `LazyFeatureProviderType` interface:

| Property       | Type                            | Description                                                                                  |
| -------------- | ------------------------------- | -------------------------------------------------------------------------------------------- |
| `feature`      | `'always' \| FeatureToggleType` | The feature toggle name. Use `'always'` for features that should load regardless of toggles. |
| `loadStrategy` | `'appInit' \| 'onDemand'`       | When to load. Defaults to `'appInit'` if omitted.                                            |
| `providers`    | `() => Promise<...>`            | Factory returning the store providers via dynamic `import()`.                                |

## Load Strategies

### Default: appInit

When no `loadStrategy` is specified (or explicitly set to `'appInit'`), the feature's store is loaded during app initialization — as soon as the feature configuration is available and the feature toggle is enabled.

```typescript
{
  feature: 'rating',
  // loadStrategy omitted → defaults to appInit
  providers: () => import('./store/...').then(m => m.provideRatingStore()),
}
```

**When to use:** For cross-cutting features whose components are embedded across many pages (product tiles, header, footer, checkout forms, etc.).
The store code is still in a separate chunk (lazy loaded via `import()`), so it does not increase the initial bundle size.
Loading happens early to ensure the store is ready before any component needs it.

**Facade pattern:** Direct store access — no `whenLoaded` or `ensureLoaded` needed.

```typescript
@Injectable({ providedIn: 'root' })
export class ProductReviewsFacade {
  private store = inject(Store);

  productReviews$ = this.store.pipe(select(getProductReviewsError));

  deleteReview(sku: string, review: ProductReview) {
    this.store.dispatch(deleteProductReview({ sku, review }));
  }
}
```

### On-Demand Loading

Features with `loadStrategy: 'onDemand'` are **not** loaded at init.
They must be explicitly loaded — typically by a route guard that calls `ensureLoaded()` before the component renders.

```typescript
{
  feature: 'contactUs',
  loadStrategy: 'onDemand',
  providers: () => import('./store/...').then(m => m.provideContactUsStore()),
}
```

**When to use:** For route-isolated features where all components live behind a dedicated route and are not used elsewhere.

**Route integration:** Add a `canActivate` guard that ensures the store is loaded:

```typescript
export const contactPageRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./contact-page.component').then(m => m.ContactPageComponent),
    canActivate: [
      featureToggleGuard,
      () =>
        inject(ModuleLoaderService)
          .ensureLoaded('contactUs')
          .then(() => true),
    ],
  },
];
```

**Facade pattern:** Same as `appInit` — direct store access.
The route guard guarantees the store is loaded before the component renders, so no `whenLoaded` wrapper is needed.

## Feature Toggle Integration

The `ModuleLoaderService` respects feature toggles:

- **Enabled features** with default/`appInit` strategy → loaded at app init
- **Disabled features** → never loaded, regardless of strategy
- **`'always'` features** (e.g., SEO) → loaded at init regardless of toggles

Feature toggles can be set in `environment.development.ts` or at runtime via environment variables.
When a feature toggle is disabled, the corresponding store chunk is never fetched — no network cost, no runtime cost.

## Extension Classification

| Extension             | Load Strategy       | Reason                                           |
| --------------------- | ------------------- | ------------------------------------------------ |
| rating                | `appInit` (default) | Components on product detail, tile, row, compare |
| compare               | `appInit` (default) | Components on product detail, tile, row          |
| wishlists             | `appInit` (default) | Components on product detail, tile, header       |
| recently              | `appInit` (default) | Components in header, home                       |
| product-notifications | `appInit` (default) | Components on product detail                     |
| copilot               | `appInit` (default) | Component in global footer                       |
| address-doctor        | `appInit` (default) | Components in registration, checkout, account    |
| quoting               | `appInit` (default) | Components on product pages, basket, account     |
| order-templates       | `appInit` (default) | Components on product pages, basket, account     |
| punchout              | `appInit` (default) | Transfer basket component on basket page         |
| seo                   | `appInit` (default) | Infrastructure — always active                   |
| tracking              | `appInit` (default) | Infrastructure — always active                   |
| contact-us            | `onDemand`          | Route-isolated — `/contact` only                 |
| store-locator         | `onDemand`          | Route-isolated — `/store-finder` only            |

## Creating a New Extension

1. Create `src/app/extensions/<name>/<name>-feature.providers.ts`:

```typescript
import { EnvironmentProviders, Provider } from '@angular/core';
import { LAZY_FEATURE_PROVIDER } from 'ish-core/utils/module-loader/module-loader.service';

export function provide<Name>Feature(): (EnvironmentProviders | Provider)[] {
  return [
    {
      provide: LAZY_FEATURE_PROVIDER,
      useValue: {
        feature: '<featureToggleName>',
        // add loadStrategy: 'onDemand' only if the extension is route-isolated
        providers: () => import('./store/<name>-store.providers').then(m => m.provide<Name>Store()),
      },
      multi: true,
    },
  ];
}
```

2. Register in `app.config.ts`:

```typescript
...provide<Name>Feature(),
```

3. For `onDemand` extensions, add an `ensureLoaded` guard to the route:

```typescript
canActivate: [
  featureToggleGuard,
  () => inject(ModuleLoaderService).ensureLoaded('<featureToggleName>').then(() => true),
],
```

4. Create the facade with direct store access (`providedIn: 'root'`):

```typescript
@Injectable({ providedIn: 'root' })
export class <Name>Facade {
  private store = inject(Store);

  data$ = this.store.pipe(select(getData));

  doSomething() {
    this.store.dispatch(someAction());
  }
}
```
