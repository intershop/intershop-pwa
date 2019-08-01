import { createSelector } from '@ngrx/store';
import { flatten, memoize, once, range } from 'lodash-es';
import { identity } from 'rxjs';

import { getShoppingState } from '../shopping-store';

import { ProductListingID, ProductListingType, adapter, serializeProductListingID } from './product-listing.reducer';

const getProductListingState = createSelector(
  getShoppingState,
  state => state.productListing
);

export const getProductListingLoading = createSelector(
  getProductListingState,
  state => state.loading
);

export const getProductListingItemsPerPage = createSelector(
  getProductListingState,
  state => state.itemsPerPage
);

export const getProductListingViewType = createSelector(
  getProductListingState,
  state => state.viewType
);

const { selectEntities: getProductListingEntites } = adapter.getSelectors(getProductListingState);

export interface ProductListingView {
  itemCount: number;
  sortKeys: string[];
  lastPage: number;
  products(): string[];
  productsOfPage(page: number): string[];
  nextPage(): number;
  previousPage(): number;
  allPages(): number[];
  allPagesAvailable(): boolean;
  empty(): boolean;
}

function mergeAllPages(data: ProductListingType) {
  return flatten(data.pages.map(page => data[page]));
}

const createView = memoize(
  (data, itemsPerPage): ProductListingView => {
    const lastPage = data ? data.pages[data.pages.length - 1] : NaN;
    const firstPage = (data && data.pages && data.pages[0]) || NaN;
    return {
      products: once(() => (data ? mergeAllPages(data) : [])),
      productsOfPage: memoize(page => (data && data[page || 1]) || [], identity),
      nextPage: once(() => (data ? (lastPage * itemsPerPage < data.itemCount && lastPage + 1) || undefined : 1)),
      previousPage: once(() => (data && firstPage !== 1 ? firstPage - 1 : undefined)),
      lastPage,
      itemCount: data ? data.itemCount : 0,
      sortKeys: data ? data.sortKeys : [],
      allPages: once(() => (data ? range(1, Math.ceil(data.itemCount / itemsPerPage) + 1) : [])),
      allPagesAvailable: once(() =>
        !data ? false : range(1, Math.ceil(data.itemCount / itemsPerPage) + 1).every(idx => !!data[idx])
      ),
      empty: () => !data || data.pages.length === 0,
    };
  },
  (data: ProductListingType) => data
);

export const getProductListingView = createSelector(
  getProductListingEntites,
  getProductListingItemsPerPage,
  (entities, itemsPerPage, id: ProductListingID) =>
    entities && createView(entities[serializeProductListingID(id)], itemsPerPage)
);
