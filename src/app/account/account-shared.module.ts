import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { OrderListComponent } from './components/order-list/order-list.component';

const sharedComponents = [OrderListComponent];
@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [...sharedComponents],
  exports: [...sharedComponents],
})
export class AccountSharedModule {}
