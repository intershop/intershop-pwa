import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { AccountOrderPageContainerComponent } from './account-order-page.container';
import { AccountOrderComponent } from './components/account-order/account-order.component';

const routes: Routes = [
  {
    path: '',
    component: AccountOrderPageContainerComponent,
    children: [
      {
        path: '**',
        component: AccountOrderPageContainerComponent,
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [AccountOrderComponent, AccountOrderPageContainerComponent],
})
export class AccountOrderPageModule {}
