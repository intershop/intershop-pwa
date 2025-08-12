import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { ProductInventoryDetails } from 'ish-core/models/product-inventories/product-inventories.model';

import { loadProductInventorySuccess } from './product-inventories.actions';

export const productInventoryAdapter = createEntityAdapter<ProductInventoryDetails>({
  selectId: inventory => inventory.sku,
});

export type ProductInventoryState = EntityState<ProductInventoryDetails>;

const initialState: ProductInventoryState = productInventoryAdapter.getInitialState({});

export const productInventoryReducer = createReducer(
  initialState,
  on(loadProductInventorySuccess, (state, action) =>
    productInventoryAdapter.upsertMany(action.payload.inventory, state)
  )
);
