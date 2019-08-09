import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import b64u from 'b64u';
import { isEqual } from 'lodash-es';
import { EMPTY } from 'rxjs';
import { debounce, distinctUntilChanged, filter, map, mapTo, mergeMap, switchMap, take } from 'rxjs/operators';

import {
  DEFAULT_PRODUCT_LISTING_VIEW_TYPE,
  PRODUCT_LISTING_ITEMS_PER_PAGE,
} from 'ish-core/configurations/injection-keys';
import { ViewType } from 'ish-core/models/viewtype/viewtype.types';
import { mapToPayload, whenFalsy, whenTruthy } from 'ish-core/utils/operators';
import { ApplyFilter, LoadProductsForFilter } from '../filter';
import { LoadProductsForCategory } from '../products';
import { SearchProducts } from '../search';

import * as actions from './product-listing.actions';
import { getProductListingView, getProductListingViewType } from './product-listing.selectors';

@Injectable()
export class ProductListingEffects {
  constructor(
    @Inject(PRODUCT_LISTING_ITEMS_PER_PAGE) private itemsPerPage: number,
    @Inject(DEFAULT_PRODUCT_LISTING_VIEW_TYPE) private defaultViewType: ViewType,
    private actions$: Actions,
    private activatedRoute: ActivatedRoute,
    private store: Store<{}>,
    private router: Router
  ) {}

  @Effect()
  initializePageSize$ = this.actions$.pipe(
    take(1),
    mapTo(new actions.SetProductListingPageSize({ itemsPerPage: this.itemsPerPage }))
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
          id,
          sorting: params.get('sorting') || undefined,
          page: page || +params.get('page') || undefined,
          filters: params.get('filters') || undefined,
        })),
        distinctUntilChanged(isEqual)
      )
    ),
    debounce(({ id, sorting, page, filters }) =>
      this.store.pipe(
        select(getProductListingView, { ...id, sorting, filters }),
        filter(view => view.empty() || !view.productsOfPage(page).length)
      )
    ),
    mergeMap(({ id, sorting, page, filters }) => {
      if (filters) {
        const searchParameter = b64u.toBase64(b64u.encode(filters));
        return [
          new LoadProductsForFilter({ id: { ...id, filters }, searchParameter }),
          new ApplyFilter({ searchParameter }),
        ];
      } else {
        switch (id.type) {
          case 'category':
            return [new LoadProductsForCategory({ categoryId: id.value, page, sorting })];
          case 'search':
            return [new SearchProducts({ searchTerm: id.value, page, sorting })];
          default:
            return EMPTY;
        }
      }
    })
  );
}
