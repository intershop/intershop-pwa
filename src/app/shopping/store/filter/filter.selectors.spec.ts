import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { combineReducers, select, Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Category } from '../../../models/category/category.model';
import { FilterNavigation } from '../../../models/filter-navigation/filter-navigation.model';
import { Product } from '../../../models/product/product.model';
import { c } from '../../../utils/dev/marbles-utils';
import { LoadProductSuccess } from '../products';
import { ShoppingState } from '../shopping.state';
import { shoppingReducers } from '../shopping.system';
import * as fromActions from './filter.actions';
import * as s from './filter.selectors';

describe('Filter Selectors', () => {
  let store$: Store<ShoppingState>;

  let filter$: Observable<FilterNavigation>;
  let filteredProducts$: Observable<Product[]>;
  let loading$: Observable<boolean>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          shopping: combineReducers(shoppingReducers),
        }),
      ],
    });

    store$ = TestBed.get(Store);

    filter$ = store$.pipe(select(s.getAvailableFilter));
    filteredProducts$ = store$.pipe(select(s.getFilteredProducts));
    loading$ = store$.pipe(select(s.getLoadingStatus));
  });

  describe('with empty state', () => {
    it('should not select any filters when used', () => {
      expect(filter$).toBeObservable(c(null));
    });

    it('should not select any filteredProducts product when used', () => {
      expect(filteredProducts$).toBeObservable(c(null));
    });
  });

  describe('with LoadFilterForCategory state', () => {
    beforeEach(() => {
      store$.dispatch(new fromActions.LoadFilterForCategory({} as Category));
    });

    it('should set the state to loading', () => {
      expect(loading$).toBeObservable(c(true));
    });
  });

  describe('with LoadFilterForCategorySuccess state', () => {
    beforeEach(() => {
      store$.dispatch(new fromActions.LoadFilterForCategorySuccess({ filter: [{ name: 'a' }] } as FilterNavigation));
    });

    it('should set the state to loaded', () => {
      expect(loading$).toBeObservable(c(false));
    });

    it('should add the filter to the state', () => {
      expect(filter$).toBeObservable(c({ filter: [{ name: 'a' }] } as FilterNavigation));
    });
  });

  describe('with LoadFilterForCategoryFail state', () => {
    beforeEach(() => {
      store$.dispatch(new fromActions.LoadFilterForCategoryFail({} as HttpErrorResponse));
    });

    it('should set the state to loaded', () => {
      expect(loading$).toBeObservable(c(false));
    });

    it('should set null to the filter in the state', () => {
      expect(filter$).toBeObservable(c(null));
    });
  });

  describe('with ApplyFilter state', () => {
    beforeEach(() => {
      store$.dispatch(new fromActions.ApplyFilter({ filterId: 'a', searchParameter: 'b' }));
    });

    it('should set the state to loaded', () => {
      expect(loading$).toBeObservable(c(true));
    });
  });

  describe('with ApplyFilterSuccess state', () => {
    beforeEach(() => {
      store$.dispatch(
        new fromActions.ApplyFilterSuccess({
          availableFilter: {} as FilterNavigation,
          filterName: 'a',
          searchParameter: 'b',
        })
      );
    });

    it('should set the state to loaded', () => {
      expect(loading$).toBeObservable(c(false));
    });
  });

  describe('with ApplyFilterFail state', () => {
    beforeEach(() => {
      store$.dispatch(new fromActions.ApplyFilterFail({} as HttpErrorResponse));
    });

    it('should set the state to loaded', () => {
      expect(loading$).toBeObservable(c(false));
    });
  });

  describe('with SetFilteredProducts state', () => {
    beforeEach(() => {
      store$.dispatch(new LoadProductSuccess({ sku: '123' } as Product));
      store$.dispatch(new LoadProductSuccess({ sku: '234' } as Product));
      store$.dispatch(new fromActions.SetFilteredProducts(['123', '234']));
    });

    it('should set the product state to the skus', () => {
      expect(filteredProducts$).toBeObservable(c([{ sku: '123' }, { sku: '234' }]));
    });
  });
});
