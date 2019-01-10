import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';

import { mapToPayloadProperty } from 'ish-core/utils/operators';

import * as compareActions from './compare.actions';
import { getCompareProductsSKUs } from './compare.selectors';

@Injectable()
export class CompareEffects {
  constructor(private actions$: Actions, private store: Store<{}>) {}

  @Effect()
  toggleCompare$ = this.actions$.pipe(
    ofType<compareActions.ToggleCompare>(compareActions.CompareActionTypes.ToggleCompare),
    mapToPayloadProperty('sku'),
    withLatestFrom(this.store.pipe(select(getCompareProductsSKUs))),
    map(([sku, skuList]) => ({ sku, isInList: skuList.includes(sku) })),
    map(({ sku, isInList }) =>
      isInList ? new compareActions.RemoveFromCompare({ sku }) : new compareActions.AddToCompare({ sku })
    )
  );
}
