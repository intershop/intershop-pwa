import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { catchError, concatMap, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { CoreState } from '../../../core/store/core.state';
import { UserActionTypes } from '../../../core/store/user/user.actions';
import { getProductEntities, LoadProduct } from '../../../shopping/store/products';
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
   * The load basket effect.
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
   * Trigger a LoadBasket action after a successful login.
   */
  @Effect()
  loadBasketAfterLogin$ = this.actions$.pipe(
    ofType(UserActionTypes.LoginUserSuccess),
    map(() => new basketActions.LoadBasket())
  );

  /**
   * The load basket items effect.
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
   * Trigger a LoadBasketItems action after a successful basket loading.
   */
  @Effect()
  loadBasketItemsAfterBasketLoad$ = this.actions$.pipe(
    ofType(basketActions.BasketActionTypes.LoadBasketSuccess),
    map((action: basketActions.LoadBasketSuccess) => action.payload),
    map(basket => new basketActions.LoadBasketItems(basket.id))
  );

  /**
   * After successfully loading the basket items, trigger a LoadProduct action
   * for each product that is missing in the current product entities state.
   */
  @Effect()
  loadProductsForBasket$ = this.actions$.pipe(
    ofType(basketActions.BasketActionTypes.LoadBasketItemsSuccess),
    map((action: basketActions.LoadBasketItemsSuccess) => action.payload),
    withLatestFrom(this.store.select(getProductEntities)),
    switchMap(([basketItems, products]) => [
      ...basketItems
        .filter(lineItem => !products[lineItem.product['title']])
        .map(lineItem => new LoadProduct(lineItem.product['title'])),
    ])
  );

  /**
   * Add a product to the current basket.
   */
  @Effect()
  addItemToBasket$ = this.actions$.pipe(
    ofType(basketActions.BasketActionTypes.AddProductToBasket),
    map((action: basketActions.AddProductToBasket) => action.payload),
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
   * Trigger a LoadBasket action after successfully adding an item to the basket.
   */
  @Effect()
  loadBasketAfterAddItemToBasket$ = this.actions$.pipe(
    ofType(basketActions.BasketActionTypes.AddItemToBasketSuccess),
    map(() => new basketActions.LoadBasket())
  );
}
