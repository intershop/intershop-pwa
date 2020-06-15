import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
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
import { getProductEntities, loadProduct } from 'ish-core/store/shopping/products';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, mapToProperty } from 'ish-core/utils/operators';

import {
  addItemsToBasket,
  addItemsToBasketFail,
  addItemsToBasketSuccess,
  addProductToBasket,
  deleteBasketItem,
  deleteBasketItemFail,
  deleteBasketItemSuccess,
  loadBasket,
  updateBasketItems,
  updateBasketItemsFail,
  updateBasketItemsSuccess,
  validateBasket,
} from './basket.actions';
import { getCurrentBasket, getCurrentBasketId } from './basket.selectors';

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
  addProductToBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addProductToBasket),
      mapToPayload(),
      // accumulate all actions
      window(this.actions$.pipe(ofType(addProductToBasket), debounceTime(1000))),
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
          map(items => addItemsToBasket({ items }))
        )
      )
    )
  );

  /**
   * Add items to the current basket.
   * Only triggers if basket is set or action payload contains basketId.
   */
  addItemsToBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addItemsToBasket),
      mapToPayload(),
      withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
      filter(([{ basketId }, currentBasketId]) => !!currentBasketId || !!basketId),
      concatMap(([payload, currentBasketId]) => {
        // get basket id from AddItemsToBasket action if set, otherwise use current basket id
        const basketId = payload.basketId || currentBasketId;

        return this.basketService.addItemsToBasket(basketId, payload.items).pipe(
          map(info => addItemsToBasketSuccess({ info })),
          mapErrorToAction(addItemsToBasketFail)
        );
      })
    )
  );

  /**
   * Reload products when they are added to basket to update price and inStock information
   */
  loadProductsForAddItemsToBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addItemsToBasket),
      mapToPayload(),
      concatMap(payload => [...payload.items.map(item => loadProduct({ sku: item.sku }))])
    )
  );

  /**
   * Creates a basket if missing and call AddItemsToBasketAction
   * Only triggers if basket is unset set and action payload does not contain basketId.
   */
  createBasketBeforeAddItemsToBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addItemsToBasket),
      mapToPayload(),
      withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
      filter(([payload, basketId]) => !basketId && !payload.basketId),
      mergeMap(([{ items }]) =>
        this.basketService.createBasket().pipe(
          mapToProperty('id'),
          map(basketId => addItemsToBasket({ items, basketId }))
        )
      )
    )
  );

  /**
   * Update basket items effect.
   * Triggers update item request if item quantity has changed and is greater zero
   * Triggers delete item request if item quantity set to zero
   */
  updateBasketItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateBasketItems),
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
                quantity: update.quantity > 0 ? { value: update.quantity, unit: update.unit } : undefined,
                product: update.sku,
              });
            }
          })
        ).pipe(
          defaultIfEmpty(),
          last(),
          map(info => updateBasketItemsSuccess({ info })),
          mapErrorToAction(updateBasketItemsFail)
        )
      )
    )
  );

  /**
   * Validates the basket after an update item error occurred
   */
  validateBasketAfterUpdateFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateBasketItemsFail),
      mapToPayload(),
      withLatestFrom(this.store.pipe(select(getCurrentBasket))),
      mapTo(validateBasket({ scopes: ['Products'] }))
    )
  );

  /**
   * Delete basket item effect.
   */
  deleteBasketItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteBasketItem),
      mapToPayloadProperty('itemId'),
      withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
      concatMap(([itemId, basketId]) =>
        this.basketService.deleteBasketItem(basketId, itemId).pipe(
          map(info => deleteBasketItemSuccess({ info })),
          mapErrorToAction(deleteBasketItemFail)
        )
      )
    )
  );

  /**
   * Triggers a LoadBasket action after successful interaction with the Basket API.
   */
  loadBasketAfterBasketItemsChangeSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addItemsToBasketSuccess, updateBasketItemsSuccess, deleteBasketItemSuccess),
      mapToPayloadProperty('info'),
      tap(info =>
        info && info.length && info[0].message
          ? this.router.navigate(['/basket'], { queryParams: { error: true } })
          : undefined
      ),
      mapTo(loadBasket())
    )
  );
}
