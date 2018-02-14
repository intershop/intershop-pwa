import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';
import { ShoppingState } from '../shopping.state';
import * as compareListActions from './compare-list.actions';
import { CompareListActionTypes } from './compare-list.actions';
import * as compareListSelectors from './compare-list.selectors';

@Injectable()
export class CompareListEffects {
  constructor(
    private actions$: Actions,
    private store: Store<ShoppingState>,
  ) { }

  @Effect()
  toggleCompare$ = this.actions$.pipe(
    ofType(CompareListActionTypes.TOGGLE_COMPARE),
    map((action: compareListActions.ToggleCompare) => action.payload),
    withLatestFrom(this.store.select(compareListSelectors.getCompareList)),
    map(([sku, skuList]) => ({ sku, isInList: skuList.includes(sku) })),
    map(({ sku, isInList }) => {
      return isInList ?
        new compareListActions.RemoveFromCompareList(sku) :
        new compareListActions.AddToCompareList(sku);
    })
  );
}
