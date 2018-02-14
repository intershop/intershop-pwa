import { createFeatureSelector } from '@ngrx/store';
import * as fromCategories from './categories/categories.reducer';
import * as fromCompareList from './compare-list/compare-list.reducer';
import * as fromProducts from './products/products.reducer';

export interface ShoppingState {
  categories: fromCategories.CategoriesState;
  products: fromProducts.ProductsState;
  compareList: fromCompareList.CompareListState;
}

export const getShoppingState = createFeatureSelector<ShoppingState>('shopping');
