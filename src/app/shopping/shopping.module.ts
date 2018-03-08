import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ProductsService } from './services/products/products.service';
import { ShoppingRoutingModule } from './shopping-routing.module';
import { effects, reducers } from './store/shopping.system';

@NgModule({
  imports: [
    ShoppingRoutingModule,
    StoreModule.forFeature('shopping', reducers),
    EffectsModule.forFeature(effects)
  ],
  providers: [
    ProductsService
  ]
})

export class ShoppingModule { }
