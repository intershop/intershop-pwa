import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';
import { ShoppingState } from '../shopping.state';
import * as compareActions from './compare.actions';
import { getCompareProductsSKUs } from './compare.selectors';

@Injectable()
export class CompareEffects {
  constructor(
    private actions$: Actions,
    private store: Store<ShoppingState>,
  ) { }

  @Effect()
  toggleCompare$ = this.actions$.pipe(
    ofType(compareActions.CompareActionTypes.ToggleCompare),
    map((action: compareActions.ToggleCompare) => action.payload),
    withLatestFrom(this.store.pipe(select(getCompareProductsSKUs))),
    map(([sku, skuList]) => ({ sku, isInList: skuList.includes(sku) })),
    map(({ sku, isInList }) => {
      return isInList ?
        new compareActions.RemoveFromCompare(sku) :
        new compareActions.AddToCompare(sku);
    })
  );
}
