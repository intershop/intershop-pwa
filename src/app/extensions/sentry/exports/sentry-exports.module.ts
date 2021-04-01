import { NgModule } from '@angular/core';

import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

@NgModule({
  providers: [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: {
        feature: 'sentry',
        location: () => import('../store/sentry-store.module').then(m => m.SentryStoreModule),
      },
      multi: true,
    },
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: {
        feature: 'sentry',
        location: () => import('../sentry.module').then(m => m.SentryModule),
      },
      multi: true,
    },
  ],
})
export class SentryExportsModule {}
