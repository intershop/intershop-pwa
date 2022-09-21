import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NoServerSideRenderingGuard } from 'ish-core/guards/no-server-side-rendering.guard';
import { SharedModule } from 'ish-shared/shared.module';

import { CheckoutAddressPageModule } from '../checkout-address/checkout-address-page.module';
import { CheckoutPaymentPageModule } from '../checkout-payment/checkout-payment-page.module';
import { CheckoutReceiptPageModule } from '../checkout-receipt/checkout-receipt-page.module';
import { CheckoutReviewPageModule } from '../checkout-review/checkout-review-page.module';
import { CheckoutShippingPageModule } from '../checkout-shipping/checkout-shipping-page.module';

import { CheckoutPageComponent } from './checkout-page.component';
import { CheckoutPageGuard } from './checkout-page.guard';
import { CheckoutProgressBarComponent } from './checkout-progress-bar/checkout-progress-bar.component';

const checkoutPageRoutes: Routes = [
  {
    path: '',
    canActivate: [NoServerSideRenderingGuard],
    component: CheckoutPageComponent,
    children: [
      {
        path: 'address',
        canActivate: [CheckoutPageGuard],
        data: { checkoutStep: 1 },
        component: CheckoutAddressPageModule.component,
      },
      {
        path: 'shipping',
        canActivate: [CheckoutPageGuard],
        data: { checkoutStep: 2 },
        component: CheckoutShippingPageModule.component,
      },
      {
        path: 'payment',
        canActivate: [CheckoutPageGuard],
        data: { checkoutStep: 3 },
        component: CheckoutPaymentPageModule.component,
      },
      {
        path: 'review',
        canActivate: [CheckoutPageGuard],
        data: { checkoutStep: 4 },
        component: CheckoutReviewPageModule.component,
      },
      {
        path: 'receipt',
        data: { checkoutStep: 5 },
        component: CheckoutReceiptPageModule.component,
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
    CheckoutAddressPageModule,
    CheckoutPaymentPageModule,
    CheckoutReceiptPageModule,
    CheckoutReviewPageModule,
    CheckoutShippingPageModule,
    RouterModule.forChild(checkoutPageRoutes),
    SharedModule,
  ],
  declarations: [CheckoutPageComponent, CheckoutProgressBarComponent],
})
export class CheckoutPageModule {}
