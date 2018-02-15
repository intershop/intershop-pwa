import { createFeatureSelector } from '@ngrx/store';
import { CategoriesState } from './categories/categories.reducer';
import { CompareListState } from './compare-list/compare-list.reducer';
import { ProductsState } from './products/products.reducer';

export interface ShoppingState {
  categories: CategoriesState;
  products: ProductsState;
  compareList: CompareListState;
}

export const getShoppingState = createFeatureSelector<ShoppingState>('shopping');
