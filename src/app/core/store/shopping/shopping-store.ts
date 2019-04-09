import { createFeatureSelector } from '@ngrx/store';

import { CategoriesState } from './categories/categories.reducer';
import { CompareState } from './compare/compare.reducer';
import { FilterState } from './filter/filter.reducer';
import { ProductsState } from './products/products.reducer';
import { PromotionsState } from './promotions/promotions.reducer';
import { RecentlyState } from './recently/recently.reducer';
import { SearchState } from './search/search.reducer';
import { ViewconfState } from './viewconf/viewconf.reducer';

export interface ShoppingState {
  categories: CategoriesState;
  products: ProductsState;
  compare: CompareState;
  recently: RecentlyState;
  search: SearchState;
  viewconf: ViewconfState;
  filter: FilterState;
  promotions: PromotionsState;
}

export const getShoppingState = createFeatureSelector<ShoppingState>('shopping');
