import { NgModule } from '@angular/core';

import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

@NgModule({
  providers: [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: { feature: 'sentry', location: import('../store/sentry-store.module') },
      multi: true,
    },
  ],
})
export class SentryExportsModule {}
