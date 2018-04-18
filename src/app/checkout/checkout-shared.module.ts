import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ShoppingBasketEmptyComponent } from './components/basket/shopping-basket-empty/shopping-basket-empty.component';
import { ShoppingBasketComponent } from './components/basket/shopping-basket/shopping-basket.component';

@NgModule({
  imports: [SharedModule],
  declarations: [ShoppingBasketComponent, ShoppingBasketEmptyComponent],
  exports: [ShoppingBasketComponent, ShoppingBasketEmptyComponent],
})
export class CheckoutSharedModule {}
