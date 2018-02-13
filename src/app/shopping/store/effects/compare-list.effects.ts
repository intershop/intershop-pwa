import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { map, withLatestFrom } from 'rxjs/operators';
import * as fromStore from '../';
import * as compareListActions from '../actions/compare-list.actions';
import * as compareListSelectors from '../selectors/compare-list.selectors';

@Injectable()
export class CompareListEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromStore.ShoppingState>,
  ) { }

  @Effect()
  toggleCompare$ = this.actions$.pipe(
    ofType(compareListActions.TOGGLE_COMPARE),
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
