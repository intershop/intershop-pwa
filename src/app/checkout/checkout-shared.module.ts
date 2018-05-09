import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { BasketCostSummaryComponent } from './components/common/basket-cost-summary/basket-cost-summary.component';
import { BasketItemDescriptionComponent } from './components/common/basket-item-description/basket-item-description.component';

@NgModule({
  imports: [SharedModule],
  declarations: [BasketItemDescriptionComponent, BasketCostSummaryComponent],
  exports: [BasketItemDescriptionComponent, BasketCostSummaryComponent],
})
export class CheckoutSharedModule {}
