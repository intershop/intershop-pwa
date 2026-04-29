import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { WithdrawalFormComponent } from './withdrawal-request/withdrawal-form/withdrawal-form.component';
import { WithdrawalRequestComponent } from './withdrawal-request/withdrawal-request.component';

const withdrawalPageRoutes: Routes = [
  {
    path: '',
    component: WithdrawalRequestComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(withdrawalPageRoutes), SharedModule],
  declarations: [WithdrawalFormComponent, WithdrawalRequestComponent],
})
export class WithdrawalPageModule {}
