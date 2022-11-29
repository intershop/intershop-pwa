import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { MatomoTracker } from '@ngx-matomo/tracker';
import { EMPTY } from 'rxjs';
import { filter, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';

import { ofProductUrl } from 'ish-core/routing/product/product.route';
import {
  addItemsToBasketSuccess,
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
            let displayPrice = new String();
            this.store.pipe(select(getPriceDisplayType)).subscribe({
              next: item => {
                displayPrice = item;
              },
            });
            console.log(
              `Price Type: ${displayPrice === 'net' ? lineItem.singleBasePrice.net : lineItem.singleBasePrice.gross}`
            );

            const product$ = this.store.pipe(select(getProduct(lineItem.productSKU)));
            product$.subscribe(product => {
              log('Selected Item');
              console.log(product);
              this.tracker.addEcommerceItem(
                lineItem.productSKU,
                product.name,
                product.defaultCategory.name,
                displayPrice === 'net' ? lineItem.singleBasePrice.net : lineItem.singleBasePrice.gross,
                lineItem.quantity.value
              );
            });
          })
        )
      ),
    { dispatch: false }
  );

  // addItemToBasket$ = createEffect(
  //   () =>
  //     this.actions$.pipe(
  //       ofType(addItemsToBasketSuccess),
  //       mapToPayloadProperty('lineItems'),
  //       log('addItemToBasketSuccessInfo'),
  //       // eslint-disable-next-line rxjs/no-unsafe-switchmap
  //       switchMap(lineItem =>
  //         lineItem.map((item) => {
  //           this.store.pipe(
  //             select(getProduct(item.productSKU)),
  //             log('addItem'),
  //             tap(product => {
  //               this.tracker.addEcommerceItem(
  //                 item.productSKU,
  //                 product.name,
  //                 product.defaultCategory.name,
  //                 item.singleBasePrice.gross,
  //                 item.quantity.value
  //               );
  //               console.log(this.store.pipe(select(getPriceDisplayType)));
  //               console.log(`${product.name} added to basket with single base price of ${item.singleBasePrice.net}`);
  //             })
  //           );
  //         })
  //       )
  //     ),
  //   { dispatch: false }
  // );

  /**
   * Is triggered when a product is deleted from the basket. Effects sends info to Matomo and logs event.
   */
  deleteProductFromBasket$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(deleteBasketItemSuccess),
        mapToPayloadProperty('itemId'),
        withLatestFrom(this.store.pipe(select(getCurrentBasket))),
        map(([itemId, basket]) => basket.lineItems.filter(lineItem => lineItem.id === itemId)?.[0]),
        filter(item => !!item),
        tap(lineItem => {
          this.tracker.removeEcommerceItem(lineItem.productSKU);
          console.log(`Item with ID:  ${lineItem.productSKU} has been deleted from the basket`);
          return lineItem;
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
        tap(basket => {
          this.tracker.trackEcommerceCartUpdate(basket.totals.total.net);
          this.store.pipe(select(getPriceDisplayType), log('Update is '));
          console.log(`Updated basket total is ${basket.totals.total.gross}`);
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
        mergeMap(product =>
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
   * Tracks the category when product detail page is called.
   */
  /*
  trackProductCategoryTagManager$ = createEffect(
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
  */

  // trackProductCategoryTagManager$ = createEffect(
  //   () => this.actions$.pipe(
  //     ofType(loadProductSuccess),
  //     switchMap(() => this.store.pipe(
  //       ofProductUrl(),
  //       select(getProduct('123')),
  //       whenTruthy(),
  //       map(item => item.)
  //       )
  //     )),
  //   { dispatch: false }
  // );

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
