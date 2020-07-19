import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Category } from 'ish-core/models/category/category.model';
import { Product, ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { loadCategorySuccess } from 'ish-core/store/shopping/categories';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';

import {
  loadProduct,
  loadProductBundlesSuccess,
  loadProductFail,
  loadProductLinksSuccess,
  loadProductSuccess,
  loadProductVariations,
  loadProductVariationsFail,
  loadProductVariationsSuccess,
  loadRetailSetSuccess,
} from './products.actions';
import {
  getBreadcrumbForProductPage,
  getProduct,
  getProductEntities,
  getProductLinks,
  getProducts,
  getSelectedProduct,
} from './products.selectors';

describe('Products Selectors', () => {
  let store$: StoreWithSnapshots;
  let router: Router;

  let prod: Product;

  beforeEach(() => {
    prod = { sku: 'sku', completenessLevel: ProductCompletenessLevel.Detail, name: 'product' } as Product;

    @Component({ template: 'dummy' })
    class DummyComponent {}

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        CoreStoreModule.forTesting(['router']),
        RouterTestingModule.withRoutes([{ path: '**', component: DummyComponent }]),
        ShoppingStoreModule.forTesting('products', 'categories'),
      ],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
    router = TestBed.inject(Router);
  });

  describe('with empty state', () => {
    it('should not select any products when used', () => {
      expect(getProductEntities(store$.state)).toBeEmpty();
    });

    it('should not select a current product when used', () => {
      expect(getSelectedProduct(store$.state)).toBeUndefined();
    });
  });

  describe('loading a product', () => {
    beforeEach(() => {
      store$.dispatch(loadProduct({ sku: '' }));
    });

    describe('and reporting success', () => {
      beforeEach(() => {
        store$.dispatch(loadProductSuccess({ product: prod }));
      });

      it('should add product to state', () => {
        expect(getProductEntities(store$.state)).toEqual({ [prod.sku]: prod });
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(loadProductFail({ error: makeHttpError({ message: 'error' }), sku: 'invalid' }));
      });

      it('should not have loaded product on error', () => {
        expect(getProductEntities(store$.state)).toBeEmpty();
      });

      it('should return a product stub if product is selected', () => {
        expect(getProduct(store$.state, { sku: 'invalid' })).toBeTruthy();
      });
    });
  });

  describe('state with a product', () => {
    beforeEach(() => {
      store$.dispatch(loadProductSuccess({ product: prod }));
    });

    describe('but no current router state', () => {
      it('should return the product information when used', () => {
        expect(getProductEntities(store$.state)).toEqual({ [prod.sku]: prod });
      });

      it('should not select the irrelevant product when used', () => {
        expect(getSelectedProduct(store$.state)).toBeUndefined();
      });

      it('should not have a breadcrumb when no product is selected', () => {
        expect(getBreadcrumbForProductPage(store$.state)).toBeUndefined();
      });
    });

    describe('with product route', () => {
      beforeEach(fakeAsync(() => {
        router.navigateByUrl('/product;sku=' + prod.sku);
        tick(500);
      }));

      it('should return the product information when used', () => {
        expect(getProductEntities(store$.state)).toEqual({ [prod.sku]: prod });
      });

      it('should select the selected product when used', () => {
        expect(getSelectedProduct(store$.state)).toHaveProperty('sku', prod.sku);
      });

      it('should generate a breadcrumb when product is selected', () => {
        expect(getBreadcrumbForProductPage(store$.state)).toMatchInlineSnapshot(`
          Array [
            Object {
              "link": undefined,
              "text": "product",
            },
          ]
        `);
      });

      describe('with category', () => {
        beforeEach(() => {
          store$.dispatch(
            loadCategorySuccess({
              categories: categoryTree([{ uniqueId: 'A', name: 'nA', categoryPath: ['A'] }] as Category[]),
            })
          );
          store$.dispatch(
            loadCategorySuccess({
              categories: categoryTree([{ uniqueId: 'B', name: 'nB', categoryPath: ['B'] }] as Category[]),
            })
          );
        });

        describe('as default category', () => {
          beforeEach(() => {
            store$.dispatch(loadProductSuccess({ product: { ...prod, defaultCategoryId: 'A' } }));
          });

          it('should generate a breadcrumb with default category when product is selected', () => {
            expect(getBreadcrumbForProductPage(store$.state)).toMatchInlineSnapshot(`
            Array [
              Object {
                "link": "/nA-catA",
                "text": "nA",
              },
              Object {
                "link": undefined,
                "text": "product",
              },
            ]
          `);
          });
        });

        describe('as selected category', () => {
          beforeEach(fakeAsync(() => {
            router.navigateByUrl('/product;sku=sku;categoryUniqueId=B');
            tick(500);
          }));

          it('should generate a breadcrumb with selected category when product is selected', () => {
            expect(getBreadcrumbForProductPage(store$.state)).toMatchInlineSnapshot(`
            Array [
              Object {
                "link": "/nB-catB",
                "text": "nB",
              },
              Object {
                "link": undefined,
                "text": "product",
              },
            ]
          `);
          });
        });

        describe('both selected and default', () => {
          beforeEach(fakeAsync(() => {
            store$.dispatch(loadProductSuccess({ product: { ...prod, defaultCategoryId: 'A' } }));
            router.navigateByUrl('/product;sku=sku;categoryUniqueId=B');
            tick(500);
          }));

          it('should generate a breadcrumb with selected category even if product has default category when product is selected', () => {
            expect(getBreadcrumbForProductPage(store$.state)).toMatchInlineSnapshot(`
            Array [
              Object {
                "link": "/nB-catB",
                "text": "nB",
              },
              Object {
                "link": undefined,
                "text": "product",
              },
            ]
          `);
          });
        });
      });
    });
  });

  describe('when loading bundles', () => {
    it('should contain the product bundle information on the product', () => {
      store$.dispatch(loadProductSuccess({ product: { sku: 'ABC' } as Product }));
      store$.dispatch(
        loadProductBundlesSuccess({
          sku: 'ABC',
          bundledProducts: [
            { sku: 'A', quantity: 1 },
            { sku: 'B', quantity: 2 },
          ],
        })
      );

      expect(getProductEntities(store$.state).ABC).toMatchInlineSnapshot(`
        Object {
          "bundledProducts": Array [
            Object {
              "quantity": 1,
              "sku": "A",
            },
            Object {
              "quantity": 2,
              "sku": "B",
            },
          ],
          "sku": "ABC",
        }
      `);
    });
  });

  describe('when loading retail sets', () => {
    it('should contain the product retail set information on the product', () => {
      store$.dispatch(loadProductSuccess({ product: { sku: 'ABC' } as Product }));
      store$.dispatch(
        loadRetailSetSuccess({
          sku: 'ABC',
          parts: ['A', 'B'],
        })
      );

      expect(getProductEntities(store$.state).ABC).toMatchInlineSnapshot(`
        Object {
          "partSKUs": Array [
            "A",
            "B",
          ],
          "sku": "ABC",
        }
      `);
    });
  });

  describe('loading product variations', () => {
    beforeEach(() => {
      store$.dispatch(loadProductSuccess({ product: { sku: 'SKU', type: 'VariationProductMaster' } as Product }));
      store$.dispatch(loadProductVariations({ sku: 'SKU' }));
    });

    describe('and reporting success', () => {
      beforeEach(() => {
        store$.dispatch(loadProductVariationsSuccess({ sku: 'SKU', variations: ['VAR'], defaultVariation: 'VAR' }));
      });

      it('should add variations to state', () => {
        expect(getProductEntities(store$.state).SKU).toMatchInlineSnapshot(`
          Object {
            "defaultVariationSKU": "VAR",
            "sku": "SKU",
            "type": "VariationProductMaster",
            "variationSKUs": Array [
              "VAR",
            ],
          }
        `);
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(loadProductVariationsFail({ error: makeHttpError({ message: 'error' }), sku: 'SKU' }));
      });

      it('should not have loaded product variations on error', () => {
        expect(getProductEntities(store$.state).SKU).toEqual({ sku: 'SKU', type: 'VariationProductMaster' });
      });
    });
  });

  describe('state with multiple products', () => {
    beforeEach(() => {
      store$.dispatch(loadProductSuccess({ product: { sku: 'SKU1', name: 'sku1' } as Product }));
      store$.dispatch(loadProductSuccess({ product: { sku: 'SKU2', name: 'sku2' } as Product }));
      store$.dispatch(loadProductSuccess({ product: { sku: 'SKU3', name: 'sku3' } as Product }));
    });

    it('should select various products on entities selector', () => {
      expect(getProductEntities(store$.state)).toHaveProperty('SKU1');
      expect(getProductEntities(store$.state)).toHaveProperty('SKU2');
      expect(getProductEntities(store$.state)).toHaveProperty('SKU3');
    });

    it('should select various products on single product selector', () => {
      expect(getProduct(store$.state, { sku: 'SKU1' })).toHaveProperty('name', 'sku1');
      expect(getProduct(store$.state, { sku: 'SKU2' })).toHaveProperty('name', 'sku2');
      expect(getProduct(store$.state, { sku: 'SKU3' })).toHaveProperty('name', 'sku3');
    });

    it('should select various products on multiple products selector', () => {
      const products = getProducts(store$.state, { skus: ['SKU1', 'SKU2', 'SKU3'] });
      expect(products).toHaveLength(3);
      expect(products.map(p => p.name)).toEqual(['sku1', 'sku2', 'sku3']);
    });
  });

  describe('when loading product links', () => {
    it('should contain the product link information on the product', () => {
      store$.dispatch(loadProductSuccess({ product: { sku: 'ABC' } as Product }));
      store$.dispatch(
        loadProductLinksSuccess({
          sku: 'ABC',
          links: { linkType: { products: ['prod'], categories: ['cat'] } },
        })
      );

      expect(getProductLinks(store$.state, { sku: 'ABC' })).toMatchInlineSnapshot(`
        Object {
          "linkType": Object {
            "categories": [Function],
            "categoryIds": Array [
              "cat",
            ],
            "productSKUs": Array [
              "prod",
            ],
            "products": [Function],
          },
        }
      `);
    });
  });
});
