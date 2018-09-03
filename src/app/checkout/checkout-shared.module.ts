import { NgModule } from '@angular/core';

import { SharedAddressModule } from '../shared/shared-address.module';
import { SharedProductModule } from '../shared/shared-product.module';
import { SharedModule } from '../shared/shared.module';

import { BasketAddressSummaryComponent } from './components/common/basket-address-summary/basket-address-summary.component';
import { BasketItemsSummaryComponent } from './components/common/basket-items-summary/basket-items-summary.component';
import { CheckoutProgressBarComponent } from './components/common/checkout-progress-bar/checkout-progress-bar.component';

const sharedComponents = [BasketAddressSummaryComponent, BasketItemsSummaryComponent, CheckoutProgressBarComponent];
@NgModule({
  imports: [SharedModule, SharedProductModule, SharedAddressModule],
  declarations: [...sharedComponents],
  exports: [...sharedComponents],
})
export class CheckoutSharedModule {}
