import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { WithdrawalRequestFormComponent } from './withdrawal-request-form/withdrawal-request-form.component';
import { WithdrawalRequestPageComponent } from './withdrawal-request-page.component';

const withdrawalPageRoutes: Routes = [
  {
    path: '',
    component: WithdrawalRequestPageComponent,
  },
];

@NgModule({
  declarations: [WithdrawalRequestFormComponent, WithdrawalRequestPageComponent],
  imports: [RouterModule.forChild(withdrawalPageRoutes), SharedModule],
})
export class WithdrawalRequestPageModule {}
