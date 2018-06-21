import { Routes } from '@angular/router';
import { CheckoutAddressPageContainerComponent } from './checkout-address-page.container';

export const checkoutAddressPageRoutes: Routes = [
  { path: '', data: { headerType: 'checkout' }, component: CheckoutAddressPageContainerComponent },
];
