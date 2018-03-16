import { ActionReducerMap } from '@ngrx/store';
import { CategoriesEffects } from './categories/categories.effects';
import { categoriesReducer } from './categories/categories.reducer';
import { CompareEffects } from './compare/compare.effects';
import { compareReducer } from './compare/compare.reducer';
import { ProductsEffects } from './products/products.effects';
import { productsReducer } from './products/products.reducer';
import { SearchEffects } from './search/search.effects';
import { searchReducer } from './search/search.reducer';
import { ShoppingState } from './shopping.state';
import { ViewconfEffects } from './viewconf/viewconf.effects';
import { viewconfReducer } from './viewconf/viewconf.reducer';

export const shoppingReducers: ActionReducerMap<ShoppingState> = {
  categories: categoriesReducer,
  products: productsReducer,
  compare: compareReducer,
  viewconf: viewconfReducer,
  search: searchReducer
};

export const shoppingEffects: any[] = [
  CategoriesEffects,
  ProductsEffects,
  CompareEffects,
  ViewconfEffects,
  SearchEffects
];
