import { TestBed } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';

import { Category } from '../../../models/category/category.model';
import { HttpError } from '../../../models/http-error/http-error.model';
import { Product } from '../../../models/product/product.model';
import { TestStore, ngrxTesting } from '../../../utils/dev/ngrx-testing';
import { categoryTree } from '../../../utils/dev/test-data-utils';
import { LoadProductSuccess } from '../products';
import { shoppingReducers } from '../shopping.system';

import {
  LoadCategory,
  LoadCategoryFail,
  LoadCategorySuccess,
  LoadTopLevelCategoriesSuccess,
  SelectCategory,
} from './categories.actions';
import {
  getCategoryEntities,
  getCategoryLoading,
  getSelectedCategory,
  getSelectedCategoryId,
  getTopLevelCategories,
  isTopLevelCategoriesLoaded,
} from './categories.selectors';

describe('Categories Selectors', () => {
  let store$: TestStore;

  let cat: Category;
  let prod: Product;

  beforeEach(() => {
    prod = { sku: 'sku' } as Product;
    cat = { uniqueId: 'Aa', categoryPath: ['Aa'] } as Category;
    cat.hasOnlineProducts = true;

    TestBed.configureTestingModule({
      imports: ngrxTesting({
        shopping: combineReducers(shoppingReducers),
      }),
    });

    store$ = TestBed.get(TestStore);
  });

  describe('with empty state', () => {
    it('should not select any categories when used', () => {
      expect(getCategoryEntities(store$.state)).toBeEmpty();
      expect(getCategoryLoading(store$.state)).toBeFalse();
    });

    it('should not select any selected category when used', () => {
      expect(getSelectedCategory(store$.state)).toBeUndefined();
      expect(getSelectedCategoryId(store$.state)).toBeUndefined();
    });

    it('should not select any top level categories when used', () => {
      expect(getTopLevelCategories(store$.state)).toBeEmpty();
      expect(isTopLevelCategoriesLoaded(store$.state)).toBeFalse();
    });
  });

  describe('loading a category', () => {
    beforeEach(() => {
      store$.dispatch(new LoadCategory(''));
    });

    it('should set the state to loading', () => {
      expect(getCategoryLoading(store$.state)).toBeTrue();
    });

    describe('and reporting success', () => {
      beforeEach(() => {
        store$.dispatch(new LoadCategorySuccess(categoryTree([cat])));
      });

      it('should set loading to false', () => {
        expect(getCategoryLoading(store$.state)).toBeFalse();
        expect(getCategoryEntities(store$.state)).toEqual({ [cat.uniqueId]: cat });
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(new LoadCategoryFail({ message: 'error' } as HttpError));
      });

      it('should not have loaded category on error', () => {
        expect(getCategoryLoading(store$.state)).toBeFalse();
        expect(getCategoryEntities(store$.state)).toBeEmpty();
      });
    });
  });

  describe('state with a category', () => {
    beforeEach(() => {
      store$.dispatch(new LoadCategorySuccess(categoryTree([cat])));
      store$.dispatch(new LoadProductSuccess(prod));
    });

    describe('but no current router state', () => {
      it('should return the category information when used', () => {
        expect(getCategoryEntities(store$.state)).toEqual({ [cat.uniqueId]: cat });
        expect(getCategoryLoading(store$.state)).toBeFalse();
      });

      it('should not select the irrelevant category when used', () => {
        expect(getSelectedCategory(store$.state)).toBeUndefined();
        expect(getSelectedCategoryId(store$.state)).toBeUndefined();
      });
    });

    describe('with category route', () => {
      beforeEach(() => {
        store$.dispatch(new SelectCategory(cat.uniqueId));
      });

      it('should return the category information when used', () => {
        expect(getCategoryEntities(store$.state)).toEqual({ [cat.uniqueId]: cat });
        expect(getCategoryLoading(store$.state)).toBeFalse();
      });

      it('should select the selected category when used', () => {
        expect(getSelectedCategory(store$.state).uniqueId).toEqual(cat.uniqueId);
        expect(getSelectedCategoryId(store$.state)).toEqual(cat.uniqueId);
      });
    });
  });

  describe('loading top level categories', () => {
    let catA: Category;
    let catB: Category;

    beforeEach(() => {
      catA = { uniqueId: 'A', categoryPath: ['A'] } as Category;
      catB = { uniqueId: 'B', categoryPath: ['B'] } as Category;
      store$.dispatch(new LoadTopLevelCategoriesSuccess(categoryTree([catA, catB])));
    });

    it('should select root categories when used', () => {
      expect(getTopLevelCategories(store$.state).map(x => x.uniqueId)).toEqual(['A', 'B']);
    });

    it('should remember if top level categories are loaded', () => {
      expect(isTopLevelCategoriesLoaded(store$.state)).toBeTrue();
    });
  });
});
