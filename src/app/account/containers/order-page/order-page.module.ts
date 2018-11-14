import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { ShoppingSharedModule } from '../../../shopping/shopping-shared.module';
import { OrderPageComponent } from '../../components/order-page/order-page.component';

import { OrderPageContainerComponent } from './order-page.container';
import { orderPageRoutes } from './order-page.routes';

@NgModule({
  imports: [RouterModule.forChild(orderPageRoutes), SharedModule, ShoppingSharedModule],
  declarations: [OrderPageComponent, OrderPageContainerComponent],
})
export class OrderPageModule {}
