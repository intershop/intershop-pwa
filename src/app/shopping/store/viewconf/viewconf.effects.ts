import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { filter, map, withLatestFrom } from 'rxjs/operators';
import * as fromCategories from '../categories';
import * as fromProducts from '../products';
import { ShoppingState } from '../shopping.state';
import * as viewconfActions from './viewconf.actions';

@Injectable()
export class ViewconfEffects {
  constructor(
    private actions$: Actions,
    private store: Store<ShoppingState>,
  ) { }

  @Effect()
  changeSortBy$ = this.actions$.pipe(
    ofType(viewconfActions.ViewconfActionTypes.ChangeSortBy),
    map((action: viewconfActions.ChangeSortBy) => action.payload),
    withLatestFrom(this.store.pipe(select(fromCategories.getSelectedCategoryId))),
    filter(([sortBy, categoryUniqueId]) => !!categoryUniqueId),
    map(([sortBy, categoryUniqueId]) => new fromProducts.LoadProductsForCategory(categoryUniqueId))
  );
}
