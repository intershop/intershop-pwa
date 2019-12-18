import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { AccountOrderHistoryPageComponent } from './account-order-history-page.component';

const routes: Routes = [{ path: '', component: AccountOrderHistoryPageComponent }];
@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [AccountOrderHistoryPageComponent],
})
export class AccountOrderHistoryPageModule {}
