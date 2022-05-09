import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { anything, capture, instance, mock, when } from 'ts-mockito';

import { ReviewsService } from 'ish-core/services/reviews/reviews.service';

import { loadProductReviews } from './product-reviews.actions';
import { ProductReviewsEffects } from './product-reviews.effects';

describe('Product Reviews Effects', () => {
  let actions$: Observable<Action>;
  let effects: ProductReviewsEffects;
  let reviewsServiceMock: ReviewsService;

  beforeEach(() => {
    reviewsServiceMock = mock(ReviewsService);
    when(reviewsServiceMock.getProductReviews(anything())).thenCall((sku: string) => of({ sku }));

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
    it('should not dispatch actions when encountering loadProductReviews', () => {
      const action = loadProductReviews({ skus: ['123'] });
      actions$ = of(action);

      effects.loadProductReviews$.subscribe(() => {
        const sku = capture(reviewsServiceMock.getProductReviews);
        expect(sku).toEqual(sku);
        done();
      });
    });
  });
});

function done() {
  throw new Error('Function not implemented.');
}
