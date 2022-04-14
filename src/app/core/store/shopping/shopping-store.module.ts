import { Injectable, InjectionToken, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreConfig, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { personalizationStatusDetermined } from 'ish-core/store/customer/user';
import { resetSubStatesOnActionsMeta } from 'ish-core/utils/meta-reducers';

import { CategoriesEffects } from './categories/categories.effects';
import { categoriesReducer } from './categories/categories.reducer';
import { FilterEffects } from './filter/filter.effects';
import { filterReducer } from './filter/filter.reducer';
import { ProductListingEffects } from './product-listing/product-listing.effects';
import { productListingReducer } from './product-listing/product-listing.reducer';
import { ProductPricesEffects } from './product-prices/product-prices.effects';
import { productPricesReducer } from './product-prices/product-prices.reducer';
import { ProductsEffects } from './products/products.effects';
import { productsReducer } from './products/products.reducer';
import { PromotionsEffects } from './promotions/promotions.effects';
import { promotionsReducer } from './promotions/promotions.reducer';
import { SearchEffects } from './search/search.effects';
import { searchReducer } from './search/search.reducer';
import { ShoppingState } from './shopping-store';

const shoppingReducers: ActionReducerMap<ShoppingState> = {
  categories: categoriesReducer,
  products: productsReducer,
  search: searchReducer,
  filter: filterReducer,
  promotions: promotionsReducer,
  productListing: productListingReducer,
  productPrices: productPricesReducer,
};

const shoppingEffects = [
  CategoriesEffects,
  ProductsEffects,
  SearchEffects,
  FilterEffects,
  PromotionsEffects,
  ProductListingEffects,
  ProductPricesEffects,
];

@Injectable()
export class DefaultShoppingStoreConfig implements StoreConfig<ShoppingState> {
  metaReducers = [
    resetSubStatesOnActionsMeta<ShoppingState>(
      ['categories', 'products', 'search', 'filter', 'productPrices'],
      [personalizationStatusDetermined]
    ),
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
