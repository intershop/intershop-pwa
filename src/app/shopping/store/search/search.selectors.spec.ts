import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { combineReducers, StoreModule } from '@ngrx/store';
import { Product } from '../../../models/product/product.model';
import { LogEffects } from '../../../utils/dev/log.effects';
import { LoadProductSuccess } from '../products';
import { shoppingReducers } from '../shopping.system';
import { SearchProductsSuccess } from './search.actions';
import { initialState, SearchState } from './search.reducer';
import { getSearchLoading, getSearchProducts, getSearchTerm } from './search.selectors';

describe('Search Selectors', () => {
  let store$: LogEffects;

  const state: SearchState = {
    ...initialState,
    searchTerm: 'a',
    products: ['9780321934161', '0818279012576'],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          shopping: combineReducers(shoppingReducers),
        }),
        EffectsModule.forRoot([LogEffects]),
      ],
    });

    store$ = TestBed.get(LogEffects);
  });

  describe('getSearchLoading', () => {
    it('should return the loading state if given', () => {
      const result = getSearchLoading.projector(state);
      const expected = state.loading;
      expect(result).toBe(expected);
    });
  });

  describe('getSearchTerm', () => {
    it('should return the search term if given', () => {
      const result = getSearchTerm.projector(state);
      const expected = state.searchTerm;
      expect(result).toBe(expected);
    });
  });

  describe('getSearchProducts', () => {
    it('should return products if found', () => {
      store$.dispatch(new LoadProductSuccess({ sku: '9780321934161' } as Product));
      store$.dispatch(new LoadProductSuccess({ sku: '0818279012576' } as Product));
      store$.dispatch(
        new SearchProductsSuccess({ searchTerm: 'search', products: ['9780321934161', '0818279012576'] })
      );

      expect(getSearchProducts(store$.state)).toEqual([
        { sku: '9780321934161' },
        { sku: '0818279012576' },
      ] as Product[]);
    });
  });
});
