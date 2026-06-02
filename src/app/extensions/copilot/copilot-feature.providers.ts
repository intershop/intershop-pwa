import { EnvironmentProviders, Provider } from '@angular/core';

import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

export function provideCopilotFeature(): (Provider | EnvironmentProviders)[] {
  return [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: {
        feature: 'copilot',
        providers: () => import('./store/copilot-store.providers').then(m => m.provideCopilotStore()),
      },
      multi: true,
    },
  ];
}

export const COPILOT_FEATURE_PROVIDERS = provideCopilotFeature();
