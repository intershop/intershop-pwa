import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthorizationToggleGuard } from 'ish-core/authorization-toggle.module';
import { FeatureToggleGuard } from 'ish-core/feature-toggle.module';
import { SharedModule } from 'ish-shared/shared.module';

import { AccountOverviewPageModule } from '../account-overview/account-overview-page.module';

import { AccountNavigationComponent } from './account-navigation/account-navigation.component';
import { AccountPageComponent } from './account-page.component';
import { AccountUserInfoComponent } from './account-user-info/account-user-info.component';

const accountPageRoutes: Routes = [
  {
    path: '',
    component: AccountPageComponent,
    children: [
      {
        path: '',
        data: { breadcrumbData: [] },
        component: AccountOverviewPageModule.component,
      },
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
        path: 'order-templates',
        data: { breadcrumbData: [{ key: 'account.ordertemplates.link' }] },
        loadChildren: () =>
          import('../../extensions/order-templates/pages/order-templates-routing.module').then(
            m => m.OrderTemplatesRoutingModule
          ),
      },
      {
        path: 'punchout',
        canActivate: [FeatureToggleGuard, AuthorizationToggleGuard],
        data: {
          feature: 'punchout',
          permission: 'APP_B2B_MANAGE_PUNCHOUT',
          breadcrumbData: [{ key: 'account.punchout.link' }],
        },
        loadChildren: () =>
          import('../../extensions/punchout/pages/punchout-account-routing.module').then(
            m => m.PunchoutAccountRoutingModule
          ),
      },
      {
        path: 'quotes',
        data: { breadcrumbData: [{ key: 'quote.quotes.link' }] },
        loadChildren: () =>
          import('../../extensions/quoting/pages/quote-list/quote-list-page.module').then(m => m.QuoteListPageModule),
      },
      {
        path: 'wishlists',
        data: { breadcrumbData: [{ key: 'account.wishlists.breadcrumb_link' }] },
        loadChildren: () =>
          import('../../extensions/wishlists/pages/wishlists-routing.module').then(m => m.WishlistsRoutingModule),
      },
      {
        path: 'organization',
        canActivate: [AuthorizationToggleGuard],
        data: { permission: 'APP_B2B_MANAGE_USERS' },
        loadChildren: () => import('organization-management').then(m => m.OrganizationManagementRoutingModule),
      },
      {
        path: 'requisitions',
        canActivate: [AuthorizationToggleGuard],
        data: { permission: 'APP_B2B_PURCHASE' },
        loadChildren: () => import('requisition-management').then(m => m.RequisitionManagementRoutingModule),
      },
    ],
  },
];

@NgModule({
  imports: [AccountOverviewPageModule, RouterModule.forChild(accountPageRoutes), SharedModule],
  declarations: [AccountNavigationComponent, AccountPageComponent, AccountUserInfoComponent],
})
export class AccountPageModule {}
