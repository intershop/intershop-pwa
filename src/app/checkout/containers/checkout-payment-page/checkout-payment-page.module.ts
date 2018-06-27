import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsSharedModule } from '../../../forms/forms-shared.module';
import { SharedProductModule } from '../../../shared/shared-product.module';
import { SharedModule } from '../../../shared/shared.module';
import { ShoppingSharedModule } from '../../../shopping/shopping-shared.module';
import { CheckoutSharedModule } from '../../checkout-shared.module';
import { CheckoutPaymentComponent } from '../../components/checkout/checkout-payment/checkout-payment/checkout-payment.component';
import { CheckoutPaymentPageContainerComponent } from './checkout-payment-page.container';
import { checkoutPaymentPageRoutes } from './checkout-payment-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(checkoutPaymentPageRoutes),
    SharedModule,
    CheckoutSharedModule,
    ShoppingSharedModule,
    FormsSharedModule,
    SharedProductModule,
  ],
  declarations: [CheckoutPaymentPageContainerComponent, CheckoutPaymentComponent],
})
export class CheckoutPaymentPageModule {}
