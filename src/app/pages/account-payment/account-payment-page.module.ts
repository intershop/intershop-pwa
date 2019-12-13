import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { AccountPaymentPageComponent } from './account-payment-page.component';
import { AccountPaymentComponent } from './account-payment/account-payment.component';

const routes: Routes = [
  {
    path: '',
    component: AccountPaymentPageComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [AccountPaymentComponent, AccountPaymentPageComponent],
})
export class AccountPaymentPageModule {}
