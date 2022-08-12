import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { BehaviorSubject, Observable, merge, noop, of, throwError } from 'rxjs';
import { delay, toArray } from 'rxjs/operators';
import { anyNumber, anyString, anything, capture, instance, mock, spy, verify, when } from 'ts-mockito';

import { ProductPriceDetails } from 'ish-core/models/product-prices/product-prices.model';
import { Product, VariationProductMaster } from 'ish-core/models/product/product.model';
import { ProductsService } from 'ish-core/services/products/products.service';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { personalizationStatusDetermined } from 'ish-core/store/customer/user/user.actions';
import { loadCategory } from 'ish-core/store/shopping/categories';
import { loadProductsForFilter } from 'ish-core/store/shopping/filter';
import { setProductListingPageSize } from 'ish-core/store/shopping/product-listing';
import { loadProductPricesSuccess } from 'ish-core/store/shopping/product-prices';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { HttpStatusCodeService } from 'ish-core/utils/http-status-code/http-status-code.service';

import {
  loadProduct,
  loadProductFail,
  loadProductLinks,
  loadProductLinksFail,
  loadProductLinksSuccess,
  loadProductParts,
  loadProductSuccess,
  loadProductVariationsFail,
  loadProductVariationsIfNotLoaded,
  loadProductsForCategory,
  loadProductsForCategoryFail,
} from './products.actions';
import { ProductsEffects } from './products.effects';

describe('Products Effects', () => {
  let actions$: Observable<Action>;
  let effects: ProductsEffects;
  let store: Store;
  let productsServiceMock: ProductsService;
  let router: Router;
  let httpStatusCodeService: HttpStatusCodeService;

  beforeEach(() => {
    productsServiceMock = mock(ProductsService);
    when(productsServiceMock.getProduct(anyString())).thenCall((sku: string) => {
      if (sku === 'invalid') {
        return throwError(() => makeHttpError({ message: 'invalid' }));
      } else {
        return of({ sku } as Product);
      }
    });

    when(productsServiceMock.getCategoryProducts('123', anyNumber(), anything(), anyNumber())).thenReturn(
      of({
        sortableAttributes: [{ name: 'name-asc' }, { name: 'name-desc' }],
        products: [{ sku: 'P222' }, { sku: 'P333' }] as Product[],
        total: 2,
      })
    );

    when(productsServiceMock.getFilteredProducts(anything(), anyNumber(), anything(), anyNumber())).thenCall(a => {
      if (a.name === 'invalid') {
        return throwError(() => makeHttpError({ message: 'invalid' }));
      } else {
        return of({
          total: 2,
          products: [{ sku: '123' }, { sku: '234' }],
        });
      }
    });

    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(['router', 'serverConfig']),
        RouterTestingModule.withRoutes([
          { path: 'category/:categoryUniqueId/product/:sku', children: [] },
          { path: 'product/:sku', children: [] },
          { path: '**', children: [] },
        ]),
        ShoppingStoreModule.forTesting('products', 'categories', 'productListing', 'productPrices'),
      ],
      providers: [
        { provide: ProductsService, useFactory: () => instance(productsServiceMock) },
        ProductsEffects,
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(ProductsEffects);
    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
    httpStatusCodeService = spy(TestBed.inject(HttpStatusCodeService));

    store.dispatch(setProductListingPageSize({ itemsPerPage: 9 }));
  });

  describe('loadProduct$', () => {
    const waitAction = personalizationStatusDetermined();
    it('should call the productsService for LoadProduct action', done => {
      const sku = 'P123';
      const action = loadProduct({ sku });
      actions$ = merge(of(personalizationStatusDetermined()), of(action));

      effects.loadProduct$.subscribe(() => {
        verify(productsServiceMock.getProduct(sku)).once();
        done();
      });
    });

    it('should map to action of type LoadProductSuccess', () => {
      const sku = 'P123';
      const action = loadProduct({ sku });
      const completion = loadProductSuccess({ product: { sku } as Product });
      actions$ = hot('b-a-a-a', { a: action, b: waitAction });
      const expected$ = cold('--c-c-c', { c: completion });

      expect(effects.loadProduct$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadProductFail - marbles', () => {
      const sku = 'invalid';
      const action = loadProduct({ sku });
      const completion = loadProductFail({ error: makeHttpError({ message: 'invalid' }), sku });
      actions$ = hot('b-a-a-a', { a: action, b: waitAction });
      const expected$ = cold('--c-c-c', { c: completion });

      expect(effects.loadProduct$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadProductFail - setTimeout', done => {
      actions$ = merge(
        of(personalizationStatusDetermined()),
        new BehaviorSubject(loadProduct({ sku: 'invalid' })),
        of(loadProduct({ sku: 'invalid' })).pipe(delay(1000)),
        of(loadProduct({ sku: 'invalid' })).pipe(delay(2000))
      );

      const actions: Action[] = [];

      effects.loadProduct$.subscribe({
        next: action => {
          actions.push(action);
        },
        error: fail,
        complete: () => fail('COMPLETED'),
      });

      setTimeout(() => {
        expect(actions).toHaveLength(1);
      }, 500);

      setTimeout(() => {
        expect(actions).toHaveLength(2);
      }, 1500);

      setTimeout(() => {
        expect(actions).toHaveLength(3);
      }, 2500);

      setTimeout(() => {
        expect(actions.every(a => a.type === loadProductFail.type));
        done();
      }, 3000);
    });

    it('should map invalid request to action of type LoadProductFail - fakeAsync', fakeAsync(() => {
      actions$ = merge(
        of(personalizationStatusDetermined()),
        new BehaviorSubject(loadProduct({ sku: 'invalid' })),
        of(loadProduct({ sku: 'invalid' })).pipe(delay(1000)),
        of(loadProduct({ sku: 'invalid' })).pipe(delay(2000))
      );

      const actions: Action[] = [];

      effects.loadProduct$.subscribe({
        next: action => {
          actions.push(action);
        },
        error: fail,
        complete: () => fail('COMPLETED'),
      });

      tick(500);
      expect(actions).toHaveLength(1);

      tick(1000);
      expect(actions).toHaveLength(2);

      tick(1000);
      expect(actions).toHaveLength(3);

      expect(actions.every(a => a.type === loadProductFail.type));
    }));
  });

  describe('loadProductsForCategory$', () => {
    it('should call service for SKU list', done => {
      actions$ = of(loadProductsForCategory({ categoryId: '123', sorting: 'name-asc' }));

      effects.loadProductsForCategory$.subscribe(() => {
        verify(productsServiceMock.getCategoryProducts('123', anyNumber(), 'name-asc', anyNumber())).once();
        done();
      });
    });

    it('should trigger actions for loading content for the product list', done => {
      actions$ = of(loadProductsForCategory({ categoryId: '123' }));

      effects.loadProductsForCategory$.pipe(toArray()).subscribe(actions => {
        expect(actions).toMatchInlineSnapshot(`
          [Products API] Load Product Success:
            product: {"sku":"P222"}
          [Products API] Load Product Success:
            product: {"sku":"P333"}
          [Product Listing Internal] Set Product Listing Pages:
            1: ["P222","P333"]
            id: {"type":"category","value":"123"}
            itemCount: 2
            sortableAttributes: [{"name":"name-asc"},{"name":"name-desc"}]
        `);
        done();
      });
    });

    it('should not die if repeating errors are encountered', () => {
      when(productsServiceMock.getCategoryProducts(anything(), anyNumber(), anything(), anyNumber())).thenReturn(
        throwError(() => makeHttpError({ message: 'ERROR' }))
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

  describe('loadFilteredProducts$', () => {
    it('should trigger product actions for ApplyFilterSuccess action', done => {
      const action = loadProductsForFilter({
        id: {
          type: 'search',
          value: 'test',
          filters: { searchTerm: ['b*'] },
        },
        searchParameter: { param: ['b'] },
      });

      actions$ = of(action);
      effects.loadFilteredProducts$.pipe(toArray()).subscribe(actions => {
        expect(actions).toMatchInlineSnapshot(`
          [Products API] Load Product Success:
            product: {"sku":"123"}
          [Products API] Load Product Success:
            product: {"sku":"234"}
          [Product Listing Internal] Set Product Listing Pages:
            1: ["123","234"]
            id: {"type":"search","value":"test","filters":{"searchTerm":[1]}}
            itemCount: 2
            sortableAttributes: []
        `);
        done();
      });
    });
  });

  describe('loadProductVariations$', () => {
    beforeEach(() => {
      when(productsServiceMock.getProductVariations(anyString())).thenReturn(
        of({ products: [{ sku: 'V1' }, { sku: 'V2' }], defaultVariation: 'V2', masterProduct: { sku: 'M' } })
      );
    });

    it('should call the products service for retrieving variations', done => {
      const action = loadProductVariationsIfNotLoaded({ sku: 'MasterSKU' });
      actions$ = of(action);

      effects.loadProductVariations$.subscribe(() => {
        verify(productsServiceMock.getProductVariations('MasterSKU')).once();
        done();
      });
    });

    it('should dispatch success action and product stubs of variations and master', done => {
      actions$ = of(loadProductVariationsIfNotLoaded({ sku: 'MasterSKU' }));

      effects.loadProductVariations$.pipe(toArray()).subscribe({
        next: actions => {
          expect(actions).toMatchInlineSnapshot(`
            [Products API] Load Product Success:
              product: {"sku":"V1"}
            [Products API] Load Product Success:
              product: {"sku":"V2"}
            [Products API] Load Product Success:
              product: {"sku":"M"}
            [Products API] Load Product Variations Success:
              sku: "MasterSKU"
              variations: ["V1","V2"]
              defaultVariation: "V2"
          `);
        },
        error: fail,
        complete: done,
      });
    });

    it('should map invalid request to action of type LoadProductVariationsFail', () => {
      when(productsServiceMock.getProductVariations(anyString())).thenReturn(
        throwError(() => makeHttpError({ message: 'invalid' }))
      );
      const action = loadProductVariationsIfNotLoaded({ sku: 'MasterSKU' });
      const completion = loadProductVariationsFail({
        error: makeHttpError({ message: 'invalid' }),
        sku: 'MasterSKU',
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadProductVariations$).toBeObservable(expected$);
    });
  });

  describe('loadProductVariationsForMasterOrVariationProduct$', () => {
    it('should trigger action if product load triggered for master product', () => {
      const action = loadProductSuccess({
        product: {
          sku: 'MasterSKU',
          type: 'VariationProductMaster',
        } as VariationProductMaster,
      });
      const completion = loadProductVariationsIfNotLoaded({ sku: 'MasterSKU' });
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-c', { c: completion });

      expect(effects.loadProductVariationsForMasterOrVariationProduct$).toBeObservable(expected$);
    });

    it('should trigger action if product load triggered for variation product', () => {
      const action = loadProductSuccess({
        product: {
          sku: 'MasterSKU',
          type: 'VariationProductMaster',
        } as VariationProductMaster,
      });
      const completion = loadProductVariationsIfNotLoaded({ sku: 'MasterSKU' });
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-c', { c: completion });

      expect(effects.loadProductVariationsForMasterOrVariationProduct$).toBeObservable(expected$);
    });

    it('should not trigger action if loaded product is standard product', () => {
      const action = loadProductSuccess({
        product: {
          sku: 'SKU',
          type: 'Product',
        } as Product,
      });
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-');

      expect(effects.loadProductVariationsForMasterOrVariationProduct$).toBeObservable(expected$);
    });
  });

  describe('redirectIfErrorInProducts$', () => {
    beforeEach(() => {
      actions$ = of(loadProductFail({ sku: 'SKU', error: makeHttpError({ status: 404 }) }));
    });

    it('should call error service if triggered on product detail page', done => {
      router.navigateByUrl('/product/SKU');
      effects.redirectIfErrorInProducts$.subscribe({
        next: () => {
          verify(httpStatusCodeService.setStatus(anything())).once();
          expect(capture(httpStatusCodeService.setStatus).last()).toMatchInlineSnapshot(`
            Array [
              404,
            ]
          `);
          done();
        },
        error: fail,
        complete: noop,
      });
    });

    it('should not call error service if triggered on page other than product detail page', fakeAsync(() => {
      router.navigateByUrl('/any');

      effects.redirectIfErrorInProducts$.subscribe({ next: fail, error: fail });

      tick(2000);

      verify(httpStatusCodeService.setStatus(anything())).never();
    }));
  });

  describe('redirectIfErrorInCategoryProducts$', () => {
    it('should call error service if triggered', done => {
      actions$ = of(
        loadProductsForCategoryFail({
          categoryId: 'ID',
          error: makeHttpError({ status: 404 }),
        })
      );

      effects.redirectIfErrorInCategoryProducts$.subscribe({
        next: () => {
          verify(httpStatusCodeService.setStatus(anything())).once();
          expect(capture(httpStatusCodeService.setStatus).last()).toMatchInlineSnapshot(`
                      Array [
                        404,
                      ]
                  `);
          done();
        },
        error: fail,
        complete: noop,
      });
    });
  });

  describe('loadProductParts$', () => {
    describe('with bundle', () => {
      beforeEach(() => {
        store.dispatch(loadProductSuccess({ product: { sku: 'ABC', type: 'Bundle' } as Product }));

        when(productsServiceMock.getProductBundles('ABC')).thenReturn(of({ stubs: [], bundledProducts: [] }));
      });

      it('should call the products service for loading bundle information', done => {
        const action = loadProductParts({ sku: 'ABC' });
        actions$ = of(action);

        effects.loadProductParts$.subscribe(() => {
          verify(productsServiceMock.getProductBundles(anything())).once();
          const [sku] = capture(productsServiceMock.getProductBundles).last();
          expect(sku).toMatchInlineSnapshot(`"ABC"`);
          done();
        });
      });

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

        actions$ = of(loadProductParts({ sku: 'ABC' }));

        effects.loadProductParts$.pipe(toArray()).subscribe(actions => {
          expect(actions).toMatchInlineSnapshot(`
            [Products API] Load Product Success:
              product: {"sku":"A"}
            [Products API] Load Product Success:
              product: {"sku":"B"}
            [Products API] Load Product Parts Success:
              sku: "ABC"
              parts: [{"sku":"A","quantity":1},{"sku":"B","quantity":1}]
          `);
          done();
        });
      });
    });

    describe('with retail set', () => {
      beforeEach(() => {
        store.dispatch(loadProductSuccess({ product: { sku: 'ABC', type: 'RetailSet' } as Product }));
      });

      it('should load stubs and retail set reference when queried', done => {
        when(productsServiceMock.getRetailSetParts('ABC')).thenReturn(of([{ sku: 'A' }, { sku: 'B' }]));

        actions$ = of(loadProductParts({ sku: 'ABC' }));

        effects.loadProductParts$.pipe(toArray()).subscribe(actions => {
          expect(actions).toMatchInlineSnapshot(`
            [Products API] Load Product Success:
              product: {"sku":"A"}
            [Products API] Load Product Success:
              product: {"sku":"B"}
            [Products API] Load Product Parts Success:
              sku: "ABC"
              parts: [{"sku":"A","quantity":1},{"sku":"B","quantity":1}]
          `);
          done();
        });
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
      when(productsServiceMock.getProductLinks('ABC')).thenReturn(
        throwError(() => makeHttpError({ message: 'ERROR' }))
      );

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
      store.dispatch(
        loadProductSuccess({
          product: { sku: 'ABC', type: 'Product', defaultCategoryId: '123' } as Product,
        })
      );

      store.dispatch(
        loadProductPricesSuccess({
          prices: [{ sku: 'ABC', prices: { salePrice: { currency: 'EUR', gross: 1 } } } as ProductPriceDetails],
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

    it('should not load a default category for the product if none is selected and product has none', fakeAsync(() => {
      store.dispatch(
        loadProductSuccess({
          product: { sku: 'ABC', type: 'Product' } as Product,
        })
      );

      router.navigateByUrl('/product/ABC');

      effects.loadDefaultCategoryContextForProduct$.subscribe({ next: fail, error: fail });

      tick(2000);
    }));

    it('should not load a default category for the product if the product failed loading', fakeAsync(() => {
      store.dispatch(
        loadProductFail({
          sku: 'ABC',
          error: makeHttpError({ message: 'ERROR' }),
        })
      );

      router.navigateByUrl('/product/ABC');

      effects.loadDefaultCategoryContextForProduct$.subscribe({ next: fail, error: fail });

      tick(2000);
    }));

    it('should not load a default category for the product if the category is taken from the context', fakeAsync(() => {
      store.dispatch(
        loadProductSuccess({
          product: { sku: 'ABC', type: 'Product', defaultCategoryId: '123' } as Product,
        })
      );

      router.navigateByUrl('/category/456/product/ABC');

      effects.loadDefaultCategoryContextForProduct$.subscribe({ next: fail, error: fail });

      tick(2000);
    }));
  });
});
