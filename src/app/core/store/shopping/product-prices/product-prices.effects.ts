import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MatomoTracker } from '@ngx-matomo/tracker';
import { debounceTime, filter, map, mergeMap, toArray, window } from 'rxjs/operators';

import { PricesService } from 'ish-core/services/prices/prices.service';
import { mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { loadProductPrices, loadProductPricesSuccess } from '.';

@Injectable()
export class ProductPricesEffects {
  constructor(
    private actions$: Actions,
    private pricesService: PricesService,
    private readonly tracker: MatomoTracker
  ) {}

  loadProductPrices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductPrices),
      mapToPayloadProperty('skus'),
      whenTruthy(),
      window(this.actions$.pipe(ofType(loadProductPrices), debounceTime(500))),
      mergeMap(window$ =>
        window$.pipe(
          toArray(),
          filter(skuArrays => skuArrays.length !== 0), // array should have entries for following map operators
          map(skuArrays => skuArrays.reduce((prev, cur) => prev.concat(cur))), // map two dimensional array list to one dimension
          map(skus => Array.from(new Set(skus))) // remove duplicated entries from sku list
        )
      ),
      mergeMap(skus =>
        this.pricesService.getProductPrices(skus).pipe(map(prices => loadProductPricesSuccess({ prices })))
      )
    )
  );

  sendProductToMatomo$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadProductPricesSuccess),
        map(action => {
          const prices = action.payload.prices;
          this.tracker.setEcommerceView(prices[0].sku, 'name1', 'category', prices[0].prices.salePrice.net);
          this.tracker.trackPageView();
          console.log(`View product with sku ${prices[0].sku} and price of ${prices[0].prices.salePrice.net}`);
          return action;
        })
      ),

    { dispatch: false }
  );
}
