import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { routerReducer } from '@ngrx/router-store';
import { Action, combineReducers, Store, StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { anyString, instance, mock, verify, when } from 'ts-mockito';
import { AVAILABLE_LOCALES } from '../../../core/configurations/injection-keys';
import { SelectLocale, SetAvailableLocales } from '../../../core/store/locale';
import { localeReducer } from '../../../core/store/locale/locale.reducer';
import { Locale } from '../../../models/locale/locale.model';
import { Product } from '../../../models/product/product.model';
import { navigateMockAction } from '../../../utils/dev/navigate-mock.action';
import { ProductsService } from '../../services/products/products.service';
import * as fromCategories from '../categories';
import { ShoppingState } from '../shopping.state';
import { shoppingReducers } from '../shopping.system';
import * as fromViewconf from '../viewconf';
import * as fromActions from './products.actions';
import { ProductsEffects } from './products.effects';

describe('ProductsEffects', () => {
  let actions$: Observable<Action>;
  let effects: ProductsEffects;
  let store$: Store<ShoppingState>;
  let productsServiceMock: ProductsService;
  let DE_DE: Locale;

  beforeEach(() => {
    productsServiceMock = mock(ProductsService);
    when(productsServiceMock.getProduct(anyString())).thenCall((sku: string) => {
      if (sku === 'invalid') {
        return _throw({ message: 'invalid' } as HttpErrorResponse);
      } else {
        return of({ sku } as Product);
      }
    });

    when(productsServiceMock.getCategoryProducts('123', 'name-asc')).thenCall(() =>
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
          routerReducer,
          locale: localeReducer,
        }),
      ],
      providers: [
        ProductsEffects,
        provideMockActions(() => actions$),
        { provide: ProductsService, useFactory: () => instance(productsServiceMock) },
      ],
    });

    effects = TestBed.get(ProductsEffects);
    store$ = TestBed.get(Store);

    const locales: Locale[] = TestBed.get(AVAILABLE_LOCALES);
    store$.dispatch(new SetAvailableLocales(locales));
    DE_DE = locales.find(v => v.lang.startsWith('de'));
  });

  describe('loadProduct$', () => {
    it('should call the productsService for LoadProduct action', () => {
      const sku = 'P123';
      const action = new fromActions.LoadProduct(sku);
      actions$ = hot('-a', { a: action });

      effects.loadProduct$.subscribe(() => {
        verify(productsServiceMock.getProduct(sku)).once();
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

      actions$ = hot('a', {
        a: new fromActions.LoadProductsForCategory('123'),
      });
    });

    it('should call service for SKU list', () => {
      effects.loadProductsForCategory$.subscribe(() => {
        verify(productsServiceMock.getCategoryProducts('123', 'name-asc')).once();
      });
    });

    it('should trigger actions of type SetProductSkusForCategory, SetSortKeys and LoadProduct for each product in the list', () => {
      const expectedValues = {
        a: new fromCategories.SetProductSkusForCategory('123', ['P222', 'P333']),
        b: new fromViewconf.SetSortKeys(['name-asc', 'name-desc']),
        c: new fromActions.LoadProduct('P222'),
        d: new fromActions.LoadProduct('P333'),
      };
      expect(effects.loadProductsForCategory$).toBeObservable(cold('(abcd)', expectedValues));
    });
  });

  describe('selectedProduct$', () => {
    it('should map to LoadProduct when product is selected', () => {
      const sku = 'P123';
      const categoryUniqueId = '123';

      // select product
      const routerAction = navigateMockAction({
        url: `/category/${categoryUniqueId}/product/${sku}`,
        params: { categoryUniqueId, sku },
      });
      store$.dispatch(routerAction);

      const expectedValues = {
        a: new fromActions.LoadProduct(sku),
      };

      expect(effects.selectedProduct$).toBeObservable(cold('a', expectedValues));
    });
  });

  describe('languageChange$', () => {
    it('should refetch product when language is changed', () => {
      const sku = 'P123';
      const categoryUniqueId = '123';

      // select product
      const routerAction = navigateMockAction({
        url: `/category/${categoryUniqueId}/product/${sku}`,
        params: { categoryUniqueId, sku },
      });
      store$.dispatch(routerAction);
      store$.dispatch(new SelectLocale(DE_DE));

      const expectedValues = {
        a: new fromActions.LoadProduct(sku),
      };

      expect(effects.languageChange$).toBeObservable(cold('a', expectedValues));
    });
  });
});
