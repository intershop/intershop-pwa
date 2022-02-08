import { createAction } from '@ngrx/store';

import { payload } from 'ish-core/utils/ngrx-creators';

import { Store } from '../../models/store/store.model';

export const loadStores = createAction(
  '[Stores Internal] Load Stores',
  payload<{ countryCode: string; postalCode: string; city: string }>()
);

export const loadStoresSuccess = createAction('[Stores API] Load Stores Success', payload<{ stores: Store[] }>());

export const loadStoresFail = createAction('[Stores API] Load Stores Fail');

export const highlightStore = createAction('[Stores] Highlight Store', payload<{ storeId: string }>());
