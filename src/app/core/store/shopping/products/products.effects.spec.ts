import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, combineReducers } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { RouteNavigation } from 'ngrx-router';
import { Observable, noop, of, throwError } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { anyNumber, anyString, anything, instance, mock, resetCalls, spy, verify, when } from 'ts-mockito';

import { PRODUCT_LISTING_ITEMS_PER_PAGE } from 'ish-core/configurations/injection-keys';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { VariationProductMaster } from 'ish-core/models/product/product-variation-master.model';
import { VariationProduct } from 'ish-core/models/product/product-variation.model';
import { Product, ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { ProductsService } from 'ish-core/services/products/products.service';
import { localeReducer } from 'ish-core/store/locale/locale.reducer';
import { LoadCategory } from 'ish-core/store/shopping/categories';
import { SetProductListingPageSize, SetProductListingPages } from 'ish-core/store/shopping/product-listing';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import * as fromActions from './products.actions';
import { ProductsEffects } from './products.effects';

describe('Products Effects', () => {
  let actions$: Observable<Action>;
  let effects: ProductsEffects;
  let store$: Store<{}>;
  let productsServiceMock: ProductsService;
  let router: Router;
  let location: Location;

  @Component({ template: 'dummy' })
  class DummyComponent {}

  beforeEach(() => {
    productsServiceMock = mock(ProductsService);
    when(productsServiceMock.getProduct(anyString())).thenCall((sku: string) => {
      if (sku === 'invalid') {
        return throwError({ message: 'invalid' });
      } else {
        return of({ sku } as Product);
      }
    });

    when(productsServiceMock.getProductBundles(anything())).thenCall((sku: string) => {
      if (!sku) {
        return throwError({ message: 'invalid' });
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
        RouterTestingModule.withRoutes([{ path: 'error', component: DummyComponent }]),
        ngrxTesting({
          reducers: {
            shopping: combineReducers(shoppingReducers),
            locale: localeReducer,
          },
        }),
      ],
      providers: [
        ProductsEffects,
        provideMockActions(() => actions$),
        { provide: ProductsService, useFactory: () => instance(productsServiceMock) },
        { provide: PRODUCT_LISTING_ITEMS_PER_PAGE, useValue: 3 },
      ],
    });

    effects = TestBed.get(ProductsEffects);
    store$ = TestBed.get(Store);
    router = spy(TestBed.get(Router));
    location = TestBed.get(Location);
    store$.dispatch(new SetProductListingPageSize({ itemsPerPage: TestBed.get(PRODUCT_LISTING_ITEMS_PER_PAGE) }));
  });

  describe('loadProductBundles$', () => {
    it('should call the productsService for LoadProductBundles action', done => {
      const sku = 'P123';
      const action = new fromActions.LoadProductSuccess({ product: { sku, type: 'Bundle' } as Product });
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
      const action = new fromActions.LoadProduct({ sku });
      actions$ = of(action);

      effects.loadProduct$.subscribe(() => {
        verify(productsServiceMock.getProduct(sku)).once();
        done();
      });
    });

    it('should map to action of type LoadProductSuccess', () => {
      const sku = 'P123';
      const action = new fromActions.LoadProduct({ sku });
      const completion = new fromActions.LoadProductSuccess({ product: { sku } as Product });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadProduct$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadProductFail', () => {
      const sku = 'invalid';
      const action = new fromActions.LoadProduct({ sku });
      const completion = new fromActions.LoadProductFail({ error: { message: 'invalid' } as HttpError, sku });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadProduct$).toBeObservable(expected$);
    });
  });

  describe('loadProductsForCategory$', () => {
    it('should call service for SKU list', done => {
      actions$ = of(new fromActions.LoadProductsForCategory({ categoryId: '123', sorting: 'name-asc' }));

      effects.loadProductsForCategory$.subscribe(() => {
        verify(productsServiceMock.getCategoryProducts('123', anyNumber(), 'name-asc')).once();
        done();
      });
    });

    it('should trigger actions for loading content for the product list', () => {
      actions$ = hot('a', {
        a: new fromActions.LoadProductsForCategory({ categoryId: '123' }),
      });
      const expectedValues = {
        b: new fromActions.LoadProductSuccess({ product: { sku: 'P222' } as Product }),
        c: new fromActions.LoadProductSuccess({ product: { sku: 'P333' } as Product }),
        d: new SetProductListingPages({
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
        throwError({ message: 'ERROR' })
      );
      actions$ = hot('-a-a-a', {
        a: new fromActions.LoadProductsForCategory({ categoryId: '123' }),
      });
      expect(effects.loadProductsForCategory$).toBeObservable(
        cold('-a-a-a', {
          a: new fromActions.LoadProductsForCategoryFail({
            error: { message: 'ERROR' } as HttpError,
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
      const action = new fromActions.LoadProductVariations({ sku: 'MSKU' });
      actions$ = of(action);

      effects.loadProductVariations$.subscribe(() => {
        verify(productsServiceMock.getProductVariations('MSKU')).once();
        done();
      });
    });

    it('should map to action of type LoadProductVariationsSuccess', () => {
      const action = new fromActions.LoadProductVariations({ sku: 'MSKU' });
      const completion = new fromActions.LoadProductVariationsSuccess({
        sku: 'MSKU',
        variations: [],
        defaultVariation: undefined,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadProductVariations$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadProductVariationsFail', () => {
      when(productsServiceMock.getProductVariations(anyString())).thenCall(() => throwError({ message: 'invalid' }));
      const action = new fromActions.LoadProductVariations({ sku: 'MSKU' });
      const completion = new fromActions.LoadProductVariationsFail({
        error: { message: 'invalid' } as HttpError,
        sku: 'MSKU',
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadProductVariations$).toBeObservable(expected$);
    });
  });

  describe('loadMasterProductForProduct$', () => {
    it('should trigger LoadProduct action if LoadProductSuccess contains productMasterSKU', () => {
      const action = new fromActions.LoadProductSuccess({
        product: {
          productMasterSKU: 'MSKU',
          type: 'VariationProduct',
        } as VariationProduct,
      });
      const completion = new fromActions.LoadProductIfNotLoaded({ sku: 'MSKU', level: ProductCompletenessLevel.List });
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-c', { c: completion });

      expect(effects.loadMasterProductForProduct$).toBeObservable(expected$);
    });

    it('should not trigger LoadProduct action if LoadProductSuccess contains productMasterSKU of loaded product', () => {
      store$.dispatch(new fromActions.LoadProductSuccess({ product: { sku: 'MSKU' } as Product }));

      const action = new fromActions.LoadProductSuccess({
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
      const action = new fromActions.LoadProductSuccess({
        product: {
          sku: 'MSKU',
          type: 'VariationProductMaster',
        } as VariationProductMaster,
      });
      const completion = new fromActions.LoadProductVariations({ sku: 'MSKU' });
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-c', { c: completion });

      expect(effects.loadProductVariationsForMasterProduct$).toBeObservable(expected$);
    });

    it('should not trigger LoadProductVariations action if loaded product variations present', () => {
      const product = {
        sku: 'MSKU',
        type: 'VariationProductMaster',
      } as VariationProductMaster;

      store$.dispatch(new fromActions.LoadProductSuccess({ product }));
      store$.dispatch(
        new fromActions.LoadProductVariationsSuccess({ sku: 'MSKU', variations: ['VAR'], defaultVariation: 'VAR' })
      );

      const action = new fromActions.LoadProductSuccess({ product });
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-');

      expect(effects.loadProductVariationsForMasterProduct$).toBeObservable(expected$);
    });

    it('should not trigger LoadProductVariants action if loaded product is not of type VariationProductMaster.', () => {
      const action = new fromActions.LoadProductSuccess({
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

  describe('routeListenerForSelectingProducts$', () => {
    it('should fire SelectProduct when route /category/XXX/product/YYY is navigated', () => {
      const action = new RouteNavigation({
        path: 'category/:categoryUniqueId/product/:sku',
        params: { categoryUniqueId: 'dummy', sku: 'foobar' },
      });
      const expected = new fromActions.SelectProduct({ sku: 'foobar' });

      actions$ = hot('a', { a: action });
      expect(effects.routeListenerForSelectingProducts$).toBeObservable(cold('a', { a: expected }));
    });

    it('should fire SelectProduct when route /product/YYY is navigated', () => {
      const action = new RouteNavigation({
        path: 'product/:sku',
        params: { sku: 'foobar' },
      });
      const expected = new fromActions.SelectProduct({ sku: 'foobar' });

      actions$ = hot('a', { a: action });
      expect(effects.routeListenerForSelectingProducts$).toBeObservable(cold('a', { a: expected }));
    });

    it('should not fire SelectProduct when route /something is navigated', () => {
      const action = new RouteNavigation({ path: 'something' });

      actions$ = hot('a', { a: action });
      expect(effects.routeListenerForSelectingProducts$).toBeObservable(cold('-'));
    });
  });

  describe('selectedProduct$', () => {
    it('should map to LoadProduct when product is selected', () => {
      const sku = 'P123';
      actions$ = hot('a', { a: new fromActions.SelectProduct({ sku }) });
      expect(effects.selectedProduct$).toBeObservable(cold('a', { a: new fromActions.LoadProduct({ sku }) }));
    });

    it('should fire LoadProduct when product is undefined', () => {
      actions$ = hot('a', { a: new fromActions.SelectProduct({ sku: undefined }) });
      expect(effects.selectedProduct$).toBeObservable(cold('-'));
    });
  });

  describe('redirectIfErrorInProducts$', () => {
    it('should redirect if triggered on product detail page', fakeAsync(() => {
      when(router.url).thenReturn('/category/A/product/SKU');

      const action = new fromActions.LoadProductFail({ sku: 'SKU', error: { status: 404 } as HttpError });

      actions$ = of(action);

      effects.redirectIfErrorInProducts$.subscribe(noop, fail, noop);

      tick(500);

      expect(location.path()).toEqual('/error');
    }));

    it('should not redirect if triggered on page other than product detail page', done => {
      when(router.url).thenReturn('/search/term');

      const action = new fromActions.LoadProductFail({ sku: 'SKU', error: { status: 404 } as HttpError });

      actions$ = of(action);

      effects.redirectIfErrorInProducts$.subscribe(fail, fail, done);
    });
  });

  describe('redirectIfErrorInCategoryProducts$', () => {
    it('should redirect if triggered', fakeAsync(() => {
      resetCalls(router);

      const action = new fromActions.LoadProductsForCategoryFail({
        categoryId: 'ID',
        error: { status: 404 } as HttpError,
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
          bundledProducts: [{ sku: 'A', quantity: 1 }, { sku: 'B', quantity: 1 }],
        })
      );

      actions$ = of(new fromActions.LoadProductSuccess({ product: { sku: 'ABC', type: 'Bundle' } as Product }));

      effects.loadProductBundles$.pipe(toArray()).subscribe(actions => {
        expect(actions).toMatchInlineSnapshot(`
          [Shopping] Load Product Success:
            product: {"sku":"A"}
          [Shopping] Load Product Success:
            product: {"sku":"B"}
          [Shopping] Load Product Bundles Success:
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
        new fromActions.LoadProductSuccess({
          product: { sku: 'ABC', type: 'RetailSet' } as Product,
        })
      );

      effects.loadRetailSetProductDetail$.pipe(toArray()).subscribe(actions => {
        expect(actions).toMatchInlineSnapshot(`
          [Shopping] Load Product if not Loaded:
            sku: "ABC"
            level: 3
        `);
        done();
      });
    });

    it('should do nothing if product is not a retail set', done => {
      actions$ = of(
        new fromActions.LoadProductSuccess({
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

      actions$ = of(new fromActions.LoadProductSuccess({ product: { sku: 'ABC', type: 'RetailSet' } as Product }));

      effects.loadPartsOfRetailSet$.pipe(toArray()).subscribe(actions => {
        expect(actions).toMatchInlineSnapshot(`
          [Shopping] Load Product Success:
            product: {"sku":"A"}
          [Shopping] Load Product Success:
            product: {"sku":"B"}
          [Shopping] Load Retail Set Success:
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

      actions$ = hot('a', { a: new fromActions.LoadProductLinks({ sku: 'ABC' }) });
      expect(effects.loadProductLinks$).toBeObservable(
        cold('(a)', {
          a: new fromActions.LoadProductLinksSuccess({
            sku: 'ABC',
            links: { linkType: { products: ['prod'], categories: [] } },
          }),
        })
      );
    });

    it('should send fail action in case of failure for load product links', () => {
      when(productsServiceMock.getProductLinks('ABC')).thenReturn(throwError({ message: 'ERROR' }));

      actions$ = hot('a', { a: new fromActions.LoadProductLinks({ sku: 'ABC' }) });
      expect(effects.loadProductLinks$).toBeObservable(
        cold('(a)', {
          a: new fromActions.LoadProductLinksFail({
            error: { message: 'ERROR' } as HttpError,
            sku: 'ABC',
          }),
        })
      );
    });
  });

  describe('loadLinkedCategories$', () => {
    it('should load category links reference when queried', () => {
      actions$ = hot('(a)', {
        a: new fromActions.LoadProductLinksSuccess({
          sku: 'ABC',
          links: {
            linkType1: { products: [], categories: ['cat1', 'cat2'] },
            linkType2: { products: [], categories: ['cat1', 'cat3'] },
          },
        }),
      });
      expect(effects.loadLinkedCategories$).toBeObservable(
        cold('(abc)', {
          a: new LoadCategory({
            categoryId: 'cat1',
          }),
          b: new LoadCategory({
            categoryId: 'cat2',
          }),
          c: new LoadCategory({
            categoryId: 'cat3',
          }),
        })
      );
    });
  });
});
