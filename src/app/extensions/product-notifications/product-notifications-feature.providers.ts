import { EnvironmentProviders, Provider } from '@angular/core';

import { LAZY_FEATURE_PROVIDER } from 'ish-core/utils/module-loader/module-loader.service';

export function provideProductNotificationsFeature(): (EnvironmentProviders | Provider)[] {
  return [
    {
      provide: LAZY_FEATURE_PROVIDER,
      multi: true,
      useValue: {
        feature: 'productNotifications',
        providers: () =>
          import('./store/product-notifications-store.providers').then(m => m.provideProductNotificationsStore()),
      },
    },
  ];
}

export const PRODUCT_NOTIFICATIONS_FEATURE_PROVIDERS = provideProductNotificationsFeature();
