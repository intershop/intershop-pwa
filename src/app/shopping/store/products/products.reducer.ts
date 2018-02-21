import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Product } from '../../../models/product/product.model';
import { ProductsAction, ProductsActionTypes } from './products.actions';

export const productAdapter: EntityAdapter<Product> = createEntityAdapter<Product>({
  selectId: product => product.sku
});

export interface ProductsState extends EntityState<Product> {
  loading: boolean;
}

export const initialState: ProductsState = productAdapter.getInitialState({
  loading: false
});

export function productsReducer(
  state = initialState,
  action: ProductsAction
): ProductsState {
  switch (action.type) {

    case ProductsActionTypes.LoadProduct: {
      return {
        ...state,
        loading: true
      };
    }

    case ProductsActionTypes.LoadProductFail: {
      return {
        ...state,
        loading: false
      };
    }

    case ProductsActionTypes.LoadProductSuccess: {
      const loadedProduct = action.payload;

      /* WORKAROUND: upsert overrides the `id` property and doesn't work as expected
       * see https://github.com/ngrx/platform/issues/817
       * we will use remove and add until then
       * const upsert: Update<Product> = { id: loadedProduct.sku, changes: loadedProduct };
       * ...productAdapter.upsertOne(upsert, state),
       */
      const cleanedState = productAdapter.removeOne(loadedProduct.sku, state);

      return {
        ...productAdapter.addOne(loadedProduct, cleanedState),
        loading: false
      };
    }
  }

  return state;
}
