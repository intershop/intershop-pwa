import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { BasketItemDescriptionComponent } from './components/common/basket-item-description/basket-item-description.component';

@NgModule({
  imports: [SharedModule],
  declarations: [BasketItemDescriptionComponent],
  exports: [BasketItemDescriptionComponent],
})
export class CheckoutSharedModule {}
