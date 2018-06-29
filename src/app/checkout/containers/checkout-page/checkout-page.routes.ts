import { Routes } from '@angular/router';
import { CheckoutAddressPageContainerComponent } from '../checkout-address-page/checkout-address-page.container';
import { CheckoutPaymentPageContainerComponent } from '../checkout-payment-page/checkout-payment-page.container';
import { CheckoutReceiptPageContainerComponent } from '../checkout-receipt-page/checkout-receipt-page.container';
import { CheckoutReviewPageContainerComponent } from '../checkout-review-page/checkout-review-page.container';
import { CheckoutShippingPageContainerComponent } from '../checkout-shipping-page/checkout-shipping-page.container';
import { CheckoutPageContainerComponent } from './checkout-page.container';

export const checkoutPageRoutes: Routes = [
  {
    path: '',
    component: CheckoutPageContainerComponent,
    children: [
      {
        path: 'address',
        data: { checkoutStep: 1 },
        component: CheckoutAddressPageContainerComponent,
      },
      {
        path: 'shipping',
        data: { checkoutStep: 2 },
        component: CheckoutShippingPageContainerComponent,
      },
      {
        path: 'payment',
        data: { checkoutStep: 3 },
        component: CheckoutPaymentPageContainerComponent,
      },
      {
        path: 'review',
        data: { checkoutStep: 4 },
        component: CheckoutReviewPageContainerComponent,
      },
      {
        path: 'receipt',
        data: { checkoutStep: 5 },
        component: CheckoutReceiptPageContainerComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'address',
      },
    ],
  },
];
