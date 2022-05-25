import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { ProductRatingStarComponent } from './shared/product-rating-star/product-rating-star.component';
import { ProductRatingComponent } from './shared/product-rating/product-rating.component';

@NgModule({
  imports: [SharedModule],
  declarations: [ProductRatingComponent, ProductRatingStarComponent],
  exports: [ProductRatingComponent, SharedModule],
})
export class RatingModule {}
