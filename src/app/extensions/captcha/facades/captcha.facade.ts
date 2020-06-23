import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, switchMap, switchMapTo } from 'rxjs/operators';

import { getServerConfigParameter } from 'ish-core/store/general/server-config';
import { whenTruthy } from 'ish-core/utils/operators';

export type CaptchaTopic =
  | 'contactUs'
  | 'emailShoppingCart'
  | 'forgotPassword'
  | 'redemptionOfGiftCardsAndCertificates'
  | 'register';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class CaptchaFacade {
  constructor(private store: Store) {}

  captchaVersion$: Observable<2 | 3 | undefined> = this.store.pipe(
    select(
      getServerConfigParameter<{
        ReCaptchaV2ServiceDefinition: { runnable: boolean };
        ReCaptchaV3ServiceDefinition: { runnable: boolean };
      }>('services')
    ),
    whenTruthy(),
    map(services =>
      services.ReCaptchaV3ServiceDefinition && services.ReCaptchaV3ServiceDefinition.runnable
        ? 3
        : services.ReCaptchaV2ServiceDefinition && services.ReCaptchaV2ServiceDefinition.runnable
        ? 2
        : undefined
    )
  );

  captchaSiteKey$ = this.captchaVersion$.pipe(
    whenTruthy(),
    switchMap(version =>
      this.store.pipe(
        select(getServerConfigParameter<string>(`services.ReCaptchaV${version}ServiceDefinition.SiteKey`)),
        whenTruthy()
      )
    )
  );

  /**
   * @param key feature name according to the captcha ICM configuration, e.g. register, forgotPassword, contactUs
   */
  captchaActive$(key: CaptchaTopic): Observable<boolean> {
    return this.store.pipe(
      filter(() => !!key),
      switchMapTo(this.captchaVersion$),
      whenTruthy(),
      switchMapTo(this.store.pipe(select(getServerConfigParameter<boolean>('captcha.' + key))))
    );
  }
}
