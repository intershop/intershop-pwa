import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { combineReducers, StoreModule } from '@ngrx/store';
import { Product } from '../../../models/product/product.model';
import { LogEffects } from '../../../utils/dev/log.effects';
import { LoadProductSuccess, SelectProduct } from '../products';
import { shoppingReducers } from '../shopping.system';
import { RecentlyEffects } from './recently.effects';
import { getMostRecentlyViewedProducts, getRecentlyProducts, getRecentlyViewedProducts } from './recently.selectors';

describe('Recently Selectors', () => {
  let store$: LogEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          shopping: combineReducers(shoppingReducers),
        }),
        EffectsModule.forRoot([RecentlyEffects, LogEffects]),
      ],
    });

    store$ = TestBed.get(LogEffects);
  });

  it('should select nothing for an empty state', () => {
    expect(getRecentlyProducts(store$.state)).toEqual([]);
    expect(getRecentlyViewedProducts(store$.state)).toEqual([]);
    expect(getMostRecentlyViewedProducts(store$.state)).toEqual([]);
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
