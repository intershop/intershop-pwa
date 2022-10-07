/* eslint-disable ish-custom-rules/ban-imports-file-pattern */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { MatomoTracker } from '@ngx-matomo/tracker';
import { EMPTY } from 'rxjs';
import { filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import {
  addItemsToBasketSuccess,
  deleteBasketItem,
  loadBasketSuccess,
  submitBasket,
  updateBasketItemSuccess,
} from 'src/app/core/store/customer/basket/basket.actions';
import { getCurrentBasket } from 'src/app/core/store/customer/basket/basket.selectors';

import { ofProductUrl } from 'ish-core/routing/product/product.route';
import { loadProductPricesSuccess } from 'ish-core/store/shopping/product-prices';
import { getProductPrice } from 'ish-core/store/shopping/product-prices/product-prices.selectors';
import { getProduct, getSelectedProduct, loadProductSuccess } from 'ish-core/store/shopping/products';
import { log } from 'ish-core/utils/dev/operators';
import { mapToPayloadProperty } from 'ish-core/utils/operators';

@Injectable()
export class MatomoEffects {
  constructor(private actions$: Actions, private store: Store, private readonly tracker: MatomoTracker) {}

  /**
   * Triggers when a product is added to the basket. Sends product data to Matomo and logs to the console.
   */
  matomoAddItemNew$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addItemsToBasketSuccess),
        mapToPayloadProperty('lineItems'),
        log('addItemToBasketSuccessInfo'),
        // eslint-disable-next-line rxjs/no-unsafe-switchmap
        switchMap(lineItem =>
          this.store.pipe(
            select(getProduct(lineItem[0].productSKU)),
            log('Item'),
            tap(product => {
              this.tracker.addEcommerceItem(
                lineItem[0].productSKU,
                product.name,
                product.defaultCategory.name,
                lineItem[0].singleBasePrice.gross,
                lineItem[0].quantity.value
              );
              console.log(
                `${product.name} added to basket with single base price of ${lineItem[0].singleBasePrice.net}`
              );
            })
          )
        )
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
        withLatestFrom(this.store.pipe(select(getCurrentBasket))),
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
          this.tracker.trackEcommerceCartUpdate(basket.totals.total.net);
          console.log(`Updated basket total is ${basket.totals.total.gross}`);
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
        ofType(updateBasketItemSuccess),
        mapToPayloadProperty('lineItem'),
        withLatestFrom(this.store.pipe(select(getCurrentBasket))),
        log('UpdateBasketItemSuccessInfo'),
        map(([lineItem, basket]) => basket.lineItems.filter(i => i.id === lineItem.id)?.[0]),
        // eslint-disable-next-line rxjs/no-unsafe-switchmap
        switchMap(lineItem =>
          this.store.pipe(
            select(getProduct(lineItem.productSKU)),
            log('Item'),
            tap(product => {
              this.tracker.addEcommerceItem(
                lineItem.productSKU,
                product.name,
                product.defaultCategory.name,
                lineItem.singleBasePrice.gross,
                lineItem.quantity.value
              );
              console.log(`${product.name} quantity updated`);
            })
          )
        )
      ),
    { dispatch: false }
  );

  /**
   * Triggered when a product detail page is called. Data is sent to Matomo and logged.
   */
  trackPageView = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadProductSuccess),
        mapToPayloadProperty('product'),
        withLatestFrom(this.store.pipe(ofProductUrl(), select(getSelectedProduct))),
        filter(product => product[0]?.sku === product[1]?.sku),
        log('SingleProduct'),
        switchMap(product =>
          this.store.pipe(
            select(getProductPrice(product[1].sku)),
            log('Item'),
            tap(item => {
              const salePrice = item.prices.salePrice.net;
              this.tracker.setEcommerceView(product[0].sku, product[0].name, product[0].defaultCategoryId, salePrice);
              this.tracker.trackPageView();
              console.log(`Product Sale Price ${salePrice}`);
            })
          )
        )
      ),
    { dispatch: false }
  );

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
