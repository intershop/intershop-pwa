import { NgModule } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';
import { filter, map, take, withLatestFrom } from 'rxjs/operators';

import { FeatureToggleModule, FeatureToggleService } from 'ish-core/feature-toggle.module';
import { CookiesService } from 'ish-core/services/cookies/cookies.service';
import { getGTMToken } from 'ish-core/store/configuration';

@NgModule({
  imports: [Angulartics2Module.forRoot(), FeatureToggleModule],
  declarations: [],
  exports: [],
  entryComponents: [],
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
    store: Store<{}>,
    cookiesService: CookiesService
  ) {
    cookiesService.cookieLawSeen$
      .pipe(
        withLatestFrom(store.pipe(select(getGTMToken))),
        filter(([accepted, gtmToken]) => accepted && !!gtmToken && featureToggleService.enabled('tracking')),
        take(1),
        map(([, gtmToken]) => gtmToken)
      )
      .subscribe(gtmToken => {
        this.gtm(window, 'dataLayer', gtmToken);
        angulartics2GoogleTagManager.startTracking();
      });
  }
}
