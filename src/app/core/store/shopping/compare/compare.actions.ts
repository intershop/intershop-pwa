import { createAction } from '@ngrx/store';

import { payload } from 'ish-core/utils/ngrx-creators';

export const addToCompare = createAction('[Shopping] Add Product to Compare', payload<{ sku: string }>());

export const removeFromCompare = createAction('[Shopping] Remove Product from Compare', payload<{ sku: string }>());

export const toggleCompare = createAction('[Shopping] Toggle Product Compare', payload<{ sku: string }>());
