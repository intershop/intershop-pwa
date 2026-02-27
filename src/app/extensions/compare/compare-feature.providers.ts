import { EnvironmentProviders, Provider, importProvidersFrom } from '@angular/core';

import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

/**
 * Provider bundle für das Compare Feature.
 * Entfernt direkte provideState/provideEffects Registrierung, damit der Root Store zuerst initialisiert werden kann.
 * Das eigentliche Store-Setup passiert im CompareStoreModule (StoreModule.forFeature / EffectsModule.forFeature).
 */
export function provideCompareFeature(): (Provider | EnvironmentProviders)[] {
  return [
    {
      provide: LAZY_FEATURE_MODULE,
      multi: true,
      useValue: {
        feature: 'compare',
        providers: () => import('./store/compare-store.module').then(m => importProvidersFrom(m.CompareStoreModule)),
      },
    },
  ];
}

// Optional: Legacy-Konstante (falls noch irgendwo verwendet)
export const COMPARE_FEATURE_PROVIDERS = provideCompareFeature();
