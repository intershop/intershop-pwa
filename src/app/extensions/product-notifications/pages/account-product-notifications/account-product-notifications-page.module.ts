import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { ProductNotificationsModule } from '../../product-notifications.module';

import { AccountProductNotificationsPageComponent } from './account-product-notifications-page.component';

const accountProductNotificationsPageRoutes: Routes = [
  {
    path: '',
    component: AccountProductNotificationsPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(accountProductNotificationsPageRoutes), ProductNotificationsModule, SharedModule],
  declarations: [AccountProductNotificationsPageComponent],
})
export class AccountProductNotificationsPageModule {}
