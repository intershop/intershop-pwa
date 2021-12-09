import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';
import { filter, map, take, takeWhile, withLatestFrom } from 'rxjs/operators';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';
import { whenTruthy } from 'ish-core/utils/operators';
import { StatePropertiesService } from 'ish-core/utils/state-transfer/state-properties.service';

import { setGTMToken } from './tracking-config.actions';
import { getGTMToken } from './tracking-config.selectors';

@Injectable()
export class TrackingConfigEffects {
  constructor(
    private actions$: Actions,
    private featureToggleService: FeatureToggleService,
    @Inject(PLATFORM_ID) private platformId: string,
    private stateProperties: StatePropertiesService,
    angulartics2GoogleTagManager: Angulartics2GoogleTagManager,
    store: Store,
    cookiesService: CookiesService
  ) {
    if (cookiesService.cookieConsentFor('tracking')) {
      store
        .pipe(
          select(getGTMToken),
          filter(gtmToken => gtmToken && featureToggleService.enabled('tracking')),
          take(1)
        )
        .subscribe(gtmToken => {
          this.gtm(window, 'dataLayer', gtmToken);
          angulartics2GoogleTagManager.startTracking();
        });
    }
  }

  setGTMToken$ = createEffect(() =>
    this.actions$.pipe(
      takeWhile(() => isPlatformServer(this.platformId) && this.featureToggleService.enabled('tracking')),
      take(1),
      withLatestFrom(this.stateProperties.getStateOrEnvOrDefault<string>('GTM_TOKEN', 'gtmToken')),
      map(([, gtmToken]) => gtmToken),
      whenTruthy(),
      map(gtmToken => setGTMToken({ gtmToken }))
    )
  );

  // tslint:disable-next-line: no-any - gtm library access
  private gtm(w: any, l: string, i: string) {
    w[l] = w[l] || [];
    w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    const gtmScript = document.createElement('script');
    const dl = l !== 'dataLayer' ? '&l=' + l : '';
    gtmScript.async = true;
    gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${i}${dl}`;
    const f = document.getElementsByTagName('script')[0];
    f.parentNode.insertBefore(gtmScript, f);
  }
}
