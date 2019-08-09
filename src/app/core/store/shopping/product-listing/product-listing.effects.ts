import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import b64u from 'b64u';
import { isEqual } from 'lodash-es';
import { distinctUntilChanged, map, mapTo, mergeMap, switchMap, take } from 'rxjs/operators';

import {
  DEFAULT_PRODUCT_LISTING_VIEW_TYPE,
  ENDLESS_SCROLLING_ITEMS_PER_PAGE,
} from 'ish-core/configurations/injection-keys';
import { ViewType } from 'ish-core/models/viewtype/viewtype.types';
import { mapToPayload, whenFalsy, whenTruthy } from 'ish-core/utils/operators';
import { ApplyFilter, LoadProductsForFilter } from '../filter';
import { LoadProductsForCategory } from '../products';
import { SearchProducts } from '../search';

import * as actions from './product-listing.actions';
import { getProductListingViewType } from './product-listing.selectors';

@Injectable()
export class ProductListingEffects {
  constructor(
    @Inject(ENDLESS_SCROLLING_ITEMS_PER_PAGE) private itemsPerPage: number,
    @Inject(DEFAULT_PRODUCT_LISTING_VIEW_TYPE) private defaultViewType: ViewType,
    private actions$: Actions,
    private activatedRoute: ActivatedRoute,
    private store: Store<{}>,
    private router: Router
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

  @Effect()
  loadMoreProducts$ = this.actions$.pipe(
    ofType<actions.LoadMoreProducts>(actions.ProductListingActionTypes.LoadMoreProducts),
    mapToPayload(),
    switchMap(({ id, page }) =>
      this.activatedRoute.queryParamMap.pipe(
        map(params => ({
          sorting: params.get('sorting') || undefined,
          currentPage: page || +params.get('page') || undefined,
          filters: params.get('filters') || undefined,
        })),
        distinctUntilChanged(isEqual),

        mergeMap(({ sorting, currentPage, filters }) => {
          const acts = [
            new actions.SetFilters({ id, filters: filters && b64u.toBase64(b64u.encode(filters)) }),
            new actions.SetSorting({ id, sorting }),
          ];
          if (filters) {
            return [
              ...acts,
              new LoadProductsForFilter({ id: { ...id, filters: b64u.toBase64(b64u.encode(filters)) } }),
              new ApplyFilter({ searchParameter: b64u.toBase64(b64u.encode(filters)) }),
            ];
          } else {
            switch (id.type) {
              case 'category':
                return [...acts, new LoadProductsForCategory({ categoryId: id.value, page: currentPage, sorting })];
              case 'search':
                return [...acts, new SearchProducts({ searchTerm: id.value, page: currentPage, sorting })];
              default:
                return acts;
            }
          }
        })
      )
    )
  );
}
