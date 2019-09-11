import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { AccountOrderPageContainerComponent } from './account-order-page.container';
import { AccountOrderPageComponent } from './components/account-order-page/account-order-page.component';

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
  declarations: [AccountOrderPageComponent, AccountOrderPageContainerComponent],
})
export class AccountOrderPageModule {}
