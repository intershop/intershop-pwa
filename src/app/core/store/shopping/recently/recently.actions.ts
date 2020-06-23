import { createAction } from '@ngrx/store';

import { payload } from 'ish-core/utils/ngrx-creators';

export const addToRecently = createAction(
  '[Recently Viewed Internal] Add Product to Recently',
  payload<{ sku: string; group?: string }>()
);

export const clearRecently = createAction('[Recently Viewed Internal] Clear Recently');
