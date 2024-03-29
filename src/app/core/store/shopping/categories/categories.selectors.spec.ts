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
  loadCategoryTreeSuccess,
  loadTopLevelCategoriesSuccess,
} from './categories.actions';
import {
  getBreadcrumbForCategoryPage,
  getCategory,
  getCategoryEntities,
  getCategoryIdByRefId,
  getNavigationCategories,
  getNavigationCategoryTree,
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

    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(['router']),
        RouterTestingModule.withRoutes([{ path: 'category/:categoryUniqueId', children: [] }]),
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
          [
            {
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
            [
              {
                "link": "/na-ctgA",
                "text": "nA",
              },
              {
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
          [
            {
              "children": undefined,
              "hasChildren": true,
              "name": "name_A",
              "uniqueId": "A",
              "url": "/name_a-ctgA",
            },
            {
              "children": undefined,
              "hasChildren": false,
              "name": "name_B",
              "uniqueId": "B",
              "url": "/name_b-ctgB",
            },
          ]
        `);
      });

      it('should select sub categories when sub category is selected', () => {
        expect(getNavigationCategories('A')(store$.state)).toMatchInlineSnapshot(`
          [
            {
              "children": undefined,
              "hasChildren": true,
              "name": "name_A.1",
              "uniqueId": "A.1",
              "url": "/name_a/name_a.1-ctgA.1",
            },
            {
              "children": undefined,
              "hasChildren": false,
              "name": "name_A.2",
              "uniqueId": "A.2",
              "url": "/name_a/name_a.2-ctgA.2",
            },
          ]
        `);
      });

      it('should select deeper sub categories when deeper sub category is selected', () => {
        expect(getNavigationCategories('A.1')(store$.state)).toMatchInlineSnapshot(`
          [
            {
              "children": undefined,
              "hasChildren": false,
              "name": "name_A.1.a",
              "uniqueId": "A.1.a",
              "url": "/name_a/name_a.1/name_a.1.a-ctgA.1.a",
            },
            {
              "children": undefined,
              "hasChildren": false,
              "name": "name_A.1.b",
              "uniqueId": "A.1.b",
              "url": "/name_a/name_a.1/name_a.1.b-ctgA.1.b",
            },
          ]
        `);
      });

      it('should be empty when selecting leaves', () => {
        expect(getNavigationCategories('A.1.a')(store$.state)).toBeEmpty();
      });
    });
  });

  describe('loading category tree', () => {
    beforeEach(() => {
      const cA = { name: 'name_A', uniqueId: 'A', categoryRef: 'A@cat', categoryPath: ['A'] } as Category;
      const cA1 = { name: 'name_A.1', uniqueId: 'A.1', categoryRef: 'A.1@cat', categoryPath: ['A', 'A.1'] } as Category;
      const cA1a = {
        name: 'name_A.1.a',
        uniqueId: 'A.1.a',
        categoryRef: 'A.1.a@cat',
        categoryPath: ['A', 'A.1', 'A.1.a'],
      } as Category;
      const cA1b = {
        name: 'name_A.1.b',
        uniqueId: 'A.1.b',
        categoryRef: 'A.1.b@cat',
        categoryPath: ['A', 'A.1', 'A.1.b'],
      } as Category;
      const cA2 = { name: 'name_A.2', uniqueId: 'A.2', categoryRef: 'A.2@cat', categoryPath: ['A', 'A.2'] } as Category;
      store$.dispatch(loadCategoryTreeSuccess({ categories: categoryTree([cA, cA1, cA1a, cA1b, cA2]) }));
    });

    describe('selecting navigation category tree', () => {
      it('should select only the category tree root', () => {
        expect(getNavigationCategoryTree('A@cat', 0)(store$.state)).toMatchInlineSnapshot(`
          {
            "children": undefined,
            "hasChildren": true,
            "name": "name_A",
            "uniqueId": "A",
            "url": "/name_a-ctgA",
          }
        `);
      });

      it('should select the category tree with only one level', () => {
        expect(getNavigationCategoryTree('A@cat', 1)(store$.state)).toMatchInlineSnapshot(`
          {
            "children": [
              {
                "children": undefined,
                "hasChildren": true,
                "name": "name_A.1",
                "uniqueId": "A.1",
                "url": "/name_a/name_a.1-ctgA.1",
              },
              {
                "children": undefined,
                "hasChildren": false,
                "name": "name_A.2",
                "uniqueId": "A.2",
                "url": "/name_a/name_a.2-ctgA.2",
              },
            ],
            "hasChildren": true,
            "name": "name_A",
            "uniqueId": "A",
            "url": "/name_a-ctgA",
          }
        `);
      });

      it('should select the whole category tree', () => {
        expect(getNavigationCategoryTree('A@cat', 2)(store$.state)).toMatchInlineSnapshot(`
          {
            "children": [
              {
                "children": [
                  {
                    "children": undefined,
                    "hasChildren": false,
                    "name": "name_A.1.a",
                    "uniqueId": "A.1.a",
                    "url": "/name_a/name_a.1/name_a.1.a-ctgA.1.a",
                  },
                  {
                    "children": undefined,
                    "hasChildren": false,
                    "name": "name_A.1.b",
                    "uniqueId": "A.1.b",
                    "url": "/name_a/name_a.1/name_a.1.b-ctgA.1.b",
                  },
                ],
                "hasChildren": true,
                "name": "name_A.1",
                "uniqueId": "A.1",
                "url": "/name_a/name_a.1-ctgA.1",
              },
              {
                "children": undefined,
                "hasChildren": false,
                "name": "name_A.2",
                "uniqueId": "A.2",
                "url": "/name_a/name_a.2-ctgA.2",
              },
            ],
            "hasChildren": true,
            "name": "name_A",
            "uniqueId": "A",
            "url": "/name_a-ctgA",
          }
        `);
      });

      it('should select sub category tree when deeper sub category is selected', () => {
        expect(getNavigationCategoryTree('A.1@cat', 2)(store$.state)).toMatchInlineSnapshot(`
          {
            "children": [
              {
                "children": undefined,
                "hasChildren": false,
                "name": "name_A.1.a",
                "uniqueId": "A.1.a",
                "url": "/name_a/name_a.1/name_a.1.a-ctgA.1.a",
              },
              {
                "children": undefined,
                "hasChildren": false,
                "name": "name_A.1.b",
                "uniqueId": "A.1.b",
                "url": "/name_a/name_a.1/name_a.1.b-ctgA.1.b",
              },
            ],
            "hasChildren": true,
            "name": "name_A.1",
            "uniqueId": "A.1",
            "url": "/name_a/name_a.1-ctgA.1",
          }
        `);
      });

      it('should select only the root category if it has no subcategories', () => {
        expect(getNavigationCategoryTree('A.2@cat', 2)(store$.state)).toMatchInlineSnapshot(`
          {
            "children": undefined,
            "hasChildren": false,
            "name": "name_A.2",
            "uniqueId": "A.2",
            "url": "/name_a/name_a.2-ctgA.2",
          }
        `);
      });
    });
  });

  describe('load category by refId', () => {
    beforeEach(() => {
      store$.dispatch(
        loadCategorySuccess({
          categories: categoryTree([
            {
              ...catA,
              categoryRef: 'categoryRef',
            },
          ]),
        })
      );
    });

    it('should get category with its categoryRef', () => {
      expect(getCategoryIdByRefId('categoryRef')(store$.state)).toEqual(catA.uniqueId);
    });
  });
});
