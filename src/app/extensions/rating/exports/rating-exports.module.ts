import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { loadFeatureProvider } from 'ish-core/utils/feature-toggle/feature-toggle.service';

import { LazyProductRatingComponent } from './lazy-product-rating/lazy-product-rating.component';
import { LazyProductReviewsComponent } from './lazy-product-reviews/lazy-product-reviews.component';

@NgModule({
  imports: [FeatureToggleModule],
  providers: [
    loadFeatureProvider('rating', true, {
      location: () => import('../store/product-review-store.module').then(m => m.ProductReviewStoreModule),
    }),
  ],
  declarations: [LazyProductRatingComponent, LazyProductReviewsComponent],
  exports: [LazyProductRatingComponent, LazyProductReviewsComponent],
})
export class RatingExportsModule {}
