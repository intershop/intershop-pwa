import { NgModule } from '@angular/core';

import { loadFeatureProvider } from 'ish-core/utils/feature-toggle/feature-toggle.service';

@NgModule({
  providers: [
    loadFeatureProvider('sentry', true, {
      location: () => import('../store/sentry-store.module').then(m => m.SentryStoreModule),
    }),
    loadFeatureProvider('sentry', true, {
      location: () => import('../sentry.module').then(m => m.SentryModule),
    }),
  ],
})
export class SentryExportsModule {}
