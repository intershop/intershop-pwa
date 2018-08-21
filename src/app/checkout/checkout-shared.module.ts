import { NgModule } from '@angular/core';

import { SharedAddressModule } from '../shared/shared-address.module';
import { SharedProductModule } from '../shared/shared-product.module';
import { SharedModule } from '../shared/shared.module';

import { BasketAddressSummaryComponent } from './components/common/basket-address-summary/basket-address-summary.component';
import { BasketCostSummaryComponent } from './components/common/basket-cost-summary/basket-cost-summary.component';
import { BasketItemsSummaryComponent } from './components/common/basket-items-summary/basket-items-summary.component';
import { CheckoutProgressBarComponent } from './components/common/checkout-progress-bar/checkout-progress-bar.component';
import { InfoBoxComponent } from './components/common/info-box/info-box.component';

const sharedComponents = [
  BasketAddressSummaryComponent,
  BasketItemsSummaryComponent,
  BasketCostSummaryComponent,
  CheckoutProgressBarComponent,
  InfoBoxComponent,
];
@NgModule({
  imports: [SharedModule, SharedProductModule, SharedAddressModule],
  declarations: [...sharedComponents],
  exports: [...sharedComponents],
})
export class CheckoutSharedModule {}
