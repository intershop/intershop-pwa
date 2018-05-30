import { Routes } from '@angular/router';
import { AccountOverviewPageContainerComponent } from '../account-overview-page/account-overview-page.container';
import { AccountRootContainerComponent } from './account-root.container';

export const accountRootRoutes: Routes = [
  {
    path: '',
    component: AccountRootContainerComponent,
    children: [
      {
        path: 'overview',
        data: { breadcrumbKey: 'account.overview.link' },
        component: AccountOverviewPageContainerComponent,
      },
      {
        path: 'profile',
        data: { breadcrumbKey: 'account.profile.link' },
        loadChildren: '../profile-settings-page/profile-settings-page.module#ProfileSettingsPageModule',
      },
      {
        path: 'orders',
        data: { breadcrumbKey: 'account.order_history.link' },
        loadChildren: '../order-history-page/order-history-page.module#OrderHistoryPageModule',
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
    ],
  },
];
