import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { map, mergeMap, withLatestFrom } from 'rxjs/operators';

import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { ofUrl } from 'ish-core/store/core/router';
import { LoadProductIfNotLoaded } from 'ish-core/store/shopping/products';
import { mapToPayloadProperty } from 'ish-core/utils/operators';

import { AddToCompare, CompareActionTypes, RemoveFromCompare, ToggleCompare } from './compare.actions';
import { getCompareProductsSKUs } from './compare.selectors';

@Injectable()
export class CompareEffects {
  constructor(private actions$: Actions, private store: Store) {}

  @Effect()
  toggleCompare$ = this.actions$.pipe(
    ofType<ToggleCompare>(CompareActionTypes.ToggleCompare),
    mapToPayloadProperty('sku'),
    withLatestFrom(this.store.pipe(select(getCompareProductsSKUs))),
    map(([sku, skuList]) => ({ sku, isInList: skuList.includes(sku) })),
    map(({ sku, isInList }) => (isInList ? new RemoveFromCompare({ sku }) : new AddToCompare({ sku })))
  );

  @Effect()
  completeProductsForComparePage$ = this.store.pipe(
    ofUrl(/^\/compare.*/),
    select(getCompareProductsSKUs),
    mergeMap(skus => skus.map(sku => new LoadProductIfNotLoaded({ sku, level: ProductCompletenessLevel.Detail })))
  );
}
