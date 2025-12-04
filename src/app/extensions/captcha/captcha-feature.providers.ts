import { EnvironmentProviders, Provider } from '@angular/core';
import { RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha-2';

import { SitekeyProviderService, getSynchronizedSiteKey } from './exports/sitekey-provider/sitekey-provider.service';

export function provideCaptchaFeature(): (Provider | EnvironmentProviders)[] {
  return [
    {
      provide: SitekeyProviderService,
      useClass: SitekeyProviderService,
    },
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useFactory: getSynchronizedSiteKey,
      deps: [SitekeyProviderService],
    },
  ];
}

export const CAPTCHA_FEATURE_PROVIDERS = provideCaptchaFeature();
