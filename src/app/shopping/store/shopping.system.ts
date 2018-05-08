import { FilterEffects } from './filter/filter.effects';
import { ActionReducerMap } from '@ngrx/store';
import { CategoriesEffects } from './categories/categories.effects';
import { categoriesReducer } from './categories/categories.reducer';
import { CompareEffects } from './compare/compare.effects';
import { compareReducer } from './compare/compare.reducer';
import { ProductsEffects } from './products/products.effects';
import { productsReducer } from './products/products.reducer';
import { RecentlyEffects } from './recently/recently.effects';
import { recentlyReducer } from './recently/recently.reducer';
import { SearchEffects } from './search/search.effects';
import { searchReducer } from './search/search.reducer';
import { ShoppingState } from './shopping.state';
import { ViewconfEffects } from './viewconf/viewconf.effects';
import { viewconfReducer } from './viewconf/viewconf.reducer';
import { filterReducer } from './filter/filter.reducer';

export const shoppingReducers: ActionReducerMap<ShoppingState> = {
  categories: categoriesReducer,
  products: productsReducer,
  compare: compareReducer,
  recently: recentlyReducer,
  search: searchReducer,
  viewconf: viewconfReducer,
  filter: filterReducer,
};

export const shoppingEffects = [
  CategoriesEffects,
  ProductsEffects,
  CompareEffects,
  RecentlyEffects,
  SearchEffects,
  ViewconfEffects,
  FilterEffects,
];
