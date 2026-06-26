import { EnvironmentProviders, Provider } from '@angular/core';

import { LAZY_FEATURE_PROVIDER } from 'ish-core/utils/module-loader/module-loader.service';

export function provideContactUsFeature(): (EnvironmentProviders | Provider)[] {
  return [
    {
      provide: LAZY_FEATURE_PROVIDER,
      useValue: {
        feature: 'contactUs',
        loadStrategy: 'onDemand',
        providers: () => import('./store/contact-us-store.providers').then(m => m.provideContactUsStore()),
      },
      multi: true,
    },
  ];
}

export const CONTACT_US_FEATURE_PROVIDERS = provideContactUsFeature();
