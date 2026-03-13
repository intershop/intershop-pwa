import { Dictionary } from '@ngrx/entity';
import { createSelector, createSelectorFactory, resultMemoize } from '@ngrx/store';
import { isEqual } from 'lodash-es';

import { ProductInventory } from 'ish-core/models/product-inventory/product-inventory.model';
import { ShoppingState, getShoppingState } from 'ish-core/store/shopping/shopping-store';

import { productInventoryAdapter } from './product-inventory.reducer';

const getProductInventoryState = createSelector(getShoppingState, (state: ShoppingState) => state.productInventory);

export const { selectEntities: getProductInventoryEntities } =
  productInventoryAdapter.getSelectors(getProductInventoryState);

export const getProductInventory = (sku: string) =>
  createSelectorFactory<object, ProductInventory>(projector => resultMemoize(projector, isEqual))(
    getProductInventoryEntities,
    (entities: Dictionary<ProductInventory>) => entities[sku]
  );
