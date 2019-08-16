import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule, combineReducers } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { RouteNavigation } from 'ngrx-router';
import { Observable, noop, of, throwError } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { anyNumber, anyString, anything, instance, mock, resetCalls, spy, verify, when } from 'ts-mockito';

import { ENDLESS_SCROLLING_ITEMS_PER_PAGE } from '../../../configurations/injection-keys';
import { HttpError } from '../../../models/http-error/http-error.model';
import { VariationProductMaster } from '../../../models/product/product-variation-master.model';
import { VariationProduct } from '../../../models/product/product-variation.model';
import { Product } from '../../../models/product/product.model';
import { ProductsService } from '../../../services/products/products.service';
import { localeReducer } from '../../locale/locale.reducer';
import { LoadCategory } from '../categories';
import { shoppingReducers } from '../shopping-store.module';
import { ChangeSortBy, SetPage, SetPagingInfo, SetPagingLoading, SetSortKeys } from '../viewconf';

import * as fromActions from './products.actions';
import { ProductsEffects } from './products.effects';

describe('Products Effects', () => {
  let actions$: Observable<Action>;
  let effects: ProductsEffects;
  let store$: Store<{}>;
  let productsServiceMock: ProductsService;
  let router: Router;
  let location: Location;

  // tslint:disable-next-line:use-component-change-detection
  @Component({ template: 'dummy' })
  // tslint:disable-next-line:prefer-mocks-instead-of-stubs-in-tests
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

    when(productsServiceMock.getCategoryProducts('123', anyNumber(), anyNumber(), 'name-asc')).thenReturn(
      of({
        categoryUniqueId: '123',
        sortKeys: ['name-asc', 'name-desc'],
        products: [{ sku: 'P222' }, { sku: 'P333' }] as Product[],
        total: 2,
      })
    );

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        RouterTestingModule.withRoutes([{ path: 'error', component: DummyComponent }]),
        StoreModule.forRoot({
          shopping: combineReducers(shoppingReducers),
          locale: localeReducer,
        }),
      ],
      providers: [
        ProductsEffects,
        provideMockActions(() => actions$),
        { provide: ProductsService, useFactory: () => instance(productsServiceMock) },
        { provide: ENDLESS_SCROLLING_ITEMS_PER_PAGE, useValue: 3 },
      ],
    });

    effects = TestBed.get(ProductsEffects);
    store$ = TestBed.get(Store);
    router = spy(TestBed.get(Router));
    location = TestBed.get(Location);
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
    beforeEach(() => {
      store$.dispatch(new ChangeSortBy({ sorting: 'name-asc' }));
    });

    it('should call service for SKU list', done => {
      actions$ = of(new fromActions.LoadProductsForCategory({ categoryId: '123' }));

      effects.loadProductsForCategory$.subscribe(() => {
        verify(productsServiceMock.getCategoryProducts('123', anyNumber(), anyNumber(), 'name-asc')).once();
        done();
      });
    });

    it('should trigger actions of type SetProductSkusForCategory, SetSortKeys and LoadProductSuccess for each product in the list', () => {
      actions$ = hot('a', {
        a: new fromActions.LoadProductsForCategory({ categoryId: '123' }),
      });
      const expectedValues = {
        b: new fromActions.LoadProductSuccess({ product: { sku: 'P222' } as Product }),
        c: new fromActions.LoadProductSuccess({ product: { sku: 'P333' } as Product }),
        d: new SetPagingInfo({ currentPage: 0, totalItems: 2, newProducts: ['P222', 'P333'] }),
        e: new SetSortKeys({ sortKeys: ['name-asc', 'name-desc'] }),
      };
      expect(effects.loadProductsForCategory$).toBeObservable(cold('(bcde)', expectedValues));
    });

    it('should not die if repeating errors are encountered', () => {
      when(productsServiceMock.getCategoryProducts(anything(), anyNumber(), anyNumber(), anyString())).thenReturn(
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
      when(productsServiceMock.getProductVariations(anyString())).thenCall(() => of([]));
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
      const completion = new fromActions.LoadProductVariationsSuccess({ sku: 'MSKU', variations: [] });
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
      const completion = new fromActions.LoadProduct({ sku: 'MSKU' });
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
      store$.dispatch(new fromActions.LoadProductVariationsSuccess({ sku: 'MSKU', variations: ['VAR'] }));

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

  describe('loadMoreProductsForCategory$', () => {
    it('should trigger if more products are available', () => {
      actions$ = hot('a', {
        a: new fromActions.LoadMoreProductsForCategory({ categoryId: '123' }),
      });
      const expectedValues = {
        a: new SetPagingLoading(),
        b: new SetPage({ pageNumber: 1 }),
        c: new fromActions.LoadProductsForCategory({ categoryId: '123' }),
      };
      expect(effects.loadMoreProductsForCategory$).toBeObservable(cold('(abc)', expectedValues));
    });
  });

  describe('routeListenerForSelectingProducts$', () => {
    it('should fire SelectProduct when route /category/XXX/product/YYY is navigated', () => {
      const action = new RouteNavigation({
        path: 'category/:categoryUniqueId/product/:sku',
        params: { categoryUniqueId: 'dummy', sku: 'foobar' },
        queryParams: {},
      });
      const expected = new fromActions.SelectProduct({ sku: 'foobar' });

      actions$ = hot('a', { a: action });
      expect(effects.routeListenerForSelectingProducts$).toBeObservable(cold('a', { a: expected }));
    });

    it('should fire SelectProduct when route /product/YYY is navigated', () => {
      const action = new RouteNavigation({
        path: 'product/:sku',
        params: { sku: 'foobar' },
        queryParams: {},
      });
      const expected = new fromActions.SelectProduct({ sku: 'foobar' });

      actions$ = hot('a', { a: action });
      expect(effects.routeListenerForSelectingProducts$).toBeObservable(cold('a', { a: expected }));
    });

    it('should not fire SelectProduct when route /something is navigated', () => {
      const action = new RouteNavigation({ path: 'something', params: {}, queryParams: {} });

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
                              Array [
                                LoadProductSuccess {
                                  "payload": Object {
                                    "product": Object {
                                      "sku": "A",
                                    },
                                  },
                                  "type": "[Shopping] Load Product Success",
                                },
                                LoadProductSuccess {
                                  "payload": Object {
                                    "product": Object {
                                      "sku": "B",
                                    },
                                  },
                                  "type": "[Shopping] Load Product Success",
                                },
                                LoadProductBundlesSuccess {
                                  "payload": Object {
                                    "bundledProducts": Array [
                                      Object {
                                        "quantity": 1,
                                        "sku": "A",
                                      },
                                      Object {
                                        "quantity": 1,
                                        "sku": "B",
                                      },
                                    ],
                                    "sku": "ABC",
                                  },
                                  "type": "[Shopping] Load Product Bundles Success",
                                },
                              ]
                        `);
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
          Array [
            LoadProductSuccess {
              "payload": Object {
                "product": Object {
                  "sku": "A",
                },
              },
              "type": "[Shopping] Load Product Success",
            },
            LoadProductSuccess {
              "payload": Object {
                "product": Object {
                  "sku": "B",
                },
              },
              "type": "[Shopping] Load Product Success",
            },
            LoadRetailSetSuccess {
              "payload": Object {
                "parts": Array [
                  "A",
                  "B",
                ],
                "sku": "ABC",
              },
              "type": "[Shopping] Load Retail Set Success",
            },
          ]
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
