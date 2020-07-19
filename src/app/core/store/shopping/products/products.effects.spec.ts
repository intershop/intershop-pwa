import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, noop, of, throwError } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { anyNumber, anyString, anything, instance, mock, verify, when } from 'ts-mockito';

import { PRODUCT_LISTING_ITEMS_PER_PAGE } from 'ish-core/configurations/injection-keys';
import { VariationProductMaster } from 'ish-core/models/product/product-variation-master.model';
import { VariationProduct } from 'ish-core/models/product/product-variation.model';
import { Product, ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { ProductsService } from 'ish-core/services/products/products.service';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { loadCategory } from 'ish-core/store/shopping/categories';
import { setProductListingPageSize, setProductListingPages } from 'ish-core/store/shopping/product-listing';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import {
  loadProduct,
  loadProductFail,
  loadProductIfNotLoaded,
  loadProductLinks,
  loadProductLinksFail,
  loadProductLinksSuccess,
  loadProductSuccess,
  loadProductVariations,
  loadProductVariationsFail,
  loadProductVariationsSuccess,
  loadProductsForCategory,
  loadProductsForCategoryFail,
} from './products.actions';
import { ProductsEffects } from './products.effects';

describe('Products Effects', () => {
  let actions$: Observable<Action>;
  let effects: ProductsEffects;
  let store$: Store;
  let productsServiceMock: ProductsService;
  let router: Router;
  let location: Location;

  @Component({ template: 'dummy' })
  class DummyComponent {}

  beforeEach(() => {
    productsServiceMock = mock(ProductsService);
    when(productsServiceMock.getProduct(anyString())).thenCall((sku: string) => {
      if (sku === 'invalid') {
        return throwError(makeHttpError({ message: 'invalid' }));
      } else {
        return of({ sku } as Product);
      }
    });

    when(productsServiceMock.getProductBundles(anything())).thenCall((sku: string) => {
      if (!sku) {
        return throwError(makeHttpError({ message: 'invalid' }));
      } else {
        return of({ product: { sku }, stubs: [] });
      }
    });

    when(productsServiceMock.getCategoryProducts('123', anyNumber(), anything())).thenReturn(
      of({
        sortKeys: ['name-asc', 'name-desc'],
        products: [{ sku: 'P222' }, { sku: 'P333' }] as Product[],
        total: 2,
      })
    );

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        CoreStoreModule.forTesting(['router']),
        RouterTestingModule.withRoutes([
          { path: 'category/:categoryUniqueId/product/:sku', component: DummyComponent },
          { path: 'product/:sku', component: DummyComponent },
          { path: '**', component: DummyComponent },
        ]),
        ShoppingStoreModule.forTesting('products', 'categories'),
      ],
      providers: [
        ProductsEffects,
        provideMockActions(() => actions$),
        { provide: ProductsService, useFactory: () => instance(productsServiceMock) },
        { provide: PRODUCT_LISTING_ITEMS_PER_PAGE, useValue: 3 },
      ],
    });

    effects = TestBed.inject(ProductsEffects);
    store$ = TestBed.inject(Store);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    store$.dispatch(setProductListingPageSize({ itemsPerPage: TestBed.inject(PRODUCT_LISTING_ITEMS_PER_PAGE) }));
  });

  describe('loadProductBundles$', () => {
    it('should call the productsService for LoadProductBundles action', done => {
      const sku = 'P123';
      const action = loadProductSuccess({ product: { sku, type: 'Bundle' } as Product });
      actions$ = of(action);

      effects.loadProductBundles$.subscribe(() => {
        verify(productsServiceMock.getProductBundles(sku)).once();
        done();
      });
    });
  });

  describe('loadProduct$', () => {
    it('should call the productsService for LoadProduct action', done => {
      const sku = 'P123';
      const action = loadProduct({ sku });
      actions$ = of(action);

      effects.loadProduct$.subscribe(() => {
        verify(productsServiceMock.getProduct(sku)).once();
        done();
      });
    });

    it('should map to action of type LoadProductSuccess', () => {
      const sku = 'P123';
      const action = loadProduct({ sku });
      const completion = loadProductSuccess({ product: { sku } as Product });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadProduct$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadProductFail', () => {
      const sku = 'invalid';
      const action = loadProduct({ sku });
      const completion = loadProductFail({ error: makeHttpError({ message: 'invalid' }), sku });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadProduct$).toBeObservable(expected$);
    });
  });

  describe('loadProductsForCategory$', () => {
    it('should call service for SKU list', done => {
      actions$ = of(loadProductsForCategory({ categoryId: '123', sorting: 'name-asc' }));

      effects.loadProductsForCategory$.subscribe(() => {
        verify(productsServiceMock.getCategoryProducts('123', anyNumber(), 'name-asc')).once();
        done();
      });
    });

    it('should trigger actions for loading content for the product list', () => {
      actions$ = hot('a', {
        a: loadProductsForCategory({ categoryId: '123' }),
      });
      const expectedValues = {
        b: loadProductSuccess({ product: { sku: 'P222' } as Product }),
        c: loadProductSuccess({ product: { sku: 'P333' } as Product }),
        d: setProductListingPages({
          id: { type: 'category', value: '123' },
          itemCount: 2,
          sortKeys: ['name-asc', 'name-desc'],
          1: ['P222', 'P333'],
        }),
      };
      expect(effects.loadProductsForCategory$).toBeObservable(cold('(bcd)', expectedValues));
    });

    it('should not die if repeating errors are encountered', () => {
      when(productsServiceMock.getCategoryProducts(anything(), anyNumber(), anything())).thenReturn(
        throwError(makeHttpError({ message: 'ERROR' }))
      );
      actions$ = hot('-a-a-a', {
        a: loadProductsForCategory({ categoryId: '123' }),
      });
      expect(effects.loadProductsForCategory$).toBeObservable(
        cold('-a-a-a', {
          a: loadProductsForCategoryFail({
            error: makeHttpError({ message: 'ERROR' }),
            categoryId: '123',
          }),
        })
      );
    });
  });

  describe('loadProductVariations$', () => {
    beforeEach(() => {
      when(productsServiceMock.getProductVariations(anyString())).thenCall(() =>
        of({ products: [], defaultVariation: undefined })
      );
    });

    it('should call the productsService for getProductVariations', done => {
      const action = loadProductVariations({ sku: 'MSKU' });
      actions$ = of(action);

      effects.loadProductVariations$.subscribe(() => {
        verify(productsServiceMock.getProductVariations('MSKU')).once();
        done();
      });
    });

    it('should map to action of type LoadProductVariationsSuccess', () => {
      const action = loadProductVariations({ sku: 'MSKU' });
      const completion = loadProductVariationsSuccess({
        sku: 'MSKU',
        variations: [],
        defaultVariation: undefined,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadProductVariations$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadProductVariationsFail', () => {
      when(productsServiceMock.getProductVariations(anyString())).thenCall(() =>
        throwError(makeHttpError({ message: 'invalid' }))
      );
      const action = loadProductVariations({ sku: 'MSKU' });
      const completion = loadProductVariationsFail({
        error: makeHttpError({ message: 'invalid' }),
        sku: 'MSKU',
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadProductVariations$).toBeObservable(expected$);
    });
  });

  describe('loadMasterProductForProduct$', () => {
    it('should trigger LoadProduct action if LoadProductSuccess contains productMasterSKU', () => {
      const action = loadProductSuccess({
        product: {
          productMasterSKU: 'MSKU',
          type: 'VariationProduct',
        } as VariationProduct,
      });
      const completion = loadProductIfNotLoaded({ sku: 'MSKU', level: ProductCompletenessLevel.List });
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-c', { c: completion });

      expect(effects.loadMasterProductForProduct$).toBeObservable(expected$);
    });

    it('should not trigger LoadProduct action if LoadProductSuccess contains productMasterSKU of loaded product', () => {
      store$.dispatch(loadProductSuccess({ product: { sku: 'MSKU' } as Product }));

      const action = loadProductSuccess({
        product: {
          productMasterSKU: 'MSKU',
          type: 'VariationProduct',
        } as VariationProduct,
      });
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-');

      expect(effects.loadMasterProductForProduct$).toBeObservable(expected$);
    });
  });

  describe('loadProductVariationsForMasterProduct$', () => {
    it('should trigger LoadProductVariations action if LoadProductSuccess triggered for master product', () => {
      const action = loadProductSuccess({
        product: {
          sku: 'MSKU',
          type: 'VariationProductMaster',
        } as VariationProductMaster,
      });
      const completion = loadProductVariations({ sku: 'MSKU' });
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-c', { c: completion });

      expect(effects.loadProductVariationsForMasterProduct$).toBeObservable(expected$);
    });

    it('should not trigger LoadProductVariations action if loaded product variations present', () => {
      const product = {
        sku: 'MSKU',
        type: 'VariationProductMaster',
      } as VariationProductMaster;

      store$.dispatch(loadProductSuccess({ product }));
      store$.dispatch(loadProductVariationsSuccess({ sku: 'MSKU', variations: ['VAR'], defaultVariation: 'VAR' }));

      const action = loadProductSuccess({ product });
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-');

      expect(effects.loadProductVariationsForMasterProduct$).toBeObservable(expected$);
    });

    it('should not trigger LoadProductVariants action if loaded product is not of type VariationProductMaster.', () => {
      const action = loadProductSuccess({
        product: {
          sku: 'SKU',
          type: 'Product',
        } as Product,
      });
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-');

      expect(effects.loadProductVariationsForMasterProduct$).toBeObservable(expected$);
    });
  });

  describe('selectedProduct$', () => {
    it('should fire SelectProduct when route /category/XXX/product/YYY is navigated', done => {
      router.navigateByUrl('/category/dummy/product/foobar');

      effects.selectedProduct$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Products Internal] Load Product:
            sku: "foobar"
        `);
        done();
      });
    });

    it('should fire SelectProduct when route /product/YYY is navigated', done => {
      router.navigateByUrl('/product/foobar');

      effects.selectedProduct$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Products Internal] Load Product:
            sku: "foobar"
        `);
        done();
      });
    });

    it('should not fire SelectProduct when route /something is navigated', done => {
      router.navigateByUrl('/any');

      effects.selectedProduct$.subscribe(fail, fail, fail);

      setTimeout(done, 1000);
    });
  });

  describe('redirectIfErrorInProducts$', () => {
    beforeEach(() => {
      store$.dispatch(loadProductFail({ sku: 'SKU', error: makeHttpError({ status: 404 }) }));
    });

    it('should redirect if triggered on product detail page', fakeAsync(() => {
      router.navigateByUrl('/product/SKU');

      effects.redirectIfErrorInProducts$.subscribe(noop, fail, noop);

      tick(500);

      expect(location.path()).toEqual('/error');
    }));

    it('should not redirect if triggered on page other than product detail page', done => {
      router.navigateByUrl('/any');

      effects.redirectIfErrorInProducts$.subscribe(fail, fail, fail);

      setTimeout(done, 1000);
    });
  });

  describe('redirectIfErrorInCategoryProducts$', () => {
    it('should redirect if triggered', fakeAsync(() => {
      const action = loadProductsForCategoryFail({
        categoryId: 'ID',
        error: makeHttpError({ status: 404 }),
      });

      actions$ = of(action);

      effects.redirectIfErrorInCategoryProducts$.subscribe(noop, fail, noop);

      tick(500);

      expect(location.path()).toEqual('/error');
    }));
  });

  describe('loadProductBundles$', () => {
    it('should load stubs and bundle reference when queried', done => {
      when(productsServiceMock.getProductBundles('ABC')).thenReturn(
        of({
          stubs: [{ sku: 'A' }, { sku: 'B' }],
          bundledProducts: [
            { sku: 'A', quantity: 1 },
            { sku: 'B', quantity: 1 },
          ],
        })
      );

      actions$ = of(loadProductSuccess({ product: { sku: 'ABC', type: 'Bundle' } as Product }));

      effects.loadProductBundles$.pipe(toArray()).subscribe(actions => {
        expect(actions).toMatchInlineSnapshot(`
          [Products API] Load Product Success:
            product: {"sku":"A"}
          [Products API] Load Product Success:
            product: {"sku":"B"}
          [Products API] Load Product Bundles Success:
            sku: "ABC"
            bundledProducts: [{"sku":"A","quantity":1},{"sku":"B","quantity":1}]
        `);
        done();
      });
    });
  });

  describe('loadRetailSetProductDetail$', () => {
    it('should trigger loading details if it is a retail set', done => {
      actions$ = of(
        loadProductSuccess({
          product: { sku: 'ABC', type: 'RetailSet' } as Product,
        })
      );

      effects.loadRetailSetProductDetail$.pipe(toArray()).subscribe(actions => {
        expect(actions).toMatchInlineSnapshot(`
          [Products Internal] Load Product if not Loaded:
            sku: "ABC"
            level: 3
        `);
        done();
      });
    });

    it('should do nothing if product is not a retail set', done => {
      actions$ = of(
        loadProductSuccess({
          product: { sku: 'ABC', type: 'Product' } as Product,
        })
      );

      effects.loadRetailSetProductDetail$.pipe(toArray()).subscribe(actions => {
        expect(actions).toMatchInlineSnapshot(`Array []`);
        done();
      });
    });
  });

  describe('loadPartsOfRetailSet$', () => {
    it('should load stubs and retail set reference when queried', done => {
      when(productsServiceMock.getRetailSetParts('ABC')).thenReturn(of([{ sku: 'A' }, { sku: 'B' }]));

      actions$ = of(loadProductSuccess({ product: { sku: 'ABC', type: 'RetailSet' } as Product }));

      effects.loadPartsOfRetailSet$.pipe(toArray()).subscribe(actions => {
        expect(actions).toMatchInlineSnapshot(`
          [Products API] Load Product Success:
            product: {"sku":"A"}
          [Products API] Load Product Success:
            product: {"sku":"B"}
          [Products API] Load Retail Set Success:
            sku: "ABC"
            parts: ["A","B"]
        `);
        done();
      });
    });
  });

  describe('loadProductLinks$', () => {
    it('should load product links reference when queried', () => {
      when(productsServiceMock.getProductLinks('ABC')).thenReturn(
        of({ linkType: { products: ['prod'], categories: [] } })
      );

      actions$ = hot('a', { a: loadProductLinks({ sku: 'ABC' }) });
      expect(effects.loadProductLinks$).toBeObservable(
        cold('(a)', {
          a: loadProductLinksSuccess({
            sku: 'ABC',
            links: { linkType: { products: ['prod'], categories: [] } },
          }),
        })
      );
    });

    it('should send fail action in case of failure for load product links', () => {
      when(productsServiceMock.getProductLinks('ABC')).thenReturn(throwError(makeHttpError({ message: 'ERROR' })));

      actions$ = hot('a', { a: loadProductLinks({ sku: 'ABC' }) });
      expect(effects.loadProductLinks$).toBeObservable(
        cold('(a)', {
          a: loadProductLinksFail({
            error: makeHttpError({ message: 'ERROR' }),
            sku: 'ABC',
          }),
        })
      );
    });
  });

  describe('loadLinkedCategories$', () => {
    it('should load category links reference when queried', () => {
      actions$ = hot('(a)', {
        a: loadProductLinksSuccess({
          sku: 'ABC',
          links: {
            linkType1: { products: [], categories: ['cat1', 'cat2'] },
            linkType2: { products: [], categories: ['cat1', 'cat3'] },
          },
        }),
      });
      expect(effects.loadLinkedCategories$).toBeObservable(
        cold('(abc)', {
          a: loadCategory({
            categoryId: 'cat1',
          }),
          b: loadCategory({
            categoryId: 'cat2',
          }),
          c: loadCategory({
            categoryId: 'cat3',
          }),
        })
      );
    });
  });

  describe('loadDefaultCategoryContextForProduct$', () => {
    it('should load a default category for the product if none is selected and product has one', done => {
      store$.dispatch(
        loadProductSuccess({
          product: { sku: 'ABC', type: 'Product', defaultCategoryId: '123' } as Product,
        })
      );

      router.navigateByUrl('/product/ABC');

      effects.loadDefaultCategoryContextForProduct$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Categories Internal] Load Category:
            categoryId: "123"
        `);
        done();
      });
    });

    it('should not load a default category for the product if none is selected and product has none', done => {
      store$.dispatch(
        loadProductSuccess({
          product: { sku: 'ABC', type: 'Product' } as Product,
        })
      );

      router.navigateByUrl('/product/ABC');

      effects.loadDefaultCategoryContextForProduct$.subscribe(fail, fail, fail);

      setTimeout(done, 1000);
    });

    it('should not load a default category for the product if the product failed loading', done => {
      store$.dispatch(
        loadProductFail({
          sku: 'ABC',
          error: makeHttpError({ error: 'ERROR' }),
        })
      );

      router.navigateByUrl('/product/ABC');

      effects.loadDefaultCategoryContextForProduct$.subscribe(fail, fail, fail);

      setTimeout(done, 1000);
    });

    it('should not load a default category for the product if the category is taken from the context', done => {
      store$.dispatch(
        loadProductSuccess({
          product: { sku: 'ABC', type: 'Product', defaultCategoryId: '123' } as Product,
        })
      );

      router.navigateByUrl('/category/456/product/ABC');

      effects.loadDefaultCategoryContextForProduct$.subscribe(fail, fail, fail);

      setTimeout(done, 1000);
    });
  });
});
