import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { forkJoin, of } from 'rxjs';
import {
  catchError,
  concatMap,
  defaultIfEmpty,
  filter,
  map,
  mergeMap,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';
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
   * Updates the invoice address of the basket.
   * Triggers the internal UpdateBasket action that handles the actual updating operation.
   */
  @Effect()
  updateBasketInvoiceAddress$ = this.actions$.pipe(
    ofType(basketActions.BasketActionTypes.UpdateBasketInvoiceAddress),
    map(
      (action: basketActions.UpdateBasketInvoiceAddress) =>
        new basketActions.UpdateBasket({
          invoiceToAddress: { id: action.payload },
        })
    )
  );

  /**
   * Updates the common shipping address of the basket.
   * Triggers the internal UpdateBasket action that handles the actual updating operation.
   */
  @Effect()
  updateBasketShippingAddress$ = this.actions$.pipe(
    ofType(basketActions.BasketActionTypes.UpdateBasketShippingAddress),
    map(
      (action: basketActions.UpdateBasketInvoiceAddress) =>
        new basketActions.UpdateBasket({
          commonShipToAddress: { id: action.payload },
        })
    )
  );

  /**
   * Update basket effect.
   */
  @Effect()
  updateBasket$ = this.actions$.pipe(
    ofType(basketActions.BasketActionTypes.UpdateBasket),
    map((action: basketActions.UpdateBasket) => action.payload),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    concatMap(([payload, basket]) => {
      return this.basketService
        .updateBasket(basket.id, payload)
        .pipe(
          map(() => new basketActions.UpdateBasketSuccess()),
          catchError(error => of(new basketActions.UpdateBasketFail(error)))
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
        .filter(basketItem => !products[basketItem.productSKU])
        .map(basketItem => new LoadProduct(basketItem.productSKU)),
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
   * Only triggers if basket is set or action payload contains basketId.
   */
  @Effect()
  addItemsToBasket$ = this.actions$.pipe(
    ofType<basketActions.AddItemsToBasket>(basketActions.BasketActionTypes.AddItemsToBasket),
    map((action: basketActions.AddItemsToBasket) => action.payload),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    filter(([payload, basket]) => !!basket || !!payload.basketId),
    switchMap(([payload, basket]) => {
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
   * Update basket items effect.
   * Triggers update item request if item quantity has changed and is greater zero
   * Triggers delete item request if item quantity set to zero
   */
  @Effect()
  updateBasketItems$ = this.actions$.pipe(
    ofType(basketActions.BasketActionTypes.UpdateBasketItems),
    map((action: basketActions.UpdateBasketItems) => action.payload),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    map(([items, basket]) => {
      const basketItems = basket.lineItems;
      const updatedItems = [];
      if (basketItems) {
        for (const basketItem of basketItems) {
          for (const item of items) {
            if (basketItem.id === item.itemId && basketItem.quantity.value !== item.quantity) {
              updatedItems.push(item);
            }
          }
        }
      }
      return { updatedItems, basket };
    }),

    switchMap(({ updatedItems, basket }) =>
      forkJoin(
        updatedItems.map(item => {
          if (item.quantity > 0) {
            return this.basketService.updateBasketItem(item.itemId, item.quantity, basket.id);
          }
          return this.basketService.deleteBasketItem(item.itemId, basket.id);
        })
      ).pipe(
        defaultIfEmpty(undefined),
        map(() => new basketActions.UpdateBasketItemsSuccess()),
        catchError(error => of(new basketActions.UpdateBasketItemsFail(error)))
      )
    )
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
   * Trigger a LoadBasketItems action after a successful basket loading.
   */
  @Effect()
  loadBasketItemsAfterBasketLoad$ = this.actions$.pipe(
    ofType(basketActions.BasketActionTypes.LoadBasketSuccess),
    map((action: basketActions.LoadBasketSuccess) => action.payload),
    map(basket => new basketActions.LoadBasketItems(basket.id))
  );

  /**
   * Get current basket if missing and call AddItemsToBasketAction
   * Only triggers if basket is unset set and action payload does not contain basketId.
   */
  @Effect()
  getBasketBeforeAddItemsToBasket$ = this.actions$.pipe(
    ofType<basketActions.AddItemsToBasket>(basketActions.BasketActionTypes.AddItemsToBasket),
    map((action: basketActions.AddItemsToBasket) => action.payload),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    filter(([payload, basket]) => !basket && !payload.basketId),
    // TODO: add create basket if LoadBasket does not create basket anymore
    mergeMap(([payload, basket]) => {
      return forkJoin(of(payload), this.basketService.getBasket());
    }),
    map(([payload, newBasket]) => {
      return new basketActions.AddItemsToBasket({ items: payload.items, basketId: newBasket.id });
    })
  );

  /**
   * Trigger an AddItemsToBasket action after LoginUserSuccess, if basket items are present from pre login state.
   */
  @Effect()
  mergeBasketAfterLogin$ = this.actions$.pipe(
    ofType(UserActionTypes.LoginUserSuccess),
    switchMap(() => this.basketService.getBasket()),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    filter(
      ([newBasket, currentBasket]) => currentBasket && currentBasket.lineItems && currentBasket.lineItems.length > 0
    ),
    map(([newBasket, currentBasket]) => {
      const items = currentBasket.lineItems.map(lineItem => ({
        sku: lineItem.productSKU,
        quantity: lineItem.quantity.value,
      }));

      return new basketActions.AddItemsToBasket({ items: items, basketId: newBasket.id });
    })
  );

  /**
   * Trigger LoadBasket action after LoginUserSucces, if no pre login state basket items are present.
   */
  @Effect()
  loadBasketAfterLogin$ = this.actions$.pipe(
    ofType(UserActionTypes.LoginUserSuccess),
    switchMap(() => this.basketService.getBasket()),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    filter(
      ([newBasket, currentBasket]) => !currentBasket || !currentBasket.lineItems || currentBasket.lineItems.length === 0
    ),
    map(() => new basketActions.LoadBasket())
  );

  /**
   * Triggers a LoadBasket action after successful interaction with the Basket API.
   */
  @Effect()
  loadBasketAfterBasketChangeSuccess$ = this.actions$.pipe(
    ofType(
      basketActions.BasketActionTypes.UpdateBasketSuccess,
      basketActions.BasketActionTypes.AddItemsToBasketSuccess,
      basketActions.BasketActionTypes.UpdateBasketItemsSuccess,
      basketActions.BasketActionTypes.DeleteBasketItemSuccess
    ),
    map(() => new basketActions.LoadBasket())
  );

  /**
   * Trigger ResetBasket action after LogoutUser.
   */
  @Effect()
  resetBasketAfterLogout$ = this.actions$.pipe(
    ofType(UserActionTypes.LogoutUser),
    map(() => new basketActions.ResetBasket())
  );
}
