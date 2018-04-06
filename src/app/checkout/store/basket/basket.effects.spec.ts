import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, combineReducers, Store, StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { anyString, instance, mock, verify, when } from 'ts-mockito';
import { Basket } from '../../../models/basket/basket.model';
import { BasketService } from '../../services/basket/basket.service';
import { checkoutReducers } from '../checkout.system';
import { LoadBasket, LoadBasketFail, LoadBasketSuccess } from './basket.actions';
import { BasketEffects } from './basket.effects';
import { BasketState } from './basket.reducer';

describe('BasketEffects', () => {

  let actions$: Observable<Action>;
  let basketServiceMock: BasketService;
  let effects: BasketEffects;
  let store$: Store<BasketState>;

  beforeEach(() => {
    basketServiceMock = mock(BasketService);
    when(basketServiceMock.getBasket(anyString()))
      .thenCall((id: string) => {
        // TODO: provide a more meaningfull test implementation
        if (id === 'invalid') {
          return _throw({ message: 'invalid' } as HttpErrorResponse);
        } else {
          return of({ id: id } as Basket);
        }
      });

      TestBed.configureTestingModule({
        imports: [
          StoreModule.forRoot({
            checkout: combineReducers(checkoutReducers),
          }),
        ],
        providers: [
          BasketEffects,
          provideMockActions(() => actions$),
          { provide: BasketService, useFactory: () => instance(basketServiceMock) },
        ],
      });

      effects = TestBed.get(BasketEffects);
      store$ = TestBed.get(Store);
  });

  describe('loadBasket$', () => {

    it('should call the basketService for LoadBasket action', () => {
      const id = 'test';
      const action = new LoadBasket('test');
      actions$ = hot('-a', {a: 'test'});

      effects.loadBasket$.subscribe(() => {
        verify(basketServiceMock.getBasket('test')).once();
      });
    });

    it('should map to action of type LoadBasketSuccess', () => {
      const id = 'test';
      const action = new LoadBasket(id);
      const completion = new LoadBasketSuccess({ id: id } as Basket);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasket$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadBasketFail', () => {
      const id = 'invalid';
      const action = new LoadBasket(id);
      const completion = new LoadBasketFail({ message: 'invalid' } as HttpErrorResponse);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasket$).toBeObservable(expected$);
    });
  });
});
