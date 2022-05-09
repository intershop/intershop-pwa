import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { loadProductReviews } from './product-reviews.actions';
import { getProductReviewBySku } from './product-reviews.selectors';

describe('Product Reviews Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), ShoppingStoreModule.forTesting('productReviews')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should not be loading when in initial state', () => {
      expect(getProductReviewBySku('123')(store$.state)).toBeFalsy();
    });
  });

  describe('loadProductReviews', () => {
    const action = loadProductReviews({ skus: ['123'] });

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set loading to true', () => {
      expect(getProductReviewBySku('123')).toBeTruthy();
    });
  });
});
