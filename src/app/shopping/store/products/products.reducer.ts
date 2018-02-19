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

      // TODO: @Ferdinand: for some reason the upsert way did not work as expected
      const cleanedState = productAdapter.removeOne(loadedProduct.sku, state);
      // const upsert: Update<Product> = { id: loadedProduct.sku, changes: loadedProduct };

      return {
        // ...productAdapter.upsertOne(upsert, state),
        ...productAdapter.addOne(loadedProduct, cleanedState),
        loading: false
      };
    }
  }

  return state;
}
