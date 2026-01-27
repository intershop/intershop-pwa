import { Injectable, InjectionToken, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreConfig, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { logoutUserSuccess, personalizationStatusDetermined } from 'ish-core/store/customer/user';
import { resetSubStatesOnActionsMeta } from 'ish-core/utils/meta-reducers';

import { CategoriesEffects } from './categories/categories.effects';
import { categoriesReducer } from './categories/categories.reducer';
import { FilterEffects } from './filter/filter.effects';
import { filterReducer } from './filter/filter.reducer';
import { ProductInventoryEffects } from './product-inventory/product-inventory.effects';
import { productInventoryReducer } from './product-inventory/product-inventory.reducer';
import { ProductListingEffects } from './product-listing/product-listing.effects';
import { productListingReducer } from './product-listing/product-listing.reducer';
import { ProductPricesEffects } from './product-prices/product-prices.effects';
import { productPricesReducer } from './product-prices/product-prices.reducer';
import { ProductsEffects } from './products/products.effects';
import { productsReducer } from './products/products.reducer';
import { PromotionsEffects } from './promotions/promotions.effects';
import { promotionsReducer } from './promotions/promotions.reducer';
import { RecommendationsEffects } from './recommendations/recommendations.effects';
import { recommendationsReducer } from './recommendations/recommendations.reducer';
import { SearchEffects } from './search/search.effects';
import { searchReducer } from './search/search.reducer';
import { ShoppingState } from './shopping-store';
import { WarrantiesEffects } from './warranties/warranties.effects';
import { warrantiesReducer } from './warranties/warranties.reducer';

const shoppingReducers: ActionReducerMap<ShoppingState> = {
  categories: categoriesReducer,
  products: productsReducer,
  search: searchReducer,
  filter: filterReducer,
  promotions: promotionsReducer,
  productInventory: productInventoryReducer,
  productListing: productListingReducer,
  productPrices: productPricesReducer,
  productRecommendations: recommendationsReducer,
  warranties: warrantiesReducer,
};

const shoppingEffects = [
  CategoriesEffects,
  ProductsEffects,
  SearchEffects,
  FilterEffects,
  PromotionsEffects,
  ProductInventoryEffects,
  ProductListingEffects,
  ProductPricesEffects,
  RecommendationsEffects,
  WarrantiesEffects,
];

@Injectable()
export class DefaultShoppingStoreConfig implements StoreConfig<ShoppingState> {
  metaReducers = [
    resetSubStatesOnActionsMeta<ShoppingState>(
      ['categories', 'search', 'filter', 'productPrices'],
      [personalizationStatusDetermined]
    ),
    resetSubStatesOnActionsMeta<ShoppingState>(['products'], [logoutUserSuccess]),
  ];
}

export const SHOPPING_STORE_CONFIG = new InjectionToken<StoreConfig<ShoppingState>>('shoppingStoreConfig');

@NgModule({
  imports: [
    EffectsModule.forFeature(shoppingEffects),
    StoreModule.forFeature('shopping', shoppingReducers, SHOPPING_STORE_CONFIG),
  ],
  providers: [{ provide: SHOPPING_STORE_CONFIG, useClass: DefaultShoppingStoreConfig }],
})
export class ShoppingStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<ShoppingState>)[]) {
    return StoreModule.forFeature('shopping', pick(shoppingReducers, reducers));
  }
}
