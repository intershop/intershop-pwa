import { Inject, Injectable } from '@angular/core';
import { ActivationEnd, NavigationStart, Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { ROUTER_NAVIGATION_TYPE } from 'ngrx-router';
import { filter, map, mapTo, mergeMap, switchMapTo, take, withLatestFrom } from 'rxjs/operators';

import { ENDLESS_SCROLLING_ITEMS_PER_PAGE } from '../../../core/configurations/injection-keys';
import { distinctCompareWith } from '../../../utils/operators';
import { getSelectedCategory } from '../categories';
import { LoadProductsForCategory } from '../products';

import * as viewconfActions from './viewconf.actions';
import { getItemsPerPage, getPagingPage } from './viewconf.selectors';

@Injectable()
export class ViewconfEffects {
  constructor(
    private actions$: Actions,
    private store: Store<{}>,
    private router: Router,
    @Inject(ENDLESS_SCROLLING_ITEMS_PER_PAGE) private itemsPerPage: number
  ) {}

  @Effect()
  setEndlessScrollingParameters$ = this.actions$.pipe(
    ofType(ROUTER_NAVIGATION_TYPE),
    take(1),
    withLatestFrom(this.store.pipe(select(getItemsPerPage))),
    filter(([, itemsPerPage]) => itemsPerPage !== this.itemsPerPage),
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
    // for every navigation
    filter(event => event instanceof NavigationStart),
    switchMapTo(
      this.router.events.pipe(
        // take first ActivationEnd
        filter<ActivationEnd>(event => event instanceof ActivationEnd),
        take(1),
        // extract page
        map(event => Number.parseInt(event.snapshot.queryParams.page, 10)),
        map(page => (!!page ? page : 0)),
        distinctCompareWith(this.store.pipe(select(getPagingPage))),
        mergeMap(
          page =>
            !!page
              ? [new viewconfActions.DisableEndlessScrolling(), new viewconfActions.SetPage(page - 1)]
              : [new viewconfActions.SetPage(0)]
        )
      )
    )
  );
}
