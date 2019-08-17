import { createFeatureSelector } from '@ngrx/store';

import { CategoriesState } from './categories/categories.reducer';
import { CompareState } from './compare/compare.reducer';
import { FilterState } from './filter/filter.reducer';
import { ProductListingState } from './product-listing/product-listing.reducer';
import { ProductsState } from './products/products.reducer';
import { PromotionsState } from './promotions/promotions.reducer';
import { RecentlyState } from './recently/recently.reducer';
import { SearchState } from './search/search.reducer';

export interface ShoppingState {
  categories: CategoriesState;
  products: ProductsState;
  compare: CompareState;
  recently: RecentlyState;
  search: SearchState;
  filter: FilterState;
  promotions: PromotionsState;
  productListing: ProductListingState;
}

export const getShoppingState = createFeatureSelector<ShoppingState>('shopping');
