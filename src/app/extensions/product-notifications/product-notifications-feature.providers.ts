import { EnvironmentProviders, Provider } from '@angular/core';

import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

export function provideProductNotificationsFeature(): (Provider | EnvironmentProviders)[] {
  return [
    {
      provide: LAZY_FEATURE_MODULE,
      multi: true,
      useValue: {
        feature: 'productNotifications',
        providers: () => import('./store/product-notifications-store.providers').then(m => m.provideProductNotificationsStore()),
      },
    },
  ];
}

export const PRODUCT_NOTIFICATIONS_FEATURE_PROVIDERS = provideProductNotificationsFeature();

