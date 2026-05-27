import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { debounceTime, filter, map, mergeMap, toArray, window } from 'rxjs/operators';

import { ProductCompletenessLevel } from 'ish-core/models/product/product.helper';
import { InventoryService } from 'ish-core/services/inventory/inventory.service';
import { loadProductSuccess } from 'ish-core/store/shopping/products/products.actions';
import { mapToPayloadProperty, mapToProperty, whenTruthy } from 'ish-core/utils/operators';

import { productInventoryApiActions, productInventoryInternalActions } from './product-inventory.actions';

@Injectable()
export class ProductInventoryEffects {
  constructor(
    private actions$: Actions,
    private inventoryService: InventoryService
  ) {}

  loadProductInventories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(productInventoryInternalActions.loadProductInventory),
      mapToPayloadProperty('skus'),
      whenTruthy(),
      window(
        this.actions$.pipe(ofType(productInventoryInternalActions.loadProductInventory), debounceTime(SSR ? 20 : 500))
      ),
      mergeMap(window$ =>
        window$.pipe(
          toArray(),
          filter(skuArrays => skuArrays.length !== 0),
          map(skuArrays => skuArrays.reduce((prev, cur) => prev.concat(cur))),
          map(skus => Array.from(new Set(skus)))
        )
      ),
      mergeMap(skus =>
        this.inventoryService
          .getProductInventory(skus)
          .pipe(map(inventory => productInventoryApiActions.loadProductInventorySuccess({ inventory })))
      )
    )
  );

  loadProductInventoryAfterProductSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductSuccess),
      mapToPayloadProperty('product'),
      filter(product => product?.completenessLevel !== ProductCompletenessLevel.Base),
      mapToProperty('sku'),
      whenTruthy(),
      map(sku => productInventoryInternalActions.loadProductInventory({ skus: [sku] }))
    )
  );
}
