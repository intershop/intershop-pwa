import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { CategoriesEffects } from './categories/categories.effects';
import { categoriesReducer } from './categories/categories.reducer';
import { CompareEffects } from './compare/compare.effects';
import { compareReducer } from './compare/compare.reducer';
import { FilterEffects } from './filter/filter.effects';
import { filterReducer } from './filter/filter.reducer';
import { ProductListingEffects } from './product-listing/product-listing.effects';
import { productListingReducer } from './product-listing/product-listing.reducer';
import { ProductsEffects } from './products/products.effects';
import { productsReducer } from './products/products.reducer';
import { PromotionsEffects } from './promotions/promotions.effects';
import { promotionsReducer } from './promotions/promotions.reducer';
import { RecentlyEffects } from './recently/recently.effects';
import { recentlyReducer } from './recently/recently.reducer';
import { SearchEffects } from './search/search.effects';
import { searchReducer } from './search/search.reducer';
import { ShoppingState } from './shopping-store';

const shoppingReducers: ActionReducerMap<ShoppingState> = {
  categories: categoriesReducer,
  products: productsReducer,
  compare: compareReducer,
  recently: recentlyReducer,
  search: searchReducer,
  filter: filterReducer,
  promotions: promotionsReducer,
  productListing: productListingReducer,
};

const shoppingEffects = [
  CategoriesEffects,
  ProductsEffects,
  CompareEffects,
  RecentlyEffects,
  SearchEffects,
  FilterEffects,
  PromotionsEffects,
  ProductListingEffects,
];

@NgModule({
  imports: [EffectsModule.forFeature(shoppingEffects), StoreModule.forFeature('shopping', shoppingReducers)],
})
export class ShoppingStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<ShoppingState>)[]) {
    return StoreModule.forFeature('shopping', pick(shoppingReducers, reducers));
  }
}
