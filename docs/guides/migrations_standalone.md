# Migration Notes (Standalone)

## From 12.0.0 to 12.1.0

**Unified extension loading with `LAZY_FEATURE_PROVIDER`**

The `LAZY_FEATURE_MODULE` injection token has been deprecated in favor of `LAZY_FEATURE_PROVIDER`.
All extension `*-feature.providers.ts` files must update their import and token usage:

```diff
- import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';
+ import { LAZY_FEATURE_PROVIDER } from 'ish-core/utils/module-loader/module-loader.service';

  {
-   provide: LAZY_FEATURE_MODULE,
+   provide: LAZY_FEATURE_PROVIDER,
    useValue: { ... },
    multi: true,
  }
```

The default `loadStrategy` is now `appInit` — features are loaded at app initialization when their feature toggle is enabled.
Previously, only features with explicit `loadStrategy: 'appInit'` were loaded at init; all others were on-demand.

- Extensions with explicit `loadStrategy: 'appInit'` can remove it (it's now the default).
- Route-isolated extensions should add `loadStrategy: 'onDemand'` and use an `ensureLoaded` route guard.
- Facades for `appInit` features no longer need `whenLoaded`/`ensureLoaded` wrappers.

See the [Extension Loading](../concepts/extension-loading.md) concept documentation for details.
