import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsSharedModule } from '../../../forms/forms-shared.module';
import { SharedProductModule } from '../../../shared/shared-product.module';
import { SharedModule } from '../../../shared/shared.module';
import { ShoppingSharedModule } from '../../../shopping/shopping-shared.module';
import { CheckoutSharedModule } from '../../checkout-shared.module';
import { CheckoutShippingComponent } from '../../components/checkout/checkout-shipping/checkout-shipping.component';
import { CheckoutShippingPageContainerComponent } from './checkout-shipping-page.container';
import { checkoutShippingPageRoutes } from './checkout-shipping-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(checkoutShippingPageRoutes),
    SharedModule,
    CheckoutSharedModule,
    ShoppingSharedModule,
    FormsSharedModule,
    SharedProductModule,
  ],
  declarations: [CheckoutShippingPageContainerComponent, CheckoutShippingComponent],
})
export class CheckoutShippingPageModule {}
