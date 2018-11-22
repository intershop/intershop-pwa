import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { OrderHistoryPageComponent } from './components/order-history-page/order-history-page.component';
import { OrderHistoryPageContainerComponent } from './order-history-page.container';

const orderPageRoutes: Routes = [
  {
    path: '',
    component: OrderHistoryPageContainerComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(orderPageRoutes), SharedModule],
  declarations: [OrderHistoryPageComponent, OrderHistoryPageContainerComponent],
})
export class OrderHistoryPageModule {}
