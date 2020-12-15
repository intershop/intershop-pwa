import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { SpaCheckoutSinglePageComponent } from './pages/spa-checkout-single-page/spa-checkout-single-page.component';
import { SpaCheckoutAddressPageModule } from './pages/spa-checkout-address/spa-checkout-address-page.module';
import { SpaCheckoutReviewPageModule } from './pages/spa-checkout-review/spa-checkout-review-page.module';
import { SpaCheckoutReceiptPageModule } from './pages/spa-checkout-receipt/spa-checkout-receipt-page.module';
import { SpaCheckoutShippingPaymentPageModule } from './pages/spa-checkout-shipping-payment/spa-checkout-shipping-payment-page.module';

const checkoutSinglePageRoutes: Routes = [
  {
    path: '',
    component: SpaCheckoutSinglePageComponent,
  },
];
@NgModule({
  imports: [
    SharedModule,
    SpaCheckoutAddressPageModule,
    SpaCheckoutReviewPageModule,
    SpaCheckoutReceiptPageModule,
    SpaCheckoutShippingPaymentPageModule,
    RouterModule.forChild(checkoutSinglePageRoutes),
  ],
  declarations: [SpaCheckoutSinglePageComponent],
})
export class SinglePageCheckoutModule {}
