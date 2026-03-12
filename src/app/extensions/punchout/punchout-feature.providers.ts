import { EnvironmentProviders, Provider } from '@angular/core';

import { EXTERNAL_DISPLAY_PROPERTY_PROVIDER } from 'ish-core/facades/product-context.facade';
import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

import { PunchoutProductContextDisplayPropertiesService } from './exports/punchout-product-context-display-properties/punchout-product-context-display-properties.service';

export function providePunchoutFeature(): (Provider | EnvironmentProviders)[] {
  return [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: {
        feature: 'punchout',
        providers: () => import('./store/punchout-store.module').then(m => m.providePunchoutStore()),
      },
      multi: true,
    },
    {
      provide: EXTERNAL_DISPLAY_PROPERTY_PROVIDER,
      useClass: PunchoutProductContextDisplayPropertiesService,
      multi: true,
    },
  ];
}

export const PUNCHOUT_FEATURE_PROVIDERS = providePunchoutFeature();
