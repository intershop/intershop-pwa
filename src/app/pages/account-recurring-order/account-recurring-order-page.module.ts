import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SwitchComponent } from 'ish-shared/components/common/switch/switch.component';
import { SharedModule } from 'ish-shared/shared.module';

import { AccountRecurringOrderPageComponent } from './account-recurring-order-page.component';

const accountRecurringOrderPageRoutes: Routes = [{ path: '', component: AccountRecurringOrderPageComponent }];

@NgModule({
  declarations: [AccountRecurringOrderPageComponent],
  imports: [RouterModule.forChild(accountRecurringOrderPageRoutes), SharedModule, SwitchComponent],
})
export class AccountRecurringOrderPageModule {}
