import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { AccountOrderPageComponent } from './account-order-page.component';
import { AccountOrderComponent } from './account-order/account-order.component';

const routes: Routes = [
  {
    path: '',
    component: AccountOrderPageComponent,
    children: [
      {
        path: '**',
        component: AccountOrderPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [AccountOrderComponent, AccountOrderPageComponent],
})
export class AccountOrderPageModule {}
