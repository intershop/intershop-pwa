import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import {
  catchError,
  concatMap,
  distinctUntilKeyChanged,
  filter,
  map,
  mergeMap,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';
import { CoreState } from '../../../core/store/core.state';
import { UserActionTypes } from '../../../core/store/user/user.actions';
import { Product } from '../../../models/product/product.model';
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
        .filter(basketItem => !products[(basketItem.product as Product).sku])
        .map(basketItem => new LoadProduct((basketItem.product as Product).sku)),
    ])
  );

  /**
   * Add a product to the current basket.
   * Triggers the internal AddItemsToBasket action that handles the actual adding of the product to the basket.
   */
  @Effect()
  addProductToBasket$ = this.actions$.pipe(
    ofType(basketActions.BasketActionTypes.AddProductToBasket),
    map((action: basketActions.AddProductToBasket) => new basketActions.AddItemsToBasket({ items: [action.payload] }))
  );

  /**
   * Add items to the current basket.
   * Only triggers if basket is set.
   * Triggers if AddItemsToBasket action was triggered without a basket before once a basket becomes available.
   */
  @Effect()
  // combine AddItemsToBasket action and getCurrentBasket selector to ensure that basket is set
  addItemsToBasket$ = combineLatest(
    this.actions$.pipe(ofType<basketActions.AddItemsToBasket>(basketActions.BasketActionTypes.AddItemsToBasket)),
    // only emit value if basket is set and basket id changes
    this.store.pipe(select(getCurrentBasket), filter(basket => !!basket), distinctUntilKeyChanged('basketId'))
  ).pipe(
    map(([action, basket]) => ({ payload: action.payload, basket })),
    switchMap(({ payload, basket }) => {
      // get basket id from AddItemsToBasket action if set, otherwise use current basket id
      const basketId = payload.basketId || basket.id;

      return this.basketService
        .addItemsToBasket(payload.items, basketId)
        .pipe(
          map(() => new basketActions.AddItemsToBasketSuccess()),
          catchError(error => of(new basketActions.AddItemsToBasketFail(error)))
        );
    })
  );

  /**
   * Update basket item effect if quantity > 0.
   */
  @Effect()
  updateBasketItem$ = this.actions$.pipe(
    ofType(basketActions.BasketActionTypes.UpdateBasketItem),
    map((action: basketActions.UpdateBasketItem) => action.payload),
    filter(payload => payload.quantity > 0),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    concatMap(([payload, basket]) => {
      return this.basketService
        .updateBasketItem(payload.itemId, payload.quantity, basket.id)
        .pipe(
          map(() => new basketActions.UpdateBasketItemSuccess()),
          catchError(error => of(new basketActions.UpdateBasketItemFail(error)))
        );
    })
  );

  /**
   * Delete basket item effect.
   */
  @Effect()
  deleteBasketItem$ = this.actions$.pipe(
    ofType(basketActions.BasketActionTypes.DeleteBasketItem),
    map((action: basketActions.DeleteBasketItem) => action.payload),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    concatMap(([itemId, basket]) => {
      return this.basketService
        .deleteBasketItem(itemId, basket.id)
        .pipe(
          map(() => new basketActions.DeleteBasketItemSuccess()),
          catchError(error => of(new basketActions.DeleteBasketItemFail(error)))
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
   * Trigger a LoadBasketItems action after a successful basket loading.
   */
  @Effect()
  loadBasketItemsAfterBasketLoad$ = this.actions$.pipe(
    ofType(basketActions.BasketActionTypes.LoadBasketSuccess),
    map((action: basketActions.LoadBasketSuccess) => action.payload),
    map(basket => new basketActions.LoadBasketItems(basket.id))
  );

  /**
   * Trigger a LoadBasket action to create and obtain a new basket
   * if no basket is present when trying to add items to the basket.
   */
  @Effect()
  createBasketIfMissing$ = this.actions$.pipe(
    ofType(basketActions.BasketActionTypes.AddItemsToBasket),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    filter(([action, basket]) => !basket),
    // TODO: add create basket if LoadBasket does not create basket anymore
    map(() => new basketActions.LoadBasket())
  );

  /**
   * Trigger an AddItemsToBasket action after LoginUserSuccess if basket items are present from pre login state.
   * Trigger a LoadBasket action, if no pre login state basket items present
   */
  @Effect()
  mergeBasketAfterLogin$ = this.actions$.pipe(
    ofType(UserActionTypes.LoginUserSuccess),
    switchMap(() => this.basketService.getBasket()),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    map(([newBasket, currentBasket]) => {
      // TODO: move to separate effect?
      if (!currentBasket || !currentBasket.lineItems || currentBasket.lineItems.length === 0) {
        return new basketActions.LoadBasket();
      }

      const items = currentBasket.lineItems.map(lineItem => ({
        sku: lineItem.product.sku,
        quantity: lineItem.quantity.value,
      }));

      return new basketActions.AddItemsToBasket({ items: items, basketId: newBasket.id });
    })
  );

  /**
   * Triggers a LoadBasket action after successful interaction with the Basket API.
   */
  @Effect()
  loadBasketAfterBasketChangeSuccess$ = this.actions$.pipe(
    ofType(
      basketActions.BasketActionTypes.AddItemsToBasketSuccess,
      basketActions.BasketActionTypes.UpdateBasketItemSuccess,
      basketActions.BasketActionTypes.DeleteBasketItemSuccess
    ),
    map(() => new basketActions.LoadBasket())
  );

  /**
   * Update basket items effect.
   * Triggers UpdateBasketItem for every item in payload array.
   */
  @Effect()
  updateBasketItems$ = this.actions$.pipe(
    ofType(basketActions.BasketActionTypes.UpdateBasketItems),
    map((action: basketActions.UpdateBasketItems) => action.payload),
    switchMap(items => [
      ...items.map(item => new basketActions.UpdateBasketItem(item as { quantity: number; itemId: string })),
    ])
  );

  /**
   * Trigger DeleteBasketItem action if UpdateBasketItem quantity === 0.
   */
  @Effect()
  deleteBasketItemIfQuantityZero$ = this.actions$.pipe(
    ofType(basketActions.BasketActionTypes.UpdateBasketItem),
    map((action: basketActions.UpdateBasketItem) => action.payload),
    filter(payload => payload.quantity === 0),
    map(payload => new basketActions.DeleteBasketItem(payload.itemId))
  );
}
