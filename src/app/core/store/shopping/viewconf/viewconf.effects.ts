import { Inject, Injectable } from '@angular/core';
import { ActivationEnd, NavigationStart, Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { ofRoute } from 'ngrx-router';
import { filter, map, mapTo, mergeMap, switchMapTo, take, withLatestFrom } from 'rxjs/operators';

import { distinctCompareWith } from 'ish-core/utils/operators';
import { ENDLESS_SCROLLING_ITEMS_PER_PAGE } from '../../../configurations/injection-keys';
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
    ofRoute(),
    take(1),
    withLatestFrom(this.store.pipe(select(getItemsPerPage))),
    filter(([, itemsPerPage]) => itemsPerPage !== this.itemsPerPage),
    mapTo(new viewconfActions.SetEndlessScrollingPageSize({ itemsPerPage: this.itemsPerPage }))
  );

  @Effect()
  changeSortBy$ = this.actions$.pipe(
    ofType<viewconfActions.ChangeSortBy>(viewconfActions.ViewconfActionTypes.ChangeSortBy),
    withLatestFrom(this.store.pipe(select(getSelectedCategory))),
    filter(([, category]) => !!category && !!category.uniqueId),
    map(([, category]) => new LoadProductsForCategory({ categoryId: category.uniqueId }))
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
        map(page => (page ? page : 0)),
        distinctCompareWith(this.store.pipe(select(getPagingPage))),
        mergeMap(page =>
          page
            ? [new viewconfActions.DisableEndlessScrolling(), new viewconfActions.SetPage({ pageNumber: page - 1 })]
            : [new viewconfActions.SetPage({ pageNumber: 0 })]
        )
      )
    )
  );
}
