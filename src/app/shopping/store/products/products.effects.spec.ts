import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { routerReducer } from '@ngrx/router-store';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { anyString, instance, mock, verify, when } from 'ts-mockito';
import { navigateMockAction } from '../../../dev-utils/navigate-mock.action';
import { TestActions, testActionsFactory } from '../../../dev-utils/test.actions';
import { Product } from '../../../models/product/product.model';
import { ProductsService } from '../../services/products/products.service';
import * as fromCategories from '../categories';
import { ShoppingState } from '../shopping.state';
import { reducers } from '../shopping.system';
import * as fromViewconf from '../viewconf';
import * as fromActions from './products.actions';
import { ProductsEffects } from './products.effects';

describe('ProductsEffects', () => {
  let actions$: TestActions;
  let effects: ProductsEffects;
  let store: Store<ShoppingState>;
  let productsServiceMock: ProductsService;

  beforeEach(() => {
    productsServiceMock = mock(ProductsService);
    when(productsServiceMock.getProduct(anyString()))
      .thenCall((sku: string) => {
        if (sku === 'invalid') {
          return _throw('');
        } else {
          console.log('sdfdsf ');
          return of({ sku } as Product);
        }
      });

    when(productsServiceMock.getProductSkuListForCategory('123', 'name-asc'))
      .thenCall(() => of({
        skus: ['P222', 'P333'],
        categoryUniqueId: '123',
        sortKeys: ['name-asc', 'name-desc']
      }));


    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          shopping: combineReducers(reducers),
          routerReducer
        }),
      ],
      providers: [
        ProductsEffects,
        { provide: Actions, useFactory: testActionsFactory },
        { provide: ProductsService, useFactory: () => instance(productsServiceMock) },
      ],
    });

    actions$ = TestBed.get(Actions);
    effects = TestBed.get(ProductsEffects);
    store = TestBed.get(Store);
  });

  describe('loadProduct$', () => {
    it('should call the productsService for LoadProduct action', () => {
      const sku = 'P123';
      const action = new fromActions.LoadProduct(sku);
      actions$.stream = hot('-a', { a: action });

      effects.loadProduct$.subscribe(() => {
        verify(productsServiceMock.getProduct(sku)).once();
      });
    });

    it('should map to action of type LoadProductSuccess', () => {
      const sku = 'P123';
      const action = new fromActions.LoadProduct(sku);
      const completion = new fromActions.LoadProductSuccess({ sku } as Product);
      actions$.stream = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadProduct$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadProductFail', () => {
      const sku = 'invalid';
      const action = new fromActions.LoadProduct(sku);
      const completion = new fromActions.LoadProductFail('');
      actions$.stream = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadProduct$).toBeObservable(expected$);
    });
  });

  describe('loadProductsForCategory$', () => {

    beforeEach(() => {
      store.dispatch(new fromViewconf.ChangeSortBy('name-asc'));

      actions$.stream = hot('a', {
        a: new fromActions.LoadProductsForCategory('123')
      });
    });

    it('should call service for SKU list', () => {
      effects.loadProductsForCategory$.subscribe(() => {
        verify(productsServiceMock.getProductSkuListForCategory('123', 'name-asc')).once();
      });
    });

    it('should trigger actions of type SetProductSkusForCategory, SetSortKeys and LoadProduct for each product in the list', () => {
      const expectedValues = {
        a: new fromCategories.SetProductSkusForCategory('123', ['P222', 'P333']),
        b: new fromViewconf.SetSortKeys(['name-asc', 'name-desc']),
        c: new fromActions.LoadProduct('P222'),
        d: new fromActions.LoadProduct('P333'),
      };
      expect(effects.loadProductsForCategory$)
        .toBeObservable(cold('(abcd)', expectedValues));
    });

  });



  describe('selectedProduct$', () => {
    it('should map to LoadProduct when product is selected', () => {
      const sku = 'P123';
      const categoryUniqueId = '123';

      // select product
      const routerAction = navigateMockAction({
        url: `/category/${categoryUniqueId}/product/${sku}`,
        params: { categoryUniqueId, sku }
      });
      store.dispatch(routerAction);

      const expectedValues = {
        a: new fromActions.LoadProduct(sku)
      };

      expect(effects.selectedProduct$).toBeObservable(cold('a', expectedValues));
    });
  });
});
