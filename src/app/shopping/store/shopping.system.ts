import { ActionReducerMap } from '@ngrx/store';
import { CategoriesEffects } from './categories/categories.effects';
import { categoriesReducer } from './categories/categories.reducer';
import { CompareEffects } from './compare/compare.effects';
import { compareReducer } from './compare/compare.reducer';
import { ProductsEffects } from './products/products.effects';
import { productsReducer } from './products/products.reducer';
import { ShoppingState } from './shopping.state';
import { viewconfReducer } from './viewconf/viewconf.reducer';

export const reducers: ActionReducerMap<ShoppingState> = {
  categories: categoriesReducer,
  products: productsReducer,
  compare: compareReducer,
  viewconf: viewconfReducer,
};

export const effects: any[] = [
  CategoriesEffects,
  ProductsEffects,
  CompareEffects
];
