import { EnvironmentProviders, Provider } from '@angular/core';

import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

/**
 * Provider bundle for the Order Templates feature.
 * The actual store setup still happens in OrderTemplatesStoreModule
 * (StoreModule.forFeature / EffectsModule.forFeature).
 */
export function provideOrderTemplatesFeature(): (Provider | EnvironmentProviders)[] {
  return [
    {
      provide: LAZY_FEATURE_MODULE,
      multi: true,
      useValue: {
        feature: 'orderTemplates',
        providers: () => import('./store/order-templates-store.module').then(m => m.provideOrderTemplatesStore()),
      },
    },
  ];
}

export const ORDER_TEMPLATES_FEATURE_PROVIDERS = provideOrderTemplatesFeature();
