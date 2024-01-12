import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

import { LazyReturnRequestModalComponent } from './lazy-return-request-modal/lazy-return-request-modal.component';

@NgModule({
  imports: [FeatureToggleModule],
  providers: [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: {
        feature: 'returnRequest',
        location: () => import('../store/return-request-store.module').then(m => m.ReturnRequestStoreModule),
      },
      multi: true,
    },
  ],
  declarations: [LazyReturnRequestModalComponent],
  exports: [LazyReturnRequestModalComponent],
})
export class ReturnRequestExportsModule {}
