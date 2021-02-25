import { NgModule } from '@angular/core';
import { Angulartics2Module } from 'angulartics2';

import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

@NgModule({
  imports: [Angulartics2Module.forRoot()],
  providers: [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: {
        feature: 'tracking',
        location: () => import('../store/tracking-store.module').then(m => m.TrackingStoreModule),
      },
      multi: true,
    },
  ],
})
export class TrackingExportsModule {}
