import { TestBed } from '@angular/core/testing';
import { combineReducers, select, Store, StoreModule } from '@ngrx/store';
import { cold } from 'jasmine-marbles';
import { Observable } from 'rxjs/Observable';
import { Product } from '../../../models/product/product.model';
import { getProducts, LoadProductSuccess } from '../products';
import { ShoppingState } from '../shopping.state';
import { shoppingReducers } from '../shopping.system';
import { SearchProductsAvailable } from './search.actions';
import { SearchState } from './search.reducer';
import { getSearchLoading, getSearchProducts, getSearchTerm } from './search.selectors';

describe('Search Selectors', () => {

  let store$: Store<ShoppingState>;
  let products$: Observable<Product[]>;
  let searchProducts$: Observable<Product[]>;

  const state: SearchState = {
    searchTerm: 'a',
    skus: ['9780321934161', '0818279012576'],
    searchLoading: false,
    suggestSearchResults: []
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          shopping: combineReducers(shoppingReducers)
        })
      ]
    });

    store$ = TestBed.get(Store);
    products$ = store$.pipe(select(getProducts));
    searchProducts$ = store$.pipe(select(getSearchProducts));

  });

  describe('getSearchLoading', () => {
    it('should return the loading state if given', () => {
      const result = getSearchLoading.projector(state);
      const expected = state.searchLoading;
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
      let products: Product[];

      products$.subscribe(value =>
        products = value
      );

      store$.dispatch(new LoadProductSuccess(new Product('9780321934161')));
      store$.dispatch(new LoadProductSuccess(new Product('0818279012576')));
      store$.dispatch(new SearchProductsAvailable(['9780321934161', '0818279012576']));

      expect(searchProducts$).toBeObservable(cold('a', { a: products }));
    });
  });

});
