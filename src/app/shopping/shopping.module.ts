import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ProductsService } from './services/products/products.service';
import { SearchService } from './services/products/search.service';
import { ShoppingRoutingModule } from './shopping-routing.module';
import { shoppingEffects, shoppingReducers } from './store/shopping.system';

@NgModule({
  imports: [
    ShoppingRoutingModule,
    StoreModule.forFeature('shopping', shoppingReducers),
    EffectsModule.forFeature(shoppingEffects),
  ],
  providers: [ProductsService, SearchService],
})
export class ShoppingModule {}
