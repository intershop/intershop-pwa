import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { ProductInventory } from 'ish-core/models/product-inventory/product-inventory.model';

import { productInventoryApiActions } from './product-inventory.actions';

export const productInventoryAdapter = createEntityAdapter<ProductInventory>({
  selectId: inventory => inventory.sku,
});

export type ProductInventoryState = EntityState<ProductInventory>;

const initialState: ProductInventoryState = productInventoryAdapter.getInitialState({});

export const productInventoryReducer = createReducer(
  initialState,
  on(
    productInventoryApiActions.loadProductInventorySuccess,
    (state, action): ProductInventoryState => productInventoryAdapter.upsertMany(action.payload.inventory, state)
  )
);
