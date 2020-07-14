import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

import { IsTactonProductDirective } from '../directives/is-tacton-product.directive';

import { LazyTactonConfigureProductComponent } from './product/lazy-tacton-configure-product/lazy-tacton-configure-product.component';

@NgModule({
  imports: [FeatureToggleModule],
  providers: [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: { feature: 'tacton', location: import('../store/tacton-store.module') },
      multi: true,
    },
  ],
  declarations: [IsTactonProductDirective, LazyTactonConfigureProductComponent],
  exports: [IsTactonProductDirective, LazyTactonConfigureProductComponent],
})
export class TactonExportsModule {}
