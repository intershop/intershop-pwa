import { NgModule } from '@angular/core';
import { SharedProductModule } from '../shared/shared-product.module';
import { SharedModule } from '../shared/shared.module';
import { AddressComponent } from './components/common/address/address.component';
import { BasketAddressSummaryComponent } from './components/common/basket-address-summary/basket-address-summary.component';
import { BasketCostSummaryComponent } from './components/common/basket-cost-summary/basket-cost-summary.component';
import { BasketItemsSummaryComponent } from './components/common/basket-items-summary/basket-items-summary.component';
import { CheckoutProgressBarComponent } from './components/common/checkout-progress-bar/checkout-progress-bar.component';

const sharedComponents = [
  AddressComponent,
  BasketAddressSummaryComponent,
  BasketItemsSummaryComponent,
  BasketCostSummaryComponent,
  CheckoutProgressBarComponent,
];
@NgModule({
  imports: [SharedModule, SharedProductModule],
  declarations: [...sharedComponents],
  exports: [...sharedComponents],
})
export class CheckoutSharedModule {}
