import { TestBed } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';

import { Product } from '../../../models/product/product.model';
import { TestStore, ngrxTesting } from '../../../utils/dev/ngrx-testing';
import { LoadProductSuccess, SelectProduct } from '../products';
import { shoppingReducers } from '../shopping.system';

import { RecentlyEffects } from './recently.effects';
import { getMostRecentlyViewedProducts, getRecentlyProducts, getRecentlyViewedProducts } from './recently.selectors';

describe('Recently Selectors', () => {
  let store$: TestStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: ngrxTesting(
        {
          shopping: combineReducers(shoppingReducers),
        },
        [RecentlyEffects]
      ),
    });

    store$ = TestBed.get(TestStore);
  });

  it('should select nothing for an empty state', () => {
    expect(getRecentlyProducts(store$.state)).toBeEmpty();
    expect(getRecentlyViewedProducts(store$.state)).toBeEmpty();
    expect(getMostRecentlyViewedProducts(store$.state)).toBeEmpty();
  });

  describe('after short shopping spree', () => {
    beforeEach(() => {
      ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach(sku => store$.dispatch(new LoadProductSuccess({ sku } as Product)));

      store$.dispatch(new SelectProduct('A'));
      store$.dispatch(new SelectProduct('B'));
      store$.dispatch(new SelectProduct('F'));
      store$.dispatch(new SelectProduct('C'));
      store$.dispatch(new SelectProduct('A'));
      store$.dispatch(new SelectProduct('D'));
      store$.dispatch(new SelectProduct('E'));
      store$.dispatch(new SelectProduct('D'));
      store$.dispatch(new SelectProduct('A'));
      store$.dispatch(new SelectProduct('B'));
      store$.dispatch(new SelectProduct('A'));
    });

    it('should have collected data for display on pages', () => {
      const viewed = ['A', 'B', 'D', 'E', 'C', 'F'];
      expect(getRecentlyProducts(store$.state)).toEqual(viewed);
      expect(getRecentlyViewedProducts(store$.state)).toEqual(viewed.map(sku => ({ sku } as Product)));
      const filtered = ['B', 'D', 'E', 'C'].map(sku => ({ sku } as Product));
      expect(getMostRecentlyViewedProducts(store$.state)).toEqual(filtered);
    });
  });
});
