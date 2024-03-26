import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { AccountOrderPageComponent } from './account-order-page.component';
import { AccountOrderToBasketComponent } from './account-order-to-basket/account-order-to-basket.component';
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
  declarations: [AccountOrderComponent, AccountOrderPageComponent, AccountOrderToBasketComponent],
})
export class AccountOrderPageModule {}
