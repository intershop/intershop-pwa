import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import * as fromCategories from './categories.reducer';
import * as fromProducts from './products.reducer';

export interface ShoppingState {
  categories: fromCategories.CategoriesState;
  products: fromProducts.ProductsState;
}

export const reducers: ActionReducerMap<ShoppingState> = {
  categories: fromCategories.reducer,
  products: fromProducts.reducer,
};

export const getShoppingState = createFeatureSelector<ShoppingState>('shopping');
