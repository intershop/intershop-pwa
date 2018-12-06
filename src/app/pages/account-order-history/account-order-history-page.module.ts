import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { AccountOrderHistoryPageContainerComponent } from './account-order-history-page.container';
import { AccountOrderHistoryPageComponent } from './components/account-order-history-page/account-order-history-page.component';

const routes: Routes = [{ path: '', component: AccountOrderHistoryPageContainerComponent }];
@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [AccountOrderHistoryPageComponent, AccountOrderHistoryPageContainerComponent],
})
export class AccountOrderHistoryPageModule {}
