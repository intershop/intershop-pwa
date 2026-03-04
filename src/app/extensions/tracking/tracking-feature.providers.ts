import { EnvironmentProviders, Provider, importProvidersFrom } from '@angular/core';
import { Angulartics2Module } from 'angulartics2';

import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

const trackingStoreProviders = () =>
  import('./store/tracking-store.module').then(module => importProvidersFrom(module.TrackingStoreModule));

export function provideTrackingFeature(): (Provider | EnvironmentProviders)[] {
  return [
    importProvidersFrom(Angulartics2Module.forRoot()),
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: {
        feature: 'tracking',
        providers: trackingStoreProviders,
      },
      multi: true,
    },
  ];
}

export const TRACKING_FEATURE_PROVIDERS = provideTrackingFeature();
