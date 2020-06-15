import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concat } from 'rxjs';
import {
  concatMap,
  debounceTime,
  defaultIfEmpty,
  filter,
  last,
  map,
  mapTo,
  mergeMap,
  reduce,
  tap,
  window,
  withLatestFrom,
} from 'rxjs/operators';

import {
  LineItemUpdateHelper,
  LineItemUpdateHelperItem,
} from 'ish-core/models/line-item-update/line-item-update.helper';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { LoadProduct, getProductEntities } from 'ish-core/store/shopping/products';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty } from 'ish-core/utils/operators';

import * as basketActions from './basket.actions';
import { getCurrentBasket } from './basket.selectors';

@Injectable()
export class BasketItemsEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store,
    private basketService: BasketService
  ) {}

  /**
   * Add a product to the current basket.
   * Triggers the internal AddItemsToBasket action that handles the actual adding of the product to the basket.
   */
  @Effect()
  addProductToBasket$ = this.actions$.pipe(
    ofType<basketActions.AddProductToBasket>(basketActions.BasketActionTypes.AddProductToBasket),
    mapToPayload(),
    // accumulate all actions
    window(
      this.actions$.pipe(
        ofType<basketActions.AddProductToBasket>(basketActions.BasketActionTypes.AddProductToBasket),
        debounceTime(1000)
      )
    ),
    mergeMap(window$ =>
      window$.pipe(
        withLatestFrom(this.store.pipe(select(getProductEntities))),
        // accumulate changes
        reduce((acc, [val, entities]) => {
          const element = acc.find(x => x.sku === val.sku);
          if (element) {
            element.quantity += val.quantity;
          } else {
            acc.push({ ...val, unit: entities[val.sku] && entities[val.sku].packingUnit });
          }
          return acc;
        }, []),
        map(items => new basketActions.AddItemsToBasket({ items }))
      )
    )
  );

  /**
   * Add items to the current basket.
   * Only triggers if basket is set or action payload contains basketId.
   */
  @Effect()
  addItemsToBasket$ = this.actions$.pipe(
    ofType<basketActions.AddItemsToBasket>(basketActions.BasketActionTypes.AddItemsToBasket),
    mapToPayload(),
    concatMap(payload =>
      this.basketService.addItemsToBasket(payload.items).pipe(
        map(info => new basketActions.AddItemsToBasketSuccess({ info })),
        mapErrorToAction(basketActions.AddItemsToBasketFail)
      )
    )
  );

  /**
   * Reload products when they are added to basket to update price and inStock information
   */
  @Effect()
  loadProductsForAddItemsToBasket$ = this.actions$.pipe(
    ofType<basketActions.AddItemsToBasket>(basketActions.BasketActionTypes.AddItemsToBasket),
    mapToPayload(),
    concatMap(payload => [...payload.items.map(item => new LoadProduct({ sku: item.sku }))])
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
    concatMap(updates =>
      concat(
        ...updates.map(update => {
          if (update.quantity === 0) {
            return this.basketService.deleteBasketItem(update.itemId);
          } else {
            return this.basketService.updateBasketItem(update.itemId, {
              quantity: update.quantity > 0 ? { value: update.quantity, unit: update.unit } : undefined,
              product: update.sku,
            });
          }
        })
      ).pipe(
        defaultIfEmpty(),
        last(),
        map(info => new basketActions.UpdateBasketItemsSuccess({ info })),
        mapErrorToAction(basketActions.UpdateBasketItemsFail)
      )
    )
  );

  /**
   * Validates the basket after an update item error occurred
   */
  @Effect()
  validateBasketAfterUpdateFailure$ = this.actions$.pipe(
    ofType<basketActions.UpdateBasketItemsFail>(basketActions.BasketActionTypes.UpdateBasketItemsFail),
    mapToPayload(),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    mapTo(new basketActions.ValidateBasket({ scopes: ['Products'] }))
  );

  /**
   * Delete basket item effect.
   */
  @Effect()
  deleteBasketItem$ = this.actions$.pipe(
    ofType<basketActions.DeleteBasketItem>(basketActions.BasketActionTypes.DeleteBasketItem),
    mapToPayloadProperty('itemId'),
    concatMap(itemId =>
      this.basketService.deleteBasketItem(itemId).pipe(
        map(info => new basketActions.DeleteBasketItemSuccess({ info })),
        mapErrorToAction(basketActions.DeleteBasketItemFail)
      )
    )
  );

  /**
   * Triggers a LoadBasket action after successful interaction with the Basket API.
   */
  @Effect()
  loadBasketAfterBasketItemsChangeSuccess$ = this.actions$.pipe(
    ofType<basketActions.AddItemsToBasketSuccess>(
      basketActions.BasketActionTypes.AddItemsToBasketSuccess,
      basketActions.BasketActionTypes.UpdateBasketItemsSuccess,
      basketActions.BasketActionTypes.DeleteBasketItemSuccess
    ),
    mapToPayloadProperty('info'),
    tap(info =>
      info && info.length && info[0].message
        ? this.router.navigate(['/basket'], { queryParams: { error: true } })
        : undefined
    ),
    mapTo(new basketActions.LoadBasket())
  );
}
