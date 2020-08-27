import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Category, CategoryCompletenessLevel } from 'ish-core/models/category/category.model';
import { Product } from 'ish-core/models/product/product.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { loadProductSuccess } from 'ish-core/store/shopping/products';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';

import {
  loadCategory,
  loadCategoryFail,
  loadCategorySuccess,
  loadTopLevelCategoriesSuccess,
} from './categories.actions';
import {
  getBreadcrumbForCategoryPage,
  getCategory,
  getCategoryEntities,
  getNavigationCategories,
  getSelectedCategory,
} from './categories.selectors';

describe('Categories Selectors', () => {
  let store$: StoreWithSnapshots;
  let router: Router;

  let catA: Category;
  let catA1: Category;
  let prod: Product;

  beforeEach(() => {
    prod = { sku: 'sku' } as Product;
    catA = {
      uniqueId: 'A',
      categoryPath: ['A'],
      completenessLevel: CategoryCompletenessLevel.Max,
      name: 'nA',
    } as Category;
    catA1 = {
      uniqueId: 'A.1',
      categoryPath: ['A', 'A.1'],
      completenessLevel: CategoryCompletenessLevel.Max,
      name: 'nA1',
    } as Category;

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
    });

    it('should not select any selected category when used', () => {
      expect(getSelectedCategory(store$.state)).toBeUndefined();
      expect(getCategory(catA.uniqueId)(store$.state)).toBeUndefined();
    });
  });

  describe('loading a category', () => {
    beforeEach(() => {
      store$.dispatch(loadCategory({ categoryId: '' }));
    });

    describe('and reporting success', () => {
      beforeEach(() => {
        store$.dispatch(loadCategorySuccess({ categories: categoryTree([catA]) }));
      });

      it('should set loading to false', () => {
        expect(getCategoryEntities(store$.state)).toHaveProperty(catA.uniqueId);
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(loadCategoryFail({ error: makeHttpError({ message: 'error' }) }));
      });

      it('should not have loaded category on error', () => {
        expect(getCategoryEntities(store$.state)).toBeEmpty();
      });
    });
  });

  describe('state with a category', () => {
    beforeEach(() => {
      store$.dispatch(loadCategorySuccess({ categories: categoryTree([catA, catA1]) }));
      store$.dispatch(loadProductSuccess({ product: prod }));
    });

    describe('but no current router state', () => {
      it('should return the category information when used', () => {
        expect(getCategoryEntities(store$.state)).toHaveProperty(catA.uniqueId);
        expect(getCategory(catA.uniqueId)(store$.state).uniqueId).toEqual(catA.uniqueId);
      });

      it('should not select the irrelevant category when used', () => {
        expect(getSelectedCategory(store$.state)).toBeUndefined();
      });

      it('should not generate a breadcrumb for unselected category', () => {
        expect(getBreadcrumbForCategoryPage(store$.state)).toBeUndefined();
      });
    });

    describe('with category route', () => {
      beforeEach(fakeAsync(() => {
        router.navigate(['category', catA.uniqueId]);
        tick(500);
      }));

      it('should return the category information when used', () => {
        expect(getCategoryEntities(store$.state)).toHaveProperty(catA.uniqueId);
        expect(getCategory(catA.uniqueId)(store$.state).uniqueId).toEqual(catA.uniqueId);
      });

      it('should select the selected category when used', () => {
        expect(getSelectedCategory(store$.state).uniqueId).toEqual(catA.uniqueId);
      });

      it('should set a category page breadcrumb when selected', () => {
        expect(getBreadcrumbForCategoryPage(store$.state)).toMatchInlineSnapshot(`
          Array [
            Object {
              "link": undefined,
              "text": "nA",
            },
          ]
        `);
      });

      describe('with subcategory', () => {
        beforeEach(fakeAsync(() => {
          router.navigate(['category', catA1.uniqueId]);
          tick(500);
        }));

        it('should select the selected category when used', () => {
          expect(getSelectedCategory(store$.state).uniqueId).toEqual(catA1.uniqueId);
        });

        it('should set a category page breadcrumb when selected', () => {
          expect(getBreadcrumbForCategoryPage(store$.state)).toMatchInlineSnapshot(`
            Array [
              Object {
                "link": "/nA-catA",
                "text": "nA",
              },
              Object {
                "link": undefined,
                "text": "nA1",
              },
            ]
          `);
        });
      });
    });
  });

  describe('loading top level categories', () => {
    beforeEach(() => {
      const cA = { name: 'name_A', uniqueId: 'A', categoryPath: ['A'] } as Category;
      const cA1 = { name: 'name_A.1', uniqueId: 'A.1', categoryPath: ['A', 'A.1'] } as Category;
      const cA1a = { name: 'name_A.1.a', uniqueId: 'A.1.a', categoryPath: ['A', 'A.1', 'A.1.a'] } as Category;
      const cA1b = { name: 'name_A.1.b', uniqueId: 'A.1.b', categoryPath: ['A', 'A.1', 'A.1.b'] } as Category;
      const cA2 = { name: 'name_A.2', uniqueId: 'A.2', categoryPath: ['A', 'A.2'] } as Category;
      const cB = { name: 'name_B', uniqueId: 'B', categoryPath: ['B'] } as Category;
      store$.dispatch(loadTopLevelCategoriesSuccess({ categories: categoryTree([cA, cA1, cA1a, cA1b, cA2, cB]) }));
    });

    describe('selecting navigation categories', () => {
      it('should select top level categories when no argument was supplied', () => {
        expect(getNavigationCategories(undefined)(store$.state)).toMatchInlineSnapshot(`
          Array [
            Object {
              "hasChildren": true,
              "name": "name_A",
              "uniqueId": "A",
              "url": "/name_A-catA",
            },
            Object {
              "hasChildren": false,
              "name": "name_B",
              "uniqueId": "B",
              "url": "/name_B-catB",
            },
          ]
        `);
      });

      it('should select sub categories when sub category is selected', () => {
        expect(getNavigationCategories('A')(store$.state)).toMatchInlineSnapshot(`
          Array [
            Object {
              "hasChildren": true,
              "name": "name_A.1",
              "uniqueId": "A.1",
              "url": "/name_A.1-catA.1",
            },
            Object {
              "hasChildren": false,
              "name": "name_A.2",
              "uniqueId": "A.2",
              "url": "/name_A.2-catA.2",
            },
          ]
        `);
      });

      it('should select deeper sub categories when deeper sub category is selected', () => {
        expect(getNavigationCategories('A.1')(store$.state)).toMatchInlineSnapshot(`
          Array [
            Object {
              "hasChildren": false,
              "name": "name_A.1.a",
              "uniqueId": "A.1.a",
              "url": "/name_A.1.a-catA.1.a",
            },
            Object {
              "hasChildren": false,
              "name": "name_A.1.b",
              "uniqueId": "A.1.b",
              "url": "/name_A.1.b-catA.1.b",
            },
          ]
        `);
      });

      it('should be empty when selecting leaves', () => {
        expect(getNavigationCategories('A.1.a')(store$.state)).toBeEmpty();
      });
    });
  });
});
