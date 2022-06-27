import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { anything, capture, instance, mock, when } from 'ts-mockito';

import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { ProductReviews } from '../../models/product-reviews/product-reviews.model';
import { ReviewsService } from '../../services/reviews/reviews.service';

import { loadProductReviews, loadProductReviewsFail, loadProductReviewsSuccess } from './product-reviews.actions';
import { ProductReviewsEffects } from './product-reviews.effects';

describe('Product Reviews Effects', () => {
  let actions$: Observable<Action>;
  let effects: ProductReviewsEffects;
  let reviewsServiceMock: ReviewsService;

  beforeEach(() => {
    reviewsServiceMock = mock(ReviewsService);
    when(reviewsServiceMock.getProductReviews(anything())).thenCall((sku: string) => of({ sku, reviews: [] }));

    TestBed.configureTestingModule({
      providers: [
        { provide: ReviewsService, useFactory: () => instance(reviewsServiceMock) },
        ProductReviewsEffects,
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(ProductReviewsEffects);
  });

  describe('loadProductReviews$', () => {
    it('should not dispatch actions when encountering loadProductReviews', done => {
      const action = loadProductReviews({ sku: '123' });
      actions$ = of(action);

      effects.loadProductReviews$.subscribe(() => {
        const sku = capture(reviewsServiceMock.getProductReviews);
        expect(sku).toEqual(sku);
        done();
      });
    });

    it('should map invalid request to action of type loadProductReviewsFail', () => {
      when(reviewsServiceMock.getProductReviews(anything())).thenReturn(
        throwError(() => makeHttpError({ message: 'invalid' }))
      );
      const action = loadProductReviews({ sku: '123' });
      const completion = loadProductReviewsFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadProductReviews$).toBeObservable(expected$);
    });

    it('should map to action of type loadProductReviewsSuccess', () => {
      const reviews: ProductReviews = {
        sku: '123',
        reviews: [],
      };

      const action = loadProductReviews({ sku: '123' });
      const completion = loadProductReviewsSuccess({ reviews });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadProductReviews$).toBeObservable(expected$);
    });
  });
});
