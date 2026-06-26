import { EnvironmentProviders, Provider } from '@angular/core';

import { LAZY_FEATURE_PROVIDER } from 'ish-core/utils/module-loader/module-loader.service';

export function provideCopilotFeature(): (EnvironmentProviders | Provider)[] {
  return [
    {
      provide: LAZY_FEATURE_PROVIDER,
      useValue: {
        feature: 'copilot',
        providers: () => import('./store/copilot-store.providers').then(m => m.provideCopilotStore()),
      },
      multi: true,
    },
  ];
}

export const COPILOT_FEATURE_PROVIDERS = provideCopilotFeature();
