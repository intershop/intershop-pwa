import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { debounceTime, filter, map, mergeMap, toArray, window } from 'rxjs/operators';

import { InventoriesService } from 'ish-core/services/inventories/inventories.service';
import { mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { loadProductInventory, loadProductInventorySuccess } from './product-inventories.actions';

@Injectable()
export class ProductInventoriesEffects {
  constructor(private actions$: Actions, private inventoriesService: InventoriesService) {}

  loadProductInventory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductInventory),
      mapToPayloadProperty('skus'),
      whenTruthy(),
      window(this.actions$.pipe(ofType(loadProductInventory), debounceTime(500))),
      mergeMap(window$ =>
        window$.pipe(
          toArray(),
          filter(skuArrays => skuArrays.length !== 0),
          map(skuArrays => skuArrays.reduce((prev, cur) => prev.concat(cur))),
          map(skus => Array.from(new Set(skus)))
        )
      ),
      mergeMap(skus =>
        this.inventoriesService
          .getProductInventory(skus)
          .pipe(map(inventory => loadProductInventorySuccess({ inventory })))
      )
    )
  );
}
