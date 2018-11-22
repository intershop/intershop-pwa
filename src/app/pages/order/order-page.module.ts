import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { OrderPageComponent } from './components/order-page/order-page.component';
import { OrderPageContainerComponent } from './order-page.container';

const orderPageRoutes: Routes = [
  {
    path: '',
    component: OrderPageContainerComponent,
    children: [
      {
        path: '**',
        component: OrderPageContainerComponent,
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(orderPageRoutes), SharedModule],
  declarations: [OrderPageComponent, OrderPageContainerComponent],
})
export class OrderPageModule {}
