import { createFeatureSelector } from '@ngrx/store';

import { CategoriesState } from './categories/categories.reducer';
import { FilterState } from './filter/filter.reducer';
import { ProductInventoryState } from './product-inventory/product-inventory.reducer';
import { ProductListingState } from './product-listing/product-listing.reducer';
import { ProductPricesState } from './product-prices/product-prices.reducer';
import { ProductsState } from './products/products.reducer';
import { PromotionsState } from './promotions/promotions.reducer';
import { RecommendationsState } from './recommendations/recommendations.reducer';
import { SearchState } from './search/search.reducer';
import { WarrantiesState } from './warranties/warranties.reducer';

export interface ShoppingState {
  categories: CategoriesState;
  products: ProductsState;
  search: SearchState;
  filter: FilterState;
  promotions: PromotionsState;
  productInventory: ProductInventoryState;
  productListing: ProductListingState;
  productPrices: ProductPricesState;
  productRecommendations: RecommendationsState;
  warranties: WarrantiesState;
}

export const getShoppingState = createFeatureSelector<ShoppingState>('shopping');
