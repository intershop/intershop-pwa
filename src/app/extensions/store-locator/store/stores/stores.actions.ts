import { createAction } from '@ngrx/store';

import { payload } from 'ish-core/utils/ngrx-creators';

import { StoreLocation } from '../../models/store-location/store-location.model';

export const loadStores = createAction(
  '[Stores Internal] Load Stores',
  payload<{ countryCode: string; postalCode: string; city: string }>()
);

export const loadStoresSuccess = createAction(
  '[Stores API] Load Stores Success',
  payload<{ stores: StoreLocation[] }>()
);

export const loadStoresFail = createAction('[Stores API] Load Stores Fail');

export const highlightStore = createAction('[Stores] Highlight Store', payload<{ storeId: string }>());
