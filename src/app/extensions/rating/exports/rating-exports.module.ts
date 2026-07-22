import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

import { LazyProductRatingComponent } from './lazy-product-rating/lazy-product-rating.component';
import { LazyProductReviewsComponent } from './lazy-product-reviews/lazy-product-reviews.component';

@NgModule({
  declarations: [LazyProductRatingComponent, LazyProductReviewsComponent],
  imports: [FeatureToggleModule],
  exports: [LazyProductRatingComponent, LazyProductReviewsComponent],
  providers: [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: {
        feature: 'rating',
        location: () => import('../store/product-review-store.module').then(m => m.ProductReviewStoreModule),
      },
      multi: true,
    },
  ],
})
export class RatingExportsModule {}
