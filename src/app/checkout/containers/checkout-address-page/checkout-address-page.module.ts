import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsSharedModule } from '../../../forms/forms-shared.module';
import { SharedProductModule } from '../../../shared/shared-product.module';
import { SharedModule } from '../../../shared/shared.module';
import { ShoppingSharedModule } from '../../../shopping/shopping-shared.module';
import { CheckoutSharedModule } from '../../checkout-shared.module';
import { CheckoutAddressComponent } from '../../components/checkout/checkout-address/checkout-address.component';
import { CheckoutAddressPageContainerComponent } from './checkout-address-page.container';
import { checkoutAddressPageRoutes } from './checkout-address-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(checkoutAddressPageRoutes),
    SharedModule,
    CheckoutSharedModule,
    ShoppingSharedModule,
    FormsSharedModule,
    SharedProductModule,
  ],
  declarations: [CheckoutAddressPageContainerComponent, CheckoutAddressComponent],
})
export class CheckoutAddressPageModule {}
