import { EnvironmentProviders, Provider } from '@angular/core';

import { SitekeyProviderService } from './exports/sitekey-provider/sitekey-provider.service';

export function provideCaptchaFeature(): (Provider | EnvironmentProviders)[] {
  return [
    {
      provide: SitekeyProviderService,
      useClass: SitekeyProviderService,
    },
  ];
}

export const CAPTCHA_FEATURE_PROVIDERS = provideCaptchaFeature();
