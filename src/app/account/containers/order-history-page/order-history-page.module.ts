import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { AccountSharedModule } from '../../account-shared.module';

import { OrderHistoryPageContainerComponent } from './order-history-page.container';
import { orderHistoryPageRoutes } from './order-history-page.routes';

@NgModule({
  imports: [RouterModule.forChild(orderHistoryPageRoutes), SharedModule, AccountSharedModule],
  declarations: [OrderHistoryPageContainerComponent],
})
export class OrderHistoryPageModule {}
