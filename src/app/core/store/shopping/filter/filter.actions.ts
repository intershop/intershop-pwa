import { createAction } from '@ngrx/store';

import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { ProductListingID } from 'ish-core/models/product-listing/product-listing.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const loadFilterForCategory = createAction(
  '[Filter Internal] Load Filter For Category',
  payload<{ uniqueId: string }>()
);

export const loadFilterSuccess = createAction(
  '[Filter API] Load Filter Success',
  payload<{ filterNavigation: FilterNavigation }>()
);

export const loadFilterFail = createAction('[Filter API] Load Filter Fail', httpError());

export const loadFilterForSearch = createAction(
  '[Filter Internal] Load Filter for Search',
  payload<{ searchTerm: string }>()
);

export const applyFilter = createAction('[Filter] Apply Filter', payload<{ searchParameter: string }>());

export const applyFilterSuccess = createAction(
  '[Filter API] Apply Filter Success',
  payload<{ availableFilter: FilterNavigation; searchParameter: string }>()
);

export const applyFilterFail = createAction('[Filter API] Apply Filter Fail', httpError());

export const loadProductsForFilter = createAction(
  '[Filter Internal] Load Products For Filter',
  payload<{ id: ProductListingID; searchParameter: string }>()
);
