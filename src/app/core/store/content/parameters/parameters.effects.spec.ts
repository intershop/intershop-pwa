import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { Product } from 'ish-core/models/product/product.model';
import { ProductsService } from 'ish-core/services/products/products.service';
import { loadProductSuccess } from 'ish-core/store/shopping/products';
import { URLFormParams } from 'ish-core/utils/url-form-params';

import { loadParametersProductListFilter, loadParametersProductListFilterSuccess } from './parameters.actions';
import { ParametersEffects } from './parameters.effects';

describe('Parameters Effects', () => {
  let actions$: Observable<Action>;
  let effects: ParametersEffects;
  let productsServiceMock: ProductsService;

  beforeEach(() => {
    productsServiceMock = mock(ProductsService);
    TestBed.configureTestingModule({
      providers: [
        { provide: ProductsService, useFactory: () => instance(productsServiceMock) },
        ParametersEffects,
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(ParametersEffects);
  });

  describe('loadParameters$', () => {
    it('should dispatch multiple actions when getFilteredProducts service is succesful', () => {
      when(productsServiceMock.getFilteredProducts(anything(), anything())).thenReturn(
        of({ total: 1, products: [{ name: 'test', sku: 'sku' } as Product], sortableAttributes: [] })
      );
      const action = loadParametersProductListFilter({
        id: 'id',
        searchParameter: {} as URLFormParams,
      });
      actions$ = hot('-a----a----a', { a: action });

      const loadProductSuccessAction = loadProductSuccess({ product: { name: 'test', sku: 'sku' } as Product });
      const loadParametersProductListFilterSuccessAction = loadParametersProductListFilterSuccess({
        id: 'id',
        productList: ['sku'],
      });
      const expected$ = cold('-(bc)-(bc)-(bc)', {
        b: loadProductSuccessAction,
        c: loadParametersProductListFilterSuccessAction,
      });

      expect(effects.loadParametersProductListFilter$).toBeObservable(expected$);
    });
  });
});
