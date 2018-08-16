import { Inject, Injectable } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { ROUTER_NAVIGATION_TYPE } from 'ngrx-router';
import { distinctUntilChanged, filter, map, mapTo, mergeMap, take, withLatestFrom } from 'rxjs/operators';

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
    private router: Router,
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

  @Effect()
  retrievePageFromRouting$ = this.router.events.pipe(
    filter<ActivationEnd>(event => event instanceof ActivationEnd),
    map(event => Number.parseInt(event.snapshot.queryParams.page, 10)),
    distinctUntilChanged(),
    mergeMap(
      page =>
        !!page
          ? [new viewconfActions.DisableEndlessScrolling(), new viewconfActions.SetPage(page - 1)]
          : [new viewconfActions.SetPage(0)]
    )
  );
}
