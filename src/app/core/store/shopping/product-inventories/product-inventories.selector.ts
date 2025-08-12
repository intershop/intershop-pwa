import { Dictionary } from '@ngrx/entity';
import { createSelector, createSelectorFactory, resultMemoize } from '@ngrx/store';
import { isEqual } from 'lodash-es';

import { ProductInventoryDetails } from 'ish-core/models/product-inventories/product-inventories.model';
import { ShoppingState, getShoppingState } from 'ish-core/store/shopping/shopping-store';

import { productInventoryAdapter } from './product-inventories.reducer';

const getProductInventoryState = createSelector(getShoppingState, (state: ShoppingState) => state.productInventory);

const { selectEntities } = productInventoryAdapter.getSelectors(getProductInventoryState);

export const getProductInventory = (sku: string) =>
  createSelectorFactory<object, ProductInventoryDetails>(projector => resultMemoize(projector, isEqual))(
    selectEntities,
    (entities: Dictionary<ProductInventoryDetails>) => entities[sku]
  );
