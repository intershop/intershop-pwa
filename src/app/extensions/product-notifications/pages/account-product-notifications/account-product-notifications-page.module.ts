import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from 'ish-shared/shared.module';

import { ProductNotificationsModule } from '../../product-notifications.module';

import { AccountProductNotificationsListComponent } from './account-product-notifications-list/account-product-notifications-list.component';
import { AccountProductNotificationsPageComponent } from './account-product-notifications-page.component';

const accountProductNotificationsPageRoutes: Routes = [
  {
    path: '',
    component: AccountProductNotificationsPageComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(accountProductNotificationsPageRoutes),
    NgbNavModule,
    ProductNotificationsModule,
    SharedModule,
  ],
  declarations: [AccountProductNotificationsListComponent, AccountProductNotificationsPageComponent],
})
export class AccountProductNotificationsPageModule {}
