import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { AccountOverviewPageModule } from '../account-overview/account-overview-page.module';

import { AccountNavigationComponent } from './account-navigation/account-navigation.component';
import { AccountPageComponent } from './account-page.component';

const accountPageRoutes: Routes = [
  {
    path: '',
    component: AccountPageComponent,
    children: [
      {
        path: 'addresses',
        data: { breadcrumbData: [{ key: 'account.saved_addresses.link' }] },
        loadChildren: () =>
          import('../account-addresses/account-addresses-page.module').then(m => m.AccountAddressesPageModule),
      },
      {
        path: 'orders',
        data: { breadcrumbData: [{ key: 'account.order_history.link' }] },
        loadChildren: () =>
          import('../account-order-history/account-order-history-page.module').then(
            m => m.AccountOrderHistoryPageModule
          ),
      },
      {
        path: 'payment',
        data: { breadcrumbData: [{ key: 'account.payment.link' }] },
        loadChildren: () =>
          import('../account-payment/account-payment-page.module').then(m => m.AccountPaymentPageModule),
      },
      {
        path: 'profile',
        data: { breadcrumbData: [{ key: 'account.profile.link' }] },
        loadChildren: () =>
          import('../account-profile/account-profile-page.module').then(m => m.AccountProfilePageModule),
      },
      {
        path: 'quotes',
        data: { breadcrumbData: [{ key: 'quote.quotes.link' }] },
        loadChildren: () =>
          import('../../extensions/quoting/pages/quoting-routing.module').then(m => m.QuotingRoutingModule),
      },
      {
        path: '',
        data: { breadcrumbData: [] },
        component: AccountOverviewPageModule.component,
      },
      {
        path: 'wishlists',
        data: { breadcrumbData: [{ key: 'account.wishlists.breadcrumb_link' }] },
        loadChildren: () =>
          import('../../extensions/wishlists/pages/wishlists-routing.module').then(m => m.WishlistsRoutingModule),
      },
      {
        path: 'order-templates',
        data: { breadcrumbData: [{ key: 'account.ordertemplates.link' }] },
        loadChildren: () =>
          import('../../extensions/order-templates/pages/order-templates-routing.module').then(
            m => m.OrderTemplatesRoutingModule
          ),
      },
    ],
  },
];
@NgModule({
  imports: [AccountOverviewPageModule, RouterModule.forChild(accountPageRoutes), SharedModule],
  declarations: [AccountNavigationComponent, AccountPageComponent],
})
export class AccountPageModule {}
