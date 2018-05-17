import { NgModule } from '@angular/core';
import { SharedProductModule } from '../shared/shared-product.module';
import { SharedModule } from '../shared/shared.module';
import { BasketCostSummaryComponent } from './components/common/basket-cost-summary/basket-cost-summary.component';
import { BasketItemDescriptionComponent } from './components/common/basket-item-description/basket-item-description.component';
import { CheckoutProgressBarComponent } from './components/common/checkout-progress-bar/checkout-progress-bar.component';

const sharedComponents = [BasketItemDescriptionComponent, BasketCostSummaryComponent, CheckoutProgressBarComponent];
@NgModule({
  imports: [SharedModule, SharedProductModule],
  declarations: [...sharedComponents],
  exports: [...sharedComponents],
})
export class CheckoutSharedModule {}
