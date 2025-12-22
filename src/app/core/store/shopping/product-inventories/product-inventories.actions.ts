import { createActionGroup } from '@ngrx/store';

import { ProductInventory } from 'ish-core/models/product-inventory/product-inventory.model';
import { payload } from 'ish-core/utils/ngrx-creators';

export const productInventoriesInternalActions = createActionGroup({
  source: 'Product Inventories Internal',
  events: {
    'Load Product Inventories': payload<{ skus: string[] }>(),
  },
});

export const productInventoriesApiActions = createActionGroup({
  source: 'Product Inventories API',
  events: {
    'Load Product Inventories Success': payload<{ inventory: ProductInventory[] }>(),
  },
});
