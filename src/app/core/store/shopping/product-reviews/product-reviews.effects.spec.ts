import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable } from 'rxjs';

import { loadProductReviews } from './product-reviews.actions';
import { ProductReviewsEffects } from './product-reviews.effects';

describe('Product Reviews Effects', () => {
  let actions$: Observable<Action>;
  let effects: ProductReviewsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductReviewsEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.inject(ProductReviewsEffects);
  });

  describe('loadProductReviews$', () => {
    it('should not dispatch actions when encountering loadProductReviews', () => {
      const action = loadProductReviews({ skus: ['123'] });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('------');

      expect(effects.loadProductReviews$).toBeObservable(expected$);
    });
  });
});
