import { createAction } from '@ngrx/store';

import { payload } from 'ish-core/utils/ngrx-creators';

import { RecentlyViewedProduct } from '../../models/recently-viewed-product/recently-viewed-product.model';

export const addToRecently = createAction(
  '[Recently Viewed Internal] Add Product to Recently',
  payload<RecentlyViewedProduct>()
);

export const clearRecently = createAction('[Recently Viewed Internal] Clear Recently');
