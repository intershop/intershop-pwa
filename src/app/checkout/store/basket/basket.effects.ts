import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { CoreState } from '../../../core/store/countries';
import { UserActionTypes } from '../../../core/store/user/user.actions';
import { BasketService } from '../../services/basket/basket.service';
import { CheckoutState } from '../checkout.state';
import { BasketActionTypes,  LoadBasket, LoadBasketFail, LoadBasketSuccess } from './basket.actions';

@Injectable()
export class BasketEffects {
  constructor(
    private actions$: Actions,
    private store: Store<CheckoutState | CoreState>,
    private basketService: BasketService
  ) { }

  /**
   * load basket effect
   */
  @Effect()
  loadBasket$ = this.actions$.pipe(
    ofType(BasketActionTypes.LoadBasket),
    map((action: LoadBasket) => action.payload),
    mergeMap(basketId => {
      return this.basketService.getBasket(basketId).pipe(
        map(basket => new LoadBasketSuccess(basket)),
        catchError(error => of(new LoadBasketFail(error)))
      );
    })
  );

  /**
   * triggers load basket effect after successful login
   */
  @Effect()
  loadBasketAfterLogin$ = this.actions$.pipe(
    ofType(UserActionTypes.LoginUserSuccess),
    map(() => new LoadBasket())
  );
}
