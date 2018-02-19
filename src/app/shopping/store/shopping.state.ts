import { createFeatureSelector } from '@ngrx/store';
import { CategoriesState } from './categories/categories.reducer';
import { CompareState } from './compare/compare.reducer';
import { ProductsState } from './products/products.reducer';

export interface ShoppingState {
  categories: CategoriesState;
  products: ProductsState;
  compare: CompareState;
}

export const getShoppingState = createFeatureSelector<ShoppingState>('shopping');
