import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CategoriesService } from './services/categories/categories.service';
import { ProductsService } from './services/products/products.service';
import { SearchService } from './services/products/search.service';
import { SuggestService } from './services/suggest/suggest.service';
import { ShoppingRoutingModule } from './shopping-routing.module';
import { shoppingEffects, shoppingReducers } from './store/shopping.system';

@NgModule({
  imports: [
    ShoppingRoutingModule,
    StoreModule.forFeature('shopping', shoppingReducers),
    EffectsModule.forFeature(shoppingEffects),
  ],
  providers: [CategoriesService, ProductsService, SearchService, SuggestService],
})
export class ShoppingModule {}
