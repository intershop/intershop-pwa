import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '../../../core/guards/auth.guard';
import { FormsSharedModule } from '../../../forms/forms-shared.module';
import { SharedAddressModule } from '../../../shared/shared-address.module';
import { SharedLineItemListModule } from '../../../shared/shared-line-item-list.module';
import { SharedProductModule } from '../../../shared/shared-product.module';
import { SharedModule } from '../../../shared/shared.module';
import { ShoppingSharedModule } from '../../../shopping/shopping-shared.module';
import { CheckoutSharedModule } from '../../checkout-shared.module';
import { CheckoutAddressComponent } from '../../components/checkout/checkout-address/checkout-address.component';
import { CheckoutPaymentComponent } from '../../components/checkout/checkout-payment/checkout-payment/checkout-payment.component';
import { CheckoutReceiptComponent } from '../../components/checkout/checkout-receipt/checkout-receipt.component';
import { CheckoutReviewComponent } from '../../components/checkout/checkout-review/checkout-review.component';
import { CheckoutShippingComponent } from '../../components/checkout/checkout-shipping/checkout-shipping.component';
import { CheckoutAddressPageContainerComponent } from '../checkout-address-page/checkout-address-page.container';
import { CheckoutPaymentPageContainerComponent } from '../checkout-payment-page/checkout-payment-page.container';
import { CheckoutReceiptPageContainerComponent } from '../checkout-receipt-page/checkout-receipt-page.container';
import { CheckoutReviewPageContainerComponent } from '../checkout-review-page/checkout-review-page.container';
import { CheckoutShippingPageContainerComponent } from '../checkout-shipping-page/checkout-shipping-page.container';

import { CheckoutPageContainerComponent } from './checkout-page.container';
import { checkoutPageRoutes } from './checkout-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(checkoutPageRoutes),
    SharedModule,
    SharedLineItemListModule,
    CheckoutSharedModule,
    ShoppingSharedModule,
    FormsSharedModule,
    SharedProductModule,
    SharedAddressModule,
  ],
  declarations: [
    CheckoutPageContainerComponent,
    CheckoutAddressPageContainerComponent,
    CheckoutAddressComponent,
    CheckoutShippingPageContainerComponent,
    CheckoutShippingComponent,
    CheckoutPaymentPageContainerComponent,
    CheckoutPaymentComponent,
    CheckoutReviewPageContainerComponent,
    CheckoutReviewComponent,
    CheckoutReceiptPageContainerComponent,
    CheckoutReceiptComponent,
  ],
  providers: [AuthGuard],
})
export class CheckoutPageModule {}
