import { Routes } from '@angular/router';
import { CheckoutPaymentPageContainerComponent } from './checkout-payment-page.container';

export const checkoutPaymentPageRoutes: Routes = [
  { path: '', component: CheckoutPaymentPageContainerComponent, data: { headerType: 'checkout' } },
];
