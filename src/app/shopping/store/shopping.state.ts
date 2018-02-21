import { createFeatureSelector } from '@ngrx/store';
import { CategoriesState } from './categories/categories.reducer';
import { CompareState } from './compare/compare.reducer';
import { ProductsState } from './products/products.reducer';
import { ViewconfState } from './viewconf/viewconf.reducer';

export interface ShoppingState {
  categories: CategoriesState;
  products: ProductsState;
  compare: CompareState;
  viewconf: ViewconfState;
}

export const getShoppingState = createFeatureSelector<ShoppingState>('shopping');
