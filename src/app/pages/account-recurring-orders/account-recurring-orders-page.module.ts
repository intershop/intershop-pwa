import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { SwitchComponent } from 'ish-shared/components/common/switch/switch.component';
import { SharedModule } from 'ish-shared/shared.module';

import { AccountRecurringOrdersPageComponent } from './account-recurring-orders-page.component';
import { RecurringOrderListComponent } from './recurring-order-list/recurring-order-list.component';

const accountRecurringOrdersPageRoutes: Routes = [
  { path: '', component: AccountRecurringOrdersPageComponent },
  {
    path: ':recurringOrderId',
    loadChildren: () =>
      import('../account-recurring-order/account-recurring-order-page.module').then(
        m => m.AccountRecurringOrderPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(accountRecurringOrdersPageRoutes), NgbNavModule, SharedModule, SwitchComponent],
  declarations: [AccountRecurringOrdersPageComponent, RecurringOrderListComponent],
})
export class AccountRecurringOrdersPageModule {}
