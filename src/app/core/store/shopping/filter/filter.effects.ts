import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { range } from 'lodash-es';
import { map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { mapErrorToAction, mapToPayload, mapToPayloadProperty } from 'ish-core/utils/operators';
import { FilterService } from '../../../services/filter/filter.service';
import { CategoriesActionTypes, getSelectedCategory } from '../categories';
import { SetProductListingPages, getProductListingItemsPerPage } from '../product-listing';
import { ProductListingID, ProductListingType } from '../product-listing/product-listing.reducer';
import { SearchActionTypes, SearchProductsSuccess } from '../search';

import * as filterActions from './filter.actions';

@Injectable()
export class FilterEffects {
  constructor(private actions$: Actions, private store: Store<{}>, private filterService: FilterService) {}

  @Effect()
  loadAvailableFilterForCategories$ = this.actions$.pipe(
    ofType<filterActions.LoadFilterForCategory>(filterActions.FilterActionTypes.LoadFilterForCategory),
    mapToPayloadProperty('category'),
    mergeMap(category =>
      this.filterService.getFilterForCategory(category).pipe(
        map(filterNavigation => new filterActions.LoadFilterForCategorySuccess({ filterNavigation })),
        mapErrorToAction(filterActions.LoadFilterForCategoryFail)
      )
    )
  );

  @Effect()
  loadFilterForSearch$ = this.actions$.pipe(
    ofType<filterActions.LoadFilterForSearch>(filterActions.FilterActionTypes.LoadFilterForSearch),
    mapToPayloadProperty('searchTerm'),
    mergeMap(searchTerm =>
      this.filterService.getFilterForSearch(searchTerm).pipe(
        map(filterNavigation => new filterActions.LoadFilterForSearchSuccess({ filterNavigation })),
        mapErrorToAction(filterActions.LoadFilterForSearchFail)
      )
    )
  );

  @Effect()
  loadFilterIfCategoryWasSelected$ = this.actions$.pipe(
    ofType(CategoriesActionTypes.SelectedCategoryAvailable),
    withLatestFrom(this.store.pipe(select(getSelectedCategory))),
    map(([, category]) => new filterActions.LoadFilterForCategory({ category }))
  );

  @Effect()
  loadFilterForSearchIfSearchSuccess$ = this.actions$.pipe(
    ofType<SearchProductsSuccess>(SearchActionTypes.SearchProductsSuccess),
    mapToPayloadProperty('searchTerm'),
    map(searchTerm => new filterActions.LoadFilterForSearch({ searchTerm }))
  );

  @Effect()
  applyFilter$ = this.actions$.pipe(
    ofType<filterActions.ApplyFilter>(filterActions.FilterActionTypes.ApplyFilter),
    mapToPayload(),
    mergeMap(({ filterId: filterName, searchParameter }) =>
      this.filterService.applyFilter(filterName, searchParameter).pipe(
        map(availableFilter => new filterActions.ApplyFilterSuccess({ availableFilter, filterName, searchParameter })),
        mapErrorToAction(filterActions.ApplyFilterFail)
      )
    )
  );

  @Effect()
  loadFilteredProducts$ = this.actions$.pipe(
    ofType<filterActions.LoadProductsForFilter>(filterActions.FilterActionTypes.LoadProductsForFilter),
    mapToPayload(),
    withLatestFrom(this.store.pipe(select(getProductListingItemsPerPage))),
    switchMap(([{ id }, itemsPerPage]) =>
      this.filterService
        .getProductSkusForFilter('default', id.filters)
        .pipe(mergeMap(newProducts => [new SetProductListingPages(this.constructPages(newProducts, id, itemsPerPage))]))
    )
  );

  constructPages(products: string[], id: ProductListingID, itemsPerPage: number): ProductListingType {
    const pages = range(0, Math.ceil(products.length / itemsPerPage)).map(n =>
      products.slice(n * itemsPerPage, (n + 1) * itemsPerPage)
    );
    return {
      id,
      itemCount: products.length,
      sortKeys: [],
      ...pages.reduce((acc, val, idx) => ({ ...acc, [idx + 1]: val }), {}),
      pages: pages.map((_, idx) => idx + 1),
    };
  }
}
