import { Routes } from '@angular/router';
import { CheckoutAddressPageContainerComponent } from './checkout-address-page.container';

export const checkoutAddressPageRoutes: Routes = [
  { path: '', component: CheckoutAddressPageContainerComponent, data: { headerType: 'checkout' } },
];
