import { createAction } from '@ngrx/store';

import { payload } from 'ish-core/utils/ngrx-creators';

export const addToCompare = createAction('[Compare] Add Product to Compare', payload<{ sku: string }>());

export const removeFromCompare = createAction('[Compare] Remove Product from Compare', payload<{ sku: string }>());

export const toggleCompare = createAction('[Compare] Toggle Product Compare', payload<{ sku: string }>());
