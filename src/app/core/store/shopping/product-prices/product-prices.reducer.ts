import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { ProductPriceDetails } from 'ish-core/models/product-prices/product-prices.model';

import { loadProductPricesSuccess } from '.';

export const productPriceAdapter = createEntityAdapter<ProductPriceDetails>({
  selectId: product => product.sku,
});

export type ProductPricesState = EntityState<ProductPriceDetails>;

const initialState: ProductPricesState = productPriceAdapter.getInitialState({});

export const productPricesReducer = createReducer(
  initialState,
  on(loadProductPricesSuccess, (state, action) => productPriceAdapter.upsertMany(action.payload.prices, state))
);
