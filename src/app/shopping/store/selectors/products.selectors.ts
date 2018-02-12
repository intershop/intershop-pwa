import { createSelector } from '@ngrx/store';
import * as fromRouter from '../../../core/store/router';
import { Product } from '../../../models/product/product.model';
import * as fromFeature from '../reducers';
import * as fromProducts from '../reducers/products.reducer';

export const getProductsState = createSelector(
  fromFeature.getShoppingState, (state: fromFeature.ShoppingState) => state.products
);

export const {
  selectEntities: getProductEntities,
  selectAll: getProducts,
} = fromProducts.productAdapter.getSelectors(getProductsState);

export const getSelectedProductId = createSelector(
  fromRouter.getRouterState,
  router => router && router.state && router.state.params.sku
);

export const getSelectedProduct = createSelector(
  getProductEntities,
  getSelectedProductId,
  (entities, id): Product => entities[id]
);

export const getProductLoading = createSelector(
  getProductsState,
  products => products.loading
);
