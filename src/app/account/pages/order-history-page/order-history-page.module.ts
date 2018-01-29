import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { AccountShareModule } from '../../account-share.module';
import { OrderHistoryPageComponent } from './order-history-page.component';
import { orderHistoryPageRoutes } from './order-history-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(orderHistoryPageRoutes),
    SharedModule,
    AccountShareModule
  ],
  declarations: [
    OrderHistoryPageComponent
  ]
})

export class OrderHistoryPageModule { }
