import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { map, mergeMap, withLatestFrom } from 'rxjs/operators';

import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { ofUrl } from 'ish-core/store/core/router';
import { loadProductIfNotLoaded } from 'ish-core/store/shopping/products';
import { mapToPayloadProperty } from 'ish-core/utils/operators';

import { addToCompare, removeFromCompare, toggleCompare } from './compare.actions';
import { getCompareProductsSKUs } from './compare.selectors';

@Injectable()
export class CompareEffects {
  constructor(private actions$: Actions, private store: Store) {}

  toggleCompare$ = createEffect(() =>
    this.actions$.pipe(
      ofType(toggleCompare),
      mapToPayloadProperty('sku'),
      withLatestFrom(this.store.pipe(select(getCompareProductsSKUs))),
      map(([sku, skuList]) => ({ sku, isInList: skuList.includes(sku) })),
      map(({ sku, isInList }) => (isInList ? removeFromCompare({ sku }) : addToCompare({ sku })))
    )
  );

  completeProductsForComparePage$ = createEffect(() =>
    this.store.pipe(
      ofUrl(/^\/compare.*/),
      select(getCompareProductsSKUs),
      mergeMap(skus => skus.map(sku => loadProductIfNotLoaded({ sku, level: ProductCompletenessLevel.Detail })))
    )
  );
}
