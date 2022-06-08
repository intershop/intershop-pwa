import { Dictionary } from '@ngrx/entity';
import { createSelector, createSelectorFactory, resultMemoize } from '@ngrx/store';
import { isEqual } from 'lodash-es';

import { ProductPriceDetails } from 'ish-core/models/product-prices/product-prices.model';
import { ShoppingState, getShoppingState } from 'ish-core/store/shopping/shopping-store';

import { productPriceAdapter } from './product-prices.reducer';

const getProductPricesState = createSelector(getShoppingState, (state: ShoppingState) => state.productPrices);

const { selectEntities } = productPriceAdapter.getSelectors(getProductPricesState);

export const getProductPrice = (sku: string) =>
  createSelectorFactory<object, ProductPriceDetails>(projector => resultMemoize(projector, isEqual))(
    selectEntities,
    (entities: Dictionary<ProductPriceDetails>) => entities[sku]
  );
