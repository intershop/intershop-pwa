import { EnvironmentProviders, Provider, importProvidersFrom } from '@angular/core';
import { Angulartics2Module } from 'angulartics2';

import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

const trackingStoreProviders = () =>
  import('./store/tracking-store.providers').then(module => module.provideTrackingStore());

export function provideTrackingFeature(): (EnvironmentProviders | Provider)[] {
  return [
    importProvidersFrom(Angulartics2Module.forRoot()),
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: {
        feature: 'tracking',
        loadStrategy: 'appInit',
        providers: trackingStoreProviders,
      },
      multi: true,
    },
  ];
}

export const TRACKING_FEATURE_PROVIDERS = provideTrackingFeature();
