import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { catchError, concatMap, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { CoreState } from '../../../core/store/core.state';
import { UserActionTypes } from '../../../core/store/user/user.actions';
import * as productsActions from '../../../shopping/store/products/products.actions';
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
  ) {}

  /**
   * load basket effect
   */
  @Effect()
  loadBasket$ = this.actions$.pipe(
    ofType(basketActions.BasketActionTypes.LoadBasket),
    map((action: basketActions.LoadBasket) => action.payload),
    mergeMap(basketId => {
      return this.basketService
        .getBasket(basketId)
        .pipe(
          map(basket => new basketActions.LoadBasketSuccess(basket)),
          catchError(error => of(new basketActions.LoadBasketFail(error)))
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
   * load basket items effect
   */
  @Effect()
  loadBasketItems$ = this.actions$.pipe(
    ofType(basketActions.BasketActionTypes.LoadBasketItems),
    map((action: basketActions.LoadBasketItems) => action.payload),
    mergeMap(basketId => {
      return this.basketService
        .getBasketItems(basketId)
        .pipe(
          map(basketItems => new basketActions.LoadBasketItemsSuccess(basketItems)),
          catchError(error => of(new basketActions.LoadBasketItemsFail(error)))
        );
    })
  );

  /**
   * trigger load basket items effect after load basket success
   */
  @Effect()
  loadBasketItemsAfterBasketLoad$ = this.actions$.pipe(
    ofType(basketActions.BasketActionTypes.LoadBasketSuccess),
    withLatestFrom(this.store.select(getCurrentBasket)),
    map(([action, basket]) => new basketActions.LoadBasketItems(basket.id))
  );

  /**
   * trigger load product effects after load basket items success
   */
  @Effect()
  loadProductsForBasket$ = this.actions$.pipe(
    ofType(basketActions.BasketActionTypes.LoadBasketItemsSuccess),
    withLatestFrom(this.store.select(getCurrentBasket)),
    switchMap(([action, basket]) => [
      ...basket.lineItems.map(lineItem => new productsActions.LoadProduct(lineItem.product['title'])),
    ])
  );

  /**
   * add product to basket effecs
   */
  @Effect()
  addItemToBasket$ = this.actions$.pipe(
    ofType(basketActions.BasketActionTypes.AddItemToBasket),
    map((action: basketActions.AddItemToBasket) => action.payload),
    withLatestFrom(this.store.select(getCurrentBasket)),
    concatMap(([payload, basket]) => {
      return this.basketService
        .addItemToBasket(payload.sku, payload.quantity, basket.id)
        .pipe(
          map(() => new basketActions.AddItemToBasketSuccess()),
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
