import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';

import { whenTruthy } from 'ish-core/utils/operators';

import { CaptchaFacade } from '../../facades/captcha.facade';

@Injectable()
export class SitekeyProviderService {
  // not-dead-code
  siteKey: string;

  constructor(captchaFacade: CaptchaFacade) {
    // synchronize asynchronous site key so we can provide it synchronously for the recaptcha service later on.
    captchaFacade.captchaSiteKey$.pipe(whenTruthy(), take(1)).subscribe(storeSiteKey => (this.siteKey = storeSiteKey));
  }
}

export function getSynchronizedSiteKey(service: SitekeyProviderService) {
  return service.siteKey;
}
