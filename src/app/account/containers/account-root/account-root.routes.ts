import { Routes } from '@angular/router';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { AccountRootContainerComponent } from './account-root.container';

export const accountRootRoutes: Routes = [
  {
    path: '',
    component: AccountRootContainerComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'profile',
        data: { breadcrumbKey: 'account.profile.link' },
        loadChildren: '../profile-settings-page/profile-settings-page.module#ProfileSettingsPageModule',
      },
      {
        path: 'overview',
        data: { breadcrumbKey: 'account.overview.link' },
        loadChildren: '../account-page/account-page.module#AccountPageModule',
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
