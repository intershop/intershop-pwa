import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { catchError, concatMap, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { CoreState } from '../../../core/store/countries';
import { UserActionTypes } from '../../../core/store/user/user.actions';
import { BasketService } from '../../services/basket/basket.service';
import { CheckoutState } from '../checkout.state';
import * as basketActions from './basket.actions';
import { getCurrentBasket } from './basket.selectors';

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
    ofType(basketActions.BasketActionTypes.LoadBasket),
    map((action: basketActions.LoadBasket) => action.payload),
    mergeMap(basketId => {
      return this.basketService.getBasket(basketId).pipe(
        map(basket => new basketActions.LoadBasketSuccess(basket)),
        catchError(error => of(new basketActions.LoadBasketFail(error))),
      );
    })
  );

  /**
   * triggers load basket effect after successful login
   */
  @Effect()
  loadBasketAfterLogin$ = this.actions$.pipe(
    ofType(UserActionTypes.LoginUserSuccess),
    map(() => new basketActions.LoadBasket())
  );

  /**
   * add product to cart effecs
   */
  @Effect()
  addItemToBasket$ = this.actions$.pipe(
    ofType(basketActions.BasketActionTypes.AddItemToBasket),
    map((action: basketActions.AddItemToBasket) => action.payload),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    concatMap(([payload, basket]) => {
      return this.basketService.addItemToBasket(payload.sku, payload.quantity, basket.id).pipe(
        map(result => new basketActions.AddItemToBasketSuccess(result)),
        catchError(error => of(new basketActions.AddItemToBasketFail(error)))
      );
    })
  );

  /**
   * triggers load basket effect after successful AddItemToBasket
   */
  @Effect()
  loadBasketAfterAddItemToBasket$ = this.actions$.pipe(
    ofType(basketActions.BasketActionTypes.AddItemToBasketSuccess),
    map(() => new basketActions.LoadBasket())
  );
}
