import { createFeatureSelector } from '@ngrx/store';

import { CategoriesState } from './categories/categories.reducer';
import { FilterState } from './filter/filter.reducer';
import { ProductListingState } from './product-listing/product-listing.reducer';
import { ProductPricesState } from './product-prices/product-prices.reducer';
import { ProductsState } from './products/products.reducer';
import { PromotionsState } from './promotions/promotions.reducer';
import { SearchState } from './search/search.reducer';

export interface ShoppingState {
  categories: CategoriesState;
  products: ProductsState;
  search: SearchState;
  filter: FilterState;
  promotions: PromotionsState;
  productListing: ProductListingState;
  productPrices: ProductPricesState;
}

export const getShoppingState = createFeatureSelector<ShoppingState>('shopping');
