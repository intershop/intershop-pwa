import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FORMLY_CONFIG } from '@ngx-formly/core';

import { noServerSideRenderingGuard } from 'ish-core/guards/no-server-side-rendering.guard';
import { SharedModule } from 'ish-shared/shared.module';

import { CheckoutAddressAnonymousComponent } from '../checkout-address/checkout-address-anonymous/checkout-address-anonymous.component';
import { CheckoutAddressPageComponent } from '../checkout-address/checkout-address-page.component';
import { CheckoutPaymentPageComponent } from '../checkout-payment/checkout-payment-page.component';
import { CheckoutReceiptPageComponent } from '../checkout-receipt/checkout-receipt-page.component';
import { CheckoutReviewPageComponent } from '../checkout-review/checkout-review-page.component';
import { checkoutReviewFormlyConfig } from '../checkout-review/checkout-review/checkout-review.component';
import { CheckoutShippingPageComponent } from '../checkout-shipping/checkout-shipping-page.component';

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
        component: CheckoutAddressPageComponent,
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
        component: CheckoutShippingPageComponent,
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
        component: CheckoutPaymentPageComponent,
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
        component: CheckoutReviewPageComponent,
        providers: [{ provide: FORMLY_CONFIG, useValue: checkoutReviewFormlyConfig, multi: true }],
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
        component: CheckoutReceiptPageComponent,
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
    CheckoutAddressAnonymousComponent,
    CheckoutPageComponent,
    CheckoutProgressBarComponent,
    RouterModule.forChild(checkoutPageRoutes),
    CheckoutReceiptPageComponent,
    CheckoutReviewPageComponent,
    SharedModule,
  ],
})
export class CheckoutPageModule {}
