import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { OrderHistoryPageComponent } from './order-history-page.component';
import { orderHistoryPageRoutes } from './order-history-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(orderHistoryPageRoutes),
    SharedModule
  ],
  declarations: [
    OrderHistoryPageComponent
  ]
})

export class OrderHistoryPageModule { }
