import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, combineReducers, Store, StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { RouteNavigation } from 'ngrx-router';
import { Observable, of, throwError } from 'rxjs';
import { anyString, anything, capture, instance, mock, verify, when } from 'ts-mockito';
import { SelectLocale, SetAvailableLocales } from '../../../core/store/locale';
import { localeReducer } from '../../../core/store/locale/locale.reducer';
import { Locale } from '../../../models/locale/locale.model';
import { Product } from '../../../models/product/product.model';
import { ProductsService } from '../../services/products/products.service';
import * as fromCategories from '../categories';
import { ShoppingState } from '../shopping.state';
import { shoppingReducers } from '../shopping.system';
import * as fromViewconf from '../viewconf';
import * as fromActions from './products.actions';
import { ProductsEffects } from './products.effects';

describe('Products Effects', () => {
  let actions$: Observable<Action>;
  let effects: ProductsEffects;
  let store$: Store<ShoppingState>;
  let productsServiceMock: ProductsService;
  const DE_DE = { lang: 'de' } as Locale;
  const EN_US = { lang: 'en' } as Locale;

  const router = mock(Router);

  beforeEach(() => {
    productsServiceMock = mock(ProductsService);
    when(productsServiceMock.getProduct(anyString())).thenCall((sku: string) => {
      if (sku === 'invalid') {
        return throwError({ message: 'invalid' } as HttpErrorResponse);
      } else {
        return of({ sku } as Product);
      }
    });

    when(productsServiceMock.getCategoryProducts('123', 'name-asc')).thenReturn(
      of({
        skus: ['P222', 'P333'],
        categoryUniqueId: '123',
        sortKeys: ['name-asc', 'name-desc'],
      })
    );

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          shopping: combineReducers(shoppingReducers),
          locale: localeReducer,
        }),
      ],
      providers: [
        ProductsEffects,
        provideMockActions(() => actions$),
        { provide: ProductsService, useFactory: () => instance(productsServiceMock) },
        { provide: Router, useFactory: () => instance(router) },
      ],
    });

    effects = TestBed.get(ProductsEffects);
    store$ = TestBed.get(Store);

    store$.dispatch(new SetAvailableLocales([DE_DE]));
  });

  describe('loadProduct$', () => {
    it('should call the productsService for LoadProduct action', done => {
      const sku = 'P123';
      const action = new fromActions.LoadProduct(sku);
      actions$ = of(action);

      effects.loadProduct$.subscribe(() => {
        verify(productsServiceMock.getProduct(sku)).once();
        done();
      });
    });

    it('should map to action of type LoadProductSuccess', () => {
      const sku = 'P123';
      const action = new fromActions.LoadProduct(sku);
      const completion = new fromActions.LoadProductSuccess({ sku } as Product);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadProduct$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadProductFail', () => {
      const sku = 'invalid';
      const action = new fromActions.LoadProduct(sku);
      const completion = new fromActions.LoadProductFail({ message: 'invalid' } as HttpErrorResponse);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadProduct$).toBeObservable(expected$);
    });
  });

  describe('loadProductsForCategory$', () => {
    beforeEach(() => {
      store$.dispatch(new fromViewconf.ChangeSortBy('name-asc'));
    });

    it('should call service for SKU list', done => {
      actions$ = of(new fromActions.LoadProductsForCategory('123'));

      effects.loadProductsForCategory$.subscribe(() => {
        verify(productsServiceMock.getCategoryProducts('123', 'name-asc')).once();
        done();
      });
    });

    it('should trigger actions of type SetProductSkusForCategory, SetSortKeys and LoadProduct for each product in the list', () => {
      actions$ = hot('a', {
        a: new fromActions.LoadProductsForCategory('123'),
      });
      const expectedValues = {
        a: new fromCategories.SetProductSkusForCategory({ categoryUniqueId: '123', skus: ['P222', 'P333'] }),
        b: new fromViewconf.SetSortKeys(['name-asc', 'name-desc']),
        c: new fromActions.LoadProduct('P222'),
        d: new fromActions.LoadProduct('P333'),
      };
      expect(effects.loadProductsForCategory$).toBeObservable(cold('(abcd)', expectedValues));
    });

    it('should not die if repeating errors are encountered', () => {
      const error = { status: 500 } as HttpErrorResponse;
      when(productsServiceMock.getCategoryProducts(anything(), anything())).thenReturn(throwError(error));
      actions$ = hot('-a-a-a', {
        a: new fromActions.LoadProductsForCategory('123'),
      });
      expect(effects.loadProductsForCategory$).toBeObservable(
        cold('-a-a-a', { a: new fromActions.LoadProductFail(error) })
      );
    });
  });

  describe('routeListenerForSelectingProducts$', () => {
    it('should fire SelectProduct when route /category/XXX/product/YYY is navigated', () => {
      const action = new RouteNavigation({
        path: 'category/:categoryUniqueId/product/:sku',
        params: { categoryUniqueId: 'dummy', sku: 'foobar' },
        queryParams: {},
      });
      const expected = new fromActions.SelectProduct('foobar');

      actions$ = hot('a', { a: action });
      expect(effects.routeListenerForSelectingProducts$).toBeObservable(cold('a', { a: expected }));
    });

    it('should fire SelectProduct when route /product/YYY is navigated', () => {
      const action = new RouteNavigation({
        path: 'product/:sku',
        params: { sku: 'foobar' },
        queryParams: {},
      });
      const expected = new fromActions.SelectProduct('foobar');

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
      actions$ = hot('a', { a: new fromActions.SelectProduct(sku) });
      expect(effects.selectedProduct$).toBeObservable(cold('a', { a: new fromActions.LoadProduct(sku) }));
    });

    it('should fire LoadProduct when product is undefined', () => {
      actions$ = hot('a', { a: new fromActions.SelectProduct(undefined) });
      expect(effects.selectedProduct$).toBeObservable(cold('-'));
    });
  });

  describe('languageChange$', () => {
    it('should refetch product when language is changed distinctly ignoring the first time', () => {
      const sku = 'P123';

      store$.dispatch(new fromActions.SelectProduct(sku));
      actions$ = hot('-a--b--b--a', { a: new SelectLocale(DE_DE), b: new SelectLocale(EN_US) });

      expect(effects.languageChange$).toBeObservable(cold('----a-----a', { a: new fromActions.LoadProduct(sku) }));
    });
  });

  describe('redirectIfErrorInProducts$', () => {
    it('should redirect if triggered', done => {
      const action = new fromActions.LoadProductFail({ status: 404 } as HttpErrorResponse);

      actions$ = of(action);

      effects.redirectIfErrorInProducts$.subscribe(() => {
        verify(router.navigate(anything())).once();
        const [param] = capture(router.navigate).last();
        expect(param).toEqual(['/error']);
        done();
      });
    });
  });
});
