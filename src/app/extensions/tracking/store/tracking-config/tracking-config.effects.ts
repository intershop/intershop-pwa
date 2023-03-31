import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { Angulartics2GoogleTagManager } from 'angulartics2';
import { filter, map, take, takeWhile, withLatestFrom } from 'rxjs/operators';
import { setMatomoSiteId, setMatomoTrackerUrl } from 'src/app/extensions/matomo/store/matomo/matomo-config.actions';
import { ENVIRONMENT_DEFAULTS } from 'src/environments/environment.model';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';
import { DomService } from 'ish-core/utils/dom/dom.service';
import { whenTruthy } from 'ish-core/utils/operators';
import { StatePropertiesService } from 'ish-core/utils/state-transfer/state-properties.service';

import { setGTMToken } from './tracking-config.actions';
import { getGTMToken } from './tracking-config.selectors';

@Injectable()
export class TrackingConfigEffects {
  constructor(
    private actions$: Actions,
    private featureToggleService: FeatureToggleService,
    private stateProperties: StatePropertiesService,
    private domService: DomService,

    angulartics2GoogleTagManager: Angulartics2GoogleTagManager,
    store: Store,
    cookiesService: CookiesService,
    @Inject(DOCUMENT) private document: Document
  ) {
    if (!SSR && cookiesService.cookieConsentFor('tracking')) {
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

    if (!SSR && featureToggleService.enabled('matomo')) {
      console.log(
        `Matomo Enabled!\n Defaults: ${ENVIRONMENT_DEFAULTS.matomoTrackerUrl} and ${ENVIRONMENT_DEFAULTS.matomoSiteId}`
      );

      setMatomoTrackerUrl({ trackerUrl: ENVIRONMENT_DEFAULTS.matomoTrackerUrl });
      setMatomoSiteId({ siteId: ENVIRONMENT_DEFAULTS.matomoSiteId });
    }
  }

  setGTMToken$ = createEffect(() =>
    this.actions$.pipe(
      takeWhile(() => SSR && this.featureToggleService.enabled('tracking')),
      take(1),
      withLatestFrom(this.stateProperties.getStateOrEnvOrDefault<string>('GTM_TOKEN', 'gtmToken')),
      map(([, gtmToken]) => gtmToken),
      whenTruthy(),
      map(gtmToken => setGTMToken({ gtmToken }))
    )
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- gtm library access
  private gtm(w: any, l: string, i: string) {
    w[l] = w[l] || [];
    w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    const gtmScript = this.domService.createElement<HTMLScriptElement>('script', this.document.head);
    const dl = l !== 'dataLayer' ? `&l=${l}` : '';

    this.domService.setProperty(gtmScript, 'async', true);
    this.domService.setProperty(gtmScript, 'src', `https://www.googletagmanager.com/gtm.js?id=${i}${dl}`);
  }
}
