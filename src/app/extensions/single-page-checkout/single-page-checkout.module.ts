import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { SpaCheckoutSinglePageComponent } from './pages/spa-checkout-single-page/spa-checkout-single-page.component';
import { SpaCheckoutAddressPageModule } from './pages/spa-checkout-address/spa-checkout-address-page.module';
import { SpaCheckoutReviewPageModule } from './pages/spa-checkout-review/spa-checkout-review-page.module';
import { SpaCheckoutReceiptPageModule } from './pages/spa-checkout-receipt/spa-checkout-receipt-page.module';
import { SpaCheckoutShippingPaymentPageModule } from './pages/spa-checkout-shipping-payment/spa-checkout-shipping-payment-page.module';


import { SpaCheckoutAddressComponent } from './pages/spa-checkout-address/spa-checkout-address/spa-checkout-address.component';
import { SpaCheckoutReviewComponent } from './pages/spa-checkout-review/spa-checkout-review/spa-checkout-review.component';
import { SpaCheckoutReceiptComponent } from './pages/spa-checkout-receipt/spa-checkout-receipt/spa-checkout-receipt.component';
import { SpaCheckoutShippingPaymentComponent } from './pages/spa-checkout-shipping-payment/spa-checkout-shipping-payment/spa-checkout-shipping-payment.component';

const checkoutSinglePageRoutes: Routes = [
  {
    path: '',
    component: SpaCheckoutSinglePageComponent,
    children: [
      {
        path: 'address',
        data: { checkoutStep: 1 },
        component: SpaCheckoutAddressComponent,
      },
      {
        path: 'shipping-payment',
        data: { checkoutStep: 2 },
        component: SpaCheckoutShippingPaymentComponent,
      },
      {
        path: 'review',
        data: { checkoutStep: 3 },
        component: SpaCheckoutReviewComponent,
      },
      {
        path: 'receipt',
        data: { checkoutStep: 4 },
        component: SpaCheckoutReceiptComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'address',
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(checkoutSinglePageRoutes),
    SharedModule,
    SpaCheckoutAddressPageModule,
    SpaCheckoutReviewPageModule,
    SpaCheckoutReceiptPageModule,
    SpaCheckoutShippingPaymentPageModule,
  ],
  declarations: [SpaCheckoutSinglePageComponent],
})
export class SinglePageCheckoutModule {}
