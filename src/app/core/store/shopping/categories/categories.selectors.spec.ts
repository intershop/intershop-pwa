import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Category } from 'ish-core/models/category/category.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Product } from 'ish-core/models/product/product.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { loadProductSuccess } from 'ish-core/store/shopping/products';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';

import {
  loadCategory,
  loadCategoryFail,
  loadCategorySuccess,
  loadTopLevelCategoriesSuccess,
} from './categories.actions';
import {
  getCategoryEntities,
  getCategoryLoading,
  getSelectedCategory,
  getTopLevelCategories,
  isTopLevelCategoriesLoaded,
} from './categories.selectors';

describe('Categories Selectors', () => {
  let store$: StoreWithSnapshots;
  let router: Router;

  let cat: Category;
  let prod: Product;

  beforeEach(() => {
    prod = { sku: 'sku' } as Product;
    cat = { uniqueId: 'Aa', categoryPath: ['Aa'] } as Category;
    cat.hasOnlineProducts = true;

    @Component({ template: 'dummy' })
    class DummyComponent {}

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        CoreStoreModule.forTesting(['router']),
        RouterTestingModule.withRoutes([{ path: 'category/:categoryUniqueId', component: DummyComponent }]),
        ShoppingStoreModule.forTesting('categories'),
      ],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
    router = TestBed.inject(Router);
  });

  describe('with empty state', () => {
    it('should not select any categories when used', () => {
      expect(getCategoryEntities(store$.state)).toBeEmpty();
      expect(getCategoryLoading(store$.state)).toBeFalse();
    });

    it('should not select any selected category when used', () => {
      expect(getSelectedCategory(store$.state)).toBeUndefined();
    });

    it('should not select any top level categories when used', () => {
      expect(getTopLevelCategories(store$.state)).toBeEmpty();
      expect(isTopLevelCategoriesLoaded(store$.state)).toBeFalse();
    });
  });

  describe('loading a category', () => {
    beforeEach(() => {
      store$.dispatch(loadCategory({ categoryId: '' }));
    });

    it('should set the state to loading', () => {
      expect(getCategoryLoading(store$.state)).toBeTrue();
    });

    describe('and reporting success', () => {
      beforeEach(() => {
        store$.dispatch(loadCategorySuccess({ categories: categoryTree([cat]) }));
      });

      it('should set loading to false', () => {
        expect(getCategoryLoading(store$.state)).toBeFalse();
        expect(getCategoryEntities(store$.state)).toEqual({ [cat.uniqueId]: cat });
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(loadCategoryFail({ error: { message: 'error' } as HttpError }));
      });

      it('should not have loaded category on error', () => {
        expect(getCategoryLoading(store$.state)).toBeFalse();
        expect(getCategoryEntities(store$.state)).toBeEmpty();
      });
    });
  });

  describe('state with a category', () => {
    beforeEach(() => {
      store$.dispatch(loadCategorySuccess({ categories: categoryTree([cat]) }));
      store$.dispatch(loadProductSuccess({ product: prod }));
    });

    describe('but no current router state', () => {
      it('should return the category information when used', () => {
        expect(getCategoryEntities(store$.state)).toEqual({ [cat.uniqueId]: cat });
        expect(getCategoryLoading(store$.state)).toBeFalse();
      });

      it('should not select the irrelevant category when used', () => {
        expect(getSelectedCategory(store$.state)).toBeUndefined();
      });
    });

    describe('with category route', () => {
      beforeEach(fakeAsync(() => {
        router.navigate(['category', cat.uniqueId]);
        tick(500);
      }));

      it('should return the category information when used', () => {
        expect(getCategoryEntities(store$.state)).toEqual({ [cat.uniqueId]: cat });
        expect(getCategoryLoading(store$.state)).toBeFalse();
      });

      it('should select the selected category when used', () => {
        expect(getSelectedCategory(store$.state).uniqueId).toEqual(cat.uniqueId);
      });
    });
  });

  describe('loading top level categories', () => {
    let catA: Category;
    let catB: Category;

    beforeEach(() => {
      catA = { uniqueId: 'A', categoryPath: ['A'] } as Category;
      catB = { uniqueId: 'B', categoryPath: ['B'] } as Category;
      store$.dispatch(loadTopLevelCategoriesSuccess({ categories: categoryTree([catA, catB]) }));
    });

    it('should select root categories when used', () => {
      expect(getTopLevelCategories(store$.state).map(x => x.uniqueId)).toEqual(['A', 'B']);
    });

    it('should remember if top level categories are loaded', () => {
      expect(isTopLevelCategoriesLoaded(store$.state)).toBeTrue();
    });
  });
});
