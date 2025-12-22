import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { debounceTime, filter, map, mergeMap, toArray, window } from 'rxjs/operators';

import { InventoryService } from 'ish-core/services/inventory/inventory.service';
import { mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { productInventoriesApiActions, productInventoriesInternalActions } from './product-inventories.actions';

@Injectable()
export class ProductInventoriesEffects {
  constructor(private actions$: Actions, private inventoryService: InventoryService) {}

  loadProductInventories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(productInventoriesInternalActions.loadProductInventories),
      mapToPayloadProperty('skus'),
      whenTruthy(),
      window(this.actions$.pipe(ofType(productInventoriesInternalActions.loadProductInventories), debounceTime(500))),
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
          .pipe(map(inventory => productInventoriesApiActions.loadProductInventoriesSuccess({ inventory })))
      )
    )
  );
}
