import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormlyModule } from '@ngx-formly/core';

import { SharedModule } from 'ish-shared/shared.module';

import { AccountPaymentConcardisDirectdebitComponent } from './account-payment-concardis-directdebit/account-payment-concardis-directdebit.component';
import { AccountPaymentPageComponent } from './account-payment-page.component';
import { AccountPaymentComponent } from './account-payment/account-payment.component';
import { PanelGroupTypeComponent } from './formly/panel-group-type/panel-group-type.component';

const routes: Routes = [
  {
    path: '',
    component: AccountPaymentPageComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    FormlyModule.forChild({ types: [{ name: 'ish-panel-group', component: PanelGroupTypeComponent }] }),
  ],
  declarations: [
    AccountPaymentComponent,
    AccountPaymentConcardisDirectdebitComponent,
    AccountPaymentPageComponent,
    PanelGroupTypeComponent,
  ],
})
export class AccountPaymentPageModule {}
