import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { ProductReviews } from '../../models/product-reviews/product-reviews.model';
import { ProductReviewStoreModule } from '../product-review-store.module';

import { loadProductReviews, loadProductReviewsFail, loadProductReviewsSuccess } from './product-reviews.actions';
import { getProductReviewsBySku, getProductReviewsError, getProductReviewsLoading } from './product-reviews.selectors';

describe('Product Reviews Selectors', () => {
  let store$: StoreWithSnapshots;

  const reviews: ProductReviews = {
    sku: '123',
    reviews: [
      {
        id: '1',
        authorFirstName: 'Foo',
        authorLastName: 'Bar',
        title: 'Nice',
        content: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr',
        creationDate: 1652874276878,
        rating: 4,
        showAuthorNameFlag: true,
        localeID: '347',
      },
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), ProductReviewStoreModule.forTesting('productReviews')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should not be loading when in initial state', () => {
      expect(getProductReviewsBySku('123')(store$.state)).toBeFalsy();
    });
  });

  describe('loading reviews', () => {
    describe('loadProductReviews', () => {
      const loadProductReviewsAction = loadProductReviews({ sku: '123' });

      beforeEach(() => {
        store$.dispatch(loadProductReviewsAction);
      });

      it('should set loading to true', () => {
        expect(getProductReviewsLoading(store$.state)).toBeTruthy();
      });
    });

    describe('loadProductReviewsSuccess', () => {
      beforeEach(() => {
        store$.dispatch(loadProductReviewsSuccess({ reviews }));
      });
      it('should set loading to false', () => {
        expect(getProductReviewsLoading(store$.state)).toBeFalsy();
      });

      it('should get review by sku', () => {
        expect(getProductReviewsBySku('123')(store$.state)).toEqual([reviews.reviews[0]]);
      });
    });

    describe('loadProductReviewsFail', () => {
      const failAction = loadProductReviewsFail({ error: makeHttpError({ message: 'invalid' }) });

      beforeEach(() => {
        store$.dispatch(failAction);
      });

      it('should set loading to false', () => {
        expect(getProductReviewsLoading(store$.state)).toBeFalsy();
      });

      it('should add the error to state', () => {
        expect(getProductReviewsError(store$.state)).toMatchInlineSnapshot(`
          Object {
            "message": "invalid",
            "name": "HttpErrorResponse",
          }
        `);
      });
    });
  });
});
