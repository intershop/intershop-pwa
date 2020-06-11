import { createAction } from '@ngrx/store';

import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { ProductListingID } from 'ish-core/models/product-listing/product-listing.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const loadFilterForCategory = createAction(
  '[Shopping] Load Filter For Category',
  payload<{ uniqueId: string }>()
);

export const loadFilterSuccess = createAction(
  '[Shopping] Load Filter Success',
  payload<{ filterNavigation: FilterNavigation }>()
);

export const loadFilterFail = createAction('[Shopping] Load Filter Fail', httpError());

export const loadFilterForSearch = createAction('[Shopping] Load Filter for Search', payload<{ searchTerm: string }>());

export const applyFilter = createAction('[Shopping] Apply Filter', payload<{ searchParameter: string }>());

export const applyFilterSuccess = createAction(
  '[Shopping] Apply Filter Success',
  payload<{ availableFilter: FilterNavigation; searchParameter: string }>()
);

export const applyFilterFail = createAction('[Shopping] Apply Filter Fail', httpError());

export const loadProductsForFilter = createAction(
  '[Shopping] Load Products For Filter',
  payload<{ id: ProductListingID; searchParameter: string }>()
);
