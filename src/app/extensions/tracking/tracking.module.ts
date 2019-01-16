import { isPlatformServer } from '@angular/common';
import { Inject, NgModule, PLATFORM_ID } from '@angular/core';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';

import { GTM_TOKEN } from 'ish-core/configurations/injection-keys';

import { FeatureToggleModule, FeatureToggleService } from 'ish-core/feature-toggle.module';
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
    private angulartics2GoogleTagManager: Angulartics2GoogleTagManager,
    @Inject(GTM_TOKEN) gtmToken: string,
    @Inject(PLATFORM_ID) private platformId,
    featureToggleService: FeatureToggleService
  ) {
    if (featureToggleService.enabled('tracking')) {
      if (!isPlatformServer(this.platformId)) {
        this.gtm(window, 'dataLayer', gtmToken);
      }
      this.angulartics2GoogleTagManager.startTracking();
    }
  }
}
