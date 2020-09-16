import { NgModule } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';
import { filter, take } from 'rxjs/operators';

import { FeatureToggleModule, FeatureToggleService } from 'ish-core/feature-toggle.module';
import { getGTMToken } from 'ish-core/store/core/configuration';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';

@NgModule({
  imports: [Angulartics2Module.forRoot(), FeatureToggleModule],
})
export class TrackingModule {
  private gtm(w, l: string, i: string) {
    w[l] = w[l] || [];
    w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    const f = document.getElementsByTagName('script')[0];
    const gtmScript = document.createElement('script');
    const dl = l !== 'dataLayer' ? '&l=' + l : '';
    gtmScript.async = true;
    gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${i}${dl}`;
    f.parentNode.insertBefore(gtmScript, f);
  }

  constructor(
    angulartics2GoogleTagManager: Angulartics2GoogleTagManager,
    featureToggleService: FeatureToggleService,
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
}
