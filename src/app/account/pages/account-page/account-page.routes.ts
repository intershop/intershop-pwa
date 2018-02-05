import { Routes } from '@angular/router';
import { AccountPageComponent } from './account-page.component';

export const accountPageRoutes: Routes = [
  { path: '', component: AccountPageComponent },
  { path: 'profile', loadChildren: 'app/account/pages/profile-settings-page/profile-settings-page.module#ProfileSettingsPageModule' },
  { path: 'orders', loadChildren: 'app/account/pages/order-history-page/order-history-page.module#OrderHistoryPageModule' }
];
