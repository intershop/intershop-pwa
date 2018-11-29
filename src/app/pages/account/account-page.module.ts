import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { AccountOverviewPageModule } from '../account-overview/account-overview-page.module';

import { AccountPageContainerComponent } from './account-page.container';
import { AccountNavigationComponent } from './components/account-navigation/account-navigation.component';
import { AccountPageComponent } from './components/account-page/account-page.component';

const accountPageRoutes: Routes = [
  {
    path: '',
    component: AccountPageContainerComponent,
    children: [
      {
        path: 'addresses',
        data: { breadcrumbData: [{ key: 'account.saved_addresses.link' }] },
        loadChildren: '../account-addresses/account-addresses-page.module#AccountAddressesPageModule',
      },
      {
        path: 'orders',
        data: { breadcrumbData: [{ key: 'account.order_history.link' }] },
        loadChildren: '../account-order-history/account-order-history-page.module#AccountOrderHistoryPageModule',
      },
      {
        path: 'orders/:orderId',
        data: {
          breadcrumbData: [
            { key: 'account.order_history.link', link: '/account/orders' },
            { key: 'account.orderdetails.breadcrumb' },
          ],
        },
        loadChildren: '../account-order/account-order-page.module#AccountOrderPageModule',
      },
      {
        path: 'overview',
        data: { breadcrumbData: [{ key: 'account.overview.link' }] },
        component: AccountOverviewPageModule.component,
      },
      {
        path: 'profile',
        data: { breadcrumbData: [{ key: 'account.profile.link' }] },
        loadChildren:
          '../account-profile-settings/account-profile-settings-page.module#AccountProfileSettingsPageModule',
      },
      {
        path: 'quote-list',
        data: { breadcrumbData: [{ key: 'quote.quotes.link' }] },
        loadChildren: 'app/extensions/quoting/pages/quote-list/quote-list-page.module#QuoteListPageModule',
      },
      {
        path: 'quote',
        data: { breadcrumbData: [{ key: 'quote.quotes.link' }] },
        loadChildren: 'app/extensions/quoting/pages/quote-edit/quote-edit-page.module#QuoteEditPageModule',
      },
      {
        path: 'quote-request',
        data: {
          breadcrumbData: [
            { key: 'quote.quotes.link', link: '/account/quote-list' },
            { key: 'quote.quote_details.link' },
          ],
        },
        loadChildren:
          'app/extensions/quoting/pages/quote-request-edit/quote-request-edit-page.module#QuoteRequestEditPageModule',
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
    ],
  },
];
@NgModule({
  imports: [AccountOverviewPageModule, RouterModule.forChild(accountPageRoutes), SharedModule],
  declarations: [AccountNavigationComponent, AccountPageComponent, AccountPageContainerComponent],
})
export class AccountPageModule {}
