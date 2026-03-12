import { Routes } from '@angular/router';

import { authorizationToggleGuard } from 'ish-core/authorization-toggle';
import { featureToggleGuard } from 'ish-core/feature-toggle';
import { serverSettingGuard } from 'ish-core/guards/server-setting.guard';

import { AccountOverviewPageComponent } from '../account-overview/account-overview-page.component';

import { AccountPageComponent } from './account-page.component';

export const accountPageRoutes: Routes = [
  {
    path: '',
    component: AccountPageComponent,
    children: [
      {
        path: '',
        data: { breadcrumbData: [] },
        component: AccountOverviewPageComponent,
      },
      {
        path: 'addresses',
        data: {
          meta: {
            title: 'account.addresses.saved_address.heading',
            robots: 'noindex, nofollow',
          },
          breadcrumbData: [{ key: 'account.saved_addresses.link' }],
        },
        loadComponent: () =>
          import('../account-addresses/account-addresses-page.component').then(m => m.AccountAddressesPageComponent),
      },
      {
        path: 'orders',
        data: {
          meta: {
            title: 'account.order_history.heading',
            robots: 'noindex, nofollow',
          },
          breadcrumbData: [{ key: 'account.order_history.link' }],
        },
        loadChildren: () =>
          import('../account-order-history/account-order-history.routes').then(m => m.accountOrderHistoryRoutes),
      },
      {
        path: 'payment',
        data: {
          meta: {
            title: 'account.payment.heading',
            robots: 'noindex, nofollow',
          },
          breadcrumbData: [{ key: 'account.payment.link' }],
        },
        loadComponent: () =>
          import('../account-payment/account-payment-page.component').then(m => m.AccountPaymentPageComponent),
      },
      {
        path: 'profile',
        data: {
          meta: {
            title: 'account.profile.heading',
            robots: 'noindex, nofollow',
          },
          breadcrumbData: [{ key: 'account.profile.link' }],
        },
        loadChildren: () => import('../account-profile/account-profile.routes').then(m => m.accountProfileRoutes),
      },
      {
        path: 'order-templates',
        data: {
          meta: {
            title: 'account.ordertemplates.heading',
            robots: 'noindex, nofollow',
          },
          breadcrumbData: [{ key: 'account.ordertemplates.link' }],
        },
        loadChildren: () =>
          import('../../extensions/order-templates/pages/order-templates.routes').then(m => m.orderTemplatesRoutes),
      },
      {
        path: 'punchout',
        canActivate: [featureToggleGuard, authorizationToggleGuard],
        data: {
          meta: {
            title: 'account.punchout.heading',
            robots: 'noindex, nofollow',
          },
          feature: 'punchout',
          permission: 'APP_B2B_MANAGE_PUNCHOUT',
          breadcrumbData: [{ key: 'account.punchout.link' }],
        },
        loadChildren: () =>
          import('../../extensions/punchout/pages/punchout-account.routes').then(m => m.punchoutAccountRoutes),
      },
      {
        path: 'quotes',
        data: {
          meta: {
            title: 'quote.list.heading',
            robots: 'noindex, nofollow',
          },
          breadcrumbData: [{ key: 'quote.quotes.link' }],
        },
        loadChildren: () => import('../../extensions/quoting/pages/quoting.routes').then(m => m.quotingRoutes),
      },
      {
        path: 'wishlists',
        data: {
          meta: {
            title: 'account.wishlists.heading',
            robots: 'noindex, nofollow',
          },
          breadcrumbData: [{ key: 'account.wishlists.breadcrumb_link' }],
        },
        loadChildren: () => import('../../extensions/wishlists/pages/wishlists.routes').then(m => m.routes),
      },
      {
        path: 'notifications',
        data: {
          meta: {
            title: 'account.notifications.heading',
            robots: 'noindex, nofollow',
          },
          breadcrumbData: [{ key: 'account.notifications.breadcrumb_link' }],
        },
        loadChildren: () =>
          import('../../extensions/product-notifications/pages/product-notifications.routes').then(
            m => m.productNotificationsRoutes
          ),
      },
      {
        path: 'organization',
        canActivate: [authorizationToggleGuard],
        data: {
          permission: 'APP_B2B_MANAGE_COSTCENTER',
        },
        loadChildren: () => import('organization-management').then(m => m.organizationManagementRoutes),
      },
      {
        path: 'requisitions',
        canActivate: [authorizationToggleGuard],
        data: {
          meta: {
            title: 'account.requisitions.requisitions',
            robots: 'noindex, nofollow',
          },
          permission: 'APP_B2B_PURCHASE',
        },
        loadChildren: () => import('requisition-management').then(m => m.requisitionManagementRoutes),
      },
      {
        path: 'recurring-orders',
        canActivate: [serverSettingGuard],
        data: {
          serverSetting: 'recurringOrder.enabled',
          breadcrumbData: [{ key: 'account.recurring_orders.breadcrumb' }],
        },
        children: [
          {
            path: '',
            loadComponent: () =>
              import('../account-recurring-orders/account-recurring-orders-page.component').then(
                m => m.AccountRecurringOrdersPageComponent
              ),
          },
          {
            path: ':recurringOrderId',
            loadComponent: () =>
              import('../account-recurring-order/account-recurring-order-page.component').then(
                m => m.AccountRecurringOrderPageComponent
              ),
          },
        ],
      },
      {
        path: 'content/:contentPageId',
        loadComponent: () =>
          import('../account-content/account-content-page.component').then(m => m.AccountContentPageComponent),
      },
    ],
  },
];

