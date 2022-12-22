import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concat, from } from 'rxjs';
import {
  concatMap,
  debounceTime,
  defaultIfEmpty,
  filter,
  last,
  map,
  mergeMap,
  switchMap,
  toArray,
  window,
  withLatestFrom,
} from 'rxjs/operators';

import {
  LineItemUpdateHelper,
  LineItemUpdateHelperItem,
} from 'ish-core/models/line-item-update/line-item-update.helper';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { getProductEntities, loadProduct } from 'ish-core/store/shopping/products';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty } from 'ish-core/utils/operators';

import {
  addItemsToBasket,
  addItemsToBasketFail,
  addItemsToBasketSuccess,
  addProductToBasket,
  createBasketFail,
  createBasketSuccess,
  deleteBasketItem,
  deleteBasketItemFail,
  deleteBasketItemSuccess,
  loadBasket,
  updateBasketItem,
  updateBasketItemFail,
  updateBasketItemSuccess,
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
   * Triggers the internal action that handles the actual adding of the product to the basket.
   */
  addProductToBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addProductToBasket),
      mapToPayload(),
      // add unit
      withLatestFrom(this.store.pipe(select(getProductEntities))),
      map(([val, entities]) => ({ ...val, unit: entities[val.sku]?.packingUnit })),
      // accumulate all actions
      window(this.actions$.pipe(ofType(addProductToBasket), debounceTime(500))),
      mergeMap(window$ => window$.pipe(toArray())),
      map(items => addItemsToBasket({ items }))
    )
  );

  addItemsToBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addItemsToBasket),
      mapToPayload(),
      withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
      concatMap(([{ items }, basketId]) => {
        if (basketId) {
          return this.basketService.addItemsToBasket(items).pipe(
            map(payload => addItemsToBasketSuccess(payload)),
            mapErrorToAction(addItemsToBasketFail)
          );
        } else {
          return this.basketService.createBasket().pipe(
            switchMap(basket =>
              this.basketService.addItemsToBasket(items).pipe(
                mergeMap(payload => [createBasketSuccess({ basket }), addItemsToBasketSuccess(payload)]),
                mapErrorToAction(addItemsToBasketFail)
              )
            ),
            mapErrorToAction(createBasketFail)
          );
        }
      })
    )
  );
  /**
   * Reload products when they are added to basket to update price and availability information
   */
  loadProductsForAddItemsToBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addItemsToBasket),
      mapToPayload(),
      concatMap(payload => [...payload.items.map(item => loadProduct({ sku: item.sku }))])
    )
  );

  updateBasketItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateBasketItem),
      mapToPayloadProperty('lineItemUpdate'),
      withLatestFrom(this.store.pipe(select(getCurrentBasket))),
      filter(([payload, basket]) => !!basket.lineItems && !!payload),
      concatMap(([lineItem]) =>
        this.basketService
          .updateBasketItem(lineItem.itemId, {
            quantity: lineItem.quantity > 0 ? { value: lineItem.quantity, unit: lineItem.unit } : undefined,
            product: lineItem.sku,
          })
          .pipe(
            map(payload => updateBasketItemSuccess(payload)),
            mapErrorToAction(updateBasketItemFail)
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
          defaultIfEmpty(undefined),
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
      map(() => validateBasket({ scopes: ['Products'] }))
    )
  );

  /**
   * Delete basket item effect.
   */
  deleteBasketItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteBasketItem),
      mapToPayloadProperty('itemId'),
      concatMap(itemId =>
        this.basketService.deleteBasketItem(itemId).pipe(
          map(info => deleteBasketItemSuccess({ itemId, info })),
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
      ofType(addItemsToBasketSuccess, updateBasketItemSuccess, updateBasketItemsSuccess, deleteBasketItemSuccess),
      map(() => loadBasket())
    )
  );

  redirectToBasketIfBasketInteractionHasInfo$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addItemsToBasketSuccess, updateBasketItemSuccess, updateBasketItemsSuccess, deleteBasketItemSuccess),
        mapToPayloadProperty('info'),
        filter(info => !!info?.[0]?.message),
        concatMap(() => from(this.router.navigate(['/basket'], { queryParams: { error: true } })))
      ),
    { dispatch: false }
  );
}
