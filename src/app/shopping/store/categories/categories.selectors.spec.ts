import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { combineReducers, StoreModule } from '@ngrx/store';
import { Category } from '../../../models/category/category.model';
import { Product } from '../../../models/product/product.model';
import { LogEffects } from '../../../utils/dev/log.effects';
import { categoryTree } from '../../../utils/dev/test-data-utils';
import { LoadProductSuccess } from '../products';
import { shoppingReducers } from '../shopping.system';
import {
  LoadCategory,
  LoadCategoryFail,
  LoadCategorySuccess,
  LoadTopLevelCategoriesSuccess,
  SelectCategory,
  SetProductSkusForCategory,
} from './categories.actions';
import {
  getCategoryEntities,
  getCategoryLoading,
  getProductCountForSelectedCategory,
  getProductsForSelectedCategory,
  getSelectedCategory,
  getSelectedCategoryId,
  getTopLevelCategories,
} from './categories.selectors';

describe('Categories Selectors', () => {
  let store$: LogEffects;

  let cat: Category;
  let prod: Product;

  beforeEach(() => {
    prod = { sku: 'sku' } as Product;
    cat = { uniqueId: 'Aa', categoryPath: ['Aa'] } as Category;
    cat.hasOnlineProducts = true;

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
    it('should not select any categories when used', () => {
      expect(getCategoryEntities(store$.state)).toBeEmpty();
      expect(getCategoryLoading(store$.state)).toBeFalse();
    });

    it('should not select any selected category when used', () => {
      expect(getSelectedCategory(store$.state)).toBeUndefined();
      expect(getSelectedCategoryId(store$.state)).toBeUndefined();
      expect(getProductCountForSelectedCategory(store$.state)).toEqual(0);
      expect(getProductsForSelectedCategory(store$.state)).toBeEmpty();
    });

    it('should not select any top level categories when used', () => {
      expect(getTopLevelCategories(store$.state)).toBeEmpty();
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
        store$.dispatch(new LoadCategoryFail({ message: 'error' } as HttpErrorResponse));
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
        expect(getProductCountForSelectedCategory(store$.state)).toEqual(0);
        expect(getProductsForSelectedCategory(store$.state)).toBeEmpty();
      });
    });

    describe('with category route', () => {
      beforeEach(() => {
        store$.dispatch(new SetProductSkusForCategory({ categoryUniqueId: cat.uniqueId, skus: [prod.sku] }));
        store$.dispatch(new SelectCategory(cat.uniqueId));
      });

      it('should return the category information when used', () => {
        expect(getCategoryEntities(store$.state)).toEqual({ [cat.uniqueId]: cat });
        expect(getCategoryLoading(store$.state)).toBeFalse();
      });

      it('should select the selected category when used', () => {
        expect(getSelectedCategory(store$.state).uniqueId).toEqual(cat.uniqueId);
        expect(getSelectedCategoryId(store$.state)).toEqual(cat.uniqueId);
        expect(getProductCountForSelectedCategory(store$.state)).toEqual(1);
        expect(getProductsForSelectedCategory(store$.state)).toEqual([prod]);
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
  });
});
