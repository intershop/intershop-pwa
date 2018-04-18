import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { ROUTER_NAVIGATION_TYPE } from 'ngrx-router';
import { of } from 'rxjs/observable/of';
import { catchError, concatMap, map, mergeMap, switchMap, take, withLatestFrom } from 'rxjs/operators';
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
    withLatestFrom(this.store.pipe(select(getProductEntities))),
    switchMap(([basketItems, products]) => [
      ...basketItems
        .filter(lineItem => !products[lineItem.product.sku])
        .map(lineItem => new LoadProduct(lineItem.product.sku)),
    ])
  );

  /**
   * Add products to the current basket.
   */
  @Effect()
  addProductsToBasket$ = this.actions$.pipe(
    ofType(basketActions.BasketActionTypes.AddProductsToBasket),
    map((action: basketActions.AddProductsToBasket) => action.payload),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    concatMap(([payload, basket]) => {
      // get basket id from AddItemsToBasket action if set, otherwise use current basket id
      const basketId = payload.basketId || basket.id;

      return this.basketService
        .addProductsToBasket(payload.items, basketId)
        .pipe(
          map(() => new basketActions.AddItemsToBasketSuccess()),
          catchError(error => of(new basketActions.AddItemsToBasketFail(error)))
        );
    })
  );

  /**
   * Trigger a LoadBasket action after successfully adding an item to the basket.
   */
  @Effect()
  loadBasketAfterAddItemsToBasket$ = this.actions$.pipe(
    ofType(basketActions.BasketActionTypes.AddItemsToBasketSuccess),
    map(() => new basketActions.LoadBasket())
  );

  /**
   * Triggers LoadBasket action after first router navigation event fired.
   */
  @Effect()
  loadBasketAfterAppInit$ = this.actions$.pipe(
    ofType(ROUTER_NAVIGATION_TYPE),
    take(1),
    map(() => new basketActions.LoadBasket())
  );

  /**
   * Triggers AddItemsToBasket action after LoginUserSuccess if basket items present from pre login state.
   * Triggers LoadBasket, if no pre login state basket items present.
   */
  @Effect()
  mergeBasketAfterLogin$ = this.actions$.pipe(
    ofType(UserActionTypes.LoginUserSuccess),
    switchMap(() => this.basketService.getBasket()),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    map(([newBasket, currentBasket]) => {
      if (!currentBasket.lineItems || currentBasket.lineItems.length === 0) {
        return new basketActions.LoadBasket();
      }
      const lineItems = currentBasket.lineItems;
      const items: { sku: string; quantity: number }[] = [];

      for (const lineItem of lineItems) {
        items.push({
          sku: lineItem.product.sku,
          quantity: lineItem.quantity.value,
        });
      }

      return new basketActions.AddProductsToBasket({ items: items, basketId: newBasket.id });
    })
  );
}
