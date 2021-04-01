import { Dictionary } from '@ngrx/entity';
import { createSelector, createSelectorFactory, resultMemoize } from '@ngrx/store';
import { flatten, isEqual, memoize, once, range } from 'lodash-es';
import { identity } from 'rxjs';

import {
  ProductListingID,
  ProductListingType,
  ProductListingView,
} from 'ish-core/models/product-listing/product-listing.model';
import { getShoppingState } from 'ish-core/store/shopping/shopping-store';

import { adapter, serializeProductListingID } from './product-listing.reducer';

const getProductListingState = createSelector(getShoppingState, state => state.productListing);

export const getProductListingLoading = createSelector(getProductListingState, state => state.loading);

export const getProductListingItemsPerPage = createSelector(getProductListingState, state => state.itemsPerPage);

export const getProductListingViewType = createSelector(getProductListingState, state => state.viewType);

const getProductListingSettings = createSelector(getProductListingState, state => state.currentSettings);

const { selectEntities: getProductListingEntities } = adapter.getSelectors(getProductListingState);

function mergeAllPages(data: ProductListingType) {
  return flatten(data.pages.map(page => data[page]));
}

function calculatePageIndices(currentPage: number, itemCount: number, itemsPerPage: number) {
  const lastPage = Math.ceil(itemCount / itemsPerPage);
  const currentWindowStart = Math.floor(currentPage / 10) * 10 || 1;
  const currentWindowEnd = Math.min(Math.floor(currentPage / 10) * 10 + 9, lastPage);

  const before = [];

  if (currentWindowEnd - 30 > 0) {
    const prevWindowStart = Math.min(1, currentWindowStart - 29);
    before.push({ value: prevWindowStart, display: `${prevWindowStart}-${currentWindowEnd - 30}` });
  }

  if (currentWindowEnd - 20 > 0) {
    const prevWindowStart = Math.max(1, currentWindowStart - 20);
    before.push({ value: prevWindowStart, display: `${prevWindowStart}-${currentWindowEnd - 20}` });
  }
  if (currentWindowEnd - 10 > 0) {
    const prevWindowStart = Math.max(1, currentWindowStart - 10);
    before.push({ value: prevWindowStart, display: `${prevWindowStart}-${currentWindowEnd - 10}` });
  }

  const after = [];
  if (currentWindowEnd + 1 === lastPage) {
    after.push({ value: currentWindowEnd + 1, display: `${currentWindowEnd + 1}` });
  }
  if (currentWindowEnd + 1 < lastPage) {
    after.push({ value: currentWindowEnd + 1, display: `${currentWindowEnd + 1}-${lastPage}` });
  }

  return [
    ...before,
    ...range(currentWindowStart, currentWindowEnd + 1).map(idx => ({ value: idx, display: `${idx}` })),
    ...after,
  ];
}

const createView = (data: ProductListingType, itemsPerPage: number): ProductListingView => {
  const lastPage = data ? data.pages[data.pages.length - 1] : NaN;
  const firstPage = (data && data.pages && data.pages[0]) || NaN;
  return {
    products: once(() => (data ? mergeAllPages(data) : [])),
    productsOfPage: memoize(page => (data && data[page || 1]) || [], identity),
    nextPage: once(() => (data ? (lastPage * itemsPerPage < data.itemCount && lastPage + 1) || undefined : 1)),
    previousPage: once(() => (data && firstPage !== 1 ? firstPage - 1 : undefined)),
    lastPage,
    itemCount: data ? data.itemCount : 0,
    sortableAttributes: data ? data.sortableAttributes : [],
    pageIndices: memoize(
      (currentPage?) => (data ? calculatePageIndices(currentPage || lastPage, data.itemCount, itemsPerPage) : []),
      identity
    ),
    allPagesAvailable: once(() =>
      !data ? false : range(1, Math.ceil(data.itemCount / itemsPerPage) + 1).every(idx => !!data[idx])
    ),
    empty: () => !data || data.pages.length === 0,
  };
};

function calculateLookUpID(
  id: ProductListingID,
  settings: { [id: string]: Pick<ProductListingID, 'filters' | 'sorting'> }
) {
  const currentSettings = settings[serializeProductListingID(id)] || {};
  return serializeProductListingID({ ...currentSettings, ...id });
}

export const getProductListingView = (id: ProductListingID) =>
  createSelectorFactory<object, ProductListingView>(projector => resultMemoize(projector, isEqual))(
    getProductListingEntities,
    getProductListingItemsPerPage,
    getProductListingSettings,
    (
      entities: Dictionary<ProductListingType>,
      itemsPerPage: number,
      settings: { [id: string]: Pick<ProductListingID, 'filters' | 'sorting'> }
    ) => entities && createView(entities[calculateLookUpID(id, settings)], itemsPerPage)
  );
