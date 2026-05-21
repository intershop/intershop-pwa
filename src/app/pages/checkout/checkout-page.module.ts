import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { noServerSideRenderingGuard } from 'ish-core/guards/no-server-side-rendering.guard';
import { SharedModule } from 'ish-shared/shared.module';

import { CheckoutAddressPageModule } from '../checkout-address/checkout-address-page.module';
import { CheckoutPaymentPageModule } from '../checkout-payment/checkout-payment-page.module';
import { CheckoutReceiptPageModule } from '../checkout-receipt/checkout-receipt-page.module';
import { CheckoutReviewPageModule } from '../checkout-review/checkout-review-page.module';
import { CheckoutShippingPageModule } from '../checkout-shipping/checkout-shipping-page.module';

import { CheckoutPageComponent } from './checkout-page.component';
import { checkoutPageGuard } from './checkout-page.guard';
import { CheckoutProgressBarComponent } from './checkout-progress-bar/checkout-progress-bar.component';

const checkoutPageRoutes: Routes = [
  {
    path: '',
    canActivate: [noServerSideRenderingGuard],
    component: CheckoutPageComponent,
    children: [
      {
        path: 'address',
        canActivate: [checkoutPageGuard],
        data: {
          checkoutStep: 1,
          meta: {
            title: 'checkout.addresses.heading',
            robots: 'noindex, nofollow',
          },
        },
        component: CheckoutAddressPageModule.component,
      },
      {
        path: 'shipping',
        canActivate: [checkoutPageGuard],
        data: {
          checkoutStep: 2,
          meta: {
            title: 'checkout.shipping.pagetitle',
            robots: 'noindex, nofollow',
          },
        },
        component: CheckoutShippingPageModule.component,
      },
      {
        path: 'payment',
        canActivate: [checkoutPageGuard],
        data: {
          checkoutStep: 3,
          meta: {
            title: 'checkout.payment.pagetitle',
            robots: 'noindex, nofollow',
          },
        },
        component: CheckoutPaymentPageModule.component,
      },
      {
        path: 'review',
        canActivate: [checkoutPageGuard],
        data: {
          checkoutStep: 4,
          meta: {
            title: 'checkout.progress.review.label',
            robots: 'noindex, nofollow',
          },
        },
        component: CheckoutReviewPageModule.component,
      },
      {
        path: 'receipt',
        data: {
          checkoutStep: 5,
          meta: {
            title: 'checkout.progress.receipt.label',
            robots: 'noindex, nofollow',
          },
        },
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
  declarations: [CheckoutPageComponent, CheckoutProgressBarComponent],
  imports: [
    CheckoutAddressPageModule,
    CheckoutPaymentPageModule,
    CheckoutReceiptPageModule,
    CheckoutReviewPageModule,
    CheckoutShippingPageModule,
    RouterModule.forChild(checkoutPageRoutes),
    SharedModule,
  ],
})
export class CheckoutPageModule {}
