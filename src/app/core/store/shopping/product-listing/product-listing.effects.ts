import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Actions, Effect } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { distinctUntilChanged, map, mapTo, take } from 'rxjs/operators';

import {
  DEFAULT_PRODUCT_LISTING_VIEW_TYPE,
  ENDLESS_SCROLLING_ITEMS_PER_PAGE,
} from 'ish-core/configurations/injection-keys';
import { ViewType } from 'ish-core/models/viewtype/viewtype.types';
import { whenFalsy, whenTruthy } from 'ish-core/utils/operators';

import * as actions from './product-listing.actions';
import { getProductListingViewType } from './product-listing.selectors';

@Injectable()
export class ProductListingEffects {
  constructor(
    @Inject(ENDLESS_SCROLLING_ITEMS_PER_PAGE) private itemsPerPage: number,
    @Inject(DEFAULT_PRODUCT_LISTING_VIEW_TYPE) private defaultViewType: ViewType,
    private actions$: Actions,
    private activatedRoute: ActivatedRoute,
    private store: Store<{}>
  ) {}

  @Effect()
  initializePageSize$ = this.actions$.pipe(
    take(1),
    mapTo(new actions.SetEndlessScrollingPageSize({ itemsPerPage: this.itemsPerPage }))
  );

  @Effect()
  initializeDefaultViewType$ = this.store.pipe(
    select(getProductListingViewType),
    whenFalsy(),
    mapTo(new actions.SetViewType({ viewType: this.defaultViewType }))
  );

  @Effect()
  setViewTypeFromQueryParam$ = this.activatedRoute.queryParamMap.pipe(
    map(params => params.get('view')),
    whenTruthy(),
    distinctUntilChanged(),
    map((viewType: ViewType) => new actions.SetViewType({ viewType }))
  );
}
