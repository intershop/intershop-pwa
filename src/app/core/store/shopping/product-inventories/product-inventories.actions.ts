import { createAction } from '@ngrx/store';

import { ProductInventoryDetails } from 'ish-core/models/product-inventories/product-inventories.model';
import { payload } from 'ish-core/utils/ngrx-creators';

export const loadProductInventory = createAction(
  '[Product Inventory] Load Product Inventory',
  payload<{ skus: string[] }>()
);

export const loadProductInventorySuccess = createAction(
  '[Products API] Load Product Inventory Success',
  payload<{ inventory: ProductInventoryDetails[] }>()
);
