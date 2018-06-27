import { Routes } from '@angular/router';
import { CheckoutAddressPageContainerComponent } from '../checkout-address-page/checkout-address-page.container';
import { CheckoutPaymentPageContainerComponent } from '../checkout-payment-page/checkout-payment-page.container';
import { CheckoutShippingPageContainerComponent } from '../checkout-shipping-page/checkout-shipping-page.container';
import { CheckoutPageContainerComponent } from './checkout-page.container';

export const checkoutPageRoutes: Routes = [
  {
    path: '',
    component: CheckoutPageContainerComponent,
    children: [
      {
        path: 'address',
        component: CheckoutAddressPageContainerComponent,
      },
      {
        path: 'shipping',
        component: CheckoutShippingPageContainerComponent,
      },
      {
        path: 'payment',
        component: CheckoutPaymentPageContainerComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'address',
      },
    ],
  },
];
