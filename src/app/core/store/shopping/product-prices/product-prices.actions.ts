import { createAction } from '@ngrx/store';

import { ProductPriceDetails } from 'ish-core/models/product-prices/product-prices.model';
import { payload } from 'ish-core/utils/ngrx-creators';

export const loadProductPrices = createAction(
  '[Product Price Internal] Load Product Prices',
  payload<{ skus: string[] }>()
);

export const loadProductPricesSuccess = createAction(
  '[Products API] Load Product Prices Success',
  payload<{ prices: ProductPriceDetails[] }>()
);
