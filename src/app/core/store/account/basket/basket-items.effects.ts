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
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, mapToProperty } from 'ish-core/utils/operators';

import {
  AddItemsToBasket,
  AddItemsToBasketFail,
  AddItemsToBasketSuccess,
  AddProductToBasket,
  BasketActionTypes,
  DeleteBasketItem,
  DeleteBasketItemFail,
  DeleteBasketItemSuccess,
  LoadBasket,
  UpdateBasketItems,
  UpdateBasketItemsFail,
  UpdateBasketItemsSuccess,
  ValidateBasket,
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
  @Effect()
  addProductToBasket$ = this.actions$.pipe(
    ofType<AddProductToBasket>(BasketActionTypes.AddProductToBasket),
    mapToPayload(),
    // accumulate all actions
    window(this.actions$.pipe(ofType<AddProductToBasket>(BasketActionTypes.AddProductToBasket), debounceTime(1000))),
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
        map(items => new AddItemsToBasket({ items }))
      )
    )
  );

  /**
   * Add items to the current basket.
   * Only triggers if basket is set or action payload contains basketId.
   */
  @Effect()
  addItemsToBasket$ = this.actions$.pipe(
    ofType<AddItemsToBasket>(BasketActionTypes.AddItemsToBasket),
    mapToPayload(),
    withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
    filter(([{ basketId }, currentBasketId]) => !!currentBasketId || !!basketId),
    concatMap(([payload, currentBasketId]) => {
      // get basket id from AddItemsToBasket action if set, otherwise use current basket id
      const basketId = payload.basketId || currentBasketId;

      return this.basketService.addItemsToBasket(basketId, payload.items).pipe(
        map(info => new AddItemsToBasketSuccess({ info })),
        mapErrorToAction(AddItemsToBasketFail)
      );
    })
  );

  /**
   * Reload products when they are added to basket to update price and inStock information
   */
  @Effect()
  loadProductsForAddItemsToBasket$ = this.actions$.pipe(
    ofType<AddItemsToBasket>(BasketActionTypes.AddItemsToBasket),
    mapToPayload(),
    concatMap(payload => [...payload.items.map(item => new LoadProduct({ sku: item.sku }))])
  );

  /**
   * Creates a basket if missing and call AddItemsToBasketAction
   * Only triggers if basket is unset set and action payload does not contain basketId.
   */
  @Effect()
  createBasketBeforeAddItemsToBasket$ = this.actions$.pipe(
    ofType<AddItemsToBasket>(BasketActionTypes.AddItemsToBasket),
    mapToPayload(),
    withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
    filter(([payload, basketId]) => !basketId && !payload.basketId),
    mergeMap(([{ items }]) =>
      this.basketService.createBasket().pipe(
        mapToProperty('id'),
        map(basketId => new AddItemsToBasket({ items, basketId }))
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
    ofType<UpdateBasketItems>(BasketActionTypes.UpdateBasketItems),
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
        map(info => new UpdateBasketItemsSuccess({ info })),
        mapErrorToAction(UpdateBasketItemsFail)
      )
    )
  );

  /**
   * Validates the basket after an update item error occurred
   */
  @Effect()
  validateBasketAfterUpdateFailure$ = this.actions$.pipe(
    ofType<UpdateBasketItemsFail>(BasketActionTypes.UpdateBasketItemsFail),
    mapToPayload(),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    mapTo(new ValidateBasket({ scopes: ['Products'] }))
  );

  /**
   * Delete basket item effect.
   */
  @Effect()
  deleteBasketItem$ = this.actions$.pipe(
    ofType<DeleteBasketItem>(BasketActionTypes.DeleteBasketItem),
    mapToPayloadProperty('itemId'),
    withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
    concatMap(([itemId, basketId]) =>
      this.basketService.deleteBasketItem(basketId, itemId).pipe(
        map(info => new DeleteBasketItemSuccess({ info })),
        mapErrorToAction(DeleteBasketItemFail)
      )
    )
  );

  /**
   * Triggers a LoadBasket action after successful interaction with the Basket API.
   */
  @Effect()
  loadBasketAfterBasketItemsChangeSuccess$ = this.actions$.pipe(
    ofType<AddItemsToBasketSuccess>(
      BasketActionTypes.AddItemsToBasketSuccess,
      BasketActionTypes.UpdateBasketItemsSuccess,
      BasketActionTypes.DeleteBasketItemSuccess
    ),
    mapToPayloadProperty('info'),
    tap(info =>
      info && info.length && info[0].message
        ? this.router.navigate(['/basket'], { queryParams: { error: true } })
        : undefined
    ),
    mapTo(new LoadBasket())
  );
}
