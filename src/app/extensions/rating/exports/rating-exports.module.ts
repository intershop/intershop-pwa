import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';

import { LazyProductRatingComponent } from './lazy-product-rating/lazy-product-rating.component';

@NgModule({
  imports: [FeatureToggleModule],

  declarations: [LazyProductRatingComponent],
  exports: [LazyProductRatingComponent],
})
export class RatingExportsModule {}
