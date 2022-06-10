import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';

import { displayInfoMessage, displaySuccessMessage } from 'ish-core/store/core/messages';
import { loadProduct } from 'ish-core/store/shopping/products';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { ReviewsService } from '../../services/reviews/reviews.service';

import {
  createProductReview,
  createProductReviewFail,
  createProductReviewSuccess,
  deleteProductReview,
  deleteProductReviewFail,
  deleteProductReviewSuccess,
  loadProductReviews,
  loadProductReviewsFail,
  loadProductReviewsSuccess,
} from './product-reviews.actions';

@Injectable()
export class ProductReviewsEffects {
  constructor(private actions$: Actions, private reviewService: ReviewsService) {}

  loadProductReviews$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductReviews),
      mapToPayloadProperty('sku'),
      whenTruthy(),
      mergeMap(sku =>
        this.reviewService.getProductReviews(sku).pipe(
          map(reviews => loadProductReviewsSuccess({ reviews })),
          mapErrorToAction(loadProductReviewsFail)
        )
      )
    )
  );

  createProductReview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createProductReview),
      mapToPayload(),
      whenTruthy(),
      mergeMap(payload =>
        this.reviewService.createProductReview(payload.sku, payload.review).pipe(
          mergeMap(reviews => [
            createProductReviewSuccess({ reviews }),
            reviews.reviews?.[0]?.status === 'NEW'
              ? displayInfoMessage({
                  message: 'product.reviews.create.approval.message',
                  messageParams: { 0: reviews.reviews?.[0]?.title },
                })
              : displaySuccessMessage({
                  message: 'product.reviews.create.success.message',
                  messageParams: { 0: reviews.reviews?.[0]?.title },
                }),
            loadProduct({ sku: payload.sku }),
          ]),
          mapErrorToAction(createProductReviewFail)
        )
      )
    )
  );

  deleteProductReview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteProductReview),
      mapToPayload(),
      mergeMap(payload =>
        this.reviewService.deleteProductReview(payload.sku, payload.review?.id).pipe(
          mergeMap(() => [
            deleteProductReviewSuccess(payload),
            displaySuccessMessage({
              message: 'product.reviews.delete.success.message',
              messageParams: { 0: payload.review.title },
            }),
            loadProduct({ sku: payload.sku }),
          ]),
          mapErrorToAction(deleteProductReviewFail)
        )
      )
    )
  );
}
