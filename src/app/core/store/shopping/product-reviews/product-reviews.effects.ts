import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';

import { ReviewsService } from 'ish-core/services/reviews/reviews.service';
import { mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { loadProductReviews, loadProductReviewsSuccess } from './product-reviews.actions';

@Injectable()
export class ProductReviewsEffects {
  constructor(private actions$: Actions, private reviewService: ReviewsService) {}

  loadProductReviews$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductReviews),
      mapToPayloadProperty('sku'),
      whenTruthy(),
      mergeMap(sku =>
        this.reviewService.getProductReviews(sku).pipe(map(reviews => loadProductReviewsSuccess({ reviews })))
      )
    )
  );
}
