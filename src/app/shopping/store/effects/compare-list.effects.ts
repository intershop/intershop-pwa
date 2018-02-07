import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
// import * as fromStore from '../';
import * as compareListActions from '../actions/compare-list.actions';

// function getRandomInt(min, max) {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

@Injectable()
export class CompareListEffects {
  constructor(
    private actions$: Actions,
    // private store: Store<fromStore.ShoppingState>,
  ) { }

  @Effect({ dispatch: false })
  toggleCompare$ = this.actions$.pipe(
    ofType(compareListActions.TOGGLE_COMPARE),
    // withLatestFrom()
  );
}
