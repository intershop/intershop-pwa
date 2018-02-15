import { ActionReducerMap } from '@ngrx/store';
import { CategoriesEffects } from './categories/categories.effects';
import { categoriesReducer } from './categories/categories.reducer';
import { CompareListEffects } from './compare-list/compare-list.effects';
import { compareListReducer } from './compare-list/compare-list.reducer';
import { ProductsEffects } from './products/products.effects';
import { productsReducer } from './products/products.reducer';
import { ShoppingState } from './shopping.state';

export const reducers: ActionReducerMap<ShoppingState> = {
  categories: categoriesReducer,
  products: productsReducer,
  compareList: compareListReducer,
};

export const effects: any[] = [
  CategoriesEffects,
  ProductsEffects,
  CompareListEffects,
];
