import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { AccountOrderHistoryPageContainerComponent } from './account-order-history-page.container';

const routes: Routes = [{ path: '', component: AccountOrderHistoryPageContainerComponent }];
@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [AccountOrderHistoryPageContainerComponent],
})
export class AccountOrderHistoryPageModule {}
