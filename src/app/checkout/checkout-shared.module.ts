import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ShoppingBasketComponent } from './components/basket/shopping-basket/shopping-basket.component';

@NgModule({
  imports: [SharedModule],
  declarations: [ShoppingBasketComponent],
  exports: [ShoppingBasketComponent],
})
export class CheckoutSharedModule {}
