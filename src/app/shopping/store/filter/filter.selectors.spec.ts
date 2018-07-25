import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { combineReducers, StoreModule } from '@ngrx/store';
import { Category } from '../../../models/category/category.model';
import { FilterNavigation } from '../../../models/filter-navigation/filter-navigation.model';
import { Product } from '../../../models/product/product.model';
import { LogEffects } from '../../../utils/dev/log.effects';
import { LoadProductSuccess } from '../products';
import { shoppingReducers } from '../shopping.system';
import {
  ApplyFilter,
  ApplyFilterFail,
  ApplyFilterSuccess,
  LoadFilterForCategory,
  LoadFilterForCategoryFail,
  LoadFilterForCategorySuccess,
  SetFilteredProducts,
} from './filter.actions';
import { getAvailableFilter, getFilteredProducts, getLoadingStatus } from './filter.selectors';

describe('Filter Selectors', () => {
  let store$: LogEffects;

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

  describe('with empty state', () => {
    it('should not select any filters when used', () => {
      expect(getAvailableFilter(store$.state)).toBeUndefined();
    });

    it('should not select any filteredProducts product when used', () => {
      expect(getFilteredProducts(store$.state)).toBeUndefined();
    });
  });

  describe('with LoadFilterForCategory state', () => {
    beforeEach(() => {
      store$.dispatch(new LoadFilterForCategory({} as Category));
    });

    it('should set the state to loading', () => {
      expect(getLoadingStatus(store$.state)).toBeTrue();
    });
  });

  describe('with LoadFilterForCategorySuccess state', () => {
    beforeEach(() => {
      store$.dispatch(new LoadFilterForCategorySuccess({ filter: [{ name: 'a' }] } as FilterNavigation));
    });

    it('should set the state to loaded', () => {
      expect(getLoadingStatus(store$.state)).toBeFalse();
    });

    it('should add the filter to the state', () => {
      expect(getAvailableFilter(store$.state)).toEqual({ filter: [{ name: 'a' }] } as FilterNavigation);
    });
  });

  describe('with LoadFilterForCategoryFail state', () => {
    beforeEach(() => {
      store$.dispatch(new LoadFilterForCategoryFail({} as HttpErrorResponse));
    });

    it('should set the state to loaded', () => {
      expect(getLoadingStatus(store$.state)).toBeFalse();
    });

    it('should set undefined to the filter in the state', () => {
      expect(getAvailableFilter(store$.state)).toBeUndefined();
    });
  });

  describe('with ApplyFilter state', () => {
    beforeEach(() => {
      store$.dispatch(new ApplyFilter({ filterId: 'a', searchParameter: 'b' }));
    });

    it('should set the state to loaded', () => {
      expect(getLoadingStatus(store$.state)).toBeTrue();
    });
  });

  describe('with ApplyFilterSuccess state', () => {
    beforeEach(() => {
      store$.dispatch(
        new ApplyFilterSuccess({
          availableFilter: {} as FilterNavigation,
          filterName: 'a',
          searchParameter: 'b',
        })
      );
    });

    it('should set the state to loaded', () => {
      expect(getLoadingStatus(store$.state)).toBeFalse();
    });
  });

  describe('with ApplyFilterFail state', () => {
    beforeEach(() => {
      store$.dispatch(new ApplyFilterFail({} as HttpErrorResponse));
    });

    it('should set the state to loaded', () => {
      expect(getLoadingStatus(store$.state)).toBeFalse();
    });
  });

  describe('with SetFilteredProducts state', () => {
    beforeEach(() => {
      store$.dispatch(new LoadProductSuccess({ sku: '123' } as Product));
      store$.dispatch(new LoadProductSuccess({ sku: '234' } as Product));
      store$.dispatch(new SetFilteredProducts(['123', '234']));
    });

    it('should set the product state to the skus', () => {
      expect(getFilteredProducts(store$.state)).toEqual([{ sku: '123' }, { sku: '234' }]);
    });
  });
});
