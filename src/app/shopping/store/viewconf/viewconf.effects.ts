import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { ROUTER_NAVIGATION_TYPE } from 'ngrx-router';
import { filter, map, mapTo, take, withLatestFrom } from 'rxjs/operators';
import { ENDLESS_SCROLLING_ITEMS_PER_PAGE } from '../../../core/configurations/injection-keys';
import { getSelectedCategory } from '../categories';
import { LoadProductsForCategory } from '../products';
import { ShoppingState } from '../shopping.state';
import * as viewconfActions from './viewconf.actions';

@Injectable()
export class ViewconfEffects {
  constructor(
    private actions$: Actions,
    private store: Store<ShoppingState>,
    @Inject(ENDLESS_SCROLLING_ITEMS_PER_PAGE) private itemsPerPage: number
  ) {}

  @Effect()
  setEndlessScrollingParameters$ = this.actions$.pipe(
    ofType(ROUTER_NAVIGATION_TYPE),
    take(1),
    mapTo(new viewconfActions.SetEndlessScrollingPageSize(this.itemsPerPage))
  );

  @Effect()
  changeSortBy$ = this.actions$.pipe(
    ofType(viewconfActions.ViewconfActionTypes.ChangeSortBy),
    map((action: viewconfActions.ChangeSortBy) => action.payload),
    withLatestFrom(this.store.pipe(select(getSelectedCategory))),
    filter(([, category]) => !!category && !!category.uniqueId),
    map(([, category]) => new LoadProductsForCategory(category.uniqueId))
  );
}
