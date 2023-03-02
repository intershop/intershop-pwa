import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { MatomoTracker } from '@ngx-matomo/tracker';
import { EMPTY } from 'rxjs';
import { filter, map, mergeMap, withLatestFrom } from 'rxjs/operators';

import { ofProductUrl } from 'ish-core/routing/product/product.route';
import {
  addItemsToBasketSuccess,
  deleteBasketItem,
  deleteBasketItemSuccess,
  loadBasketSuccess,
  submitBasketSuccess,
  updateBasketItemSuccess,
} from 'ish-core/store/customer/basket';
import { getCurrentBasket, getSubmittedBasket } from 'ish-core/store/customer/basket/basket.selectors';
import { getPriceDisplayType } from 'ish-core/store/customer/user';
import { loadProductPricesSuccess } from 'ish-core/store/shopping/product-prices';
import { getProductPrice } from 'ish-core/store/shopping/product-prices/product-prices.selectors';
import { getProduct, getSelectedProduct, loadProductSuccess } from 'ish-core/store/shopping/products';
import { log } from 'ish-core/utils/dev/operators';
import { mapToPayloadProperty } from 'ish-core/utils/operators';

@Injectable()
export class MatomoEffects {
  constructor(private actions$: Actions, private store: Store, private readonly tracker: MatomoTracker) {}

  displayPrice = new String();

  /**
   * Triggers when a product is added to the basket. Sends product data to Matomo and logs to the console.
   */
  addItemToBasket$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addItemsToBasketSuccess),
        mapToPayloadProperty('lineItems'),
        log('addItemToBasketSuccessInfo'),
        map(lineItems =>
          lineItems.forEach(lineItem => {
            // if the display price is not available, assign the display price
            if (!this.displayPrice) {
              this.store.pipe(select(getPriceDisplayType)).subscribe({
                next: item => {
                  this.displayPrice = item;
                },
              });
            }

            console.log(
              `Price Type: ${
                this.displayPrice === 'net' ? lineItem.singleBasePrice.net : lineItem.singleBasePrice.gross
              }`
            );

            // send product data to matomo
            const product$ = this.store.pipe(select(getProduct(lineItem.productSKU)));
            product$.subscribe(product => {
              console.log(product);
              this.tracker.addEcommerceItem(
                lineItem.productSKU,
                product.name,
                product.defaultCategory.name,
                this.displayPrice === 'net' ? lineItem.singleBasePrice.net : lineItem.singleBasePrice.gross,
                lineItem.quantity.value
              );
            });
          })
        )
      ),
    { dispatch: false }
  );

  /**
   * Is triggered when a product is deleted from the basket. Effects sends info to Matomo and logs event.
   */
  deleteProductFromBasket$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(deleteBasketItem),
        mapToPayloadProperty('itemId'),
        withLatestFrom(this.store.pipe(select(getCurrentBasket))),
        map(([itemId, basket]) => basket.lineItems.filter(lineItem => lineItem.id === itemId)?.[0]),
        filter(item => !!item),
        log('DELETE'),
        mergeMap(async item => {
          const deleteAction = await deleteBasketItemSuccess;

          if (deleteAction) {
            this.tracker.removeEcommerceItem(item.productSKU);
            console.log(`Product ${item.id} was deleted from the basket`);
          } else {
            console.log('Something went wrong');
          }
        })
      ),
    { dispatch: false }
  );

  /**
   * Updates the basket value in matomo. Triggered when product is added, removed and updated.
   */
  updateBasketValue$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadBasketSuccess),
        mapToPayloadProperty('basket'),
        map(basket => {
          // check if a display price type is already available, if not assign the price type
          if (!this.displayPrice) {
            this.store.pipe(select(getPriceDisplayType)).subscribe({
              next: item => {
                this.displayPrice = item;
              },
            });
          }

          // if total is undefined, the basket equals 0
          if (!basket.totals.total) {
            this.tracker.trackEcommerceCartUpdate(0);

            console.log('Updated basket total is 0');
          } else {
            this.displayPrice === 'net'
              ? this.tracker.trackEcommerceCartUpdate(basket.totals.total.net)
              : this.tracker.trackEcommerceCartUpdate(basket.totals.total.gross);

            console.log(
              `Updated basket total is ${
                this.displayPrice === 'net' ? basket.totals.total.net : basket.totals.total.gross
              }`
            );
          }
        })
      ),
    { dispatch: false }
  );

  /**
   * Updates products already in basket, when quantity, etc. is updated.
   */
  updateBasketItem$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateBasketItemSuccess),
        mapToPayloadProperty('lineItem'),
        withLatestFrom(this.store.pipe(select(getCurrentBasket))),
        log('UpdateBasketItemSuccessInfo'),
        map(([lineItem, basket]) => basket.lineItems.filter(i => i.id === lineItem.id)?.[0]),
        mergeMap(lineItem =>
          this.store.pipe(
            select(getProduct(lineItem.productSKU)),
            log('Item'),
            map(product => {
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
        mergeMap(product =>
          this.store.pipe(
            select(getProductPrice(product[1].sku)),
            log('Item'),
            map(item => {
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
   * This effects should be seen as a less favorable alternative to the trackPageView effect.
   */
  trackPageViewTagManager = createEffect(
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
   * Trigger ResetBasketErrors after the user navigated to another basket/checkout route
   * Add queryParam error=true to the route to prevent resetting errors.
   *
   */
  trackSubmittedOrders$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(submitBasketSuccess),
        mergeMap(() => {
          this.store.pipe(select(getSubmittedBasket)).subscribe(b => {
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
