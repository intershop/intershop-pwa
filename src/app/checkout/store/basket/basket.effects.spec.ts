import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { anyNumber, anyString, anything, instance, mock, verify, when } from 'ts-mockito';
import { Basket } from '../../../models/basket/basket.model';
import { BasketService } from '../../services/basket/basket.service';
import { CheckoutState } from '../checkout.state';
import * as basketActions from './basket.actions';
import { BasketEffects } from './basket.effects';

describe('BasketEffects', () => {

  let actions$: Observable<Action>;
  let basketServiceMock: BasketService;
  let effects: BasketEffects;
  let storeMock$: Store<CheckoutState>;

  beforeEach(() => {
    basketServiceMock = mock(BasketService);
    storeMock$ = mock(Store);

    when(basketServiceMock.getBasket(anyString()))
      .thenCall((id: string) => {
        // TODO: provide a more meaningfull test implementation
        if (id === 'invalid') {
          return _throw({ message: 'invalid' } as HttpErrorResponse);
        } else {
          return of({ id: id } as Basket);
        }
      });

    when(basketServiceMock.addItemToBasket(anyString(), anyNumber(), anyString()))
      .thenCall((sku: string, quantity: number, basketId: string) => {
        // TODO: provide a more meaningfull test implementation
        if (sku === 'invalid') {
          return _throw({ message: 'invalid' } as HttpErrorResponse);
        } else {
          return of({});
        }
      });

    when(storeMock$.pipe(anything())).thenCall(selector => {
      return selector(of({
        checkout: {
          basket: {
            basket: {
              id: 'test'
            }
          }
        }
      }));
    });

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        BasketEffects,
        provideMockActions(() => actions$),
        { provide: BasketService, useFactory: () => instance(basketServiceMock) },
        { provide: Store, useFactory: () => instance(storeMock$) }
      ],
    });

    effects = TestBed.get(BasketEffects);
  });

  describe('loadBasket$', () => {

    it('should call the basketService for LoadBasket action', () => {
      const id = 'test';
      const action = new basketActions.LoadBasket(id);
      actions$ = hot('-a', { a: action });

      effects.loadBasket$.subscribe(() => {
        verify(basketServiceMock.getBasket(id)).once();
      });
    });

    it('should map to action of type LoadBasketSuccess', () => {
      const id = 'test';
      const action = new basketActions.LoadBasket(id);
      const completion = new basketActions.LoadBasketSuccess({ id: id } as Basket);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasket$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadBasketFail', () => {
      const id = 'invalid';
      const action = new basketActions.LoadBasket(id);
      const completion = new basketActions.LoadBasketFail({ message: 'invalid' } as HttpErrorResponse);
      // TODO: fix me
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-c', { c: completion });

      expect(effects.loadBasket$).toBeObservable(expected$);
    });
  });

  describe('addItemToBasket$', () => {

    it('should call the basketService for AddItemToBasket action', () => {
      const payload = { sku: 'test', quantity: 1 };
      const action = new basketActions.AddItemToBasket({ sku: 'test', quantity: 1 });
      actions$ = hot('-a', { a: action });

      effects.addItemToBasket$.subscribe(() => {
        verify(basketServiceMock.addItemToBasket(payload.sku, payload.quantity, 'test')).once();
      });
    });

    it('should map to action of type AddItemToBasketSuccess', () => {
      const payload = { sku: 'test', quantity: 1 };
      const action = new basketActions.AddItemToBasket(payload);
      const completion = new basketActions.AddItemToBasketSuccess({});
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addItemToBasket$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type AddItemToBasketFail', () => {
      const payload = { sku: 'invalid', quantity: 1 };
      const action = new basketActions.AddItemToBasket(payload);
      const completion = new basketActions.AddItemToBasketFail({ message: 'invalid' } as HttpErrorResponse);
      // TODO: fix me
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addItemToBasket$).toBeObservable(expected$);
    });
  });

});
