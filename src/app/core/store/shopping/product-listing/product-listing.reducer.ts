import { EntityState, createEntityAdapter } from '@ngrx/entity';

import { ViewType } from 'ish-core/models/viewtype/viewtype.types';

import { ProductListingAction, ProductListingActionTypes } from './product-listing.actions';

export interface ProductListingID {
  type: string;
  value: string;
  sorting?: string;
  filters?: string;
}

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
export interface ProductListingType {
  id: ProductListingID;
  itemCount: number;
  sortKeys: string[];
  [page: number]: string[];
  pages?: number[];
}

export function serializeProductListingID(id: ProductListingID) {
  return `${id.type}@${id.value}@${id.filters || id.sorting}`;
}

export const adapter = createEntityAdapter<ProductListingType>({
  selectId: item => serializeProductListingID(item.id),
});

export interface ProductListingState extends EntityState<ProductListingType> {
  loading: boolean;
  itemsPerPage: number;
  viewType: ViewType;
  currentSettings: { [id: string]: Pick<ProductListingID, 'filters' | 'sorting'> };
}

export const initialState: ProductListingState = adapter.getInitialState({
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
  const serializedId = serializeProductListingID(id);
  const oldSettings = currentSettings[serializedId] || {};
  return { ...currentSettings, [serializedId]: { ...oldSettings, ...newSettings } };
}

export function productListingReducer(state = initialState, action: ProductListingAction): ProductListingState {
  switch (action.type) {
    case ProductListingActionTypes.SetEndlessScrollingPageSize:
      return { ...state, itemsPerPage: action.payload.itemsPerPage };

    case ProductListingActionTypes.SetViewType:
      return { ...state, viewType: action.payload.viewType };

    case ProductListingActionTypes.SetSorting:
      return {
        ...state,
        currentSettings: mergeCurrentSettings(state.currentSettings, action.payload.id, {
          sorting: action.payload.sorting,
        }),
      };

    case ProductListingActionTypes.SetFilters:
      return {
        ...state,
        currentSettings: mergeCurrentSettings(state.currentSettings, action.payload.id, {
          filters: action.payload.filters,
        }),
      };

    case ProductListingActionTypes.LoadMoreProducts:
      return { ...state, loading: true };

    case ProductListingActionTypes.SetProductListingPages: {
      // merge payload with previous entity in state
      const newState = adapter.upsertOne(action.payload, {
        ...state,
        loading: false,
      });
      // overwrite pages property when not supplied by the action payload
      if (!action.payload.pages) {
        const entity = newState.entities[serializeProductListingID(action.payload.id)];
        entity.pages = calculatePages(entity);
      }
      return newState;
    }
  }

  return state;
}
