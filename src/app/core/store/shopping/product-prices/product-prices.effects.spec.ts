import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import { anything, capture, instance, mock, when } from 'ts-mockito';

import { ProductPriceDetails } from 'ish-core/models/product-prices/product-prices.model';
import { PricesService } from 'ish-core/services/prices/prices.service';

import { loadProductPrices, loadProductPricesSuccess } from '.';
import { ProductPricesEffects } from './product-prices.effects';

describe('Product Prices Effects', () => {
  let actions$: Observable<Action>;
  let effects: ProductPricesEffects;
  let pricesServiceMock: PricesService;

  beforeEach(() => {
    pricesServiceMock = mock(PricesService);
    when(pricesServiceMock.getProductPrices(anything())).thenCall((skus: string[]) => of(skus.map(sku => ({ sku }))));

    TestBed.configureTestingModule({
      providers: [
        { provide: PricesService, useFactory: () => instance(pricesServiceMock) },
        ProductPricesEffects,
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(ProductPricesEffects);
  });

  describe('loadProductPrices$', () => {
    it('should call the getProductPrices service with skus for loadProductPrices action', done => {
      const skus = ['P123'];
      const action = loadProductPrices({ skus });
      actions$ = of(action);

      effects.loadProductPrices$.subscribe(() => {
        const [skus, customerId] = capture(pricesServiceMock.getProductPrices).last();
        expect(skus).toEqual(skus);
        expect(customerId).toBeUndefined();
        done();
      });
    });

    it('should map multiple actions to type LoadProductSuccess', () => {
      const action1 = loadProductPrices({ skus: ['a', 'b'] });
      const action2 = loadProductPrices({ skus: ['b', 'c'] });
      const action3 = loadProductPrices({ skus: ['a', 'c', 'd'] });

      const completion = loadProductPricesSuccess({
        prices: [
          { sku: 'a' } as ProductPriceDetails,
          { sku: 'b' } as ProductPriceDetails,
          { sku: 'c' } as ProductPriceDetails,
          { sku: 'd' } as ProductPriceDetails,
        ],
      });
      actions$ = hot('        -a-b-a-c--|', { a: action1, b: action2, c: action3 });
      const expected$ = cold('----------(c|)', { c: completion });

      expect(effects.loadProductPrices$).toBeObservable(expected$);
    });
  });
});
