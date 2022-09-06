import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { MatomoTracker } from '@ngx-matomo/tracker';
import { EMPTY } from 'rxjs';
import { filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import {
  addItemsToBasketSuccess,
  deleteBasketItem,
  updateBasketItems,
  loadBasketSuccess,
  submitBasket,
} from 'src/app/core/store/customer/basket/basket.actions';
import { getCurrentBasket } from 'src/app/core/store/customer/basket/basket.selectors';

import { ofProductUrl } from 'ish-core/routing/product/product.route';
import { loadProductPricesSuccess } from 'ish-core/store/shopping/product-prices';
import { getProduct, getSelectedProduct, loadProductSuccess } from 'ish-core/store/shopping/products';
import { log } from 'ish-core/utils/dev/operators';
import { mapToPayloadProperty } from 'ish-core/utils/operators';

@Injectable()
export class MatomoEffects {
  constructor(private actions$: Actions, private store: Store, private readonly tracker: MatomoTracker) {}

  quant = 0;
  sku = '';

  /**
   * Triggers when a product is added to the basket. Sends product data to Matomo and logs to the console.
   */
  matomoAddItem$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addItemsToBasketSuccess),
        mapToPayloadProperty('items'),
        log('Hallo'),
        tap(item => {
          console.log(item);
          this.quant = item[0].quantity;
          this.sku = String(item[0].sku);
          console.log(`Quantity: ${this.quant}`);
          console.log(`SKU: ${this.sku}`);
        }),
        withLatestFrom(this.store.pipe(select(getProduct(this.sku)))),
        tap(item => {
          console.log(item);
        })
      ),
    { dispatch: false }
  );

  /**
   * Is triggered when a product is deleted from the basket. Effects sends info to Matomo and logs event.
   */
  matomoProductDelete$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(deleteBasketItem),
        mapToPayloadProperty('itemId'),
        withLatestFrom(this.store.select(getCurrentBasket)),
        map(([itemId, basket]) => basket.lineItems.filter(lineItem => lineItem.id === itemId)?.[0]),
        filter(item => !!item),
        tap(lineItem => {
          this.tracker.removeEcommerceItem(lineItem.productSKU);
          console.log(`Item with ID:  ${lineItem.productSKU} has been deleted from the basket`);
        })
      ),
    { dispatch: false }
  );

  /**
   * Updates the basket value in matomo. Triggered when product is added, removed and updated.
   */
  matomoUpdateBasketValue$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadBasketSuccess),
        mapToPayloadProperty('basket'),
        tap(basket => {
          this.tracker.trackEcommerceCartUpdate(basket.totals.total.gross);
          console.log('Matomo Basket Updated');
        })
      ),
    { dispatch: false }
  );

  /**
   * Updates products already in basket, when quantity, etc. is updated.
   */
  matomoItemUpdate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateBasketItems),
        mapToPayloadProperty('lineItemUpdates'),
        withLatestFrom(this.store.select(getCurrentBasket)),
        map(([lineItemUpdates, basket]) => basket.lineItems.filter(i => i.id === lineItemUpdates[0].itemId)?.[0]),
        tap(lineItem => {
          this.tracker.addEcommerceItem(
            lineItem.productSKU,
            `SKU: ${lineItem.productSKU}`,
            undefined,
            lineItem.price.gross,
            Number(lineItem.quantity.value)
          );
          console.log(`Update Item: ${lineItem.productSKU}. New Quantity is: ${lineItem.quantity.value}`);
        })
      ),
    { dispatch: false }
  );

  /**
   * Triggered when a product detail page is called. Data is sent to Matomo and logged.
   */
  matomoPageView = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadProductPricesSuccess),
        tap(action => {
          if (action.payload.prices.length === 1) {
            console.log(`Price Site is ${action.payload.prices.length}`);
            const prices = action.payload.prices;
            this.tracker.setEcommerceView('#PV', '#PV', 'category', prices[0].prices.salePrice.net);
            this.tracker.trackPageView();
            console.log(`View product with sku ${prices[0].sku} and price of ${prices[0].prices.salePrice.net}`);
          } else {
            console.log(`Price Site is ${action.payload.prices.length}`);
          }
        })
      ),

    { dispatch: false }
  );

  /**
   * Trigger ResetBasketErrors after the user navigated to another basket/checkout route
   * Add queryParam error=true to the route to prevent resetting errors.
   *
   */
  /*
  orderSubmitTrackingMatomo$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createOrderSuccess),
        // eslint-disable-next-line rxjs/no-unsafe-switchmap
        switchMap(() => {
          this.store.pipe(select(getSelectedOrder)).subscribe(b => {
            this.tracker.trackEcommerceOrder(b.id, b.totals.total.gross);
            this.tracker.trackPageView();
            console.log(`Tracked order with id ${b.id} and total amount of ${b.totals.total.gross}`);
          });

          return EMPTY;
        })
      ),

    { dispatch: false }
  );
  */

  /**
   * Executed when product detail page is called. It sends the information to Matomo using a manual event and not by using the eCommerce view.
   */
  matomoPageViewTagManager = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadProductPricesSuccess),
        map(action => {
          const prices = action.payload.prices;
          console.log(prices.length);
          // track only price array contains one value -> avoids firing on category level
          if (prices.length === 1) {
            this.tracker.trackEvent('ProductPageView', prices[0].sku, 'pageView', 1);
            console.log(`Viewed product with sku ${prices[0].sku}`);
            return action;
          } else {
            return action;
          }
        })
      ),
    { dispatch: false }
  );

  /**
   * Tracks the category when product detail page is called.
   */
  trackProductCategory$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadProductSuccess),
        mapToPayloadProperty('product'),
        withLatestFrom(this.store.pipe(ofProductUrl(), select(getSelectedProduct))),
        filter(([payloadProd, product]) => !!product && payloadProd?.sku === product?.sku),
        tap(([, product]) => {
          const category = product.defaultCategoryId;
          this.tracker.trackEvent('TrackCategory', category);
          console.log(`Category is ${category}`);
        })
      ),
    { dispatch: false }
  );

  /**
   * Trigger ResetBasketErrors after the user navigated to another basket/checkout route
   * Add queryParam error=true to the route to prevent resetting errors.
   *
   */
  orderSubmitTrackingMatomo$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(submitBasket),
        switchMap(() => {
          this.store.pipe(select(getCurrentBasket)).subscribe(b => {
            this.tracker.trackEcommerceOrder(b?.id, b?.totals.total.gross);
            this.tracker.trackPageView();
            console.log(`Tracked order with id ${b?.id} and total amount of ${b?.totals.total.gross}`);
          });

          return EMPTY;
        })
      ),
    { dispatch: false }
  );
}
