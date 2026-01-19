import { createActionGroup } from '@ngrx/store';

import { ProductInventory } from 'ish-core/models/product-inventory/product-inventory.model';
import { payload } from 'ish-core/utils/ngrx-creators';

export const productInventoryInternalActions = createActionGroup({
  source: 'Product Inventory Internal',
  events: {
    'Load Product Inventory': payload<{ skus: string[] }>(),
  },
});

export const productInventoryApiActions = createActionGroup({
  source: 'Product Inventory API',
  events: {
    'Load Product Inventory Success': payload<{ inventory: ProductInventory[] }>(),
  },
});
