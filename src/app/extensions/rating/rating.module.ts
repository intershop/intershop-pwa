import { NgModule } from '@angular/core';
import { ConfigOption, FormlyModule } from '@ngx-formly/core';

import { SharedModule } from 'ish-shared/shared.module';

import { RatingStarsFieldComponent } from './formly/rating-stars-field/rating-stars-field.component';
import { ProductRatingStarComponent } from './shared/product-rating-star/product-rating-star.component';
import { ProductRatingComponent } from './shared/product-rating/product-rating.component';
import { ProductReviewCreateDialogComponent } from './shared/product-review-create-dialog/product-review-create-dialog.component';
import { ProductReviewsComponent } from './shared/product-reviews/product-reviews.component';

const ratingFormlyConfig: ConfigOption = {
  types: [
    {
      name: 'ish-rating-stars-field',
      component: RatingStarsFieldComponent,
      wrappers: ['form-field-horizontal', 'validation'],
    },
  ],
};

@NgModule({
  imports: [FormlyModule.forChild(ratingFormlyConfig), SharedModule],
  declarations: [
    ProductRatingComponent,
    ProductRatingStarComponent,
    ProductReviewCreateDialogComponent,
    ProductReviewsComponent,
    RatingStarsFieldComponent,
  ],
  exports: [ProductRatingComponent, ProductReviewsComponent, SharedModule],
})
export class RatingModule {}
