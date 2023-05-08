import { NgModule } from '@angular/core';
import { Angulartics2Module } from 'angulartics2';

import { loadFeatureProvider } from 'ish-core/utils/feature-toggle/feature-toggle.service';

@NgModule({
  imports: [Angulartics2Module.forRoot()],
  providers: [
    loadFeatureProvider('tracking', true, {
      location: () => import('../store/tracking-store.module').then(m => m.TrackingStoreModule),
    }),
  ],
})
export class TrackingExportsModule {}
