import { Routes } from '@angular/router';
import { CheckoutShippingPageContainerComponent } from './checkout-shipping-page.container';

export const checkoutShippingPageRoutes: Routes = [
  { path: '', component: CheckoutShippingPageContainerComponent, data: { headerType: 'checkout' } },
];
