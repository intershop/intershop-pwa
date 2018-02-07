import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import * as fromCategories from './categories.reducer';
import * as fromCompareList from './compare-list.reducer';
import * as fromProducts from './products.reducer';

export interface ShoppingState {
  categories: fromCategories.CategoriesState;
  products: fromProducts.ProductsState;
  compareList: fromCompareList.CompareListState;
}

export const reducers: ActionReducerMap<ShoppingState> = {
  categories: fromCategories.reducer,
  products: fromProducts.reducer,
  compareList: fromCompareList.reducer
};

export const getShoppingState = createFeatureSelector<ShoppingState>('shopping');
