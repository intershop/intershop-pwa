import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedAddressModule } from '../shared/shared-address.module';
import { SharedModule } from '../shared/shared.module';

import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderListContainerComponent } from './containers/order-list/order-list.container';

const sharedComponents = [OrderListContainerComponent, OrderListComponent];
@NgModule({
  imports: [CommonModule, SharedModule, SharedAddressModule],
  declarations: [...sharedComponents],
  exports: [...sharedComponents],
})
export class AccountSharedModule {}
