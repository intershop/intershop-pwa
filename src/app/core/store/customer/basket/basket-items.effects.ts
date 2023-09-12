import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { from } from 'rxjs';
import { concatMap, debounceTime, filter, map, mergeMap, switchMap, toArray, window } from 'rxjs/operators';

import { BasketItemsService } from 'ish-core/services/basket-items/basket-items.service';
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
  deleteBasketItems,
  deleteBasketItemsFail,
  deleteBasketItemsSuccess,
  loadBasket,
  updateBasketItem,
  updateBasketItemFail,
  updateBasketItemSuccess,
  validateBasket,
} from './basket.actions';
import { getCurrentBasket, getCurrentBasketId } from './basket.selectors';

@Injectable()
export class BasketItemsEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store,
    private basketService: BasketService,
    private basketItemsService: BasketItemsService
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
      concatLatestFrom(() => this.store.pipe(select(getProductEntities))),
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
      concatLatestFrom(() => this.store.pipe(select(getCurrentBasketId))),
      concatMap(([{ items }, basketId]) => {
        if (basketId) {
          return this.basketItemsService.addItemsToBasket(items).pipe(
            map(payload => addItemsToBasketSuccess(payload)),
            mapErrorToAction(addItemsToBasketFail)
          );
        } else {
          return this.basketService.createBasket().pipe(
            switchMap(basket =>
              this.basketItemsService.addItemsToBasket(items).pipe(
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
      mergeMap(payload => [...payload.items.map(item => loadProduct({ sku: item.sku }))])
    )
  );

  updateBasketItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateBasketItem),
      mapToPayloadProperty('lineItemUpdate'),
      concatLatestFrom(() => this.store.pipe(select(getCurrentBasket))),
      filter(([payload, basket]) => !!basket.lineItems && !!payload),
      concatMap(([lineItem]) =>
        this.basketItemsService
          .updateBasketItem(lineItem.itemId, {
            quantity: lineItem.quantity > 0 ? { value: lineItem.quantity, unit: lineItem.unit } : undefined,
            product: lineItem.sku,
            customerProductID: lineItem.customerProductID,
            partialOrderNo: lineItem.partialOrderNo,
          })
          .pipe(
            map(payload => updateBasketItemSuccess(payload)),
            mapErrorToAction(updateBasketItemFail)
          )
      )
    )
  );

  /**
   * Validates the basket after an update item error occurred
   */
  validateBasketAfterUpdateFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateBasketItemFail),
      mapToPayload(),
      concatLatestFrom(() => this.store.pipe(select(getCurrentBasket))),
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
        this.basketItemsService.deleteBasketItem(itemId).pipe(
          map(info => deleteBasketItemSuccess({ itemId, info })),
          mapErrorToAction(deleteBasketItemFail)
        )
      )
    )
  );

  /**
   * Delete all basket items effect.
   */
  deleteBasketItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteBasketItems),
      concatMap(() =>
        this.basketItemsService.deleteBasketItems().pipe(
          map(info => deleteBasketItemsSuccess({ info })),
          mapErrorToAction(deleteBasketItemsFail)
        )
      )
    )
  );

  /**
   * Triggers a LoadBasket action after successful interaction with the Basket API.
   */
  loadBasketAfterBasketItemsChangeSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addItemsToBasketSuccess, updateBasketItemSuccess, deleteBasketItemSuccess, deleteBasketItemsSuccess),
      map(() => loadBasket())
    )
  );

  redirectToBasketIfBasketInteractionHasInfo$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addItemsToBasketSuccess, updateBasketItemSuccess, deleteBasketItemSuccess),
        mapToPayloadProperty('info'),
        filter(info => !!info?.[0]?.message),
        concatMap(() => from(this.router.navigate(['/basket'], { queryParams: { error: true } })))
      ),
    { dispatch: false }
  );
}
