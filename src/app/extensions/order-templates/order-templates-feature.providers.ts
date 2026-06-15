import { EnvironmentProviders, Provider } from '@angular/core';

import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

/**
 * Provider bundle for the Order Templates feature.
 * The actual store setup happens lazily via provider-native store registration.
 */
export function provideOrderTemplatesFeature(): (EnvironmentProviders | Provider)[] {
  return [
    {
      provide: LAZY_FEATURE_MODULE,
      multi: true,
      useValue: {
        feature: 'orderTemplates',
        providers: () => import('./store/order-templates-store.providers').then(m => m.provideOrderTemplatesStore()),
      },
    },
  ];
}

export const ORDER_TEMPLATES_FEATURE_PROVIDERS = provideOrderTemplatesFeature();
