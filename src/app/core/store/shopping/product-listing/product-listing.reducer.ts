import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { ProductListingID, ProductListingType } from 'ish-core/models/product-listing/product-listing.model';
import { ViewType } from 'ish-core/models/viewtype/viewtype.types';
import { loadProductsForFilter } from 'ish-core/store/shopping/filter';
import {
  loadProductsForCategory,
  loadProductsForCategoryFail,
  loadProductsForMaster,
  loadProductsForMasterFail,
} from 'ish-core/store/shopping/products';
import { searchProducts, searchProductsFail } from 'ish-core/store/shopping/search';
import { setLoadingOn, unsetLoadingAndErrorOn, unsetLoadingOn } from 'ish-core/utils/ngrx-creators';
import { formParamsToString } from 'ish-core/utils/url-form-params';

import { setProductListingPageSize, setProductListingPages, setViewType } from './product-listing.actions';

export function serializeProductListingID(id: ProductListingID) {
  return `${id.type}@${id.value}@${formParamsToString(id.filters)}@${id.sorting}`;
}

export const adapter = createEntityAdapter<ProductListingType>({
  selectId: item => serializeProductListingID(item.id),
});

/**
 * the state type of a product listing
 *
 * Each product listing state is persisted and populated individually in the store.
 *
 * To get a specific state use the {@link getProductListingView} selector.
 *
 * Each state is identified by an ID which consists of type and value:
 * i.e. { id: 'search', value: 'Asus' }, { id: 'category', value: 'Computers' }
 *
 * New pages retrieved via {@link SetProductListingPages} actions are merged
 * into the state in the same entity. The view supplied by the selector helps
 * retrieving all necessary properties through helper methods
 */
export interface ProductListingState extends EntityState<ProductListingType> {
  loading: boolean;
  itemsPerPage: number;
  viewType: ViewType;
  currentSettings: { [id: string]: Pick<ProductListingID, 'filters' | 'sorting'> };
}

const initialState: ProductListingState = adapter.getInitialState({
  loading: false,
  itemsPerPage: undefined,
  viewType: undefined,
  currentSettings: {},
});

/**
 * find all pages in the given entity and return as array of integers
 */
function calculatePages(entry: ProductListingType) {
  return (
    Object.keys(entry)
      // Object.keys returns strings so convert all keys to integers
      .map(x => +x)
      // filter out all non-pages (NaN)
      .filter(x => !!x)
      .sort((a, b) => a - b)
  );
}

function mergeCurrentSettings(
  currentSettings: { [id: string]: Pick<ProductListingID, 'filters' | 'sorting'> },
  id: ProductListingID,
  newSettings: Pick<ProductListingID, 'filters' | 'sorting'>
) {
  const serializedId = serializeProductListingID({ type: id.type, value: id.value });
  const oldSettings = currentSettings[serializedId] || {};
  return { ...currentSettings, [serializedId]: { ...oldSettings, ...newSettings } };
}

export const productListingReducer = createReducer(
  initialState,
  on(setProductListingPageSize, (state, action) => ({
    ...state,
    itemsPerPage: action.payload.itemsPerPage,
  })),
  on(setViewType, (state, action) => ({ ...state, viewType: action.payload.viewType })),
  setLoadingOn(searchProducts, loadProductsForCategory, loadProductsForFilter, loadProductsForMaster),
  unsetLoadingOn(setProductListingPages),
  unsetLoadingAndErrorOn(searchProductsFail, loadProductsForCategoryFail, loadProductsForMasterFail),
  on(setProductListingPages, (state, action) => {
    const pages =
      action.payload.pages ||
      calculatePages({ ...state.entities[serializeProductListingID(action.payload.id)], ...action.payload });

    const currentSettings = mergeCurrentSettings(state.currentSettings, action.payload.id, {
      sorting: action.payload.id.sorting,
      filters: action.payload.id.filters,
    });

    return adapter.upsertOne({ ...action.payload, pages }, { ...state, currentSettings });
  })
);
