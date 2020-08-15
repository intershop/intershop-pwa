import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { AccountPaymentConcardisDirectdebitComponent } from './account-payment-concardis-directdebit/account-payment-concardis-directdebit.component';
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
  declarations: [AccountPaymentComponent, AccountPaymentConcardisDirectdebitComponent, AccountPaymentPageComponent],
})
export class AccountPaymentPageModule {}
