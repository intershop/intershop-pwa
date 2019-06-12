import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concat } from 'rxjs';
import { concatMap, defaultIfEmpty, filter, last, map, mapTo, mergeMap, withLatestFrom } from 'rxjs/operators';

import {
  LineItemUpdateHelper,
  LineItemUpdateHelperItem,
} from 'ish-core/models/line-item-update/line-item-update.helper';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, mapToProperty } from 'ish-core/utils/operators';
import { BasketService } from '../../../services/basket/basket.service';

import * as basketActions from './basket.actions';
import { getCurrentBasket, getCurrentBasketId } from './basket.selectors';

@Injectable()
export class BasketItemsEffects {
  constructor(private actions$: Actions, private store: Store<{}>, private basketService: BasketService) {}

  /**
   * Add a product to the current basket.
   * Triggers the internal AddItemsToBasket action that handles the actual adding of the product to the basket.
   */
  @Effect()
  addProductToBasket$ = this.actions$.pipe(
    ofType<basketActions.AddProductToBasket>(basketActions.BasketActionTypes.AddProductToBasket),
    mapToPayload(),
    map(item => new basketActions.AddItemsToBasket({ items: [item] }))
  );

  /**
   * Add items to the current basket.
   * Only triggers if basket is set or action payload contains basketId.
   */
  @Effect()
  addItemsToBasket$ = this.actions$.pipe(
    ofType<basketActions.AddItemsToBasket>(basketActions.BasketActionTypes.AddItemsToBasket),
    mapToPayload(),
    withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
    filter(([{ basketId }, currentBasketId]) => !!currentBasketId || !!basketId),
    concatMap(([payload, currentBasketId]) => {
      // get basket id from AddItemsToBasket action if set, otherwise use current basket id
      const basketId = payload.basketId || currentBasketId;

      return this.basketService.addItemsToBasket(basketId, payload.items).pipe(
        mapTo(new basketActions.AddItemsToBasketSuccess()),
        mapErrorToAction(basketActions.AddItemsToBasketFail)
      );
    })
  );

  /**
   * Creates a basket if missing and call AddItemsToBasketAction
   * Only triggers if basket is unset set and action payload does not contain basketId.
   */
  @Effect()
  createBasketBeforeAddItemsToBasket$ = this.actions$.pipe(
    ofType<basketActions.AddItemsToBasket>(basketActions.BasketActionTypes.AddItemsToBasket),
    mapToPayload(),
    withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
    filter(([payload, basketId]) => !basketId && !payload.basketId),
    mergeMap(([{ items }]) =>
      this.basketService.createBasket().pipe(
        mapToProperty('id'),
        map(basketId => new basketActions.AddItemsToBasket({ items, basketId }))
      )
    )
  );

  /**
   * Update basket items effect.
   * Triggers update item request if item quantity has changed and is greater zero
   * Triggers delete item request if item quantity set to zero
   */
  @Effect()
  updateBasketItems$ = this.actions$.pipe(
    ofType<basketActions.UpdateBasketItems>(basketActions.BasketActionTypes.UpdateBasketItems),
    mapToPayload(),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    filter(([payload, basket]) => !!basket.lineItems && !!payload.lineItemUpdates),
    map(([{ lineItemUpdates }, { lineItems }]) =>
      LineItemUpdateHelper.filterUpdatesByItems(lineItemUpdates, lineItems as LineItemUpdateHelperItem[])
    ),

    withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
    concatMap(([updates, basketId]) =>
      concat(
        ...updates.map(update => {
          if (update.quantity === 0) {
            return this.basketService.deleteBasketItem(basketId, update.itemId);
          } else {
            return this.basketService.updateBasketItem(basketId, update.itemId, {
              quantity: update.quantity > 0 ? { value: update.quantity } : undefined,
              product: update.sku,
            });
          }
        })
      ).pipe(
        defaultIfEmpty(),
        last(),
        mapTo(new basketActions.UpdateBasketItemsSuccess()),
        mapErrorToAction(basketActions.UpdateBasketItemsFail)
      )
    )
  );

  /**
   * Delete basket item effect.
   */
  @Effect()
  deleteBasketItem$ = this.actions$.pipe(
    ofType<basketActions.DeleteBasketItem>(basketActions.BasketActionTypes.DeleteBasketItem),
    mapToPayloadProperty('itemId'),
    withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
    concatMap(([itemId, basketId]) =>
      this.basketService.deleteBasketItem(basketId, itemId).pipe(
        mapTo(new basketActions.DeleteBasketItemSuccess()),
        mapErrorToAction(basketActions.DeleteBasketItemFail)
      )
    )
  );

  /**
   * Triggers a LoadBasket action after successful interaction with the Basket API.
   */
  @Effect()
  loadBasketAfterBasketItemsChangeSuccess$ = this.actions$.pipe(
    ofType(
      basketActions.BasketActionTypes.AddItemsToBasketSuccess,
      basketActions.BasketActionTypes.UpdateBasketItemsSuccess,
      basketActions.BasketActionTypes.DeleteBasketItemSuccess
    ),
    mapTo(new basketActions.LoadBasket())
  );
}
