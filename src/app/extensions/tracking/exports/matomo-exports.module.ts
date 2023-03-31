import { NgModule } from '@angular/core';
import { NgxMatomoRouterModule } from '@ngx-matomo/router';
import { NgxMatomoTrackerModule } from '@ngx-matomo/tracker';

import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

@NgModule({
  imports: [NgxMatomoRouterModule, NgxMatomoTrackerModule.forRoot({ trackerUrl: undefined, siteId: undefined })],
  providers: [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: {
        feature: 'matomo',
        location: () => import('../store/tracking-store.module').then(m => m.TrackingStoreModule),
      },
      multi: true,
    },
  ],
})
export class MatomoExportsModule {}
