import { Routes } from '@angular/router';
import { AccountPageContainerComponent } from './account-page.container';

export const accountPageRoutes: Routes = [
  { path: '', component: AccountPageContainerComponent },
  { path: 'profile', loadChildren: 'app/account/pages/profile-settings-page/profile-settings-page.module#ProfileSettingsPageModule' },
  { path: 'orders', loadChildren: 'app/account/pages/order-history-page/order-history-page.module#OrderHistoryPageModule' }
];
