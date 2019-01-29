import { isPlatformBrowser } from '@angular/common';
import { Inject, NgModule, PLATFORM_ID } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';
import { filter, takeWhile } from 'rxjs/operators';

import { FeatureToggleModule, FeatureToggleService } from 'ish-core/feature-toggle.module';
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
    @Inject(PLATFORM_ID) platformId: string,
    featureToggleService: FeatureToggleService,
    store: Store<{}>
  ) {
    store
      .pipe(
        takeWhile(() => isPlatformBrowser(platformId)),
        select(getGTMToken),
        filter(gtmToken => !!gtmToken && featureToggleService.enabled('tracking'))
      )
      .subscribe(gtmToken => {
        this.gtm(window, 'dataLayer', gtmToken);
        angulartics2GoogleTagManager.startTracking();
      });
  }
}
